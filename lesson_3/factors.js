function factors(number) {
  let divisor = number;
  let factors = [];

  while (divisor > 0) {
    if (number % divisor === 0) {
      factors.push(number / divisor);
    }
    divisor -= 1;
  }
  // do {
  //   if (number % divisor === 0) {
  //     factors.push(number / divisor);
  //   }
  //   divisor -= 1;
  // } while (divisor !== 0);
  return factors;
}

console.log(factors(10));
console.log(factors(-2));
console.log(factors(0));