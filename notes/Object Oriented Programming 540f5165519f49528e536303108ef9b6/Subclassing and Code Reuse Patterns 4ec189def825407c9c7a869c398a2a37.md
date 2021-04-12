# Subclassing and Code Reuse Patterns

## Object Creation with Prototypes (OLOO)

OLOO 

1. prototype object
2. initializer method (customizes that state for each object) usually named init
3. `Object.create` method shares behavoirs

OLOO **Objects Linking to Other Objects** pattern uses prototypes and involves extracting properties common to all objects of the same type to a prototype objects. All objects of the same type then inherit from that prototype

Using OLOO we extract `start` and `stop` methods to a prototype object and use `init` method on the prototype object to set properties

```jsx
let carPrototype = {
	start: function() {
		this.started = true;
	},
	
	stop: function() {
		this.started = false;
	},

	init(make, model, year) {
		this.make = make;
		this.model = model;
		this.year = year;
		return this
	},
};
```

The last line in the `init` method `return this` makes `init` return a reference to the car object it was called on. With that we can chain `create` and `init` and assign the result to the `car1` variable

```jsx
let car1 = Object.create(carPrototype).init('Toyota', 'Corolla', 2016);
```

### Advantage of OLOO over Factory Function

Since all objects created with the OLOO pattern inherit methods from a single prototype object, the objects that inherit from that prototype object share the same method. Making the OLOO pattern a significant advantage over factory function when it comes to memory efficiency

Factory function create copies of all the methods for each new object. That can have a significant performance impact, especially on smaller devices with limited memory

An advantage of the factory patter is that it lets us create objects with private state. Any state stored in the body of the factory function instead of in the returned object is private to the returned object. They can't be accessed or modified unless on of the object methods exposes state

## Subtyping with Constructors and Prototypes

```jsx
function Rectangle(length, width) {
	this.length = length;
	this.width = width;
}

Rectangle.prototype.getArea = function() {
	return this.length * this.width;
};

function Square(size) {
	this.length = size;
	this.width = size;
}

Square.prototype.getArea = function() {
	return this.length * this.width;
};
```

Here we can use prototypal inheritance. The relationship between `Square` and `Rectanlge` is that a square is a *special type* of rectanlge where both the length and width are the same. We say that `Square` is a **sub-type** of `Rectangle` , or that `Rectangle` is a **super-type** of `Square`

```jsx
Square.prototype = Object.create(Rectangle.prototype);
```

Since a function's `prototype` property is writable we can change what object it references. We can reassign `Square.prototype` to an object that inherits from `Rectangle.prototype` like in the line above

Resulting in a prototype chain that looks like

sqr —→ Square.prototype —→ Rectangle.prototype —→ Object.prototype

All objects created by the `Square` constructor inherit from `Square.prototype` , which we have set up to inherit from `Rectangle.prototype`

### Restoring the `constructor` property

One side-effect of this approach is that the `constructor` property on square objects points to `Rectangle` when it should point to `Square` instead.

This happens because we reassign `Square.prototype` to a new object that inherits from `Rectangle.prototype` , and the `constructor` property for `Rectangle.prototype` points back to `Rectangle` . Therefore, `Square.prototype.constructor` points to `Rectangle` . 

To fix this we need to reassign `Square.prototype.constructor` to `Square`

```jsx
Square.prototype.constructor = Square;
```

In most cases, failure to reassign the `constructor` won't hurt anything, however there are situations where the value of the `constructor` property is important

### Constructor Reuse

In the examples `Rectangle` and `Square` constructor functions are similar. We may be able to use the `Rectangle` constructor in `Square`. To do that, we can invoke `Rectangle` with its execution context explicitly set to the execution context of `Square` 

```jsx
function Square(size) {
	Rectangle.call(this, size, size);
}
```

### Prototypal Inheritance vs. Pseudo-Classical Inheritance

The simpler for of inheritance is **prototypal inheritance** or **prototypal delegation (using the prototype chain)**. An object's internal `[[Prototype]]` property points to another object, and the object can delegate method calls to that other object

