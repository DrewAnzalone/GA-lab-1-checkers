import Piece from "./classes/piece.js";
import Player from "./classes/player.js";

// global consts and lets
const print = console.log;
let blackTurn = true;
const player1 = new Player(blackTurn);
const player2 = new Player(!blackTurn);
const board = Array(8).fill().map(() => Array(8).fill(null));

// player1.addPiece(1, 1, board);
// print(player1);
// const [moves, attacks] = player1.pieces[0].findMoves();
// print(board)
// print("moves", moves)
// print("attacks", attacks)

// functions
function init() {
  blackTurn = true;
  player1.reset();
  player2.reset();
  resetBoard();
}

function resetBoard() {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (!((y+x)&1) || (y > 2 && y < 5)) { // if white tile or middle row
        board[y][x] = null;
        continue;
      }
      if (y > 3) { placePiece(player1, y, x); }
      else { placePiece(player2, y, x); }
    }
  }
}

function placePiece(player, y, x) {
  player.addPiece(y, x, board);
  board[y][x] = player.latestPiece;
}

function gameOver() {
  if (!player1.pieces.length || !player2.pieces.length) {
    return player1.pieces.length ? player1 : player2;
  }
  return false;
}

function main() {
  init();
  gameLoop();
}

// main();