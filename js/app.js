import Piece from "./classes/piece.js";
import Player from "./classes/player.js";

// element refs

const boardElem = document.querySelector("#board");
boardElem.addEventListener("click", tileOnClick);
const turnTracker = document.querySelector("#current-turn");

// global consts and lets

let blackTurn = true;
let gameOver = false;
const selected = { div: null, id: null };
const player1 = new Player(blackTurn);
const player2 = new Player(!blackTurn);
const board = Array(8).fill().map(() => Array(8).fill(null));
const divmod8 = (num) => [Math.floor(num / 8), num % 8];
const toID = (coord) => 8 * coord[0] + coord[1];
const print = console.log;

// events

function tileOnClick(event) {
  if (gameOver) return;
  if (!selected.div) { // no pieces are currently selected
    firstClick(event);
  } else {
    secondClick(event);
  }
}

function firstClick(event) {
  // pinpoint clicked tile and potential piece
  const id = event.target.id;
  const [y, x] = divmod8(id);
  const piece = board[y][x];
  
  if (!piece || piece.player !== blackTurn) return; // end if clicked on null or wrong player's piece
  
  const options = piece.findMoves();
  if (!options.moves.length && !options.attacks.length) return; // if no valid moves, end
  
  selected.div = event.target;
  selected.id = id;
  const destinations = [
    ...options.moves.map((move) => toID(move)),
    ...options.attacks.map((move) => toID(move))
  ]; // flattening destination coordinates to div IDs
  
  renderUpdates([id], true, "selected");
  renderUpdates(destinations, true, "destination");
}

function secondClick(event) {
  removeSelectedDestination();
  if (event.target.classList.contains("destination")) {
    // initiate move
  } else {
    firstClick(event);
  }
}

// functions

function removeSelectedDestination() {
  selected.div.classList.remove("selected");
  selected.div = null;
  document.querySelectorAll(".destination").forEach(e => e.classList.remove("destination"));
}

function init() {
  turnTracker.innerText = "Black's Turn!";
  blackTurn = true;
  player1.reset();
  player2.reset();
  resetBoard();
}

function resetBoard() {
  boardElem.innerHTML = ""; // wipe the board to start from 0 -- easier than trying to relocate existing pieces

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const odd = (y + x) & 1;

      // create tile and coloring
      const tileDiv = document.createElement("div");
      tileDiv.id = 8 * y + x;
      tileDiv.classList.add("tile");
      tileDiv.classList.add(odd ? "brown" : "white");

      // place pieces
      if (!odd || (y > 2 && y < 5)) { // if white tile or middle row
        board[y][x] = null;
      } else {
        placePiece(y > 3 ? player1 : player2, y, x)
        tileDiv.classList.add("piece");
        tileDiv.classList.add(y > 3 ? "black" : "red");
      }

      boardElem.appendChild(tileDiv);
    }
  }
  // placePiece(player2, 4, 3);
  // board[4][3] = player2.latestPiece;
  // document.getElementById(35).classList.add("piece", "red");
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

function renderUpdates(ids, add, ...classes) {
  for (const id of ids) {
    const square = document.getElementById(id);
    if (add) {
      square.classList.add(...classes);
    } else {
      square.classList.remove(...classes);
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