When people talk about *inheritance* in the context of JavaScript, they generall mean **psuedo-classical inheritance** also called **constructor inheritance (where functions are used to create objects)**. In this inheritance, a constructor's prototype inherits from another contructor's prototype; that is, a sub-type inherits from a super-type. The term "pseudo 

When people talk about *inheritance* in the context of JavaScript, they generall mean **pseudo-classical inheritance** also called **constructor inheritance**. In this inheritance, a constructor's prototype inherits from another contructor's prototype; that is, a sub-type inherits from a super-type. 

The term "pseudo-classical" refers to that fact that constructor inheritance mimics the classes from other OOP languages, but doesn't actually use classes.

## Subtyping with Classes

```jsx
class Rectangle {
	constructor(length, width) {
		this.length = length;
		this.width = width;
	}
	getArea() {
		return this.length * this.width;
	}
	toString() {
		return `[Rectangle ${this.width * this.length}]`;
	}
}

class Square extends Rectangle {
	constructor(size) {
		super(size, size);
	}
	toString() {
		return `[Square] ${this.width * this.length}`;
	}
}		
```

The `extends` keyword signifies that the class named to the left of `extends` should inherit from the class specified to the right of `extends` , therefore `Square` inherits from `Rectangle` 

### `super`

When `super` is called inside the `constructor` method, the `super` keyword refers to the constructor method for the parent class (the class that we inherit from). You don't need to use `super` in every subclass but in most cases you do. In particular, if the superclass's constructor creates any object properties, you must call `super` to ensure that those properties are set properly.

If you do call `super` in a subclass's constructor, you must call it before you use `this` in that constructor

### Inheritance With Class Expressions

```jsx
let Person = class {
	constructor(name, age) {
		this.name = name;
		this.age = age;
	}
	sayName() {
		console.log(`My name is ${this.name}.`);
	}
};

let Student = class extends Person {
	constructor(name, age, semester) {
		super(name, age);
		this.semester = semester;
	}
	enrollInCourse(courseNumber) {
		console.log(`${this.name} has enrolled in course ${courseNumber}.`);
	}
};

let student = new Student('Kim', 22, 'Fall');
student.sayName(); // logs 'My name is Kim'
student.enrollInCouse('JS120'); // logs 'Kim has enrolled in course JS120'
```

In this example, using class expressions the `Student` class inherits from the `Person` class. That gives studnet object access to methods of the `Person` class and extends peroson objects further by adding a `semester` property and an `enrollInCourse` method. Notice that we've reused `Person`'s constructor inside the `Student` constructor, and calling `super` with `name` and `age` since the `Student` constructor expects those arguments. We also assign the `semester` arguments to the `semester` property after `super` returns

## Code Reuse with Mixins

Javascript objects can inherit from only one object and classes can extend only one other class. When an object can have only one prototype objects, it's called **single inheritance**

Some programming languages allow classes to inherit from multiple classes, a functionality known as **multiple inheritance**.

### Mix-ins

JavaScript mix-ins adds methods and properties from on object to another by copying the properties of one obhect to another with `Object.assign`. 

```jsx
class Bird {}

class Stork extend Bird {
	fly() {}
}

class Parrot extends Bird {
	fly() {}
}

class Penguin extends Bird {
	swim() {}
}

class Ostrich extends Bird {
	swim() {}
}

class Duck extends Bird {
	swim() {}
	fly() {}
}

class Goose extends Bird {
	swim() {}
	fly() {}
} 
```

Here we can use **mix-ins** instead to reduce duplication. A **mix-in** is an object that defines one or more methods that can be "mixed in" to a class granting that class access to all of the methods in the object.

