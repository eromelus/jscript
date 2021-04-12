# Functions, Objects and Prototypes

## Review - Object

Objects are basically a collection of properties where each property has a key and value. Property key are **always** strings. If you define a property with a non string key, it will be coerced into a string

### Property Access

Dot notation is also called member access notation `myObject.foo` . Bracket notation is called computed member access notation `myObject['foo']` . 

If you have a variable that contains a key's name, you must use bracket notation

```jsx
let key = 'name'
person[key]
```

The main difference is member access notation requires a **valid** variable name while computed member access notation can take any UTF-8 compatible string as the key.

Also with computed member access notation, anything between the brackets gets evaluated as a string and used to reference the property

### Property Existence

When accessing a property that doesn't exist on an object we get `undefined` . We also get `undefined` if the property is explicitly set to that.

We check if a property exist in an object by using the `in` operator or `hasOwnProperty` method.

```jsx
'false' in myObject           // true
myObject.hasOwnProperty('y')  // true
```

`Object.keys()` and `Object.getOwnPropertyNames()` can also indirectly check if a property exist. Key difference between the two is `Object.keys()` returns enumerable properties while `Object.getOwnPropertyNames()` return all properties regardless if they're enumerable or not.

## Object Prototypes

In Javascript, objects can inherit properties and behavior from other objects. Javascript objects use **prototypal inheritance**. 

The function `Object.create` creates a new object that inherits properties from an existing object. It takes a **prototype** **object** as an argument and return a new object that inherits properties from the prototype object. 

The newly created object has access to all the properties and methods that the prototype object provides **but** it doesn't receive any properties or methods of it's own. Instead it **delegates** property and method access to its prototype

```jsx
let a = { foo: 1, bar: 2 };

let b = Object.create(a);
b.foo; // => 1
b      // => {} 
```

![Functions,%20Objects%20and%20Prototypes%20e2b45e20df1749bab178e23d617acbac/Untitled.png](Functions,%20Objects%20and%20Prototypes%20e2b45e20df1749bab178e23d617acbac/Untitled.png)

Javascript objects use an internal `[[Prototype]]` property to keep track of their prototype. When you create an object with `Object.create` the new object's `[[Prototype]]` gets assigned to the prototype object.

`Object.setPrototypeOf` also can be used to set the prototype object of an object

```jsx
let a = { 
	foo: 1, 
	bar: 2, 
};

let b = {};
Object.setPrototypeOf(b, a); // setPrototypeOf(target, source)

b.foo;                       // => 1
b                            // => {}
Object.getPrototypeOf(b)     // => { foo: 1, bar: 2 }
```

Objects hold a reference to their prototype objects through their internal `[[Prototype]]` property. If the object's prototype changes, those changes take effect in the inheriting object as well

All Javascript objects inherit from a prototype

```jsx
let a = {};
// undefined

Object.getPrototypeOf(a)
// {}
```

This example shows that the default prototype is the prototype object of the Object constructor giving us access to Objects methods like `hasOwnProperty` 

### Iterating Over Objects with Prototypes

- a `for/in` loop iterates over an object properties including the objects in its prototype chain. You can use `hasOwnProperty` to skip the prototype properties

```jsx
let obj1 = { a: 1, b: 2 }
let obj2 = Object.create(obj1);
obj2.c = 3;
obj2.d = 4;

for (let prop in obj2) {
	console.log(obj2[prop]);
}            // => 3  
			       //    4
             //    1
				     //    2
```

- `Object.keys` returns an object's "own" property keys

`for/in` and `Object.keys` deal with enumerable properties (properties that you can iterate over). Most properties and methods of the built-in types like `length` property or `forEach` method in an array are not enumerable

### Prototype Chain

Since the prototype of an object is itself an object, the prototype can also have a prototype from which it inherits

```jsx
let a = { 
	foo: 1, 
};

let b = { 
	bar: 2, 
};

let c = {
	baz: 3,
};

Object.setPrototypeOf(c, b);
Object.setPrototypeOf(b, a);

console.log(c.bar);  // => 2
console.log(c.foo);  // => 1
```

`b` is the prototype of `c` and `c` inherits from `b` . `a` is the prototype of `b` and `b` inherits from `a` . All properties that you can access on `a` or `b` are now available on `c` . 

We say that objects `b` and `a` are part of the **prototype chain** of object `c` .

The complete prototype chain looks like

c --> b --> a --> Object.prototype --> null

### **The _ _proto_ _ Property**

