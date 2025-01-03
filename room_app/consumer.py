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
    isHost = False

    def connect(self):
        self.user = self.scope['user']
        self.players.append(self)
        self.accept()

    def disconnect(self, close_code):
        self.players.remove(self)
        return

    def receive(self, text_data):
        # if not self.game_active:
        #     return
        data = json.loads(text_data)

        if data.get('type') == 'is_host':
            self.isHost = True
            return

        for player in self.players:
            if 'update_list' in data:
                player.send(text_data=json.dumps({**data, 'isHost': self.isHost}))
            else:
                if (player.user != self.user):
                    player.send(text_data=json.dumps({**data, 'isHost': self.isHost}))
