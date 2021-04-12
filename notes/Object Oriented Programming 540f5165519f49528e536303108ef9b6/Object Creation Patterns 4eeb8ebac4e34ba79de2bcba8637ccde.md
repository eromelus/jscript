# Object Creation Patterns

Javascript doesn't implement behavior sharing using class-based inheritance like other mainsteam languages, it uses the object prototype to share properties

## OOP Principles: Encapsulation

Objects provide a means to group related data and function into one unit. In the context of the object, the data and functions are commonly called state and methods respectively

The grouping together of related state and methods is what's called encapsulation

```jsx
// procedural
let overtime = 10;
let baseSalary = 6000;
let rate = 50;

function computeWage(baseSalary, overtime, rate) {
	return baseSalary + (overtime * rate);
}
// oop
let employee = {
	baseSalary: 6000,
	overtime: 10,
	rate: 50,
	computeWage() {
		return this.baseSalary + (this.overtime * this.rate)
	}
}
```

## Factory Functions

Object factories also called *Factory Object Creation Pattern* provide a simple way to create objects of the same type with a predefined template

```jsx
function createPerson(firstName, lastName = '') {
	return {
		firstName,
		lastName,
		fullName() {
			return `${this.firstName} ${this.lastName}`.trim();
 		},
	};
}
```

Factory functions have two major disadvantages

1. Every object created with a factory function has a full copy of all the methods which is redundant and can place a have load on system memory
2. There is no way to inspect an object and learn whether we created it with a factory function. That effectively makes it impossible to identify the specific "type" of the object; at best, you can only determine that an object has some specific characteristics

## Constructors

```jsx
function Car(make, model, year) {
	this.make = make;
	this.model = model;
	this.year = year;
	this.started = false;

	this.start = function() {
		this.started = true;
	};
	this.stop = function() {
		this.started = false;
	};
}

let corrola = new Car('Toyota', 'Corolla', 2016);
let leaf = new Car('Nissan', 'LEAF', 2018);
```

When defining a constructors the name must begin with a capital letter like `Car` in the example above. Capitalizing isn't a requirement but it is a convention that most Javascript developers follow

The construction function parameters match the properties associated with each `Car` object except for `started` which received an initial value instead. The initial value for such properties can come from anywhere. Ex. we can compute the value from other properties or retrieve a value from a database

### Calling a Constructor Function

- we call it with the `new` keyword
- we use `this` to set the object's properties and methods, and
- we don't supply an explicit return value (we can, but usually don't)

Using the `new` keyword when invoking a function causes Javascript to treat the funcion as a constructor

Javascript takes the following steps when you invoke a function with `new`

1. It creates an entirely new object
2. It sets the prototype of the new object to it's constructor's `prototype` property
3. It sets the value (execution context) of `this` for use inside the function to point to the new object
4. It invokes the function. Since `this` refers to the new object, we use it within the function to set the object's properties and methods
5. Once the function finishes running, `new` returns the new object even though we don't explicitly return anything, unless the function returns another object

If you don't use the `new` keyword, the constructor function acts like an ordinary function and won't get set to reference the new object. Since functions that don't return an explicit value return `undefined` , calling a constructor without `new` also returns `undefined` . When you use `new` the function doesn't have to return anything explicitly: it returns the newly created object automatically

`new` can be used to call any function, however you cannot call arrow function with `new` since they use their surrounding context as the value of `this` 

You can use `new` on method that you define in objects, though calling a method with concise syntax(also called a concise method) won't work

```jsx
let foo = {
	Car(make, model, year) {
		this.make = make;
		this.model = model;
		this.year = year;
	}
};
new foo.Car(); // Uncaught TypeError: foo.Car is not a constructor
```

Many but not all built-on objects and methods are incompatible with `new` 

```jsx
new console.log(); // Uncaught TypeError: console.log is not a constructor
new Math(); // Uncaught TypeError: Math is not a constructor

new Date(); // Tue Mar 09 2021 20:29:43 GMT-0500
```

### Constructors With Explicit Return Values

```jsx
function Car(name, breed, weight) {
	this.name = name;
	this.breed = breed;
	this.weight = weight;

	return { foo: 1 };
}

let fluffy = new Cat('Fluffy', 'Persian', 15);
fluffy.weight; // undefined
fluffy.foo; // 1
```

