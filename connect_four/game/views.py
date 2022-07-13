from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
import uuid


# Create your views here.


class RoomView(generics.ListCreateAPIView):
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
        if queryset.exists():
            room = queryset[0]
            if 'board' in request.data:
                board = request.data['board']
                room.board = board
            if 'decision' in request.data:
                decision = bool(request.data['decision'])
                room.host_starts = decision
            if 'host_time' in request.data:
                host_time = request.data['host_time']
                room.host_time = host_time
            if 'player_time' in request.data:
                player_time = request.data['player_time']
                room.player_time = player_time
            if 'player_id' in request.data:
                player_id = request.data['player_id']
                room.player_id = player_id
            room.save(update_fields=[
                      'board', 'host_starts', 'host_time', 'player_time', 'player_id'])
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
            player_nickname = request.data['player_nickname']
            player_id = uuid.uuid4()
            if room_finded.exists():
                room = room_finded[0]
                if room.player_id == None:
                    room.player_nickname = player_nickname
                    room.player_id = player_id
                    room.save(update_fields=['player_id', 'player_nickname'])
                    self.request.session['room_code'] = code
                    return Response({"Success": "Joined the room!"}, status=status.HTTP_200_OK)
                else:
                    return Response({'Error': 'Room is full'}, status=status.HTTP_400_BAD_REQUEST)
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
            host_nickname = request.data['host_nickname']
            public = request.data['public']
            host_time = game_time
            player_time = game_time
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.public = public
                room.host_nickname = host_nickname
                room.game_time = game_time
                room.host_time = host_time
                room.player_time = player_time
                room.save(update_fields=['game_time',
                          'host_time', 'player_time', 'host_nickname', 'public'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, game_time=game_time,
                            host_time=host_time, player_time=player_time, host_nickname=host_nickname, public=public)
                room.save()
                self.request.session['room_code'] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        host = self.request.session.session_key
        finded_room = Room.objects.filter(host=host)
        if finded_room.exists():
            room = finded_room[0]
            room.delete()
        return Response(status=status.HTTP_200_OK)
