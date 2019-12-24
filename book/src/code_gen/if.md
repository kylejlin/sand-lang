# If-else

`if` expressions generate Java that uses ternary expressions when possible, falling back to deferred intialization when ternary expressions are not sufficient.

For example:

```sand
// --snip--

use System.out.println;

foo() {
    let x = if bar {
        1
    } else {
        0
    };

    let y: int = if bar {
        println("Hi");
        1
    } else {
        0
    };
}
```

results in

```java
// --snip--

private void foo() {
    int x = bar ? 1 : 0;

    int y;

    if (bar) {
        System.out.println("Hi");
        y = 1;
    } else {
        y = 0;
    }
}
```

You can customize this behavior with `sandConfig.ifExprOutput`.

Setting `ifExprOutput` to `"ALWAYS_DEFERRED"` will force the compiler to always generate code using deferred initialization.

Setting `ifExprOutput` to `"TERNARY_WHEN_SIMPLE"` will force the compiler to choose ternary expressions over deferred initialization if and only if the Sand expression is an `if` expression with zero `else-if` clauses and the bodies of the `if` clause and the `else` clause each have exactly one non-if expression.

The default value of `ifExprOutput` is `"TERNARY_WHEN_POSSIBLE"` which causes the compiler to choose ternary expressions when possible.
