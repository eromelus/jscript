const readline = require('readline-sync');
const VALID_CHOICES = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
const WINNING_MOVES = {
  rock     : ['scissors', 'lizard'],
  paper    : ['spock',    'rock'],
  scissors : ['paper',    'lizard'],
  lizard   : ['paper',    'spock'],
  spock    : ['rock',     'scissors']
};
const NUMBER_OF_GAMES = 3;

let playerScore = 0;
let computerScore = 0;

function prompt(message) {
  console.log(`=> ${message}`);
}

function displayWinner(choice, computerChoice) {
  prompt(`You chose ${choice}, computer chose ${computerChoice}`);

  if (choice === computerChoice) {
    prompt('It\'s a tie!');
  } else if (WINNING_MOVES[choice].includes(computerChoice)) {
    prompt('You win!');
  } else {
    prompt('You lose!');
  }
}

function displayScore(playerScore, computerScore) {
  prompt(`You: ${playerScore}`);
  prompt(`Computer: ${computerScore}\n`);
}

function incrementScore(choice, computerChoice) {
  if (choice === computerChoice) {
    return;
  } else if (WINNING_MOVES[choice].includes(computerChoice)) {
    playerScore += 1;
  } else {
    computerScore += 1;
  }
}

prompt(`Lets play rock paper scissors!`);
prompt(`Best of ${NUMBER_OF_GAMES}`);

while (true) {
  prompt('-------------------------------');
  displayScore(playerScore, computerScore);

  prompt(`Pick 1: ${VALID_CHOICES.join(', ')}`);
  prompt('Press "0": rock, "1": paper, "2": scissors, "3": lizard, "4": spock');
  let choice = readline.question();

  while (![...VALID_CHOICES.keys()].includes(Number(choice))) {
    prompt('That\'s not a valid choice');
    choice = readline.question();
  }

  choice = VALID_CHOICES[choice];

  let randomIndex = Math.floor(Math.random() * VALID_CHOICES.length);
  let computerChoice = VALID_CHOICES[randomIndex];

  displayWinner(choice, computerChoice);
  incrementScore(choice, computerChoice);

  if (playerScore === NUMBER_OF_GAMES ||
      computerScore === NUMBER_OF_GAMES) break;
}

console.log(' ');
prompt('Final Score');
displayScore(playerScore, computerScore);
prompt('Thanks for playing!');