# Switch statements

Instead of this:

```java
boolean isAlive;

switch (liveNeighbors) {
    case 0:
    case 1:
        isAlive = false;
        break;
    case 2:
        isAlive = wasAlive;
        break;
    case 3:
        isAlive = true;
        break
    default:
        isAlive = false;
        break;
}
```

...write this:

```sand
re isAlive = false;

switch liveNeighbors {
    case 0 | 1 {
        isAlive = false;
    }
    case 2 {
        isAlive = wasAlive;
    }
    case 3 {
        isAlive = true;
    }
    else {
        isAlive = false;
    }
}
```

Notice:

- No explicit `break;`: Each `case` clause automatically breaks out of the switch statement at the end of its body, so there is no need to explicitly write `break;`.
- To handle multiple cases with the same body of code, you can separate the values with a `|` (e.g., `case 0 | 1`).
- `else` is used instead of `default`
