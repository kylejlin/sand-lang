# Ternary expressions

Sand doesn't support ternary expressions (`condition ? trueVal : falseVal`).

Instead, Sand supports _`if` expressions_, which are semantically equivalent to ternary expressions, but syntactically cleaner.

Instead of this:

```java
int sign = num < 0 ? -1 : num > 0 ? 1 : 0;
```

...write this:

```sand
let sign: int = if num < 0 {
    -1
} else if num > 0 {
    1
} else {
    0
};
```

An `if` expression must have:

- Exactly one `else` clause
- Zero or more `else if` clauses

The body of the `if` expression as well as the bodies of the `else if` and `else` clauses all must consist of zero or more [`use` statements](../aliases.md#use-statements) followed by exactly one expression.