If a constructors explicitly tries to return an object it will return that object instead of a new object of the desired type. In all other situations,  like if there's a primitive return value, it still returns the newly created object of the desired type and ignores the primitive

### Supplying Constructor Arguments with Plain Objects

One common technique used to manage parameters in a contructor involves passing them to our constructor with an object argument

```jsx
let civicArgs = {
	make: 'Honda',
	model: 'Civic',
	year: 2016,
	color: 'black',
	passengers: 5,
	convertible: false,
	mileage: 16000
}

let civic = new Car(civicArgs);
```

That means we'd have to rework our `Car` constructor to accept an object as an argument

```jsx
function Car(args) {
	this.make = args.make;
	this.model = args.model;
	this.year = args.year
	...
	// rest of properites
}
```

With `Object.assign` , we can refactor this constructor

```jsx
function Car(args) {
	Object.assign(this, args);

	this.drive = function() {
		this.started = true;
	};
}
```

One drawback of the `Object.assign` approach is that the `args` object may contain properties that the `Car` object doesn't need. Those addittional properties will, nevertheless, get added to the `Car` object, excess baggage for the objects to carry around.

### Determining an Object's Type

The `new` operator creates a new instance of an object. If we were to call the Car constructor with `new` we can say that the object is an **instance** of a `Car` 

The `instanceof` operator lets us determine whether a given constructor created an object.

### `new` and Implict Execution

For a function call, the implicit context is the global object

For a method call, the implicit context is the object used to call the method

For a constructor call with `new` , the implicit context is the new object. 

If you call a constructor with the `new` keyword you'll unintentionally created a global variable(s) with the properties in the constructor since `this` is set to the *global object*.

To prevent *polluting the namespace* (creating global variables) you can check if `this` is an instance of the constructor

```jsx
function Person(name) {
	if (!(this instanceof Person)) {
		return new Person(name);
	}
	this.name = name;
}  
```

## Constructors With Prototypes

**Psuedo-Classical pattern** of object creation generates objects using a constructor function that defines state, then defineds shared bahviors on the constructor's prototype. If the function is ised as a constructor, the returned object's `[[Prototype]]` will reference the constructor's `prototype` property. That lets us set properties on the constructor's prototype object so that all objects created by the construcotr will share them. *Psuedo-classical* pattern of object created

### Method Delegation to Prototypes

Rather than creating a new method every time we create an object, we can use prototypes between objects of the same type to share code. **Delegation** means that we can share methods by putting them in the prototype object

Javascript searches the prototype chain to find the method. Thus we can define a method once in the prototype object and let the inheriting objects delegate the method calls to the prototype

```jsx
let DogPrototype = {
	bark() {
		console.log(this.weight > 20 ? 'Woof!' : 'Yip!');
	}
};

function Dog(name, breed, weight) {
	Object.setPrototypeOf(this, DogPrototype);
	this.name = name;
	this.breed = breed;
	this.weight = weight;
	// this.bark method removed
}
```

Now the `bark` method isn't defined on individual objects but is instead defined on the `[[Prototype]]` property

```jsx
// Delete DogPrototype

function Dog(name, breed, weight) {
	Object.setPrototypeOf(this, Dog.myPrototype);
	// rest of the code
}

Dog.myPrototype = {
	bark() {
		console.log(this.weight > 20 ? 'Woof!' : 'Yip!');
	}
};
```

Here we we better establish the relationship between the constructor and prototype by assign the prototype as a property of the `Dog` constructor function

### The Constructor `prototype` Property

What makes constructors special is a characterstic of all function objects in Javascript: they all have a `prototype` property that we call the **function prototype** to distinguish them from the prototypes used when creating ordinary objects

When you call a function, say `Foo` with the `new` keyword, Javascript sets the new object's prototype to the current value of `Foo` 's `prototype` property. That is, the constructor creates an object that inherits from the constructor function's prototype. Since inheritance in Javascript users prototypes, we can also say that the constructor creates an object with a prototypes that is the same as the constructor function's prototype

2 distinctions between constructor prototypes and object prototypes

