let obj = {
  grape: { type: 'fruit', colors: ['red', 'green'], size: 'small' },
  carrot: { type: 'vegetable', colors: ['orange'], size: 'medium' },
  apple: { type: 'fruit', colors: ['red', 'green'], size: 'medium' },
  apricot: { type: 'fruit', colors: ['orange'], size: 'medium' },
  marrow: { type: 'vegetable', colors: ['green'], size: 'large' },
};

// colors of fruits (capitalized)
// sizes of the vegetable (uppercase)

let capitalize = word => word[0].toUpperCase() + word.slice(1);

console.log(Object.values(obj).map(produce => {
  if (produce['type'] === 'fruit') {
    return produce['colors'].map(color => capitalize(color))
  } else {
    return produce['size'].toUpperCase();
  }
}));