from django.urls import path, register_converter
from .views import *

urlpatterns = [
    path('', index),
    path('player/join', index),
    path('player/create', index),
    path('player/room/<str:roomCode>', index),
    path('player/', index),
    path('computer/', index),
    path('computer/<str:level>', index),
]
