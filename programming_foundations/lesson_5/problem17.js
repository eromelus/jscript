function randomHexChar() {
  let hexChars = '0123456789abcdef';
  let randomIdx = Math.floor(Math.random() * hexChars.length);

  return hexChars[randomIdx];
}

function generateUUID() {
  let sections = [8, 4, 4, 4, 12];
  
  return sections.map(num => {
    let string = ''
    for (let i = 0; i < num; i++) {
      string += randomHexChar();
    }

    return string;
  }).join('-');
}

console.log(generateUUID());
console.log(generateUUID());
console.log(generateUUID());
