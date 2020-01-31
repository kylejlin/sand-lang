# Arrays and lists

## Arrays

Just like in Java:

1. Arrays are mutable fixed-length sequences.
2. The type of an array of `T` is denoted by `T[]`.

Unlike in Java, arrays are created with the syntax `[val1, val2, val3, valN]`.

For example:

```sand
let x: int[] = [1, 2, 3];
let y = ["Hello", "world"];
```

If you want to fill an array with a certain value, you can use [array filling](../advanced_assignments/array_filling.md):

```sand
// Fills an array by calling randInt() 3 times.
let x = fill [randInt(1, 5); 3];
```

## Lists

You can write `T[+]` as syntactic sugar for `java.util.List<T>`.
For example, the following two code samples are equivalent.

```sand
import java.util.List;

pub class Foo {
    foo(bar: List<Integer>) {}
}
```

```sand
pub class Foo {
    foo(bar: int[+]) {}
}
```

In addition to manually constructing `ArrayList<T>()`, you can also use [list filling](../advanced_assignments/list_filling.md):

```sand
// Fills an ArrayList with "Hello" and "world"
let x = +["Hello", "world"];

// Fills an ArrayList by calling randInt() 3 times
let y = fill +[randInt(1, 5); 3];
```
