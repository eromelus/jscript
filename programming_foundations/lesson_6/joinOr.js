function joinOr(arr, delimiter=', ', word='or') {
  // if (arr.length === 2) return arr.join(' or ');

  // let delimitedArr = arr.join(`${delimiter}`).split(' ');
  // let last = delimitedArr.pop();

  // return `${delimitedArr.slice(0, delimitedArr.length).join(' ')} ${word} ${last}`;
  switch (arr.length) {
    case 0:
      return '';
    case 1:
      return arr[0];
    case 2:
      return arr.join(` ${word} `);
    default:
      return arr.slice(0, arr.length -1).join(delimiter) +
        `${delimiter}${word} ${arr[arr.length -1]}`
  }
}

console.log(joinOr([1]));                     // => "1 or 2"
joinOr([1, 2, 3]);               // => "1, 2, or 3"
joinOr([1, 2, 3], '; ');         // => "1; 2; or 3"
joinOr([1, 2, 3], ', ', 'and');  // => "1, 2, and 3"