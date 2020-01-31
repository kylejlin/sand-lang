# Primitives

There are eight primitive data types:

1. `int`
2. `short`
3. `long`
4. `byte`
5. `char`
6. `float`
7. `double`
8. `boolean`

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

A numeric literal can be given an explicit type by appending the type to the end of the literal.
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
