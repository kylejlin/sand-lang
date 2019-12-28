# Data types

This chapter describes the Sand's data types and the syntax to create instances of those types.

## Strings

Use double quotes to write strings, and backslashes for escapes.

```sand
let greeting = "Hello world";
let multiline = "Hey\nlook\na\nmultiline\nstring!";
let escapes = "This is a quote: \". This is a backslash \\";
```

As in Java, Strings are immutable.

## Numbers

Integral types (`int`, `short`, `long`, `byte`, `char`) cannot contain a `.`.

Non-integral types (`float`, `double`) _must_ contain a `.`, even if they are whole.

For example:

```sand
// Legal
let x: float = 42.0;

// Illegal
let x: float = 42;
```

### Exponential notation

Numeric literals can use exponential notation using a lowercase `e`:

```sand
// Legal
let x: int = 42e3;
let y: float = 42e-3;

// Illegal
let x: int = 42E3;
```

### Explicit type annotation

A numeric literal can be given an explicit type by prepending the type to the end of the literal.
This can be useful when the type of a literal cannot be inferred.

For example:

```sand
// Illegal
let x = 42.0; // Is a float or double?

// Legal
let x = 42float;
```

## Characters

Denote a character by surrounding it in single quotes:

```sand
let x = 'a';
let y = 65char;

System.out.println(x == y); // Prints true
```

You can use backslashes to represent characters you could not surround in single quotes:

```sand
let x = '\n';
let y = '\'';
let z = '\\';
```

## Booleans

Use the constants `true` and `false`.

## Objects

As previously discussed, you can write `Class { prop1: val1, prop2: val2 }` to create an object of type `Class` with `propN` set to `valN`.

Trailing commas are encouraged, but not required.

Example:

```sand
let dog = Dog {
    name: "Fido",
    age: 5000,
};

// Also legal

let dog = Dog {
    name: "Fido",
    age: 5000 // <- no trailing comma
};
```

See [object literals](./classes.md#instantiating-a-class) for more details.

### Null

Use the `null` constant.

#### Implicit non-nullability

Object types are non-nullable by default.

Hence, the following is illegal:

```sand
let bar: Bar = null;
```

To make a type nullable, append `?` to the type:

```sand
let bar: Bar? = null;
```

## Sequences

Sequences are homogeneous collections of zero or more ordered values.

Three commonly used sequences are arrays, resizable lists, and ranges.

### Arrays

Arrays are mutable fixed-length sequences.

Create an array with `[val1, val2, val3, valN]`.

The type of an array of `T` can be denoted by either `T[]` or `array<T>`.

For example:

```sand
let x: int[] = [1, 2, 3];
let y: array<int> = [1, 2, 3];
```

### Resizable lists

Resizable lists are (mutable) variable-length sequences.

Currently, resizable lists are implemented with `java.util.ArrayList`, but this is subject to change.

The type of a resizable list `T` can be denoted by either `T[*]` or `rlist<T>`.

There are no literals to create resizable lists, but you can create an array and use the `~` operator to convert it to a resizable list:

```sand
let x: int[*] = ~[1, 2, 3];
let y: rlist<int> = ~[1, 2, 3];
```

### Ranges

Ranges are immutable sequences of zero or more `int`s.

Create a range with `start..exclusiveEnd` or `start..=inclusiveEnd`.

The former (`..`) will create a range starting at `start` and ending just before `exclusiveEnd`.

The latter (`..=`) will create a range starting at `start` and ending at `inclusiveEnd`.

For example, in the code below, `x` and `y` are equivalent:

```sand
let x = 1..10;
let y = 1..=9;
```

They both refer to the sequence `1, 2, 3, 4, 5, 6, 7, 8, 9`.

Ranges can be ascending, descending, or empty.

```sand
let ascending = 1..10;
let descending = 10..1;
let empty = 1..1;
```
