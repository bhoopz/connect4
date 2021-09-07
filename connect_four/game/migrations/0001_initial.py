# Generated by Django 3.2.6 on 2021-09-06 10:11

from django.db import migrations, models
import game.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(default=game.models.generate_code, max_length=5, unique=True)),
                ('host', models.CharField(max_length=50, unique=True)),
                ('game_time', models.TimeField(verbose_name='Player time:')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
