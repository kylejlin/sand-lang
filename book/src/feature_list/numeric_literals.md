# Typed numeric literals

Sometimes the compiler cannot infer the type of a variable.

For example, consider the following:

```sand
let x = 42;
```

What is the type of `x`?
It could be an `int`, `short`, `long`, or `char`.

Since the compiler does not know the type of `x`, the above code will not compile.

There are two ways to fix this:

- [Adding type annotations ](./local_vars.md#type-annotation)
- Typed numeric literals

## Adding type annotations

If you forgot about explicit type annotations, refer to the chapter on [local variables](./local_vars.md#type-annotation).

## Typed numeric literals

Primitive types can be appended to numeric literals to explicitly give them a type.
For example:

```sand
let x = 42int;
```

Now `x` is unambiguously an `int`.
