import Piece from "./classes/piece.js";
import Player from "./classes/player.js";

// element refs
const boardElem = document.querySelector("#board");
boardElem.addEventListener("click", tileOnClick);
const turnTracker = document.querySelector("#current-turn");
const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", init);

// global game object and helper methods
const gameAttrs = {
  winner: null,
  dimension: 8,
  blackTurn: true,
  chainAttack: false,
  selected: { div: null, id: null }
};
gameAttrs.player1 = new Player(gameAttrs.blackTurn);
gameAttrs.player2 = new Player(!gameAttrs.blackTurn);
gameAttrs.board = Array(gameAttrs.dimension).fill().map(() => Array(gameAttrs.dimension).fill(null)); // some attrs are defined line by line because some rely on earlier attrs

const divmod8 = (num) => [Math.floor(num / gameAttrs.dimension), num % gameAttrs.dimension];
const toID = (coord) => gameAttrs.dimension * coord[0] + coord[1];

// events
`
Using default args is potentially risky here if the click event ever passes multiple arguments.
But, from my research, I couldn't find anything that indicates this is a possibility in plain html/js
The alternative to achieve this behavior is replacing the function on line 6 with the arrow function:
(event) => tileOnClick(event, gameAttrs)
`
function tileOnClick(event, game = gameAttrs) {
  if (game.winner) turnTracker.innerText = `${game.winner === game.player1 ? "Black" : "Red"} Wins!`;
  else if (game.chainAttack) { // chain attacks are foced, so check for valid destination
    if (event.target.classList.contains("destination")) { secondClick(game, event); }
  }
  else if (!game.selected.div) { // no pieces are currently selected
    firstClick(game, event);
  } else { // a piece is selected
    secondClick(game, event);
  }
}

function firstClick(game, event) {
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

function secondClick(game, event) {
  const isDestination = event.target.classList.contains("destination");
  removeSelectedDestination(game);

  if (isDestination) { // a valid move has been chosen
    const player = game.blackTurn ? game.player1 : game.player2;
    const enemy = game.blackTurn ? game.player2 : game.player1;
    const chainAttacks = player.makeMove(divmod8(game.selected.id), divmod8(event.target.id), enemy);
    refreshBoard(game);

    if (chainAttacks.length) { // there are chain attacks available, dont change turns
      game.chainAttack = true;
      renderUpdates([event.target.id], "selected");
      renderUpdates(chainAttacks.map(move => toID(move)), "destination");
      game.selected.div = event.target;
      game.selected.id = event.target.id;
      return;
    }

    game.chainAttack = false;
    game.winner = getWinner(game);
    if (game.winner) turnTracker.innerText = `${game.winner === game.player1 ? "Black" : "Red"} Wins!`;
    else flipTurn(game);
  } else { // the player clicked a blank tile or another piece
    firstClick(game, event);
  }
}

// functions
function init(event = null, game = gameAttrs) {
  game.selected.div = null;
  game.chainAttack = false;
  game.selected.id = null;
  game.player1.reset();
  game.player2.reset();
  game.winner = null;
  flipTurn(game, "reset");
  resetBoard(game);
}

function resetBoard(game) {
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
        placePiece(game, y > 3 ? game.player1 : game.player2, y, x);
        tileDiv.classList.add("piece");
        tileDiv.classList.add(y > 3 ? "black" : "red");
      }

      boardElem.appendChild(tileDiv);
    }
  }
}

function placePiece(game, player, y, x) {
  player.addPiece(y, x, game.board);
  game.board[y][x] = player.latestPiece;
}

function flipTurn(game, reset = null) {
  game.blackTurn = !game.blackTurn;
  if (reset) { game.blackTurn = true; }
  turnTracker.innerText = `${game.blackTurn ? "Black" : "Red"}'s Turn!`;
  if (game.winner) turnTracker.innerText = `${game.winner === game.player1 ? "Black" : "Red"} Wins!`;
}

function getWinner(game) {
  const player = game.blackTurn ? game.player1 : game.player2;
  const opponent = game.blackTurn ? game.player2 : game.player1;
  if (!(opponent.pieces.length && opponent.hasMoves())) return player;
  return null;
}

// rendering
function removeSelectedDestination(game) {
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

function refreshBoard(game) {
  for (const tile of document.querySelectorAll(".tile")) {
    const coord = divmod8(tile.id);
    const pieceClasses = game.board[coord[0]][coord[1]]?.getClassNames() || [];
    tile.classList.remove("piece", "black", "red", "king");
    tile.classList.add(...pieceClasses);
  }
}

// run game
init()
