function selectFruit(produce) {
  let selectedFruits = {}
  let produceKeys = Object.keys(produce);

  for (let counter = 0; counter < produceKeys.length; counter += 1) {
    let currentKey = produceKeys[counter];
    let currentValue = produce[currentKey];

    if (produce[currentKey] === 'Fruit') {
      selectedFruits[currentKey] = currentValue;
    }
  }
  return selectedFruits;
}

let produce = {
  apple: 'Fruit',
  carrot: 'Vegetable',
  pear: 'Fruit',
  broccoli: 'Vegeable'
}

console.log(selectFruit(produce)); // => { apple: 'Fruit', pear: 'Fruit' }