```jsx
const Swimmable = {
	swim() {}
}

const Flyable = {
	fly() {}
}

class Stork {}
Object.assign(Stork.prototype, Flyable);

class Parrot {}
Object.assign(Parrot.prototype, Flyable);

class Penguin {}
Object.assign(Penguin,prototype, Swimmable);

class Ostrich {}
Object.assign(Ostrich.prototype, Swimmable);

class Duck {}
Object.assign(Duck.prototype, Swimmable, Flyable);

class Goose {}
Object.assign(Goose.prototype, Swimmable, Flyable);
```

In this code we created a `Swimmable` and `Flyable` object that has a `swim` and `fly` method resptectively. to mix it into our various swimming and flying birds, we've used `Object.assign` to add methods from `Swimmable` and `Flyable` to the prototype objects of those classes

### Mix-ins vs. Inheritance

Some JavaScript developers suggest that inheritance fails at modeling some scenarios but a combination of factory functions and mix-ins can model any object relationship.

Though using just mix-ins and factory functions without class/ constructor inheritance suffers the downsides of all factory functions

1. Every new objects receives a new copy of all of its methods, including new copies of both mix-in methods and the methods that belong more directly to the object. This can be taxing on memory resources, even more so than the memory requirements of mix-ins
2. You can't determine the type of an object created with a factory function: the `instanceof` operator only recognizes these objects as instances of the `Object` type

A balance of mix-in and classical inheritance pattern is suggested

1. Inheritance works well when on object type is positivelya sub-type of another object. In our example, it's natural for a penguin to also be a swimming bird. These types have an **is a** relationship: a penfind *is a* swimming bird. Whenever two object types have an "is a" relationship, constructor or class inheritance makes sense
2. When you want to endow your object with some capability, a mix-in may be the correct choice 

## Polymorphism

**Polymorphism** refers to the ability of objects of different types to respond in different ways to the same method invocation

### Polymorphism Through Inheritance

When two different object types respond to the same method call simply by **overriding** the appropriate method in the class is an example of polymorphism.

Polymorphism through inheritance can be when an object doesn't provide it's own behavior for a method and uses inheritance to acquire the behavior through its supertype. 

### Polymorphism Through Duck Typing

**Duck typing** occurs when objects of different **unrelated types** both respond the the same method name. With duck typing, we aren't concerened with the class or type of an object, but we do care whether an object has a particular behavior. Those objects can be interacted with in a uniform way

For example, an application may have a variety of elements that can respond to a mouse click by calling a method named `handleClick` . Those elements may be completely different — for instance, a checkbox vs. a text input field — but they're all *clickable* objects.

## More Object Oriented Programming

### Orchestration Engine

**Orchestration engine** a class that controls the flow of the apllication or some part of the application. It's common practice to make the orchestration enginge the last class in a file, and to give it a name that is likely to be unique

### Stubs and Spikes

**Stubs** and **spikes** are common in OO code and are inserted as comments that identifies the method as a stub or spike, `STUB` and `SPIKE` . Such comments help the developer keep track of what remains to be done 

**Stubs** are written first. They serve as placeholder for functions and methods to be written or removed later. They don't have any useful functionality yet; most stubs are either empty or return a constant value. Enough to let you test your code without having to build the entire program first.

**Spikes** provide a general outline of how the program flows. Spikes take a high-level view, focusing on the general logic of the program; they don't concern ourselves with the implementation details of different methods

### `toString` with Objects

Javascript uses `toString` when it must implicitly convert something to a string representation. It returns the unhelpful `[object Object]` when passed an object. You can override `toString` in your classes; that is, you can define a `toString` method in your class that JavaScript should call instead

### Eliminate Magic Constants

You should always create a symbolic constant for "magic constants" (unnamed constants)

The `static` keyword defines a property that belongs to the class, not the individual objects(instances) created from the class. It's useful for defining **class constants** like those provided in other languages. We must qualify the constatn name with the class name, even if we reference it from somewhere in the class

```jsx
class Square {
	static UNUSED_SQUARE = ' ';
	static HUMAN_MARKER = 'X';
	static COMPUTER_MARKER = 'O';
	
	constructor(marker = Square.UNUSED_SQUARE) {
		this.marker = marker;
	}
}
```