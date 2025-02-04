export default class Piece {
  static diagonals = {
    upLeft: [-1, -1],
    upRight: [-1, 1],
    downLeft: [1, -1],
    downRight: [1, 1]
  }

  constructor(player, y, x, board, king = false) {
    this.player = player;
    this.y = y;
    this.x = x;
    this.board = board;
    this.king = king;
  }

  get pos() {
    return [this.y, this.x]
  }

  findMoves() {
    const potentialMoves = [];
    if (this.king) { // can move in all 4 diagonals
      potentialMoves.push(this.makePotentialMove("upLeft"));
      potentialMoves.push(this.makePotentialMove("upRight"));
      potentialMoves.push(this.makePotentialMove("downLeft"));
      potentialMoves.push(this.makePotentialMove("downRight"));
    } else if (this.player) { // player is black and not kinged -- moving up 
      potentialMoves.push(this.makePotentialMove("upLeft"));
      potentialMoves.push(this.makePotentialMove("upRight"));
    } else { // player is red and not kinged -- moving down
      potentialMoves.push(this.makePotentialMove("downLeft"));
      potentialMoves.push(this.makePotentialMove("downRight"));
    }
    return this.removeInvalidMoves(potentialMoves);
  }

  makePotentialMove(direction) {
    return {
      dir: direction,
      newPos: this.shift(direction, this.pos)
    };
  }

  removeInvalidMoves(moves) {
    moves = moves.filter(this.inBounds);
    const output = { moves: [], attacks: [] };

    for (const move of moves) {
      if (this.noOverlapPlayerPiece(move, this.board)) { output.moves.push(move.newPos); }
      else if (this.validAttack(move, this.board)) { output.attacks.push(this.shift(move.dir, move.newPos)); }
    }
    return output;
  }

  inBounds(move) {
    return move.newPos[0] >= 0 && move.newPos[0] < 8 && move.newPos[1] >= 0 && move.newPos[1] < 8;
  }

  noOverlapPlayerPiece(move, board) {
    const potentialMove = board[move.newPos[0]][move.newPos[1]];
    return potentialMove === null;
  }

  validAttack(move, board) {
    const potentialMove = board[move.newPos[0]][move.newPos[1]];
    if (potentialMove === null) { return false; }
    if (potentialMove.player === this.player) { return false; }

    const destination = this.shift(move.dir, move.newPos)
    return board[destination[0]][destination[1]] === null;
  }

  shift(dir, currPos) { // return a new position after shifting the curr position by diagonals[dir]
    const direction = Piece.diagonals[dir];
    const newY = currPos[0] + direction[0];
    const newX = currPos[1] + direction[1];
    return [newY, newX];
  }

  boardRemove() {
    this.board[this.y][this.x] = null;
  }

  makeMove() {
    1 + 1; // random line of code for unimplemented function
  }

  attackMove() {
    5 + 5; // random line of code for unimplemented function
  }
}
