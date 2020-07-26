const readline = require('readline-sync');
const MESSAGES = require('./loan_messages.json')

function prompt(message) {
  console.log(`=> ${message}`)
}

function invalidNumber(number) {
  return number.trim() === '' || 
         Number(number) < 0   ||
         Number.isNaN(Number(number));
}

function validateInput(input) {
  while (invalidNumber(input)) {
    prompt(MESSAGES['notValid']);
    input = readline.question();
  }
}

while (true) {
  console.clear();
  prompt(MESSAGES['welcome']);
  prompt(MESSAGES['loanAmount']);
  let loanAmount = readline.question();

  validateInput(loanAmount);

  prompt(MESSAGES['interestRate']);
  prompt(MESSAGES['example']);
  let apr = readline.question();

  validateInput(apr);

  prompt(MESSAGES['loanTerm']);
  let yearLoanTerm = readline.question();

  validateInput(yearLoanTerm);

  let monthLoanTerm = (Number(yearLoanTerm) * 12);
  let monthlyInterest = (Number(apr) / 100) / 12;

  let monthlyPayment = Number(loanAmount) * (monthlyInterest / (1 - Math.pow((1 + monthlyInterest),(-monthLoanTerm))));
  prompt(`Your monthly payment is $${monthlyPayment.toFixed(2)}`);

  prompt(MESSAGES['another']);
  let answer = readline.question().toLowerCase();
  if (answer[0] !== 'y') break;
}