import Piece from "./piece.js"

export default class Player {
  constructor(isBlack) {
    this.isBlack = isBlack;
    this.pieces = []
  }

  addPiece(i, j, board) {
    const piece = new Piece(this.isBlack, i, j, board);
    this.pieces.push(piece);
    return piece;
  }
}
