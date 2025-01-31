class Piece {
  static diagonals = [[-1, -1], [-1, 1], [1, -1], [1, 1]] // vector ops for moving up-left, up-right, down-left, down-right
  
  constructor(player, position, board, king = false) {
    this.player = player;
    this.pos = position;
    this.board = board;
    this.king = false;
  }

  findMoves() {
    const potentialMoves = [];
    if (this.king) { // can move in all 4 diagonals
      potentialMoves.push([0, this.shift(0, this.pos)]); // up left
      potentialMoves.push([1, this.shift(1, this.pos)]); // up right
      potentialMoves.push([2, this.shift(2, this.pos)]); // down left
      potentialMoves.push([3, this.shift(3, this.pos)]); // down right
    } else if (this.player) { // player is black and not kinged -- moving up 
      potentialMoves.push([0, this.shift(0, this.pos)]); // up left
      potentialMoves.push([1, this.shift(1, this.pos)]); // up right
    } else { // player is red and not kinged -- moving down
      potentialMoves.push([2, this.shift(2, this.pos)]); // down left
      potentialMoves.push([3, this.shift(3, this.pos)]); // down right
    }

    return this.removeInvalidMoves(potentialMoves);
  }

  removeInvalidMoves(moves) {
    moves = moves.filter(this.inBounds);
    const validMoves = moves.filter(this.noOverlapPlayer);
    const validAttacks = moves.filter(this.validAttack);
    return [validMoves, validAttacks];
  }

  inBounds(move) {
    return move[1][0] >= 0 && move[1][0] < 8 && move[1][1] >= 0 && move[1][1] < 8;
  }

  noOverlapPlayerPiece(move) {
    const potentialMove = this.board[move[1][0]][move[1][1]]; 
    return potentialMove === null;
  }
  
  validAttack(move) {
    const potentialMove = this.board[move[1][0]][move[1][1]];
    if (potentialMove === null) { return false; }
    if (potentialMove.player === this.player) { return false; }

    const destination = this.shift(move[0], move[1])
    return this.board[destination[0]][destination[1]] === null;
  }

  shift(direction, position) { // return a new position after shifting the position by diagonals[direction]
    return [position[0]+diagonals[direction][0], position[1]+diagonals[direction][1]]
  }

  makeMove() {
    this.board
  }

  attackMove() {

  }
}

export default Piece;
