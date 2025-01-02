from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework.exceptions import NotAuthenticated

User = get_user_model()

# Create your views here.
class CurrentUserHistory(APIView):
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

        response = [
            {
                "opponent": {
                    "avatar": "https://example.com/avatars/opponent123.png",
                    "name": "Jane Smith"
                },
                "playerScore": 3,
                "opponentScore": 11,
                "result": "Won",
                "date": "2024-12-25T18:30:00Z"
            },
            {
                "opponent": {
                    "avatar": "https://example.com/avatars/opponent456.png",
                    "name": "John Doe"
                },
                "playerScore": 7,
                "opponentScore": 5,
                "result": "Lost",
                "date": "2024-12-20T15:45:00Z"
            }
        ]

        return Response(response)

class ProfileUserHistory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid")

        token = auth_header.split(' ')[1]
        try:
            user = User.objects.get(auth_token=token)
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token")

        response = [
            {
                "opponent": {
                    "avatar": "https://example.com/avatars/opponent123.png",
                    "name": "Jane Smith"
                },
                "playerScore": 3,
                "opponentScore": 11,
                "result": "Won",
                "date": "2024-12-25T18:30:00Z"
            },
            {
                "opponent": {
                    "avatar": "https://example.com/avatars/opponent456.png",
                    "name": "John Doe"
                },
                "playerScore": 7,
                "opponentScore": 5,
                "result": "Lost",
                "date": "2024-12-20T15:45:00Z"
            }
        ]

        return Response(response)