- if `bar` is an object, then the object from which `bar` inherits is the **object prototype.** By default, constructor functions set the object prototype for the objects they create to the constructor's prototype object
- The **constructor's prototype object**, also called the **function prototype**, is a function object that the constructor uses as the object prototype for the objects it creates. In other words, each object that the constructor creates inherits from the constructor's prototype object. The constuctor stores its prototype object in its `prototype` property; that is, if the constructor's name is `Foo`, then `Foo.prototype` references the constructor's prototype object.

Every Javascript function has a `prototype` property though it's only used when you call the function as a constructor by using the `new` keyword. 

```jsx
function Dog(name, breed, weight) {
	// deleted Object.setPrototypeOf(this, Dog.myPrototype);
	this.name = name;
	this.breed = breed;
	this.weight = weight;
}

Dog.prototype.bark = function() {
	console.log(this.weight > 20 ? 'Woof!' : 'Yip!');
};

let maxi = new Dog('Maxi', 'German Shepherd', 32);
maxi.bark(); // 'Woof!'

let biggie = new Dog('Biggie', 'Whippet', 9);
biggie.bark(); // 'Yip!'
```

`this` in `this.weight` doesn't refer to the prototype object. Javascript binds `this` to the object whose method you used to call it, even if the method is in the prototype. `this` always refers to the original object.

### Overriding the Prototype

Inherited nethods from a prototype can be **overridden** by the methods the objects own

## Static and Instance Properties and Methods

We often refer to individual objects of a specific type as **instances** of that type. An instance is just another term for the objects created using any means of defining multiple objects of the same kind

### Instance Properties

Properties of an instance are **instance properties**

### Instance Methods

Methods stored directly in an object are known as **instance methods**. However, methods aren't usually stored in the instance object, they're usually defined in the object's prototype object. While methods defined in the prototype object aren't stored in the instance object, they still operate on individual instances so we refer to them as **instance methods**

### Static Properties

**Static properties** are defined and accessed directly on the constructor. They typically belong to the type rather than the individual instances or the prototype object

One common use of static properties is to keep track of all of the objects crated by a contructor

```jsx
function Dog(name, breed, weight) {
	this.name = name;
	this.breed = breed;
	this.weight = weight;
	Dog.allDogs.push(this);
}

Dog.allDogs = [];
```

In this case, the static property `allDogs` contains an array with a reference to every dog object created while the program is running. The list of all dogs isn't information pertinent to a specific instance of `Dog` , it's information about dogs in general so it should be a static property

### Static Methods

Examples of static method on built-in JavaScript constructors like `Object.assign`, `Array.isArray`, and `Date.now` 

## Built-in Constructors

### The `Array` constructor

`new Array()` creates and returns a new array. The array returned is empty unless you pass some arguments to the constructor. Each argument you provide gets added to the new array as an element

You can also pass in a single number argument. In doing so the constructor creates an array with a length equal to the number specified  by the argument with no actual elements. This along with `Array.prototype.fill` method, lets you create array with a value that is repeated in every element

```jsx
new Array(3)
// [ <3 empty items> ]

(new Array(3)).fill('*')
// [ '*', '*', '*' ]
```

`Array` lets you omit the `new` keyword but stay consistent and use `new` unless there's a good reason to omit it.

Static array method belong directly to the constructor function; they aren't part of the prototype used to create new objects. As a result, their names don't include `.prototype` 

`Array.isArray` method takes one argument and return `true` if the argument is an array object, and `false` if it is not

`Array.from` method takes an **array-like object** as an argument and returns a new array with the equivalent element values. An array-like object is any object that has a `length` property.

### The `Object` constructor

`new Object()` create and returns a new object. The `new` keyword can be omitted but it is not a good practice. All objects created by the `Object` constructor or with object literal synatc inherit from `Object.prototype` therefore all such objects have access to the instance methods defined in `Object.prototype`

Since array are a subtype of object, all array obects have access to all the methods on `Object.prototype`

**Almost all JavaScript objects, whether built-in or custom-created, inherit from `Object.prototype`, either directly or further down the prototype chain**

### The Date Constructor

The `Date` constructor creates objects, commonly called a **date object**, that represent a specific date and time. Calling `Date` without arguments returns a fate object the represents the creation fate and tie of the object 

The `Date` prototype object provides a variety of convenient methods for working with dates

`Date.prototype.getFullYear` returns the war from the date as a number

