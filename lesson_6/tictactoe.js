const readline = require('readline-sync');
const MESSAGES = require('./tictactoe_messages.json');
const INITIAL_MARKER = ' ';
const PLAYER_MARKER = 'X';
const COMPUTER_MARKER = 'O';
const STARTING_PLAYERS = ['p', 'player', 'c', 'computer'];
const ROUNDS_TO_WIN = 3;
const WINNING_LINES = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], // rows
  [1, 4, 7], [2, 5, 8], [3, 6, 9], // columns
  [1, 5, 9], [3, 5, 7]             // diagnols
];

function prompt(msg) {
  console.log(`=> ${msg}`);
}

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
  console.log('-----+-----+-----');
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

function playerChoosesSquare(board) {
  let square;

  while (true) {
    prompt(`Choose a square: ${joinOr(emptySquares(board))}`);
    square = readline.question().trim();
    if (emptySquares(board).includes(square)) break;

    prompt(MESSAGES['notValid']);
  }

  board[square] = PLAYER_MARKER;
}

function emptySquares(board) {
  return Object.keys(board).filter(key => board[key] === INITIAL_MARKER);
}

function computerChoosesSquare(board) {
  let square;
  // offense
  for (let index = 0; index < WINNING_LINES.length; index++) {
    let line = WINNING_LINES[index];
    square = findAtRiskSquare(line, board, COMPUTER_MARKER);
    if (square) break;
  }
  // defense
  if (!square) {
    for (let index = 0; index < WINNING_LINES.length; index++) {
      let line = WINNING_LINES[index];
      square = findAtRiskSquare(line, board, PLAYER_MARKER);
      if (square) break;
    }
  }
  // pick 5
  if (!square) {
    if (board[5] === INITIAL_MARKER) {
      square = 5;
    }
  }
  // random
  if (!square) {
    let randomIndex = Math.floor(Math.random() * emptySquares(board).length);
    square = emptySquares(board)[randomIndex];
  }
  board[square] = COMPUTER_MARKER;
}


function findAtRiskSquare(line, board, marker) {
  let marksInLine = line.map(square => board[square]);

  if (marksInLine.filter(value => value === marker).length === 2) {
    let unusedSquare = line.find(square => board[square] === INITIAL_MARKER);
    if (unusedSquare !== undefined) {
      return unusedSquare;
    }
  }
  return null;
}


function boardFull(board) {
  return emptySquares(board).length === 0;
}

function someoneWon(board) {
  return !!detectWinner(board);
}

function detectWinner(board) {
  for (let line = 0; line < WINNING_LINES.length; line++) {
    let [sq1, sq2, sq3] = WINNING_LINES[line];

    if (
      board[sq1] === PLAYER_MARKER &&
      board[sq2] === PLAYER_MARKER &&
      board[sq3] === PLAYER_MARKER
    ) {
      return 'player';
    } else if (
      board[sq1] === COMPUTER_MARKER &&
      board[sq2] === COMPUTER_MARKER &&
      board[sq3] === COMPUTER_MARKER
    ) {
      return 'computer';
    }
  }
  return null;
}
function joinOr(arr, delimiter = ', ', word = 'or') {
  switch (arr.length) {
    case 0:
      return '';
    case 1:
      return arr[0];
    case 2:
      return arr.join(` ${word} `);
    default:
      return arr.slice(0, arr.length - 1).join(delimiter) +
        `${delimiter}${word} ${arr[arr.length - 1]}`;
  }
}

function displayScore(scores) {
  let { player, computer } = scores;
  prompt(`Player: ${player} | Computer: ${computer}`);
}

function updateScore(scores, winner) {
  if (Object.keys(scores).includes(winner)) {
    scores[winner]++;
  }
}

function isMatchOver(scores) {
  return (scores.player === ROUNDS_TO_WIN) ||
    (scores.computer === ROUNDS_TO_WIN);
}


function displayWinnerOfRound(board) {
  if (someoneWon(board)) {
    let winner = detectWinner(board)[0].toUpperCase() +
      detectWinner(board).slice(1);
    prompt(`${winner} won!`);
  } else {
    prompt('It\'s a tie!');
  }
}

function getPlayAgainAnswer() {
  prompt('Play again? (y or n)');
  let answer = readline.question().toLowerCase();

  while ((answer[0] !== 'n' && answer[0] !== 'y') || answer.length !== 1) {
    prompt(MESSAGES['notValid']);
    prompt(MESSAGES['playAgain']);
    answer = readline.question().toLowerCase();
  }
  return answer;
}

function chooseSquare(board, currentPlayer) {
  if (currentPlayer === 'p') {
    playerChoosesSquare(board);
  } else {
    computerChoosesSquare(board);
  }
}

function alternatePlayer(currentPlayer) {
  return currentPlayer === 'p' ? 'c' : 'p';
}

function chooseStartingPlayer() {
  prompt(MESSAGES['chooseStartingPlayer']);
  let startingPlayer = readline.question().toLowerCase();
  while (!STARTING_PLAYERS.includes(startingPlayer)) {
    prompt(MESSAGES['notValid']);
    prompt(MESSAGES['chooseStartingPlayer']);
    startingPlayer = readline.question().toLowerCase();
  }

  return startingPlayer[0];
}

while (true) {
  console.clear();
  prompt(MESSAGES['welcome']);
  let scores = { player: 0, computer: 0 };

  while (!isMatchOver(scores)) {
    let board = initializeBoard();
    let currentPlayer = chooseStartingPlayer();

    while (true) {
      displayBoard(board);
      displayScore(scores);

      chooseSquare(board, currentPlayer);
      currentPlayer = alternatePlayer(currentPlayer);

      if (someoneWon(board) || boardFull(board)) {
        displayBoard(board);
        updateScore(scores, detectWinner(board));
        displayScore(scores);
        displayWinnerOfRound(board);
        break;
      }
    }
  }

  if (getPlayAgainAnswer() !== 'y') break;
}

prompt(MESSAGES['thankyou']);