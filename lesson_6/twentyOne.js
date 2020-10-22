const readline = require('readline-sync');
const MESSAGES = require('./twentyOne_messages.json');

const FACES = ['H', 'D', 'C', 'S'];
const VALUES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
const MOVE_OPTIONS = ['h', 's'];
const PLAY_AGAIN_OPTIONS = ['y', 'n'];
const ROUNDS_TO_WIN = 5;
const GAME_NUM = 21;
const DEALER_NUM = 17;

function startingDeck() {
  let deck = [];

  for (let face of FACES) {
    for (let value of VALUES) {
      deck.push([face, value]);
    }
  }

  return deck;
}

function prompt(msg) {
  console.log(`=> ${msg}`);
}

function dealCards(deck) {
  let cards = [];

  for (let num = 0; num < 2; num += 1) {
    cards.push(deck.pop());
  }
  return cards;
}

function total(hand) {
  let values = hand.map(card => card[1]);
  let total = 0;

  values.forEach(value => {
    if (value === 'A') {
      total += 11;
    } else if (['J', 'Q', 'K'].includes(value)) {
      total += 10;
    } else {
      total += Number(value);
    }
  });

  // calculate aces
  values.filter(value => value === 'A').forEach(_ => {
    if (total > GAME_NUM) total -= 10;
  });

  return total;
}

function displayHands(dealerHand, playerHand, playerTotal) {
  let dealerCardValues = dealerHand.map(card => card[1]);

  console.log(`Dealer has: ${dealerCardValues[0]} and unknown card`);
  console.log(`You have: ${showHand(playerHand)} for a total of ${playerTotal}`);
}

function isBust(total) {
  return total > GAME_NUM;
}

function shuffle(deck) {
  for (let idx = deck.length - 1; idx > 0; idx -= 1) {
    let otherIdx = Math.floor(Math.random() * (idx + 1));
    [deck[idx], deck[otherIdx]] = [deck[otherIdx], deck[idx]];
  }
}

function hit(hand, deck) {
  hand.push(deck.pop());
}

function getResult(playerTotal, dealerTotal) {
  if (playerTotal > 21) {
    return 'PLAYER_BUSTED';
  } else if (dealerTotal > 21) {
    return 'DEALER_BUSTED';
  } else if (playerTotal > dealerTotal) {
    return 'PLAYER';
  } else if (dealerTotal > playerTotal) {
    return 'DEALER';
  } else {
    return 'TIE';
  }
}

function joinAnd(array, delimeter = ', ', word = 'and') {
  switch (array.length) {
    case 0:
      return '';
    case 1:
      return array[0];
    case 2:
      return array.join(` ${word} `);
    default:
      return array.slice(0, array.length - 1).join(delimeter) +
        `${delimeter}${word} ${array[array.length - 1]}`;
  }
}

function showHand(hand) {
  let cards = hand.map(card => card[1]);

  return joinAnd(cards);
}

function displayResult(playerTotal, dealerTotal) {
  let result = getResult(playerTotal, dealerTotal);

  switch (result) {
    case 'PLAYER_BUSTED':
      prompt(MESSAGES['playerBusted']);
      break;
    case 'DEALER_BUSTED':
      prompt(MESSAGES['dealerBusted']);
      break;
    case 'PLAYER':
      prompt(MESSAGES['playerWin']);
      break;
    case 'DEALER':
      prompt(MESSAGES['dealerWin']);
      break;
    case 'TIE':
      prompt(MESSAGES['tie']);
      break;
  }
}

function playAgain() {
  console.log('');
  prompt(MESSAGES['playAgain']);

  let answer = readline.question().toLowerCase();
  while (!PLAY_AGAIN_OPTIONS.includes(answer) || answer.length !== 1) {
    console.log(MESSAGES['invalidEntry']);
    prompt(MESSAGES['playAgain']);
    answer = readline.question().toLowerCase();
  }
  return answer === 'y';
}