Older Javascript programs use a property names `__proto__` pronounced **dunder proto**, instead of `Object.setPrototypeOf` and `Object.getPropertyOf` . "dunder" is  a shortened version of "double underscore", non hidden version of the `[[Prototype]]` property. 

Only use `__proto__` (deprecated) if very older browsers or older version of Node need to be supported

### Property Look-Up in the Prototype Chain

Objects lower down in the chain inherit properties and behaviors from objects in the chain above.

When accessing a property on Javascript looks for the property in this order. Upstream

1. "own" property with that name on the object
2. object's prototype
3. prototype's prototype
4. `Object.prototype` (constructor)

Then the property access evaluates to `undefined` 

Where two objects in the prototype chain have a property with the same name. The object that's closer to the calling object takes precedence.

Meaning a downstream object shadows an inherited property if it as a property with the same name.

```jsx
let a = { 
	foo: 1,
};

let b = {
	foo: 2,
};

Object.setPrototypeOf(b, a);

let c = Object.create(b);
console.log(c.foo);  // => 2;
```

### Methods on Object.prototype

The `Object.prototype` object is at the top of all Javascript prototype chains so it's methods are available from any Javascript object. 3 useful methods

- `Object.prototype.toString()` returns a string representation of the object
- `Object.prototype.isPrototypeOf(obj)` determines whether the object is part of another object's prototype chain
- `Object.prototype.hasOwnProperty(prop)` determines whether the object contains the property

### Objects Without Prototypes

To create an object that doesn't have a prototype set the prototype to `null` 

`let a = Object.create(null)`

Objects created this way do not have access to Object methods like `Object.prototype.hasOwnProperty` and also don't have a prototype chain that ends with `Object.prototype` . It ends with `null`

### Code Examples

- What does the following code log to the console?

    Logs 2. `qux.foo` returns `1` since `qux` has a `foo` property with that value. `baz` does not have a property of `foo` so Javascript searches the prototype chain for `foo` property and finds the property in `qux` which is also `1` . The sum of the two values is `2` 

```jsx
let qux = { foo: 1 };
let baz = Object.create(qux);

console.log(baz.foo + qux.foo);
```

- What happens if we add the line `baz.foo = 2`  before the `console.log` statement?

    `baz.foo = 2` creates a new property `foo` with a value of `2` in the  `baz`  object so `baz.foo` returns the value of its own `foo`  property. `qux.foo` also returns the value of its own `foo` property so the result is `3` 

    Property assignment

- What happens if we add the line `qux.foo = 2` before the `console.log` statement?

    Objects hold a reference to their prototype object so if the object's prototype is changed, the changes are observable in the inheriting object as well

     `baz` doesn't have its own copy of the `foo` property, so Javascript uses the prototype chain to look up `baz.foo` and it find the `foo` property in `quz` which was changed to `2` , resulting in logging 4

## Function Expressions

Javascript engine runs code in two passes. During the first pass **hoisting** occurs, where the engine effectively moves function declarations to the top of the scope in which they're defined. The second pass executes the code.

**Function expressions** are function defintions that are part of an expression.

Unnamed function are called **anonymous functions**. Ex. `let prompt = function() {...};` . The main advantage of naming a function expression is when the function throws an error. If the function has a name, the stack trace uses that name to help you determine where the error occurred, without the name the location of ther error is reported as anonymous.

Arrow functions are always function expressions and anonymous.

Functions in Javascript can be assigned to variables and properties, passed to other functions or returned from another function making them **first class functions.**

```jsx
let myFunc = function() {}'
typeof myFunc // function
```

All functions have a type of `function` which is a kind of object with properties and methods

## Higher Order Functions

A **higher order function** is a function that either 

1. takes a function as an argument like `forEach` `map` etc
2. returns a function

## The Global Object

Javascript creates a global object when it starts running that serves as the **implicit execution context.** In Node.js the global object is the object named `global` ; in the browser, it's the `window` object

All Javascript code executes within a context. The top-level context is the `window` object in browsers and the `global` object in Node

The global object is where Javascript gets global entities like `NaN` , `Infinity` , and `setTimeout`

Whenever you assign a value to a variable without using the `let`, `const`, or `var`  keywords the variable gets added to the global object as a property

```jsx
foo = 'bar';
global.foo; // 'bar' (in Node)
window.foo; // 'bar' (in a browser)
```

When you try to access a variable for which there are no local or global variables with the variable's name, Javascript looks at the global object and looks for a property with that name

It's not often you modify the global object, but you'll sometimes use it to set properties in Node that you need in multiple modules

Execution Context

