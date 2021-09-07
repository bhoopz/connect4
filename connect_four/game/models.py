from django.db import models
import string
import random
from django.utils.translation import gettext as _

# Create your models here.


def generate_code():
    length = 5
    while True:
        code = ''.join(random.choices(
            string.ascii_uppercase + string.digits, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break
    return code


class Room(models.Model):
    code = models.CharField(max_length=5, default=generate_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    game_time = models.TimeField(
        _("Player time:"), auto_now=False, auto_now_add=False)
    created_at = models.DateTimeField(auto_now_add=True)
