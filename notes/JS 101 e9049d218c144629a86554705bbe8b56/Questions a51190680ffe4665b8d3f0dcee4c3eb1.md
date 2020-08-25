# Questions

- `[1, 2, 3].filter(num => 'hi')` What is the return value of the `filter` method call ? Why?

    `[1, 2, 3]` 

    `filter` performs selection based on the truthiness of the callback's return value. In this case, the return value is always `'hi'` , which is always truthy. Therefore `filter` will return a new array containing all of the elements in the original array

```jsx
[1, 2, 3].map(num => {
	num * num;
});
```

- What is the return value of `map` in the code above? Why?

    `[undefined, undefined, undefined]`

    `map` looks at the return value of the callback function to decide the elements in the returned array. Each element in the original array is replaced by what the callback returns for that element. In this case, there's no explicit return statement in the callback function, which means that the callback returns `undefined` each time.

- `[1, 2, 3].map(num => num * num)` What is the return value of `map` in this case? Why?

    `[1, 4, 9]`

    Without braces surrounding the body of the one line arrow function, Javascript uses the computed value as the return value (no return statement needed). In this case, the callback returns `1` , `4` , and `9` on the 3 iterations

- `['ant', 'bear', 'caterpillar'].pop().length` What is the return value of the following statement? Why?

    `11`

    `pop` is being called on the array which destructively removes the last element from the calling array and returns it. `length` is being accessed on the return value of `pop` which in this case is `'caterpillar'` so the final return value is `11`

```jsx
[1, 2, 3].every(num => {
	return num = num * 2;
});
```

- What is the callback's return value? Also, what is the return value of `every` in this code?

    The callback's return value is `2`, `4`, and `6`. The return value of `every` is `true`.

    The expression in the callback, `num = num * 2` is an assignment expression and will evaluate as the expression on the right-hand side of the assignment and `2` , `4` , and `6` is what gets returned in each iteration. Since all of those numbers are truthy values, `every` will return `true`

```jsx
let arr = [1, 2, 3, 4, 5]
arr.fill(1, 1, 5);
```

- How does `Array.prototype.fill` work? Is it destructive?

    `fill` takes a value and two indices as arguments and replaces the indices in between those two given indices with the given value

    Yes `fill` is destructive because it mutates the array it's called on

    `arr // [1, 1, 1, 1, 1]`

```jsx
['ant', 'bear'].map(elem => {
	if (elem.length > 3) {
		return elem;
	}
});
```

- What is the return value of `map` ? Why?

    `[undefined, 'bear']` 

    `map` uses the return value of the callback function for each element passed in as an argument as the values for the new array it returns. 

    In this case, the callback function has a condition `(elem.length > 3)` and will only return if the length of the element is greater than `3`. The only value with a length greater than `3` is `'bear'` so for the first element, `'ant'`, the condition evaluates to `false` and `elem` isn't returned

    When a function doesn't explicitly return something, it implicitly returns `undefined`. That's why `undefined` is the first element in the returned array.

```jsx
let statement = 'The Flintstones Rock';
let charsInStatement = statement.split('')
																.filter(char => char !== ' ');

let result = charsInStatement.reduce((obj, char) => {
	obj[char] = obj[char] || 0;
  obj[char] += 1;
	return obj;
}, {});
```

- `obj[char] = obj[char] || 0` What is happening in this line of code?

    Short-circuiting

    Javascript first evaluates the left operand (`obj[char]`) of the `||` operator. If it is truthy, Javascript doesn't evaluate the right operand. 

    So if a character doesn't exist as a key in our `obj` object, `obj[char]` will return `undefined` — a falsy value — resulting in the assignment of `obj[char]` to 0. If `obj[char]` instead evaluates to a truth value such as `1` , it'll simply reassign the current value to `obj[char]`