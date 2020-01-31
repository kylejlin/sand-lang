# Classes, properties, methods

## Public class

Each file has exactly one _public item_ (which can either be a [class](./classes.md) or an [interface](./interfaces.md)).
The public item must have the same name as the file (without the `.sand` part).

To declare a public class, write `pub class`. For example, in the file `HelloWorld.sand`, you would write:

```sand
pub class HelloWorld {

}
```

## Private classes

Each file can also have zero or more private classes.
To make a class private, simply omit the `pub`.

```sand
class YourPrivateClass {

}
```

## Instance properties

```sand
class Dog {
    // Each class can declare zero or more instance properties.
    // Each property must have a data type

    // Creates a property `name` with type `String`.
    name: String;

    // Properties are private by default.
    // You can use `pub` or `prot` to make them public or protected.
    pub age: int;

    // Properties are final (non-assignable except in constructors) by default.
    // You can use `re` to make them reassignable.
    re barkCount: int;
}
```

## Instance methods

```sand
class Dog {
    // Each class can declare zero or more instance methods.
    // Each method has a return type, which is implicitly `void`.

    // Creates a method `bark` that has a return type of `void`.
    bark() {
        System.out.println("Woof");
    }

    // Creates a method `getName` that returns an `int`.
    getAge(): int {
        return age;
    }

    // Methods can take arguments
    isOlderThan(other: Dog): boolean {
        return age > other.age;
    }

    // Like properties, methods are private by default.
    // You can use `pub` or `prot` to make them public or protected.
    pub getName(): String {
        return name;
    }
}
```

## Static properties

To declare a static property, write `static` in the declaration before the property name:

```sand
class Dog {
    pub static SPECIES = "Canis lupus familiaris";

    // Use `re` to make a property reassignable.
    static re dogsCreated = 0int;
}
```

Static properties must be initialized.

```sand
class Dog {
    // Illegal - missing initial value
    static re dogsCreated: int;
}
```

## Static methods

To declare a static method, write `static` in the declaration before the method name.
Static methods cannot access `this` or `super`.

```sand
class Dog {
    pub static fromName(name: String) {
        return Dog(name);
    }
}
```

## Method overloading

You can have multiple methods with the same name if they have different argument types.
Each method may have a different accessiblity level and/or different return type.
These rules apply to both static and instance methods.

```sand
class Foo {
    bar() {

    }

    bar(x: int): int {

    }

    pub bar(x: String): boolean {

    }
}
```

## Constructors

Use `new` to declare constructors:

```sand
class Dog {
    pub new(name: String) {
        this.name = name;
    }
}
```

Constructors cannot return a value.

```sand
class Dog {
    // Illegal
    pub new(name: String): Dog {
        this.name = name;
        return this;
    }
}
```

## Constructing instances of class

Unlike Java, you do not use the `new` keyword to construct instances of a class.

Instead, to construct an instance of class `T`, simply write `T(arg1, arg2, argN)`.

```sand
pub class App {
    pub static main(args: String[]) {
        let x = Dog("Spot");
    }
}
```

You can also use named arguments (`T(arg1Name: arg1Val, arg2Name: arg2Val, argNName: argNVal)`)).

```sand
pub class App {
    pub static main(args: String[]) {
        let x = Dog(name: "Spot");
        let y = Leash(leashLength: 8);
    }
}

class Leash {
    pub new(leashLength: int) {
        // ...
    }
}
```

## Extending classes

See [inheritance](./inheritance/classes.md).

## Open classes

Classes are by default non-extendable.
To allow a class to be extended, use `open`:

```sand
open class Animal {

}
```

Open classes must at least give their subclasses read-access to all their properties, either directly or through an auto-generated getter (see _Visibility modifiers_ and _Getters and setters_ below).

## Superclasses

Classes can extend other open classes.

Syntax:

```sand
class Child extends Parent {

}
```

All classes implicitly extend `Object`.

## Type arguments

Classes can take type arguments.

Syntax:

```sand
class MyList<T> {

}
```

### Constraints

```sand
// T must be a subclass of Animal
class MyAnimalList<T: Animal> {

}
```

## Properties

```sand
class Dog {
    name: String;
    age: int;

    static re numberOfDogs: int = 0;
}
```

Properties are private, non-static, and non-reassignable by default.

### Assignability

To make a property reassignable, add `re` (short for "reassignable"):

```sand
pub class Dog {
    name: String;
    re age: int;

    pub main(args: String[]) {
        Dog dog = Dog { name: "Fido", age: 0 };

        // Illegal
        dog.name = "Buddy";

        // Legal
        dog.age = 1;
    }
}
```

### Visibility modifiers

```sand
class Dog {
    pub name: String;
    prot age: int;
}
```

`pub` is short for "public" and `prot` for "protected".

### Getters and setters

```sand
class Dog {
    pub(get, set) name: String;
}
```

The above code creates a private property `name`, a public method `getName(): String`, and a public method `setName(name: String)`.

### Static properties

Static properties must be initialized.

```sand
class Dog {
    // Illegal
    static re nameOfDogMostRecentlyCreated: String;

    // Legal
    static re nameOfDogMostRecentlyCreated = "Fido";
}
```

Like non-static properties, static properties are private and non-reassignable by default.

## Methods

Methods are static and private by default.

Adding `this` as the first parameter makes the method non-static.

Similar to properties, method visibility can be modified with `pub` and `prot`.

If a method returns a value, its return type must be explicitly declared.

```sand
class Dog {
    name: String;
    re age: int;

    pub create(): Dog {
        Dog { name: "Fido", age: 49 }
    }

    pub getName(this): String {
        name
    }

    pub incrementAge(this) {
        age += 1;
    }

    pub incrementAge(this, amount: int) {
        age += amount;
    }
}
```

