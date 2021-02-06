let arr = ['10', '11', '9', '7', '8'];

// let descendingArray = arr.map(string => Number(string)).sort((a, b) => b - a);
let descendingArray = arr.sort((a, b) => Number(b) - Number(a));
console.log(descendingArray);