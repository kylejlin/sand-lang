# Objects

Just like in Java:

- Objects are passed by reference.
- Objects are compared by reference when using `==`.
- There is a `null` constant which is assignable to any nullable object type.

## Constructing an object

Unlike Java, you don't need to use the `new` keyword to construct an instance of a class.

```sand
pub class Parrot {
    pub static main(args: String[]) {
        // Not `new Parrot("Joe")`
        let parrot = Parrot("Joe");
        parrot.greet();
    }

    name: String;

    pub new(name: String) {
        this.name = name;
    }

    pub greet() {
        System.out.println("I am " + name);
    }
}
```

You can also used named arguments:

```sand
pub class Parrot {
    pub static main(args: String[]) {
        let parrot = Parrot(name: Joe);
        parrot.greet();
    }

    // ...
}
```

## Explicit nullability

Unlike Java, objects are non-nullable by default.
To make a type nullable, append a `?`.
For example:

```sand
// Illegal
let x: Dog = null;

// Legal
let y: Dog? = null;
let z: Dog? = Dog.fromName("Spot");
```

## Autoboxing

Primitives are automatically "boxed" in their respective wrapper types when using them as a type argument to a generic type.

**Example 1:**

This:

```sand
re x: int? = 0;
x = null;
```

...compiles to this:

```java
Integer x = 0;
x = null;
```

**Example 2**

This:

```sand
pub sum(nums: int[+]): int {
    // ...
}
```

...compiles to this:

```java
public int sum(nums: List<Integer>) {
    // ...
}
```

## Strings

Use double quotes to write strings, and backslashes for escapes.

```sand
let greeting = "Hello world";
let multiline = "Hey\nlook\na\nmultiline\nstring!";
let escapes = "This is a quote: \". This is a backslash \\";
```

Just like in Java:

1. Strings are immutable.
2. Since Strings are objects, you should **not** use `==` to compare them for value equality.

## Arrays and lists

Arrays and lists are objects, but they aren't discussed in this chapter because they are discussed in [the next one](./sequences.md).
