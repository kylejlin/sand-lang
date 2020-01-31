# Inheritance

Classes are final (nonextensible) by default.
To make a class extensible, you need to modify its _extensibility level_.

Every class has an extensibility level.
There are three extensibility levels:

| Level    | Can class be extended? | Can base class be constructed |
| -------- | ---------------------- | ----------------------------- |
| final    | no                     | yes                           |
| open     | yes                    | yes                           |
| abstract | yes                    | no                            |

As previously stated, classes are final by default.
However, you can prepend `open` or `abstract` to make them open or abstract.

## Final classes

```sand
// Classes are final by default, so
// there's no need to prepend any modifiers.
class Animal {
    pub new() {}
}


// Illegal - final classes cannot be extended
class Dog extends Animal {

}

// Legal - final classes can be constructed
let x = Animal();
```

## Open classes

```sand
open class Animal {
    pub new() {}
}


// Legal - open classes can be extended
class Dog extends Animal {

}

// Legal - open classes can be constructed
let x = Animal();
```

## Abstract classes

```sand
abstract class Animal {
    pub new() {}
}


// Legal - abstract classes can be extended
class Dog extends Animal {

}

// Illegal - abstract classes cannot be constructed
let x = Animal();
```
