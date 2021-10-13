from django.db import models
import string
import random
import numpy as np
import math
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


def make_board():
    board = np.zeros((6, 7))
    return board


class Room(models.Model):
    code = models.CharField(max_length=5, default=generate_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    game_time = models.TimeField(
        _("Player time:"), auto_now=False, auto_now_add=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Game(models.Model):

    board = models.CharField(max_length=200, default=make_board)
    host = models.CharField(max_length=50, unique=True)
    bot_level = models.IntegerField(null=False, default=1)

    @classmethod
    def row_change(self, board, column):
        for x in range(0, 6):
            if(board[x][column] == 0):
                return x

    @classmethod
    def correct_row(self, board, column):
        return board[5][column] == 0 and column < 7

    @classmethod
    def winning_conditions(self, board, x):
        # pionowo
        for y in range(7):
            for z in range(3):
                if(board[z][y] == x and board[z+1][y] == x and board[z+2][y] == x and board[z+3][y] == x):
                    return True

        # poziomo
        for y in range(4):
            for z in range(6):
                if(board[z][y] == x and board[z][y+1] == x and board[z][y+2] == x and board[z][y+3] == x):
                    return True

        # skos w dół
        for y in range(4):
            for z in range(3, 6):
                if(board[z][y] == x and board[z-1][y+1] == x and board[z-2][y+2] == x and board[z-3][y+3] == x):
                    return True

        # skos w góre
        for y in range(4):
            for z in range(3):
                if(board[z][y] == x and board[z+1][y+1] == x and board[z+2][y+2] == x and board[z+3][y+3] == x):
                    return True

    @classmethod
    def score_every_node(self, board, player, bot):
        score = 0

        for y in range(7):
            for z in range(3):
                if(board[z][y] == bot and board[z+1][y] == bot and board[z+2][y] == bot and board[z+3][y] == bot):
                    score += math.inf
                elif(board[z][y] == bot and board[z+1][y] == bot and board[z+2][y] == bot):
                    score += 5
                elif(board[z][y] == bot and board[z+1][y] == bot):
                    score += 2
                if(board[z][y] == player and board[z+1][y] == player and board[z+2][y] == player and board[z+3][y] == player):
                    score += -math.inf
                elif(board[z][y] == player and board[z+1][y] == player and board[z+2][y] == player):
                    score += -5
                elif(board[z][y] == player and board[z+1][y] == player):
                    score += -2

        for y in range(4):
            for z in range(6):
                if(board[z][y] == bot and board[z][y+1] == bot and board[z][y+2] == bot and board[z][y+3] == bot):
                    score += math.inf
                elif(board[z][y] == bot and board[z][y+1] == bot and board[z][y+2] == bot):
                    score += 5
                elif(board[z][y] == bot and board[z][y+1] == bot):
                    score += 2
                if(board[z][y] == player and board[z][y+1] == player and board[z][y+2] == player and board[z][y+3] == player):
                    score += -math.inf
                elif(board[z][y] == player and board[z][y+1] == player and board[z][y+2] == player):
                    score += -5
                elif(board[z][y] == player and board[z][y+1] == player):
                    score += -2

        # skos w dół
        for y in range(4):
            for z in range(3, 6):
                if(board[z][y] == bot and board[z-1][y+1] == bot and board[z-2][y+2] == bot and board[z-3][y+3] == bot):
                    score += math.inf
                elif(board[z][y] == bot and board[z-1][y+1] == bot and board[z-2][y+2] == bot):
                    score += 5
                elif(board[z][y] == bot and board[z-1][y+1] == bot):
                    score += 2
                if(board[z][y] == player and board[z-1][y+1] == player and board[z-2][y+2] == player and board[z-3][y+3] == player):
                    score += -math.inf
                elif(board[z][y] == player and board[z-1][y+1] == player and board[z-2][y+2] == player):
                    score += -5
                elif(board[z][y] == player and board[z-1][y+1] == player):
                    score += -2

        # skos w góre
        for y in range(4):
            for z in range(3):
                if(board[z][y] == bot and board[z+1][y+1] == bot and board[z+2][y+2] == bot and board[z+3][y+3] == bot):
                    score += math.inf
                elif(board[z][y] == bot and board[z+1][y+1] == bot and board[z+2][y+2] == bot):
                    score += 5
                elif(board[z][y] == bot and board[z+1][y+1] == bot):
                    score += 2
                if(board[z][y] == player and board[z+1][y+1] == player and board[z+2][y+2] == player and board[z+3][y+3] == player):
                    score += -math.inf
                elif(board[z][y] == player and board[z+1][y+1] == player and board[z+2][y+2] == player):
                    score += -5
                elif(board[z][y] == player and board[z+1][y+1] == player):
                    score += -2

        return score

    @classmethod
    def draw_condition(self, board):
        if(np.all(board)):
            return True

    @classmethod
    def make_move(self, board, row, column, player):
        board[row][column] = player

    @classmethod
    def legal_moves(self, board):
        possibilities = []
        for i in range(0, 7):
            if(board[5][i] == 0):
                possibilities.append(i)
                random.shuffle(possibilities)
        return possibilities

    @classmethod
    def ai_move(self, board, player, bot):
        best_score = -math.inf
        best_column = 3
        possibilities = self.legal_moves(board)
        for x in possibilities:
            column = x
            if(self.correct_row(board, column)):
                row = self.row_change(board, column)
                board[row][column] = bot
                score = self.minimax(
                    board, 3, False, -math.inf, math.inf, player, bot)
                print(score, column)
                board[row][column] = 0
                if(score > best_score):
                    best_score = score
                    best_column = x

        row = self.row_change(board, best_column)
        self.make_move(board, row, best_column, bot)

    @classmethod
    def string_to_2d_array(self, data):
        data = data.replace('\n ', '')
        data = data.replace('[', "")
        data = data.replace('], ', '.]')
        data = data.replace(',', '.')
        data = data[0:len(data)-2]
        data = data.replace(']', '.]')
        data = str(data.split('],'))
        data = data.replace("'", "")
        data = data.replace('[', '')
        data = data.replace(']', '')
        data = data.replace(' ', '.')
        data = data.replace('..', '.')
        data = data.replace(' ', '')
        data = data.split('.')
        data = data[0:42]
        data = [int(x) for x in data]

        def divide(l, n):
            return [l[i:i+n] for i in range(0, len(l), n)]
        data = divide(data, 7)
        return data

    @classmethod
    def minimax(self, board, depth, maximizing_player, alpha, beta, player, bot):

        if(depth == 0):
            score = self.score_every_node(board, player, bot)
            return score

        if(maximizing_player):
            best_score = -math.inf
            possibilities = self.legal_moves(board)
            for x in possibilities:
                column = x
                if(self.correct_row(board, column)):
                    row = self.row_change(board, column)
                    board[row][column] = bot
                    score = self.minimax(
                        board, depth-1, False, alpha, beta, player, bot)
                    board[row][column] = 0
                    best_score = max(score, best_score)
                    alpha = max(alpha, best_score)
                    if(beta <= alpha):
                        break
            return best_score

        else:
            best_score = math.inf
            possibilities = self.legal_moves(board)
            for x in possibilities:
                column = x
                if(self.correct_row(board, column)):
                    row = self.row_change(board, column)
                    board[row][column] = player
                    score = self.minimax(
                        board, depth-1, True, alpha, beta, player, bot)
                    board[row][column] = 0
                    best_score = min(score, best_score)
                    beta = min(beta, best_score)
                    if(beta <= alpha):
                        break
            return best_score

    @classmethod
    def player_move(self, board, player, column):

        if(self.correct_row(board, column)):
            row = self.row_change(board, column)
            self.make_move(board, row, column, player)

    @classmethod
    def check_conditions(self, board, player, bot):
        if(self.draw_condition(board)):
            print('DRAW!')
            return True
        if(self.winning_conditions(board, player)):
            print('PLAYER WON!')
            return True
        if(self.winning_conditions(board, bot)):
            print('BOT WON!')
            return True

    @classmethod
    def main(self, column, board):
        game_over = False
        queue = [1, 2]
        player = random.choice(queue)
        queue.remove(player)
        bot = queue[0]
        """ player = 2
        bot = 1 """
        if not game_over:
            if(player < bot):
                self.player_move(board, player, column)
                if(self.check_conditions(board, player, bot)):
                    game_over = True
                    return board
                self.ai_move(board, player, bot)
                if(self.check_conditions(board, player, bot)):
                    game_over = True
                    return board

            else:
                self.ai_move(board, player, bot)
                if(self.check_conditions(board, player, bot)):
                    game_over = True
                    return board
                self.player_move(board, player, column)
                if(self.check_conditions(board, player, bot)):
                    game_over = True
                    return board
            return board
