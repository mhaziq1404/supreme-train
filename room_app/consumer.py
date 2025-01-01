import json
from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
import jwt
from django.contrib.auth import get_user_model

User = get_user_model()

class RoomConsumer(WebsocketConsumer):
    players = []

    def connect(self):
        self.user = self.scope['user']
        self.players.append(self)
        self.accept()

    def disconnect(self, close_code):
        return

    def receive(self, text_data):
        # if not self.game_active:
        #     return
        data = json.loads(text_data)

        # if 'host_update' in data:
        #     self.room.id = data['room_data']['id']
        #     self.room.name = data['room_data']['name']
        #     self.room.type = data['room_data']['type']
        #     self.room.players = data['room_data']['players']

        # if 'player_update' in data:
        #     new_players = data['room_data']['players']
        #     self.room.players.append(new_player)

        # data['room_data'] = self.room

        for player in self.players:
            if 'update_list' in data:
                player.send(text_data=json.dumps(data))
            else:
                if (player.user != self.user):
                    player.send(text_data=json.dumps(data))
