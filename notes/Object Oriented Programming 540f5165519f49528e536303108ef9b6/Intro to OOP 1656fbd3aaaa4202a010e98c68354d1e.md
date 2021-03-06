# Intro to OOP

## Object Oriented Programming

**Object-Oriented Programming** is a **programming paradigm** where we think about a problem in terms of objects

Advantages are it allows programmers to think at a higher level of abstraction, easy to maintain (reduce the dependencies), easy to understand and change. 

While the disadvantages are requires more code and less efficient code requiring more memory, disk space and computing power

## Encapsulation

**Encapsulation** is the idea of grouping related properties and methods in a single object (bundling data and operations into a single entity)

Also refers to restring access to the state and certain behaviors; objects expose a **public interface** for interacting with other object and keep the implementation details hidden (showing only the data and behavior that other parts of the application that need to work)

However, JavaScript doesn't not directly provide the means to limit exposure of methods and properties. There are way to achieve a degree of access restriction, but they're not perfect

## Creating Objects

When object properties have function values, they are called **methods**

The OO style strong discourages changing property values directly. Instead, it encourages using methods to interface with the object.

### Compact Method Syntax

When writing methods for object you can omit the `:` and the `function` keyword

```jsx
let raceCar = {
	make: 'BMW',
	fuelLevel: 0.5,

	drive() {
		raceCar.fuelLevel -= 0.1;
	},
	// drive: function() {
	// 	 raceCar.fuelLevel -= 0.1;
	// }
}
```

### The `this` Keyword

`this` keyword inside a method, refers to the object that contains the method

```jsx
let raceCar = {
	make: 'BMW',
	fuelLevel: 0.5,

	drive() {
		this.fuelLevel -= 0.1;
	},
	// drive() {
	//	raceCar.fuelLevel -= 0.1;
	// },
}
```

## Collaborator Objects

Objects that help provide state **within** another object are called **collaborators**

```jsx
let cat = {
	name: 'Fluffy'
}

let pete = {
	name: 'Pete',
	pet: cat,

	printName() {
		console.log(`My pet's name is ${this.pet.name}`);	
	}
}
```

The `pete` object has a collaborator object stored in it's `pet` property

## Functions as Object Factories

**Object factories** are functions that create and return objects of a particular **type**

```jsx
function createCar(make, fuelLevel, engineOn) {
	return {
		make: make, 
		fuelLevel: fuelLevel,
		engineOn: engineOn,

		startEngine() {
			this.engineOn = true;
		}
	}
}

let jaguar = createCar('Jaguar', 0.4, false);
```

You can use shorthand notation when a property and a variable have the same name; i. e. `make` , `fuelLevel`  and `engineOn` 

```jsx
function createCar(make, fuelLevel, engineOn) {
	return {
		make,       // same as `make: make,`
		fuelLevel,  // same as `fuelLevel: fuelLevel,`
		engineOn    // same as `engineOn: engineOn,`
	}
}
```

One object factory can reuse another object factor by mixing the object returned by another factory function into itself by using `Object.assign`

## Steps to planning an object-oriented application

1. Write a textual description of the problem or exercise
2. Extract the significant nouns and verbs from the description
3. Organize and associate the verbs with the nouns

Nouns are the types of objects and verbs are the behaviors or methods

1. RPS is a two player game where each player chooses one of three possible moves: rock, paper, or scissors. The winner is chosen by comparing their moves with the rules
2. Nouns: player, move, rule

    Verbs: choose, compare

 3.  Player - choose

Move

Rule

??? - compare

### Orchestration engine

Once the the nouns and verbs are organized into objects, we need an engine to orchestrate the objects. **The engine is where the procedural program flow should be**

Child types inherit common properties and methods from a parent type, class inheritance.