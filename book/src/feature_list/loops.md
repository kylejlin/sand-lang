# Loops

Like `if`, loops requires curly braces.

## `while`

```sand
// --snip--

re n = 0;
while n < 10 {
    System.out.println(n);
}
```

## `loop`

`loop` is an infinite loop.
It is equivalent to `while true`.

```sand
// --snip--

// prints "hi" forever
loop {
    System.out.println("hi");
}
```

## `repeat`

`repeat n` executes its body `n` times.
If `n` is zero or negative, the body is never executed.

```sand
// --snip--

repeat 3 {
    System.out.println("hi");
}
```

## `for`

Iterates over an iterable (see the [Inline functions chapter](./inline_funcs/intro.md) for more details).

```sand
// --snip--

for i in (0..10) {
    System.out.println(i);
}
```

Sand does not support C-style for loops.

## Skipping to the next iteration

You can use `continue;` to skip to the next iteration of a loop.

## Immediately exiting

You can use `break;` to immediately exit a loop.
