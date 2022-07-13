import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import *


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['roomCode']
        self.room_group_name = 'chat_%s' % self.room_code

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = None
        nick = None
        board = None
        decision = None
        player_id = None
        who_won_string = None
        host_score = None
        player_score = None
        host_time = None
        host_seconds = None
        player_time = None
        player_seconds = None
        if 'message' in text_data_json:
            message = text_data_json['message']
        if 'nick' in text_data_json:
            nick = text_data_json['nick']
        if 'board' in text_data_json:
            board = text_data_json['board']
        if 'decision' in text_data_json:
            decision = text_data_json['decision']
        if 'player_id' in text_data_json:
            player_id = text_data_json['player_id']
        if 'who_won_string' in text_data_json:
            who_won_string = text_data_json['who_won_string']
        if 'host_score' in text_data_json:
            host_score = text_data_json['host_score']
        if 'player_score' in text_data_json:
            player_score = text_data_json['player_score']
        if 'host_time' in text_data_json:
            host_time = text_data_json['host_time']
        if 'host_seconds' in text_data_json:
            host_seconds = text_data_json['host_seconds']
        if 'player_time' in text_data_json:
            player_time = text_data_json['player_time']
        if 'player_seconds' in text_data_json:
            player_seconds = text_data_json['player_seconds']

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
        if decision != None:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_decision',
                    'decision': decision,
                }
            )
        if player_id != None:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'player_info',
                    'player_id': player_id,
                }
            )

        if who_won_string != None:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'who_won',
                    'who_won_string': who_won_string,
                }
            )

        if player_score != None:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_player_score',
                    'player_score': player_score,
                }
            )

        if host_score != None:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_host_score',
                    'host_score': host_score,
                }
            )

        if host_time != None and host_seconds != None:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'host_time_menagement',
                    'host_time': host_time,
                    'host_seconds': host_seconds,
                }
            )

        if player_time != None and player_seconds != None:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'player_time_menagement',
                    'player_time': player_time,
                    'player_seconds': player_seconds,
                }
            )

    async def chat_message(self, event):
        message = event['message']
        nick = event['nick']

        if message != None and nick != None:
            await self.send(text_data=json.dumps({
                'message': message,
                'nick': nick,
            }))

    async def room_data(self, event):
        board = event['board']

        await self.send(text_data=json.dumps({
            'board': board,
        }))

    async def send_decision(self, event):
        decision = event['decision']

        await self.send(text_data=json.dumps({
            'decision': decision,
        }))

    async def player_info(self, event):
        player_id = event['player_id']

        await self.send(text_data=json.dumps({
            'player_id': player_id,
        }))

    async def who_won(self, event):
        who_won_string = event['who_won_string']

        await self.send(text_data=json.dumps({
            'who_won_string': who_won_string,
        }))

    async def send_player_score(self, event):
        player_score = event['player_score']

        await self.send(text_data=json.dumps({
            'player_score': player_score,
        }))

    async def send_host_score(self, event):
        host_score = event['host_score']

        await self.send(text_data=json.dumps({
            'host_score': host_score,
        }))

    async def host_time_menagement(self, event):
        host_time = event['host_time']
        host_seconds = event['host_seconds']

        await self.send(text_data=json.dumps({
            'host_time': host_time,
            'host_seconds': host_seconds,
        }))

    async def player_time_menagement(self, event):
        player_time = event['player_time']
        player_seconds = event['player_seconds']

        await self.send(text_data=json.dumps({
            'player_time': player_time,
            'player_seconds': player_seconds,
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