function showBothHands(playerHand, dealerHand, playerTotal, dealerTotal) {
  let playerCards = showHand(playerHand);
  let dealerCards = showHand(dealerHand);

  console.log(`Dealer cards: ${dealerCards} for a total of ${dealerTotal}`);
  console.log(`Your cards: ${playerCards} for a total of ${playerTotal}`);
  console.log('');
}

function isMatchDone(score) {
  return score['player'] === ROUNDS_TO_WIN || score['dealer'] === ROUNDS_TO_WIN;
}

function updateScore(score, playerTotal, dealerTotal) {
  let result = getResult(playerTotal, dealerTotal);

  if (result === 'PLAYER' || result === 'DEALER_BUSTED') {
    score['player'] += 1;
  } else if (result === 'DEALER' || result === 'PLAYER_BUSTED') {
    score['dealer'] += 1;
  }
}

function displayScore(score) {
  console.log("Score");
  console.log("---------------------");
  console.log(`Player: ${score['player']} | Dealer: ${score['dealer']}`);
}

function pressToContinue() {
  console.log('');
  console.log('Press enter to continue');
  readline.question();
}

function displayWinner(score) {
  let winner = Object.keys(score).find(key => score[key] === ROUNDS_TO_WIN);
  console.log(`${winner[0].toUpperCase() + winner.slice(1)} wins the game!`);
}

function hitOrStay(answer) {
  while (true) {
    console.log('');
    prompt(MESSAGES['hitStay']);
    answer = readline.question().toLowerCase();
    if (MOVE_OPTIONS.includes(answer)) break;
    console.log(MESSAGES['invalidEntry']);
  }

  return answer;
}

function dealerStays(dealerHand) {
  return dealerHand.length === 2;
}

function displayRules() {
  console.log('\nRules:');
  console.log('It\'s you (player) vs the dealer');
  console.log(`The goal is to beat the dealers hand without going over ${GAME_NUM}`);
  console.log(`Face cards (J, Q, K, A) are worth 10`);
  console.log('Aces are with 1 or 11 depending on your hand');
  console.log('To hit is to ask for another card');
  console.log('To stand is to hold your total');
  console.log('Dealer will hit until his hand totals 17 or higher');
}

while (true) {
  console.clear();
  console.log(MESSAGES['welcome']);
  displayRules();
  console.log(MESSAGES['roundsToWin'], ROUNDS_TO_WIN);
  console.log('');
  const score = { player: 0, dealer: 0 };

  while (!isMatchDone(score)) {
    // Initialize deck
    let deck = startingDeck();
    shuffle(deck);

    // Deal cards to player and dealer
    let dealerHand = [];
    let playerHand = [];

    dealerHand.push(...dealCards(deck));
    playerHand.push(...dealCards(deck));

    let dealerTotal = total(dealerHand);
    let playerTotal = total(playerHand);

    displayScore(score);
    console.log('');
    displayHands(dealerHand, playerHand, playerTotal);

    // Player turn
    while (true) {
      let playerMove = hitOrStay();

      if (playerMove === 'h') {
        hit(playerHand, deck);
        playerTotal = total(playerHand);

        console.clear();
        console.log(MESSAGES['playerHit']);
        displayHands(dealerHand, playerHand, playerTotal);
      }
      if (playerMove === 's' || isBust(playerTotal)) break;
    }

    // Dealer turn
    while (dealerTotal < DEALER_NUM) {
      if (isBust(playerTotal) || isBust(dealerTotal)) break;
      hit(dealerHand, deck);
      dealerTotal = total(dealerHand);

      console.clear();
      console.log(MESSAGES['dealerHit']);
    }

    // Compare cards and declare winner
    if (dealerStays(dealerHand)) console.clear();
    showBothHands(playerHand, dealerHand, playerTotal, dealerTotal);
    displayResult(playerTotal, dealerTotal);
    console.log('');
    updateScore(score, playerTotal, dealerTotal);
    displayScore(score);
    pressToContinue();
    console.clear();
  }

  displayWinner(score);
  console.log('');
  displayScore(score);
  if (!playAgain()) break;
}

console.log(MESSAGES['thankYou']);