The execution context is a concept that refers to the **environment** in which a function executes. The execution context depends on how the function or method was invoked, not on where the function was defined.

There are two basic ways to set the context when calling a function or method:

1. **Explicit**: The execution context that you set explicitly
2. **Implicit**: The execution context that Javascript sets implicitly when your code doesn't proved an expllicit context

Setting the execution context is also called **binding** `this` or **setting the binding**. A binding ties two things together. In this case, it refers to the fact that a call binds `this` to a specific object when the function or method is called

The value of `this` is the current execution context of the function or method

### **Function Exection Context (Implicit)**

All function calls have an execution context, and since a regular function call does not provide an explicit context, Javascript supplies an implicit context: the global object, `this`. 

```jsx
function foo() {
	console.log('this refers to: ' + this);
}

foo();
// this refers to [object global]
```

### **Strict Mode and Implicit Context**

When strict mode is enabled, the implicit `this` is assigned to `undefined` instead of the global object

### **Method Execution Context (Implicit)**

When calling a method that belongs to an object, the object used to call the method is the implicit execution context for that method call, **method execution context**. 

```jsx
let foo = {
	bar: function() {
		console.log(this);
	}
};
foo.bar(); // `foo` is the implict execution context for `bar`
// { bar: [Function: bar] }
```

Javascript functions being first class functions has ramification for the execution context. 

```jsx
let baz = foo.bar;
baz(); // Object [global] {...}
```

In this example, we assign the `foo.bar` method to the baz variable. The `foo.bar` property and the `baz` variable now refer to the same function object. The execution context is determined by how the function or method is called so since we're calling `baz` as a standalone function, its execution context is the global object

There are two main ways to provide an explicit execution context to any function or method when called in Javascript: `call` and `apply` 

### Explicit Execution Context with `call`

The `call` method calls a function with an explicit execution context

```jsx
function logNum() {
	console.log(this.num);
}

let obj = {
	num: 42
};

logNum.call(obj) // logs 42
```

Here we call the `logNum` function and tell it to use `obj` as its exection context. When we use `call` , `this`  inside the `logNum` function refers to the `obj` object. The first argument to `call` provides the explicit context for the function invocation

This behavior is similar to the following but we add a new property to the `obj` and mutate the `obj`

```jsx
function logNum() {
	console.log(this.num);
}

let obj = {
	num: 42
};

obj.logNum = logNum;
obj.logNum(); // logs 42
```

You can also use `call` to explicitly set execution context on methods, not just function

```jsx
let obj1 = {
	logNum() {
		console.log(this.num);
	}
};

let obj2 = {
	num: 42
};

obj1.logNum.call(obj2); // logs 42
```

The `call` method lets us pass arguments as a comma separated list. The general syntax for `call`

 `someObject.someMethod.call(context, arg1, arg2, arg3, ...)` 

```jsx
function sumNum(num1) {
	return this.num + num1;
}

let obj = {
	num: 42
};

sumNum.call(obj, 5) // logs 47
```

### Explicit Exection Context with `apply`

The `apply` method works the same way as `call` . The only difference is that `apply` uses an array to pass any arguments to the function.

The general syntax for `apply`

`someObject.someMethod.apply(context, [arg1, arg2, arg3, ...])` 

With modern Javascript (ES6 and higher), `apply` isn't needed since you can use `call` in conjunction with the spread operator when you have a list of arguments in an array

```jsx
let args = [arg1, arg2, arg3];
someObject.someMthod.call(context, ...args);
```

## Hard Binding Functions with Contexts

`bind`  returns a new function that is permanently bound to the object passed as `bind` 's first argument. 

When `bind` is used, the function is permanently bound to the object so it cannot change its exection context

```jsx
function sumNum(num1) {
	return this.num + num1;
}

let obj = {
	num: 42;
}

let sumNum2 = sumNum.bind(obj);
sumNum2(5); // 47
```

## Dealing with Context Loss

### Method Copied from Object

When a method is copied out of an object and used elsewhere, the execution context is no longer the original object

```jsx
let john = {
	firstName: 'John',
	lastName: 'Doe',
	greetings() {
		console.log('hello, ' + this.firstName + ' ' + this.lastName);
	},
};

john.greeting();          // context is john
let foo = john.greetings; // strips context
foo();                    // context is now the global object 
```

Also if you take a method out of an object and pass it to another function for execution the context can be loss

```jsx
function repeatThreeTimes(func) {
	func(); // can't use func.call(john); john is out of scope
	func();
	func();
}

function foo() {
	let john = {
		firstName: 'John',
		lastName: 'Doe',
		greeting: function() {
			console.log('hello, ' + this.firstName + ' ' + this.lastName);
		},
	};
	repeatThreeTimes(john.greetings); // strips context
}

foo();
```