### Method overloading

Several methods can have the same name if their argument types differ.

For example, in the above code, `incrementAge` refers to two methods: one accepting no arguments, and one accepting an `int`.
Therefore, the code is valid.

For the purposes of overloading, `this` is not considered when comparing argument types.
Hence, the following code would not compile:

```sand
class Foo {
    bar(this, baz: String): int {
        baz.length()
    }

    bar(baz: String): int {
        baz.length()
    }
}
```

## Abstract classes

Abstract classes can declare abstract methods (methods without an implementation).

```sand
abstract class Animal {
    abstract getSpecies(this);
}
```

Abstract classes and methods are implicitly open.

Abstract methods cannot be static or private.
Abstract methods [default to `prot`](./classes.md#implicit-prot-accessibility) (protected visibility), because they cannot be private.

## Overriding methods

Overriding is when a child class implements a method declared in an ancestor class.

Overriding requires:

1. The method be declared `open` or `abstract` in the parent.
2. The method is not `static`.
3. The child method be declared an `override`.

For example:

```sand
open class Animal {
    genus: String;
    species: String;

    getLatinName(this): String {
        genus + species
    }

    open greet(this) {}
}

class Dog extends Animal {
    use System.out.println;

    // Illegal because getLatinName is non-open
    getLatinName(this): String {
        "Canis lupus"
    }

    // Illegal because Dog.greet is not marked as an override
    greet(this) {
        println("Woof");
    }

    // Legal
    override greet(this) {
        println("Woof");
    }
}
```

Static methods cannot be `open` because Sand compiles to Java, and Java does not support overriding static methods (because polymorphism only works on class instances, not classes themselves).

## Implicit `prot` accessibility

Normally, methods are private by default.
However, if a method is `open`, `abstract`, or an `override`,
it is protected by default.
This is because `open` and `abstract` methods must be overridable or implementable by subclasses, which implies they must be accessible to the subclasses, and therefore have a minimum accesibility level of `prot`.
Similarly, method `override`s can only be written for methods that can be accessed by the overriding (sub) class, which are by definition `prot` at a minimum.

Hence, the following is redundant, and should instead be simply written `open foo()` and `override foo()`, respectively:

```sand
open class Super {
    prot open foo(this) {
//  ^^^^ Unnecessary
    }
}

class Sub extends Super {
    prot override foo(this) {
//  ^^^^ Unnecessary
    }
}
```

## `override` does not imply `open`

`override` does not imply `open`—if you want an overridden method to in turn be overridable, you have to explicitly mark it `open`.

Hence, the following is illegal:

```sand
open class Animal {
    open species(this): String {

    }
}

open class Dog extends Animal {
    override species(this): String {

    }
}

class Corgi extends Dog {
    // Illegal override, because Dog.species() is not open
    override species(this): String {

    }
}
```

To fix this, you would make `Dog.species` `open`:

```sand
open class Dog extends Animal {
    open override species(this): String {

    }
}
```

## Instantiating a class

Instances can be created with the syntax

```sand
Class { prop1: val1, prop2: val2, ... }
```

Example:

```sand
class Dog {
    name: String;
    age: int;

    pub create(): Dog {
        // Creates an instance of Dog and returns it
        Dog { name: "Fido", age: 49 }
    }
}
```

### Instantiation scope restrictions

By default, object literals can only appear in the class they are instantiating.
For instance, the following is illegal:

```sand
class Dog {
    name: String;
    age: int;
}

class DogBuilder {
    pub buildDog(): Dog {
        Dog { name: "Fido", age: 49 }
    }
}
```

To enable this, add `pub inst;` to the class you want to be publicly instantiable:

```sand
class Dog {
    name: String;
    age: int;

    pub inst;
}
```

You can alternatively use `prot inst;` to restrict instantiation to child classes.

Additionally, the instantiation scope restriction of a class cannot be more permissive than that of its ancestors.
For example:

```sand
open class Animal {
    prot species: String;

    prot inst;
}

class Dog extends Animal {
    name: String;

    // Illegal (because Animal.inst is prot)
    pub inst;

    // Legal
    pub makeDog(name: String): Dog {
        Dog { name: name, species: "Canis lupus" }
    }
}
```

### Property initialization shorthand

`Class { foo }` is syntactic sugar for `Class { foo: foo }`, so the above example could be rewritten as

```sand
pub makeDog(name: String): Dog {
    Dog { name, species: "Canis lupus" }
}
```

### Copying objects

Suppose we had

```sand
class Dog {
    name: String;
    age: int;

    pub clone(dog: Dog): Dog {
        Dog { name: dog.name, age: dog.age }
    }
}
```

We can use object-copying to simplify this to

```sand
pub clone(dog: Dog): Dog {
    Dog { ...dog }
}
```

Object copies (i.e., `...expr`) must come before all normal object entries (i.e., those of the form `foo: foo` or `foo`).

For example, `Dog { ...dog, name }` is legal, while `Dog { name, ...dog }` is not.

Sometimes object-copying is not only convenient, but essential.
For example, suppose we had

```sand
open class Animal {
    prot species: String;

    pub fromSpecies(species: String): Animal {
        Animal { species }
    }
}
```

Since `Animal.inst` is private, we cannot manually instantiate an `Animal` from a subclass such as `Dog`.
Hence, the following is illegal:

```sand
class Dog extends Animal {
    pub fromName(name: String): Dog {
        Dog { name, species: "Canis lupus" }
        //          ^^^^^^^ Error!
        // Animal is only privately instantiable,
        // so sub-classes cannot manually initialize
        // its properties.
    }
}
```

To fix this, we would use object-copying:

```sand
pub fromName(name: String): Dog {
    Dog { ...Animal.fromSpecies("Canis lupus"), name }
}
```
