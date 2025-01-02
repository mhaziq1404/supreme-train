from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework.exceptions import NotAuthenticated
import json

User = get_user_model()

class AllChats(APIView):
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

        # response = [
        #     {
        #         "id": "1",
        #         "user": {
        #             "id": "1",
        #             "name": "John Doe",
        #             "avatar": "https://via.placeholder.com/40",
        #             "status": "online"
        #         },
        #         "messages": [
        #             {
        #                 "id": "1",
        #                 "content": "Hey! Want to play a match?",
        #                 "timestamp": "2024-01-21T10:30:00Z",
        #                 "senderId": "1",
        #                 "status": "read"
        #             }
        #         ]
        #     },
        #     {
        #         "id": "2",
        #         "user": {
        #             "id": "2",
        #             "name": "Sarah Smith",
        #             "avatar": "https://via.placeholder.com/40",
        #             "status": "offline"
        #         },
        #         "messages": [
        #             {
        #                 "id": "2",
        #                 "content": "Good game yesterday!",
        #                 "timestamp": "2024-01-20T09:30:00Z",
        #                 "senderId": "2",
        #                 "status": "delivered"
        #             }
        #         ]
        #     }
        # ]

        response = []

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


class BlockedChats(APIView):
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

        # response = [
        #     '2',
        #     '5',
        #     '8'
        # ]

        response = []

        return Response(response)

class SyncChats(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid")

        token = auth_header.split(' ')[1]
        try:
            user = User.objects.get(auth_token=token)
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token")

        return Response({'status': '200'})