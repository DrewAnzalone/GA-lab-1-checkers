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
    
'''
I initially wrote this loop down to mimic tile game implementations I had previously developed in python.
Over my time implementing this extremely high level approach, I discovered and reinforced a lot of fundamental differences between python and js.
For example, in this python implementation, everything is under a main while loop, but with js and html there is no loop - it's all event based.
Similarly, you can't "offer" moves the way you could offer in a loop implementation which force stops the game and can require one of a few options.
Also while discussing and inquiring about the details and mechanics of js and classes, I encountered many perspectives about coding practices and smells.
For example, some told me that using classes at all, especially `this`, is a code smell. I encountered multiple issues regarding `this`, so I understand
at least partially where theyre coming from regarding this point.
It should also go without saying that there were some edge cases that this pseudocode misses, such as "running out of moves" being a game over criteria.
'''