`Date.prototype.getDay` method returns a number that represents the day of the week that corresponds to the date object. The return value is `0` for Sunday to `6` for Saturday

### The `String` Constructor

Javascript has two kinds of strings: string primitives and `String` objects. String primitives are created using quotes or back-tick characters. 

To create a `String` object, we use the `String` constructor

```jsx
let strPrimitive = 'abc'
typeof strPrimitive
// 'string'

let strObject = new String('xyz')
typeof strObject
// 'object'
```

Calling the `String` constructor without the `new` keyword will not create an object, it simply returns a new string/

### The `Number` and `Boolean` Constructors

The `Number` and `Boolean` constructors work in the same way as `String` . When called with the `new` keyword it returns an object, when `new` is ommited it returns it's respective types

JavaScript invisibly wraps primitives in objects to access methods and properties

### Extending Built-in Prototypes

Since all Javascript objects derive their behavior from the prototype objects associated with their constructors, we can add new capabilities to our built-in objects by changing those prototypes

```jsx
Array.prototype.first = function() {
	return this[0];
}

[1, 2, 3].first(); // 1
```

It's best to avoid extending built-in objects as can confuse other developer working on your project

### Borrowing Array Methods for Strings

Using explicit context-binding, we can apply a method to a different object type than the one that defines the method. This allows us to borrow array methods to manipulate `String` objects

```jsx
let string = 'EEE';
Array.prototype.every.call(string, char => char === 'E'); 
// true
```

We can shorten that expression by using an empty array

```jsx
[].every.call(string, char => char === 'E'); 
// true

[].filter.call('olives', val => val < 'm').join('');
// 'lie'
```

## ES6 Classes

ES6 classes provide a cleaner, more compact alternative to constructors and prototypes. Functionally, classes behave almost identically to the constructors and prototypes aim to replace. Classes allow for static method by using the `static` modifier

### Class Declarations

Simplest way to declare classes in JavaScript is with the **class declaration**

```jsx
class Rectangle {
	constructor(length, width) {
		this.length = length;
		this.width = width;
	}
	
	getArea() {
		return this.length * this.width;
	}
}

let rec = new Rectangle(10, 5);
console.log(typeof Rectangle)         // function
console.log(rec instanceof Rectangle) // true
console.log(rec.constructor)          // [class Rectangle]
console.log(rec.getArea());           // 50
```

Class declaration begin with the `class` keyword, followed by the name of the class. One significant difference is that the constructor is now a method named `constructor` insideour class instead of being a standalone function

You **must** use the `new` keyword to call the constructor when using a `class`. JavaScript raises a `TypeError` if you try to call the constructor without the `new` keyword

### Class Expressions

Classes have an expression form that doesn't require a name after the `function` keyword

```jsx
let Rectangle = class {
	constructor(length, width) {
		this.length = length;
		this.width = width;
	}
	getArea() {
		return this.length * this.width;
	}
};
```

Aside from the syntax, class expressions are functionally equivalent to class declarations, it's just a matter of styles

### Class as First-Class_Citizens

A **first-class citizen** is a value that can be passed into a function, returned from a function, and assigned to a variable. JavaScript classes are also first-class values and can be passed into functions as arguments

```jsx
function createObject(classDef) {
	return new classDef();
}

class Foo {
	sayHi() {
		console.log('Hi!');
	}
}

let obj = createObject(Foo);
obj.sayHi(); // logs 'Hi!'

typeof Foo; // function
```

Since functions are first-class objects, classes must also be first-class objects

### Static Method and Properties

Methods invoked with the constructor as the caller like `Array.isArray` are static methods. Static methods are defined directly on the class, no on the objects the class creates whereas instance methods must be called by an instance object.

You can define static methods with the `class` keyword as long as you use the `static` keyword

```jsx
class Rectangle {
	constructor(length, width) {
		this.length = length;
		this.width = width;
	}
	static getDescription() {
		return 'A rectangle is a shape with 4 sides'
	}
}
console.log(Rectangle.getDescription()); 
// A rectablge is a shape with 4 sides
```

Static properties are properties defined on the constructor function instead of the individual objects. To define a static property in a `class` just use the `static` keyword inside the `class`

```jsx
class Rectangle {
	static description = 'A rectangle is a shape with 4 sides'
}
```