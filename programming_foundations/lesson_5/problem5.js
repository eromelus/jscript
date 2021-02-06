let munsters = {
  Herman: { age: 32, gender: 'male' },
  Lily: { age: 30, gender: 'female' },
  Grandpa: { age: 402, gender: 'male' },
  Eddie: { age: 10, gender: 'male' },
  Marilyn: { age: 23, gender: 'female'}
};

// let sum = 0

// Object.entries(munsters).forEach(person => {
//   if (person[1].gender === 'male') {
//     sum += person[1].age
//   }
// });

// console.log(sum)

let totalMaleAge = 0;

for (let person in munsters) {
  if (munsters[person]['gender'] === 'male') {
    totalMaleAge += munsters[person]['age'];
  }
}

console.log(totalMaleAge);