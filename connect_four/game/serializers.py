from rest_framework import serializers
from .models import *


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'game_time',
                  'created_at', 'board', 'host_id', 'player_id', 'host_starts', 'host_time', 'player_time', 'host_nickname', 'player_nickname', 'public')


class RoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('game_time',)
