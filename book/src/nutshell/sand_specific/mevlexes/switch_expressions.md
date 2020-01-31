# Switch expressions

As a shorthand for this:

```sand
let isAlive = if liveNeighbors == 0 || lifeNeighbors == 1 {
    false
} else if liveNeighbors == 2 {
    wasAlive
} else if liveNeighbors == 3 {
    true
} else {
    false
};
```

...you can write this:

```sand
let isAlive = switch liveNeighbors {
    case 0 | 1 {
        false
    }
    case 2 {
        wasAlive
    }
    case 3 {
        true
    }
    else {
        false
    }
};
```

...which roughly compiles to this:

```java
final boolean isAlive = liveNeighbors == 0 || liveNeighbors == 1
    ? false
    : liveNeighbors == 2
    ? wasAlive
    : liveNeighbors == 3
    ? true
    : false
    ;
```

A `switch` expression must have exactly one `else` clause.

Each body of a `case` clause as well as the body of the `else` clause must consist of zero or more [`use` statements](../../aliases.md#use-statements) followed by exactly one expression.
