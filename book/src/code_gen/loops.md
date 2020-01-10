# Loops

`while` is self-explanatory.

`loop` is transpiled to `while (true)`.

`repeat n` is transpiled to `for (int i = 0; i < n; i++)`.
If `i` conflicts with some other variable, another name will be used instead.

The algorithm for transpiling `for` is a little more complicated.
See the [Magic functions chapter](./magic_funcs/intro.md) for more info.
