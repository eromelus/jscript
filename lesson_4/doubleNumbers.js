function doubleNumbers(numbers) {
  for (let counter = 0; counter < numbers.length; counter += 1) {
    let currentNumber = numbers[counter];
    numbers[counter] = currentNumber * 2;
  }
  return numbers;
}

let myNumbers = [1, 4, 3, 7, 2, 6];

console.log(doubleNumbers(myNumbers)) // => [2, 8, 6, 14, 4, 12]
console.log(myNumbers);