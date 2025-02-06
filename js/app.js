import Piece from "./classes/piece.js";
import Player from "./classes/player.js";

// element refs

const boardElem = document.querySelector("#board");
boardElem.addEventListener("click", tileOnClick);
const turnTracker = document.querySelector("#current-turn");
const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", init);

// global game object and helper methods

const game = {};
game.winner = null;
game.dimension = 8;
game.blackTurn = true;
game.chainAttack = false;
game.selected = { div: null, id: null };
game.player1 = new Player(game.blackTurn);
game.player2 = new Player(!game.blackTurn);
game.board = Array(game.dimension).fill().map(() => Array(game.dimension).fill(null)); // attrs are defined line by line because some rely on earlier attrs

const divmod8 = (num) => [Math.floor(num / game.dimension), num % game.dimension];
const toID = (coord) => game.dimension * coord[0] + coord[1];

// events

function tileOnClick(event) {
  if (game.winner) turnTracker.innerText = `${game.winner === game.player1 ? "Black" : "Red"} Wins!`
  else if (game.chainAttack) { // chain attacks are foced, so check for valid destination
    if (event.target.classList.contains("destination")) { secondClick(event); }
  } else if (!game.selected.div) { // no pieces are currently selected
    firstClick(event);
  } else { // a piece is selected
    secondClick(event);
  }
}

function firstClick(event) {
  // pinpoint clicked tile and potential piece
  const id = event.target.id;
  const [y, x] = divmod8(id);
  const piece = game.board[y][x];

  if (!piece || piece.player !== game.blackTurn) return; // end if clicked on null or wrong player's piece

  const options = piece.findMoves();
  if (!(options.moves.length || options.attacks.length)) return; // if no valid moves, end

  game.selected.div = event.target;
  game.selected.id = id;
  const destinations = [
    ...options.moves.map((move) => toID(move)),
    ...options.attacks.map((move) => toID(move))
  ]; // flattening destination coordinates to div IDs

  renderUpdates([id], "selected");
  renderUpdates(destinations, "destination");
}

function secondClick(event) {
  if (event.target.classList.contains("destination")) { // a valid move has been chosen
    removeSelectedDestination();
    const player = game.blackTurn ? game.player1 : game.player2;
    const enemy = game.blackTurn ? game.player2 : game.player1;
    const chainAttacks = player.makeMove(divmod8(game.selected.id), divmod8(event.target.id), enemy);
    refreshBoard();
    if (chainAttacks.length) { // there are chain attacks available, dont change turns
      game.chainAttack = true;
      renderUpdates([event.target.id], "selected");
      renderUpdates(chainAttacks.map(move => toID(move)), "destination");
      game.selected.div = event.target;
      game.selected.id = event.target.id;
      return;
    }
    game.chainAttack = false;
    game.winner = getWinner();
    if (game.winner) turnTracker.innerText = `${game.winner === game.player1 ? "Black" : "Red"} Wins!`;
    else flipTurn();
  } else { // the player clicked a blank tile or another piece
    removeSelectedDestination();
    firstClick(event);
  }
}

// functions

function init() {
  game.selected.div = null;
  game.chainAttack = false;
  game.selected.id = null;
  game.player1.reset();
  game.player2.reset();
  game.winner = null;
  flipTurn("reset");
  resetBoard();
}

function resetBoard() {
  boardElem.innerHTML = ""; // wipe the board to start from 0 -- easier than trying to relocate existing pieces

  for (let y = 0; y < game.dimension; y++) {
    for (let x = 0; x < game.board[y].length; x++) {
      const odd = (y + x) & 1;

      // create tile and coloring
      const tileDiv = document.createElement("div");
      tileDiv.id = toID([y, x]);
      tileDiv.classList.add("tile");
      tileDiv.classList.add(odd ? "brown" : "white");

      // place pieces
      if (!odd || (y > 2 && y < 5)) { // if white tile or middle row
        game.board[y][x] = null;
      } else {
        placePiece(y > 3 ? game.player1 : game.player2, y, x);
        tileDiv.classList.add("piece");
        tileDiv.classList.add(y > 3 ? "black" : "red");
      }

      boardElem.appendChild(tileDiv);
    }
  }
}

function placePiece(player, y, x) {
  player.addPiece(y, x, game.board);
  game.board[y][x] = player.latestPiece;
}

function flipTurn(reset = null) {
  game.blackTurn = !game.blackTurn;
  if (reset) { game.blackTurn = true; }
  turnTracker.innerText = `${game.blackTurn ? "Black" : "Red"}'s Turn!`;
  if (game.winner) turnTracker.innerText = `${game.winner === game.player1 ? "Black" : "Red"} Wins!`
}

function getWinner() {
  const player = game.blackTurn ? game.player1 : game.player2;
  const opponent = game.blackTurn ? game.player2 : game.player1;
  if (!(opponent.pieces.length && opponent.hasMoves())) return player;
  return null;
}

// rendering

function removeSelectedDestination() {
  game.selected.div.classList.remove("selected");
  game.selected.div = null;
  document.querySelectorAll(".destination").forEach(e => e.classList.remove("destination"));
}

function renderUpdates(ids, ...classes) {
  for (const id of ids) {
    const square = document.getElementById(id);
    square.classList.add(...classes);
  }
}

function refreshBoard() {
  for (const tile of document.querySelectorAll(".tile")) {
    const coord = divmod8(tile.id)
    const pieceClasses = game.board[coord[0]][coord[1]]?.getClassNames() || [];
    tile.classList.remove("piece", "black", "red", "king")
    tile.classList.add(...pieceClasses);
  }
}

init()
