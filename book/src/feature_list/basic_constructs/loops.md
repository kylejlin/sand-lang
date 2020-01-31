# Loops

Like `if`, loops requires curly braces.

## `while`

```sand
re n = 0;
while n < 10 {
    System.out.println(n);
}
```

## `loop`

`loop` is an infinite loop.
It is equivalent to `while true`.

```sand
// prints "hi" forever (or at least until the user terminates the program)
loop {
    System.out.println("hi");
}
```

## `for (;;)` ("C-style" for loop)

The C-style loop works just like it does in Java.

Syntax (same as Java):

```sand
for (<declaration>; <condition>; <afterthought>) {

}
```

Replace `<declaration>` with some variable declaration, `<condition>` with some boolean expression, and `afterthought` with some expression to be evaluated after the body is executed.

Example:

```sand
for (let i = 0int; i < 10; i += 1) {
    System.out.println(i);
}
```

## `for <val> in <seq>` (sequence value iteration)

Iterates over a list or array.

```sand
for word in ["Hello", " ", "world"] {
    System.out.print(word);
}
```

## `for (<key>, <val>) in <seq>` (sequence entry iteration)

Iterates over a list or array.

```sand
for (i, word) in ["Hello", " ", "world"] {
    System.out.println("The " + i + "th word is " + word);
}
```

## `for <counter> in <range>`

Iterates over range of integers

```sand
// Prints 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
// But *not* 10, because `+<` excludes the upper bound
for i in 0 +< 10 {
    System.out.println(i);
}
```

You can replace `+<` with any one of the four range symbols.
There are four range symbols:

1. `+<` - ascending, inclusive lower bound, exclusive upper bound
2. `->` - descending, inclusive upper bound, exclusive lower bound
3. `+<=` - ascending, inclusive lower bound, inclusive upper bound
4. `->=` - descending, inclusive upper bound, inclusive lower bound

## Skipping to the next iteration

You can use `continue;` to skip to the next iteration of a loop.

## Immediately exiting

You can use `break;` to immediately exit a loop.
