import Piece from "./piece.js"

export default class Player {
  constructor(isBlack) {
    this.isBlack = isBlack;
    this.pieces = [];
  }

  get latestPiece() {
    return this.pieces[this.pieces.length-1];
  }

  addPiece(y, x, board) {
    const piece = new Piece(this.isBlack, y, x, board);
    this.pieces.push(piece);
    return piece;
  }

  removePiece(piece) {
    piece.boardRemove();
    const idx = this.pieces.findIndex(p => p === piece);
    this.pieces.splice(idx, 1);
  }

  makeMove(fromCoord, toCoord) {
    const movingPiece = this.pieces.find(piece =>  fromCoord[0] == piece.y && fromCoord[1] == piece.x );
    if (Math.abs(fromCoord[0]-toCoord[0]) > 1) { // moving 2 tiles diagonally
      movingPiece.attackMove(toCoord);
    } else {
      movingPiece.move(toCoord);
    }
  }

  hasMoves() {
    return this.pieces.any((piece) => {
      const options = piece.findMoves();
      return options.moves || options.attacks
    })
  }

  reset() {
    this.pieces.length = 0;
  }

}
