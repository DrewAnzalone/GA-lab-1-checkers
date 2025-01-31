def gameover():
    return player1.hasNoPieces() or player2.hasNoPieces()

def main():
    while not gameover():
        select checker to move
        show valid move spots
        select spot to move to # including skipping a tile for attacks
        after move, check for kinging
        if attack, check for and offer chain attacks
    display winner, offer restart