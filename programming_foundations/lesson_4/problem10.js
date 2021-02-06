let ages = {
  Herman: 32,
  Lily: 30,
  Grandpa: 5843,
  Eddie: 10,
  Marilyn: 22,
  Spot: 237
}

let ageNumbers = Object.values(ages);
Math.min(...ageNumbers);

Math.min(...Object.values(ages))
