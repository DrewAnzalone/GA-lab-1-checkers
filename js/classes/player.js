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

  reset() {
    this.pieces.length = 0;
  }

}
