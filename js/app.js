import Piece from "./classes/piece.js";
import Player from "./classes/player.js";

// element refs

const boardElem = document.querySelector("#board");
boardElem.addEventListener("click", tileOnClick);
const turnTracker = document.querySelector("#current-turn");
const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", init);

// global lets and consts

let blackTurn = true;
let winner = null;
const dimension = 8;
const selected = { div: null, id: null };
const player1 = new Player(blackTurn);
const player2 = new Player(!blackTurn);
const board = Array(dimension).fill().map(() => Array(dimension).fill(null));
const divmod8 = (num) => [Math.floor(num / dimension), num % dimension];
const toID = (coord) => dimension * coord[0] + coord[1];
const boardManagers = [removeSelectedDestination, renderUpdates, refreshBoard]
const print = console.log;

// events

function tileOnClick(event) {
  if (winner) turnTracker.innerText = `${winner === player1 ? "Black" : "Red"} Wins!`
  else if (!selected.div) { // no pieces are currently selected
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
  if (event.target.classList.contains("destination")) { // a valid moive has been chosen
    removeSelectedDestination();
    const player = blackTurn ? player1 : player2;
    player.makeMove(divmod8(selected.id), divmod8(event.target.id), boardManagers); // boardManagers must be passed in and not called on the next line because of chain attacks
    winner = getWinner();
    if (!winner) flipTurn();
  } else { // the player clicked a blank tile or another piece
    removeSelectedDestination();
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
  flipTurn("reset");
  selected.div = null;
  selected.id = null;
  blackTurn = true;
  winner = null;
  player1.reset();
  player2.reset();
  resetBoard();
}

function flipTurn(reset = null) {
  blackTurn = !blackTurn;
  if (reset) { blackTurn = true; }
  turnTracker.innerText = `${blackTurn ? "Black" : "Red"}'s Turn!`;
}

function resetBoard() {
  boardElem.innerHTML = ""; // wipe the board to start from 0 -- easier than trying to relocate existing pieces

  for (let y = 0; y < dimension; y++) {
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
        placePiece(y > 3 ? player1 : player2, y, x);
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

function getWinner() {
  if (!player1.pieces.length || !player2.pieces.length) { // either player has no pieces
    return player1.pieces.length ? player1 : player2;
  }

  if (!player1.hasMoves()) return player2;
  if (!player2.hasMoves()) return player1;

  return null;
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

function refreshBoard() {
  // print("refresh called")
  for (const tile of document.querySelectorAll(".tile")) {
    const coord = divmod8(tile.id)
    const pieceClasses = board[coord[0]][coord[1]]?.getClassNames() || [];
    tile.classList.remove("piece", "black", "red", "king")
    tile.classList.add(...pieceClasses);
  }
}
init()
// player2.reset()
// for (let row = 0; row < 4; row++) {
//   board[row].fill(null)
// }
refreshBoard()
// print(board)
// main();