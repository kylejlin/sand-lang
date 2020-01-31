# Switch pseudexes

Switch pseudexes are similar to [switch statements](../syntax_diff/switch.md) except that each body must end with an expression.

Example:

```sand
let isAlive = switch liveNeighbors {
    case 0 | 1 {
        System.out.println("A cell died of underpopulation");
        false
    }
    case 2 {
        wasAlive
    }
    case 3 {
        true
    }
    else {
        System.out.println("A cell died of overpopulation");
        false
    }
};
```
