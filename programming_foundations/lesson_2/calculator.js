const readline = require('readline-sync');
const MESSAGES = require('./calculator_messages.json');
const LANGUAGE = 'en';

function prompt(key) {
  let message = messages(key, LANGUAGE);
  console.log(`=> ${message}`);
}

function messages(message, lang='en') {
  return MESSAGES[lang][message];
}

function invalidNumber(num) {
  return num.trimStart() === '' || Number.isNaN(Number(num));
}

while (true) {
  
  prompt('welcome');

  prompt('firstNumber');
  let number1 = readline.question();

  while (invalidNumber(number1)) {
    prompt('notValid');
    number1 = readline.question();
  }

  prompt('secondNumber');
  let number2 = readline.question();

  while (invalidNumber(number2)) {
    prompt('notValid');
    number2 = readline.question();
  }

  prompt('whichOperation');
  let operation = readline.question();

  while (!['1', '2', '3', '4'].includes(operation)) {
    prompt('chooseNumber');
    operation = readline.question();
  }

  let output;
  switch (operation) {
    case '1':
      output = Number(number1) + Number(number2);
      break;
    case '2':
      output = Number(number1) - Number(number2);
      break;
    case '3':
      output = Number(number1) * Number(number2);
      break;
    case '4':
      output = Number(number1) / Number(number2);
      break;
  }

  console.log(`The result is ${output}`);

  prompt('another');
  answer = readline.question();

  if (answer.toLowerCase()[0] !== 'y') break;
}

prompt('thankyou');