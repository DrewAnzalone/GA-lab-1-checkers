export default class Piece {
  static diagonals = [[-1, -1], [-1, 1], [1, -1], [1, 1]] // vector ops for moving up-left, up-right, down-left, down-right
  
  constructor(player, x, y, king = false) {
    this.player = player;
    this.x = x;
    this.y = y;
    this.king = king;
  }

  get pos() {
    return [this.x, this.y]
  }

  findMoves(board) {
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
    return this.removeInvalidMoves(potentialMoves, board);
  }

  removeInvalidMoves(moves, board) {
    moves = moves.filter(this.inBounds);
    let validMoves = moves.filter(this.noOverlapPlayerPiece(board));
    let validAttacks = moves.filter(this.validAttack(board));
    validMoves = validMoves.map((move) => move[1]);
    validAttacks = validAttacks.map((move) => move[1]);
    return [validMoves, validAttacks];
  }

  inBounds(move) {
    return move[1][0] >= 0 && move[1][0] < 8 && move[1][1] >= 0 && move[1][1] < 8;
  }

  noOverlapPlayerPiece(board) {
    const curry = (move) => { // I hate it I hate it I hate it but JS is dynamically scoped for some reason so I have to curry board into the filter function
      const potentialMove = board[move[1][0]][move[1][1]]; 
      return potentialMove === null;
    }
    return curry;
  }
  
  validAttack(board) {
    const curry = (move) => { // I hate it I hate it I hate it but JS is dynamically scoped for some reason so I have to curry board into the filter function
      const potentialMove = board[move[1][0]][move[1][1]];
      if (potentialMove === null) { return false; }
      if (potentialMove.player === this.player) { return false; }
  
      const destination = this.shift(move[0], move[1])
      return board[destination[0]][destination[1]] === null;
    }
    return curry;
  }

  shift(direction, position) { // return a new position after shifting the position by diagonals[direction]
    return [position[0]+Piece.diagonals[direction][0], position[1]+Piece.diagonals[direction][1]]
  }

  makeMove() {
    1+1; // random line of code for unimplemented function
  }

  attackMove() {
    5+5; // random line of code for unimplemented function
  }
}
