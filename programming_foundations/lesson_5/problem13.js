let sumOfOdds = arr => {
  return arr.filter(num => num % 2 === 1).reduce((sum, num) => sum + num);
}


let arr = [[1, 6, 7], [1, 5, 3], [1, 8, 3]];

console.log(arr.slice().sort((a, b) => sumOfOdds(a) - sumOfOdds(b)));
console.log(arr);