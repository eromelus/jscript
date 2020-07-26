let string = 'The Flintstones Rock';
let padding = 0;

while (padding < 10) {
  console.log(string.padStart(string.length + padding));
  padding += 1;
}