To fix this by either pass a context argument to a function using `call` which you may not be able to do if the function belongs to a third party library or you can hard-bind the method's context using `bind` but then you can no longer determine the context by looking at the invocation of the final function

### Inner Function Not Using the Surrounding Context

```jsx
let obj = {
	a: 'hello',
	b: 'world',
	foo: function() {
		function bar() {
			console.log(this.a + ' ' + this.b);
		}
		bar();
	},
};

obj.foo(); // undefined undefined
```

A function or method's execution context depends only on how you invoke it. `bar` is invoked as a standlone function so its execution context is the global object. Inner functions do not use the surrounding execution context

4 solutions to this problem

Solution 1: Preserve Context with a Variable in Outer Scope

Use something like `let self = this` or `let that = this` in the outer function. If you define `self` or `that` in the other scope, you can use that variable and whatever value it conatins inside you nested inner function(s) 

```jsx
...
	foo: function() {
		let self = this;
		
		function bar() {
			console.log(self.a + ' ' + self.b);
		}

		bar()
	},
...
```

`this` is assigned to the local variable `self`. Since Javascript uses lexical scoping rules for variables `bar` can access `self` within its body; that lets us use it instead of `this` to access the correct context object

Solution 2: Call Inner Function with Explicit Context

Use `call` or `apply` to explicitly provide a context when calling the inner function

Solution 3: Use `bind`

Call `bind` on the inner function and get a new function with its execution context permanently set to the object

Solution 4: Use an arrow function

Arrow function inherit their exection context fom the surrounding scope. So an arrow function defined inside of another function always has the same context as the outer function.

An arrow function, once created, always has the same context as the function that surrounded it when it was created

Using arrow function is most common fix though you should not try to use them as method on a object since arrow function always get the value of `this` from the surrounding context

```jsx
...
	foo: function() {
		bar = () => {
			console.log(this.a + ' ' + this.b);
		}

		bar();
	},
...
```

### Function as Argument Losing Surrounding Context

Passing a function as an argument to another function strips it of its execution context, which means the function argument gets invoked with the context set to the global object.

```jsx
function repeatThreeTimes(func) {
	func();
	func();
	func();
}

let john = {
	firstName: 'John',
	lastName: 'Doe',
	greetings: function() {
		repeatThreeTimes(function() {
			console.log('hello, ' + this.firstName + ' ' + this.lastName);
		});
	},
};

john.greetings();

// hello, undefined undefined
// hello, undefined undefined
// hello, undefined undefined
```

The `john` object is used to call the `greetings` method, with `john` as its context. `greeting` calls the `repeatThreeTimes` function with a function argument whose body refers to `this`. `repeatThreeTimes` calls its argument three times with an implicit execution context so the context for all three invocations is the global object. `this` inside the function passed to `repeatThreeTimes` is the global object, not `john` 

```jsx
let obj = {
	a: 'hello',
	b: 'world',
	foo: function() {
		[1, 2, 3].forEach(function(number) {
			console.log(String(number) + ' ' + this.a + ' ' + this.b);
		});
	},
};

obj.foo();

// 1 undefined undefined
// 2 undefined undefined
// 3 undefined undefined
```

In this example, the `obj` object is used to call the `foo` method, with `obj` as its context. In the method body it loops over the array `[1, 2, 3]` and attempts to logs the value of the `obj` properties `a` and `b` using `forEach`. The problem is `forEach` executes the function expression passed to it, so it gets exectued with the global object as its context

4 Solutions to this problem

Solution 1: Preserve the Context with a Variable in Outer Scope

```jsx
let obj = {
	a: 'hello',
	b: 'world',
	foo: function() {
		let self = this;
		[1, 2, 3].forEach(function(number) {
			console.log(String(number) + ' ' + self.a + ' ' self.b);
		});
	},
};
```

Solution 2: Use `bind` 

```jsx
let obj = {
	foo: function() {
		[1, 2, 3].forEach(function(number) {
			console.log(String(number) + ' ' + this.a + ' ' + this.b);
		}.bind(this));
	},
};

obj.foo();

// 1 hello world
// 2 hello world
// 3 hello world
```

Solution 3: Use an Arrow Function

Solution 4: Use the optional thisArg argument

```jsx
...
[1, 2, 3].forEach(function(number) {
	console.log(String(number) + ' ' + this.a + ' ' + this.b);
}, this);
...
```