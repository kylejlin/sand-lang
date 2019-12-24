# Inline functions

Inline functions are a subset of [magic values](../magic.md).
Since they are magic, they have no runtime representation.
Inline functions are special because they can return magic values, unlike non-magic functions.

Sand provides some [built-in inline functions](./list.md), but you can also write your own.

## Writing your own inline functions

Inline functions are written `\arg1, arg2, [...argN] -> returnValue`.

For example, the following function takes a number and returns its square:

```sand
\n -> n * n
```

This function returns the absolute vaue of a number:

```sand
\n -> if n < 0  { -n } else { n }
```

## Using inline functions

On their own, user-defined inline functions are useless.

However, they can be quite useful when used in conjunction with built-in inline functions.

For instance, suppose you had a resizable list, and you wanted to calculate the list of its squares:

```sand
let x = int [1, 2, 3];
let y = x.map(\n -> n * n).rList();
```

The above code uses the built-in `.map` function and a user defined square function (`\n -> n * n`) to create a magic iterable containing the squares of `x`.
The magic iterable is then converted into a resizable list (by using the built-in `.rList` function), which can be stored in `y` because resizable lists are non-magic.

Hence, `y` now contains a resizable list containing `1`, `4`, and `9`.

The next subchapter lists Sand's built-in inline functions.
