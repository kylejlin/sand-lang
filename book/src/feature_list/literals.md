# Literals

## Strings

Use double quotes to write strings, and backslashes for escapes.

```sand
"Hello world"
"Hey\nlook\na\nmultiline\nstring!"
"This is a quote: \". This is a backslash \\"
```

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

As previously discussed, you can write `ClassName { prop1: val1, prop2: val2 }` to create an object of type `ClassName` with `propN` set to `valN`.

Trailing commas are permitted.

Example:

```sand
Dog {
    name: "Fido",
    age: 5000,
}
```

See [object literals](./classes.md#instantiating-a-class) for more details.

### Null

Use the `null` constant.

## Arrays

Create an array with `[val1, val2, val3, valN]`.

The type of an array of `T` can be denoted by either `T[]` or `array<T>`.

For example:

```sand
let x: int[] = [1, 2, 3];
```

## Resizable lists

Sand provides an abstract type `rlist`, representing a resizable sequence of values.
`rlist` is similar to `array`, except arrays are fixed-length while resizable lists are resizable.

Currently, resizable lists are implemented with `java.util.ArrayList`, but this is subject to change.

The type of a resizable list `T` can be denoted by either `T[*]` or `rlist<T>`.

There are no literals to create resizable lists, but you can create an array and use the `~` operator to convert it to a resizable list:

```sand
let x: int[*] = ~[1, 2, 3];
```

## Ranges

Ranges are sequences of zero or more `int`s.

Create a range with `start..exclusiveEnd` or `start..=inclusiveEnd`.

The former (`..`) will create a range starting at `start` and ending just before `exclusiveEnd`.

The latter (`..=`) will create a range starting at `start` and ending at `inclusiveEnd`.

For example, in the code below, `x` and `y` are equivalent:

```sand
let x = 1..10;
let y = 1..=9;
```

They both refer to the sequence `1, 2, 3, 4, 5, 6, 7, 8, 9`.

Sometimes you need to enclose ranges in parentheses.
For example:

```sand
(1..=5).map(\n -> n * n)
```
