import Piece from "./classes/piece.js";
import Player from "./classes/player.js";

const print = console.log;
let blackTurn = true;
const player1 = new Player(blackTurn);
const player2 = new Player(!blackTurn);
const board = Array(8).fill().map(() => Array(8).fill(null));
player1.addPiece(1, 1, board);
print(player1);
const [moves, attacks] = player1.pieces[0].findMoves();
// print(board)
print("moves", moves)
print("attacks", attacks)

function init() {
  blackTurn = true;
  player1.reset();
  player2.reset();
  // reset board
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (!((y+x)&1) || (y > 2 && y < 5)) { board[y][x] = null; }
      else { board[y][x] =  y > 3; }
    }
  }
}

// init();
// print(board);