# Method overridability

## Overridability levels

Similar to classes, methods are final (nonoverridable) by default.
To make a class extensible, you need to modify its _overridability level_.

Every method has an overridability level.
There are three overridability levels:

| Level    | Can the method be overridden? |
| -------- | ----------------------------- |
| final    | no (forbidden)                |
| open     | yes (optional)                |
| abstract | yes (required)                |

As previously stated, methods are final by default.
However, you can prepend `open` or `abstract` to make them open or abstract.

## Overriding

When overriding the method in the child class, you must prepend `override`, or else your code will not compile.

## Overriding example

```sand
abstract class Animal {
    abstract prot getSpecies(): String;

    shoutSpecies() {
        System.out.println("I AM A " + getSpecies().toUpperCase());
    }

    open greet() {
        System.out.println("Hello world");
    }
}

// Illegal - getSpecies() is abstract and must be overridden
class Dog extends Animal {

}

class Dog extends Animal {
    // Illegal - `override` keyword required
    prot getSpecies(): String {
        species
    }
}

class Dog extends Animal {
    // Illegal - shoutSpecies() is final cand cannot be overridden
    override shoutSpecies() {

    }
}

// Legal
class Dog extends Animal {
    override prot getSpecies(): String {
        species
    }

    // Animal.greet() is open, so Dog is *allowed* to override it, but it isn't *required* to
}

// Legal
class Dog extends Animal {
    override prot getSpecies(): String {
        species
    }

    // Animal.greet() is open, so Dog is *allowed* to override it, but it isn't *required* to
    override greet() {

    }
}
```
