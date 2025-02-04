import Piece from "./classes/piece.js";
import Player from "./classes/player.js";

// element refs

const boardElem = document.querySelector("#board");
boardElem.addEventListener("click", tileOnClick);
const turnTracker = document.querySelector("#current-turn");

// global consts and lets
const print = console.log;
let blackTurn = true;
const player1 = new Player(blackTurn);
const player2 = new Player(!blackTurn);
const board = Array(8).fill().map(() => Array(8).fill(null));
const divmod8 = (num) => [Math.floor(num/8), num%8];
// player1.addPiece(1, 1, board);
// print(player1);
// const [moves, attacks] = player1.pieces[0].findMoves();
// print(board)
// print("moves", moves)
// print("attacks", attacks)

// functions

function tileOnClick(event) {
  // unhighlight tiles
  document.querySelector(".selected")?.classList.remove("selected");
  document.querySelectorAll(".destination").forEach(e => e.classList.remove("destination"));

  // pinpoint clicked tile and potential piece
  const id = event.target.id;
  const [y, x] = divmod8(id);
  const piece = board[y][x];

  
  if (!piece || piece.player !== blackTurn) return; // end if clicked on null or wrong player's piece

  const options = piece.findMoves();
  // const destinations = options[0].concat(options[1])
  print(options)

}

function init() {
  turnTracker.innerText = "Black's Turn!";
  blackTurn = true;
  player1.reset();
  player2.reset();
  resetBoard();
  // render();
}

function resetBoard() {
  boardElem.innerHTML = ""; // wipe the board to start from 0 -- easier than trying to relocate existing pieces

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const odd = (y+x)&1;

      // create tile and coloring
      const tileDiv = document.createElement("div");
      tileDiv.id = 8*y+x;
      tileDiv.classList.add("tile");
      tileDiv.classList.add(odd ? "brown" : "white")

      // place pieces
      if (!odd || (y > 2 && y < 5)) { // if white tile or middle row
        board[y][x] = null;
      } else if (y > 3) {
        placePiece(player1, y, x);
        tileDiv.classList.add("piece")
        tileDiv.classList.add("black");
      } else {
        placePiece(player2, y, x);
        tileDiv.classList.add("piece")
        tileDiv.classList.add("red");
      }

      boardElem.appendChild(tileDiv);
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

function render() {
  for (let y = 0; y < 8; ++y) {
    for (let x = 0; x < 8; ++x) {
      1+1;
    }
  }
}

function main() {
  init();
  // gameLoop();
}

init()
print(board)
// main();