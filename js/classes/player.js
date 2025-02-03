import Piece from "./piece.js"

export default class Player {
  constructor(isBlack) {
    this.isBlack = isBlack;
    this.pieces = [];
  }

  addPiece(y, x, board) {
    const piece = new Piece(this.isBlack, y, x, board);
    this.pieces.push(piece);
    return piece;
  }

  reset() {
    this.pieces.lengh = 0;
  }
}
