from django.test import TestCase

import numpy as np
import math
import random


def make_board():
    board = np.zeros((6, 7))
    return board


def row_change(board, column):
    for x in range(0, 6):
        if(board[x][column] == 0):
            return x


def correct_row(board, column):
    return board[5][column] == 0 and column < 7


def winning_conditions(board, x):
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


def score_every_node(board, player, bot, BOT_LEVEL):
    score = 0

    for y in range(7):
        for z in range(3):
            if BOT_LEVEL == 5 and board[z][3] == bot:
                score += 1
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
            if BOT_LEVEL == 5 and board[z][3] == bot:
                score += 1
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
            if BOT_LEVEL == 5 and board[z][3] == bot:
                score += 1
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
            if BOT_LEVEL == 5 and board[z][3] == bot:
                score += 1
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


def draw_condition(board):
    if(np.all(board)):
        return True


def make_move(board, row, column, player):
    board[row][column] = player


def legal_moves(board):
    possibilities = []
    for i in range(0, 7):
        if(board[5][i] == 0):
            possibilities.append(i)
            random.shuffle(possibilities)
    return possibilities


def ai_move(depth):
    BOT_LEVEL = depth
    best_score = -math.inf
    best_column = 3
    possibilities = legal_moves(board)
    for x in possibilities:
        column = x
        if(correct_row(board, column)):
            row = row_change(board, column)
            board[row][column] = bot
            score = minimax(board, depth, False, -
                            math.inf, math.inf, BOT_LEVEL)
            print(score, column)
            board[row][column] = 0
            if(score > best_score):
                best_score = score
                best_column = x

    row = row_change(board, best_column)
    make_move(board, row, best_column, bot)


def minimax(board, depth, maximizing_player, alpha, beta, BOT_LEVEL):

    if(depth == 0):
        score = score_every_node(board, player, bot, BOT_LEVEL)
        return score

    if(maximizing_player):
        best_score = -math.inf
        possibilities = legal_moves(board)
        for x in possibilities:
            column = x
            if(correct_row(board, column)):
                row = row_change(board, column)
                board[row][column] = bot
                score = minimax(board, depth-1, False, alpha, beta, BOT_LEVEL)
                board[row][column] = 0
                best_score = max(score, best_score)
                alpha = max(alpha, best_score)
                if(beta <= alpha):
                    break
        return best_score

    else:
        best_score = math.inf
        possibilities = legal_moves(board)
        for x in possibilities:
            column = x
            if(correct_row(board, column)):
                row = row_change(board, column)
                board[row][column] = player
                score = minimax(board, depth-1, True, alpha, beta, BOT_LEVEL)
                board[row][column] = 0
                best_score = min(score, best_score)
                beta = min(beta, best_score)
                if(beta <= alpha):
                    break
        return best_score


def player_move():
    column = int(input())
    if(correct_row(board, column)):
        row = row_change(board, column)
        make_move(board, row, column, player)


def check_conditions():
    if(draw_condition(board)):
        print('DRAW!')
        return True
    if(winning_conditions(board, player)):
        print('PLAYER WON!')
        return True
    if(winning_conditions(board, bot)):
        print('BOT WON!')
        return True


def start_game():
    game_over = False
    while not game_over:
        if(player < bot):
            player_move()
            if(check_conditions()):
                break
            ai_move(3)
            print(np.flipud(board))
            if(check_conditions()):
                break

        else:
            ai_move(3)
            print(np.flipud(board))
            if(check_conditions()):
                break
            player_move()
            if(check_conditions()):
                break


board = make_board()
queue = [1, 2]
player = random.choice(queue)
queue.remove(player)
bot = queue[0]
start_game()
