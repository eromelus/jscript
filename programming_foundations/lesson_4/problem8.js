let flinstones = ['Fred', 'Barney', 'Wilma', 'Betty', 'Bambam', 'Pebbles'];

let list = {}

flinstones.forEach((name, index) => {
 list[name] = index; 
});

console.log(list)