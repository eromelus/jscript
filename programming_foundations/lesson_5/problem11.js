let arr = [{ a: 1 }, { b: 2, c: 3 }, { d: 4, e: 5, f: 6 }];

console.log(arr.map(obj => {
  let newObj = Object.assign({}, obj)

  for (let key in newObj) {
    newObj[key] += 1;
  }
  return newObj;
}));

console.log(arr)