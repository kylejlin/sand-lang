# Lists

## Arrays

Array transpilation is straightforward.

## Resizable lists

`T[+]` transpiles to `java.util.ArrayList<T>`, boxing `T` if it's a primitive.

For an `rlist` `x`:

- `x[n]` transpiles to `x.get(n)`
- `x[n] = v` transpiles to `x.set(n, v)`
- `x[n] += v` transpiles to `x.set(n, x.get(n) + v)` (the same goes for the other assignment variations)
