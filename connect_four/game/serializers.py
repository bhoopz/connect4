from rest_framework import serializers
from .models import *


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'game_time', 'created_at')


class RoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('game_time',)


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ('id', 'board', 'host', 'bot_level')


class GameCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ('bot_level',)
