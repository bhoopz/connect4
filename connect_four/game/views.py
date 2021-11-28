from django.shortcuts import render
from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
import numpy as np


# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if room.exists():
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room does not found': 'Invalid data...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Request error': 'Wrong code parameter'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        code = request.data.get(self.lookup_url_kwarg)
        queryset = Room.objects.filter(code=code)
        board = request.data['board']
        if queryset.exists():
            room = queryset[0]
            room.board = board
            room.save(update_fields=['board'])
            return Response(status=status.HTTP_200_OK)
        return Response({'Error': 'Invalid post data...'}, status=status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_finded = Room.objects.filter(code=code)
            if room_finded.exists():
                room = room_finded[0]
                self.request.session['room_code'] = code
                return Response({"Success": "Joined the room!"}, status=status.HTTP_200_OK)
            return Response({'Error': 'Invalid room code...'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Error': 'Invalid post data...'}, status=status.HTTP_400_BAD_REQUEST)


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)


class RoomCreateView(APIView):
    serializer_class = RoomCreateSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            game_time = serializer.data.get('game_time')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.game_time = game_time
                room.save(update_fields=['game_time'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, game_time=game_time)
                room.save()
                self.request.session['room_code'] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


""" class GameView(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class GameCreateView(APIView):
    serializer_class = GameCreateSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            bot_level = serializer.data.get('bot_level')
            host = self.request.session.session_key
            queryset = Game.objects.filter(host=host)
            if queryset.exists():
                game = queryset[0]
                game.bot_level = bot_level
                game.save(update_fields=['bot_level'])
                return Response(GameSerializer(game).data, status=status.HTTP_200_OK)
            else:
                game = Game(host=host, bot_level=bot_level)
                game.save()
            return Response(GameSerializer(game).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST) """


class LeaveGame(APIView):
    def post(self, request, format=None):
        host = self.request.session.session_key
        finded_game = Game.objects.filter(host=host)
        if finded_game.exists():
            game = finded_game[0]
            game.delete()
        return Response(status=status.HTTP_200_OK)


""" class Test(APIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'board': request.GET.get('board')
        }
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        try:
            column = int(request.data['column'])
            data = main(column)
            print(data)
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST) """
