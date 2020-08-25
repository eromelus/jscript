const INITIAL_MARKER = ' ';
const COMPUTER_MARKER = 'O';
const PLAYER_MARKER = 'X';
const WINNING_LINES = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9], // rows
    [1, 4, 7], [2, 5, 8], [3, 6, 9], // columns
    [1, 5, 9], [3, 5, 7]             // diagnols
];

function displayBoard(board) {
  console.clear();

  console.log(`You are ${PLAYER_MARKER}. Computer is ${COMPUTER_MARKER}`);

  console.log('');
  console.log('     |     |');
  console.log(`  ${board[1]}  |  ${board[2]}  |  ${board[3]}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board[4]}  |  ${board[5]}  |  ${board[6]}`);
  console.log('     |     |');
  console.log('-----+-----+-----')
  console.log('     |     |');
  console.log(`  ${board[7]}  |  ${board[8]}  |  ${board[9]}`);
  console.log('     |     |');
  console.log('');
}

function initializeBoard() {
  let board = {};
  for (let square = 1; square <= 9; square++) {
    board[String(square)] = INITIAL_MARKER;
  }
  return board;
}

function emptySquares(board) {
  return Object.keys(board).filter(key => board[key] === INITIAL_MARKER);
}

function findAtRiskSquare(line, board) {
  let marksInLine = line.map(square => board[square]);

  if (marksInLine.filter(value => value === 'X').length === 2) {
    let unusedSquare = line.find(square => board[square] === ' ');
    if (unusedSquare !== undefined) {
      return unusedSquare;
    }
  }
  return null;
}

function computerChoosesSquare(board) {
  let square;

  for (let index = 0; index < WINNING_LINES.length; index++) {
    let line = WINNING_LINES[index];
    square = findAtRiskSquare(line, board);
    if (square) break;
  }

  board[square] = 'O';
  
  // let randomIndex = Math.floor(Math.random() * emptySquares(board).length);

  // let square = emptySquares(board)[randomIndex];
  // board[square] = COMPUTER_MARKER;
}

let board = initializeBoard();
board[1] = 'X';
board[9] = 'X';
board[5] = 'O';

computerChoosesSquare(board);
displayBoard(board);

// algorithm
// iterate through the winning lines 
// find where the player already has marks in winning lines
// if the markers have two out of three X's 
// - find the unused square
// - mark square
// if there isn't an unused square
// - have computer pick at random