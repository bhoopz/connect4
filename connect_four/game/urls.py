from django.urls import path
from .views import *

urlpatterns = [
    path('player/room', RoomView.as_view()),
    path('player/create-room', RoomCreateView.as_view()),
    path('player/get-room', GetRoom.as_view()),
    path('player/join-room', JoinRoom.as_view()),
    path('player/user-in-room', UserInRoom.as_view()),



    path('computer/get-game', GetGame.as_view()),
    path('computer/games', GameView.as_view()),
    path('computer/create-game', GameCreateView.as_view()),
    path('computer/leave-game', LeaveGame.as_view()),

]
