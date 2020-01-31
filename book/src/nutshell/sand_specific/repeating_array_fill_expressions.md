# Repeating array fill expressions

> Not to be confused with [repeated array fill *pseudo*expressions](../pseudexes/fill/repeating.md#arrays)

Similar to their pseudoexpression counterparts, repeating array fill expressions create an array by repeatedly evaluating an expression (called the _fill value_) a constant number of times (called the _repetition quantity_).

Instead of this:

```java
double[] fiveRandomNumbers = {
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random()
};
```

...write this:

```sand
let fiveRandomNumbers = [Math.random(); static 5];
```

The repetition quantity must be a constant.
For example `["foo"; static n]` is illegal.
