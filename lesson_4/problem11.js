let statement = 'The Flintstones Rock';

let charsInStatement = statement.split('').filter(char => char !== ' ');

let result = charsInStatement.reduce((obj, char) => {
  // if (Object.keys(obj).includes(char)) {
  //   obj[char] += 1;
  // } else {
  //   obj[char] = 1;
  // }
  obj[char] = obj[char] || 0;
  obj[char] += 1;

  return obj;
}, {});

console.log(result);