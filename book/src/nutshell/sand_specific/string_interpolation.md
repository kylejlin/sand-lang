# String interpolation

## Interpolating variables

Instead of this:

```java
System.out.println("You took " + minutes + " minutes and " + seconds + " seconds");
```

...write this:

```sand
System.out.println("You took {minutes} minutes and {seconds} seconds");
```

## Interpolating other expressions

Interpolation is not just limited to variables:

```sand
let confirmation = "Are you sure you want to order {cart.getQuantity(item)} {item.getName()}s?";
```

### Caveat: Curly brace restrictions

Interpolated expressions cannot contain "unbalanced" curly-braces.

For example, `"Hi {if a {b} else {c}}!"` is legal, but `"{'}'}"` is not.

This is because **the compiler determines the start and end of each interpolated expression before it parses any of those expressions**.
It uses curly-braces to determine the start and end of each interpolated expression.

#### A more thorough explanation

To determine the start and end of each interpolated expression, the compiler roughly follows the algorithm below:

- Start in "string scanning mode"
- When you encounter `{`, switch to "expression scanning mode"
- Set the "curly brace count" to one
  - Incremented it every time you encounter `{`
  - Decrement it every time you encounter `}`
- When the count reaches zero, switch back to string scanning mode

Consider the first example: `"Hi {if a {b} else {c}}!"`.

- When the compiler sees the `{` after `Hi`, it switches to expression scanning mode and sets the curly brace count to 1.
  - When it sees the `{` after `if a`, it increments the count to 2.
  - When it sees the `}` after `b`, it decrements the count to 1.
  - When it sees the `{` after `else`, it increments the count to 2.
  - When it sees the `}` after `c`, it decrements the count to 1.
  - When it sees the `}` before `!`, it decrements the count to 0 and switches back to string scanning mode.

The interpolated expression is therefore `if a {b} else {c}`, which is a valid Sand expression.

In contrast, consider the second example: `"{'}'}"`.

- When the compiler sees the `{` at the beginning of the string, it switches to expression scanning mode and sets the curly brace count to 1.
  - When it sees the the `}` after `'`, it decrements the count to 0 and switches back to string scanning mode.

The interpolated expression is therefore `'`, which is not a valid Sand expression.
This _would_ eventually result in a compilation error, except the compiler doesn't even get that far!

This is because the compiler finishes scanning a string before parsing its interpolated expressions.
When the compiler encounters the second `}`, it is in string scanning mode.
The compiler doesn't allow unescaped `}`s in string scanning mode, so it throws an error (about the unescaped `}`), thus not even making it to the interpolated-expression-parsing stage.

Obviously, the above example is quite silly and unrealistic—you wouldn't never interpolate a character literal (or a string literal, for that matter).
It is only listed to illustrate why right curly braces must be "balanced" with left curly braces.

## Escaping curly braces

Use `\`:

```sand
System.out.println("This is a left curly brace: \{");
System.out.println("This is a right curly brace: \}");
```
