let arr = [['b', 'c', 'a'], [2, 1, 3], ['blue', 'black', 'green']];

console.log(arr.map(subArray => {
  if (typeof subArray[0] === 'string') {
    return subArray.slice().sort();
  } else {
    return subArray.slice().sort((a, b) => a -b);
  }
}));

console.log(arr);
