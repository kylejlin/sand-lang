# Ranges

Ranges are sequences of integers.

Ranges are written `start..exclusiveEnd` or `start..=inclusiveEnd`.
In both cases, the lower bound is inclusive.

Example:

```sand
// --snip--

use System.out.println;

// Prints 0 to 9
for i in 0..10 {
    println(i);
}

// Prints 0 to 10
for i in 0..=10 {
    println(i);
}
```

Ranges are [magic](./magic.md), so you cannot store them in a variable or property or return them from a method.
