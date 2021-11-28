import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import *


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['roomCode']
        self.room_group_name = 'chat_%s' % self.room_code
        print(self.scope['client'], " <-----self.scope['client']")

        # Dołącza do grupy
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Opuszcza grupe
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Otrzymuje wiadomość od WebSocket
    async def receive(self, text_data):
        user2 = self.scope["user"]
        text_data_json = json.loads(text_data)
        message = None
        nick = None
        board = None
        if 'message' in text_data_json:
            message = text_data_json['message']
        if 'nick' in text_data_json:
            nick = text_data_json['nick']
        if 'board' in text_data_json:
            board = text_data_json['board']

        # Wysyła wiadomość do grupy
        if message != None and nick != None:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'nick': nick,
                }
            )
        if board != None:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'room_data',
                    'board': board,
                }
            )

    # Otrzymuje wiadomość od grupy
    async def chat_message(self, event):
        message = event['message']
        nick = event['nick']

        # Wysyła wiadomość do WebSocket
        if message != None and nick != None:
            await self.send(text_data=json.dumps({
                'message': message,
                'nick': nick,
            }))

    async def room_data(self, event):
        board = event['board']

        # Wysyła wiadomość do WebSocket
        await self.send(text_data=json.dumps({
            'board': board,
        }))


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        await self.channel_layer.group_add(
            "game",
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            "game",
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        board = text_data_json['board']
        depth = int(text_data_json['depth'])
        player = int(text_data_json['player'])
        bot = int(text_data_json['bot'])
        board_temp = Game.ai_move(board, player, bot, depth)

        await self.send(text_data=json.dumps({
            'board': board_temp,
        }))
