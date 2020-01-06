# Magic functions

Magic functions are functions that have no Java definition.

Magic functions are allowed to return magic values.

Sand provides some magic functions, but you can also write your own.

## Writing your own magic functions

Inline functions are written `\arg1, arg2, [...argN] -> returnValue`.

For example, the following function takes a number and returns its square:

```sand
\n -> n * n
```

This function returns the absolute vaue of a number:

```sand
\n -> if n < 0  { -n } else { n }
```

## Using magic functions

On their own, user-defined magic functions are useless.

However, they can be quite useful when used in conjunction with built-in magic functions.

For instance, suppose you had a resizable list, and you wanted to calculate the list of its squares:

```sand
let x: int[] = [1, 2, 3];
let y = x.map(\n -> n * n).rList();
```

The above code uses the built-in `.map` function and a user defined square function (`\n -> n * n`) to create a magic sequence containing the squares of `x`.
The magic sequence is then converted into a resizable list (by using the built-in `.rList` function), which can be stored in `y` because resizable lists are non-magic.

Hence, `y` now contains a resizable list containing `1`, `4`, and `9`.

The next subchapter lists Sand's built-in magic functions.
