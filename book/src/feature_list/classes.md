# Classes, properties, methods

## Public class

Each file has exactly one public class with the same name as the file.
For example, `HelloWorld.sand` must contain a public class called `HelloWorld`.

Syntax:

```sand
pub class HelloWorld {

}
```

## Private classes

Each file can also have zero or more private classes.

Syntax:

```sand
class YourPrivateClass {

}
```

Notice the lack of `pub` - classes are private by default.

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

Abstract classes are implicitly open.

## Overriding methods

Overriding is when a child class implements a method declared in an ancestor class.

Overriding requires:

1. The method be declared `open` or `abstract` in the parent.
2. The child method be declared an `override`.

For example:

```sand
open class Animal {
    genus: String;
    species: String;

    getLatinName(): String {
        genus + species
    }

    open greet() {}
}

class Dog extends Animal {
    use System.out.println;

    // Illegal because getLatinName is non-open
    getLatinName(): String {
        "Canis lupus"
    }

    // Illegal because Dog.greet is not marked as an override
    greet() {
        println("Woof");
    }

    // Legal
    override greet() {
        println("Woof");
    }
}
```

## Implicit `prot` accessiblity

Normally, methods are private by default.
However, if a method is `open` or `abstract`,
it is protected by default.
This is because `open` and `abstract` methods must be overridable or implementable by subclasses, which implies they must be accessible to the subclasses, and therefore have a minimum accesibility level of `prot`.

Hence, the following is redundant, but legal:

```sand
open class Foo {
    prot open foo() {

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
