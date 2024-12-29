from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework.exceptions import NotAuthenticated

User = get_user_model()

class AllRooms(APIView):
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
                'id': '1',
                'name': 'Pro League #1',
                'host': 'John Doe',
                'type': 'Ranked',
                'status': 'Waiting',
                'skill': '1500-1800 ELO',
                'maxPlayers': 2,
                'players': [
                    {
                        'id': '1',
                        'name': 'John Doe',
                        'avatar': 'https://via.placeholder.com/32'
                    }
                ]
            },
            {
                'id': '2',
                'name': 'Casual Fun',
                'host': 'Sarah Smith',
                'type': 'Casual',
                'status': 'In Progress',
                'skill': 'All Levels',
                'maxPlayers': 2,
                'players': [
                    {
                        'id': '2',
                        'name': 'Sarah Smith',
                        'avatar': 'https://via.placeholder.com/32'
                    },
                    {
                        'id': '3',
                        'name': 'Mike Johnson',
                        'avatar': 'https://via.placeholder.com/32'
                    }
                ]
            },
            {
                'id': '3',
                'name': 'Tournament Quarter-Finals',
                'host': 'Official Tournament',
                'type': 'Tournament',
                'status': 'Waiting',
                'skill': '2000+ ELO',
                'maxPlayers': 2,
                'players': [
                    {
                        'id': '4',
                        'name': 'Emma Wilson',
                        'avatar': 'https://via.placeholder.com/32'
                    }
                ]
            }
        ]

        return Response(response)


    def post(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid")

        token = auth_header.split(' ')[1]
        try:
            user = User.objects.get(auth_token=token)
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token")

        return Response({'id': 1})


class RoomDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid")

        token = auth_header.split(' ')[1]
        try:
            user = User.objects.get(auth_token=token)
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token")

        response = {
            'id': id,
            'name': 'Pro League #1',
            'host': 'John Doe',
            'type': 'Ranked',
            'status': 'Waiting',
            'skill': '1500-1800 ELO',
            'maxPlayers': 2,
            'players': [
                {
                    'id': '1',
                    'name': 'John Doe',
                    'avatar': 'https://via.placeholder.com/32'
                }
            ]
        }

        return Response(response)