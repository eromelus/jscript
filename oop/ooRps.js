/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const readline = require("readline-sync");
const ROUNDS_TO_WIN = 5;
const WINNING_MOVES = {
  rock: ['scissors', 'lizard'],
  paper: ['rock', 'spock'],
  scissors: ['paper', 'lizard'],
  lizard: ['paper', 'spock'],
  spock: ['rock', 'scissors']
};
const MOVES = Object.keys(WINNING_MOVES);

function createPlayer() {
  return {
    move: null,
    score: 0,
    moveHistory: [],

    resetScore() {
      this.score = 0;
    },

    incrementScore() {
      this.score += 1;
    },

    updateMoveHistory() {
      this.moveHistory.push(this.move);
    },

    resetMoves() {
      this.moveHistory = [];
    },
  };
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;

      while (true) {
        console.log("Your move: rock, paper, scissors, lizard or spock");
        choice = readline.question().toLowerCase();
        if (MOVES.includes(choice)) break;
        console.log("Sorry, invalid choice.");
      }
      this.move = choice;
    },
  };

  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    computerWeightedChoices: [...MOVES],

    choose() {
      let randomIdx = Math.floor(Math.random() * this.computerWeightedChoices.length);
      this.move = this.computerWeightedChoices[randomIdx];
    },

    updateComputerWeightedChoices(humanMove, computerMove, humanMoveHistory) {
      let humanWin = WINNING_MOVES[humanMove].includes(computerMove);
      let totalMoves = humanMoveHistory.length;
      let currentHumanMoveCount = humanMoveHistory.filter(move => move === humanMove).length;
      let currentHumanMoveCountPercentage = currentHumanMoveCount / totalMoves;

      if (humanWin && currentHumanMoveCountPercentage >= .4 && currentHumanMoveCount >= 2) {
        for (let possibleComputerPriorityMove in WINNING_MOVES) {
          if (WINNING_MOVES[possibleComputerPriorityMove].includes(humanMove)) {
            let computerPriorityMove = possibleComputerPriorityMove;
            this.computerWeightedChoices.push(computerPriorityMove);
          }
        }
      }
    },
  };
  return Object.assign(playerObject, computerObject);
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.clear();
    console.log("Let's play Rock, Paper, Scissors!");
    console.log(`First to ${ROUNDS_TO_WIN} wins!`);
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;
    console.log(`You chose: ${humanMove}`);
    console.log(`The computer chose: ${computerMove}\n`);

    if (WINNING_MOVES[humanMove].includes(computerMove)) {
      console.log('You win!');
    } else if (WINNING_MOVES[computerMove].includes(humanMove)) {
      console.log('Computer wins!');
    } else {
      console.log("It's a tie!");
    }

    this.pressToContinue();
  },

  pressToContinue() {
    console.log('Press enter to continue!');
    readline.question();
  },

  displayGoodbyeMessage() {
    console.log("Thanks for playing Rock, Paper, Scissors. Goodbye!");
  },

  updateScore() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if (WINNING_MOVES[humanMove].includes(computerMove)) {
      this.human.incrementScore();
    } else if (WINNING_MOVES[computerMove].includes(humanMove)) {
      this.computer.incrementScore();
    }
  },

  displayScore() {
    console.log('---------------------------');
    console.log(`You: ${this.human.score}`);
    console.log(`Computer: ${this.computer.score}\n`);
  },

  resetGame() {
    [this.human, this.computer].forEach(player => {
      player.resetScore();
      player.resetMoves();
    });
  },

  displayGrandWinner() {
    console.clear();
    this.displayWelcomeMessage();
    this.displayScore();

    console.log(`${this.human.score === ROUNDS_TO_WIN ? 'You win' : 'Computer wins'} it all!`);
    console.log('\nWith the following moves! GG');
  },

  updateHistory() {
    this.human.updateMoveHistory();
    this.computer.updateMoveHistory();
  },

  displayHistory() {
    let humanMoves = this.human.moveHistory;
    let computerMoves = this.computer.moveHistory;

    console.log(`#  You      Computer`);

    humanMoves.forEach((move, idx) => {
      console.log(`${idx + 1}  ${move.padEnd(8)} ${computerMoves[idx]}`);
    });
    console.log('');
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question().toLowerCase();

    while (!['y', 'n'].includes(answer)) {
      console.log('Sorry, invalid choice. Try again (y/n)');
      answer = readline.question().toLowerCase();
    }
    return answer === 'y';
  },

  gameOver() {
    if (this.human.score === ROUNDS_TO_WIN || this.computer.score === ROUNDS_TO_WIN) {
      return true;
    }
    return false;
  },

  updateGame() {
    this.updateScore();
    this.updateHistory();
  },

  play() {
    while (true) {
      while (true) {
        this.displayWelcomeMessage();
        this.displayScore();
        this.human.choose();
        this.computer.choose();
        this.updateGame();
        this.computer.updateComputerWeightedChoices(this.human.move, this.computer.move, this.human.moveHistory);
        this.displayWinner();

        if (this.gameOver()) break;
      }
      this.displayGrandWinner();
      this.displayHistory();
      if (!this.playAgain()) break;
      this.resetGame();
    }
    this.displayGoodbyeMessage();
  }
};

RPSGame.play();