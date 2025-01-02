from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework.exceptions import NotAuthenticated
from .consumer import OnlineConsumer
import json
from .models import Friendship
from rest_framework import status
from rest_framework.exceptions import NotFound

User = get_user_model()

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid")

        token = auth_header.split(' ')[1]
        try:
            user = User.objects.get(auth_token=token)
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token")

        return Response({'username': user.username, 'email': user.email, 'bio': user.bio})


    def put(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid")

        token = auth_header.split(' ')[1]
        try:
            user = User.objects.get(auth_token=token)
            user.bio = request.data.get('bio', user.bio)
            user.save()
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token")

        return Response({'status': '200'})


class CurrentUserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid")

        token = auth_header.split(' ')[1]
        try:
            user = User.objects.get(auth_token=token)
            total_matches = user.total_matches
            wins = user.wins
            points = user.points
            winRate = wins/total_matches if total_matches > 0 else 0
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token")

        return Response({'totalMatches': total_matches, 'wins': wins, 'points': points, 'winRate': 0})


class ProfileUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, user_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid")

        token = auth_header.split(' ')[1]
        try:
            requesting_user = User.objects.get(auth_token=token)
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token")

        try:
            user = User.objects.get(id=user_id)
            if user.username == "admin":
                raise NotFound("The requested user does not exist.")
        except User.DoesNotExist:
            raise NotFound("The requested user does not exist.")



        return Response({'username': user.username, 'email': user.email, 'bio': user.bio})

class ProfileUserStatsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, user_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid")

        token = auth_header.split(' ')[1]
        try:
            requesting_user = User.objects.get(auth_token=token)
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token or user id")

        try:
            user = User.objects.get(id=user_id)
            total_matches = user.total_matches
            wins = user.wins
            points = user.points
            winRate = wins/total_matches if total_matches > 0 else 0
            if user.username == "admin":
                raise NotFound("The requested user does not exist.")
        except User.DoesNotExist:
            raise NotFound("The requested user does not exist.")

        return Response({'totalMatches': total_matches, 'wins': wins, 'points': points, 'winRate': 0})


class UsersOnlineView(APIView):
    def get(self, request):
        """
        Returns the list of online users with their details.
        """
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid.")

        token = auth_header.split(' ')[1]
        online_users = OnlineConsumer.get_online_users()

        try:
            user_obj = User.objects.get(auth_token=token)
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token.")
        
        response = [
            {
                'id': user.id,
                'name': user.username,
                'username': user.username,
                'avatar': user.profile.avatar_url if hasattr(user, 'profile') else 'https://via.placeholder.com/150',
                'status': 'Online',  # Static "Online" status for simplicity
                'rank': user.profile.rank if hasattr(user, 'profile') else 'Unranked',
                'elo': user.profile.elo if hasattr(user, 'profile') else 1000
            }
            for user in online_users if user != user_obj
        ]

        return Response(response)


class FriendshipRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid.")

        token = auth_header.split(' ')[1]

        # 2. Identify current user
        try:
            user = User.objects.get(auth_token=token)
            friend_requests = Friendship.objects.filter(
                to_user=user,
                status='pending'
            )
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token.")

        data = [
            {
                "id": fr.id,
                "senderId": fr.from_user.id,
                "name": fr.from_user.username,
                "avatar": fr.from_user.avatar,
                "status": fr.status,
                "timestamp": fr.created_at
            }
            for fr in friend_requests
        ]
        return Response(data, status=status.HTTP_200_OK)


class FriendshipStatusRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, friend_id):
        """
        Create a new friend request (status='pending') 
        from the current user (determined by token) to the user with id=friend_id.
        """

        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid.")

        token = auth_header.split(' ')[1]

        # 2. Identify current user by token
        try:
            user = User.objects.get(auth_token=token)
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token.")

        # 3. Check that the user to be friended exists
        try:
            other_user = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            raise NotFound("The requested user does not exist.")

        # 4. Prevent user from friending themselves
        if user == other_user:
            return Response(
                {"detail": "You cannot friend yourself."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Friendship.objects.filter(from_user=other_user, to_user=user).exists():
            friendship = Friendship.objects.get(from_user=other_user, to_user=user)
            friendship.status = 'accepted'
            friendship.save()
            friendship2, created = Friendship.objects.get_or_create(
                from_user=user,
                to_user=other_user,
                defaults={'status': 'pending'}
            )
            friendship2 = Friendship.objects.get(from_user=user, to_user=other_user)
            friendship2.status = 'accepted'
            friendship2.save()

            return Response(
                {"detail": "Friendship accepted."},
                status=status.HTTP_200_OK
            )

        # 5. Create or get an existing Friendship object
        #    If a record already exists, we check its status
        friendship, created = Friendship.objects.get_or_create(
            from_user=user,
            to_user=other_user,
            defaults={'status': 'pending'}
        )

        if not created:
            # Friendship already exists between these two
            # You might want to handle different statuses differently:
            if friendship.status == "pending":
                return Response(
                    {"detail": "Friend request already sent."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif friendship.status == "accepted":
                return Response(
                    {"detail": "You are already friends."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif friendship.status == "rejected":
                return Response(
                    {"detail": "Friend request has been rejected previously."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Check if there are duplicate friendships in the database
        duplicates = Friendship.objects.filter(from_user=user, to_user=other_user)
        if duplicates.count() > 1:
            for duplicate in duplicates[1:]:
                duplicate.delete()
        return Response(
            {
                "detail": "Friend request created (status=pending).",
                "friendship_id": friendship.id
            },
            status=status.HTTP_201_CREATED
        )

    def delete(self, request, friend_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid.")

        token = auth_header.split(' ')[1]

        # 1. Identify current user by token
        try:
            user = User.objects.get(auth_token=token)
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token.")

        # 2. Check that the user to be unfriended exists
        try:
            other_user = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            raise NotFound("The requested user does not exist.")

        # 3. Prevent user from unfriending themselves
        if user == other_user:
            return Response(
                {"detail": "You cannot unfriend yourself."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 4. Delete the friendship if it exists (both directions, if they exist)
        deleted_any = False

        # First direction: user -> other_user
        friendship = Friendship.objects.filter(from_user=user, to_user=other_user).first()
        if friendship:
            friendship.delete()
            deleted_any = True

        # Second direction: other_user -> user
        friendship2 = Friendship.objects.filter(from_user=other_user, to_user=user).first()
        if friendship2:
            friendship2.delete()
            deleted_any = True

        if not deleted_any:
            # Optional: return 404 if no friendship was found at all
            return Response(
                {"detail": "No friendship found between these users."},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {"detail": "Friendship deleted."},
            status=status.HTTP_200_OK
        )


class FriendshipView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 1. Validate the Authorization header (again, using DRF’s TokenAuth is recommended in real projects)
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid.")

        token = auth_header.split(' ')[1]

        # 2. Identify current user
        try:
            user = User.objects.get(auth_token=token)
            friend_requests = Friendship.objects.filter(
                to_user=user,
                status='accepted'
            )
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token.")

        data = [
            {
                "id": fr.id,
                "senderId": fr.from_user.id,
                "name": fr.from_user.username,
                "avatar": fr.from_user.avatar,
                "status": fr.from_user.status,
                "timestamp": fr.created_at
            }
            for fr in friend_requests
        ]
        return Response(data, status=status.HTTP_200_OK)