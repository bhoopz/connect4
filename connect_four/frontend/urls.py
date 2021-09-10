from django.urls import path
from .views import *

urlpatterns = [
    path('', index),
    path('player/join', index),
    path('player/create', index),
    path('player/room/<str:roomCode>', index),
    path('player/', index),
]
