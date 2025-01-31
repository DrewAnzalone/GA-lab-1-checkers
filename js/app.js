const print = console.log;
const board = Array(8).fill().map(() => Array(8).fill(null));
let blackTurn = true;
// print(board);

function init() {
  
  // reset board
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (!((i+j)&1) || (i > 2 && i < 5)) { board[i][j] = null; }
      else { board[i][j] =  i > 3; }
    }
  }
}

init();
print(board);