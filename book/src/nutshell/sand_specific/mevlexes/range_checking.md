# Range checking

Instead of this:

```java
boolean isOnBoard = 0 <= row && row < 8 && 0 <= col && col < 8;
boolean isTeen = 13 <= age && age <= 19;
```

...write this:

```sand
let inOnBoard = row in 0 =.. 8 && col in 0 =.. 8;
let isTeen = age in 13 =.= 19;
```

There are four ranges:

- `...` - exclusive lower bound, exclusive upper bound
- `..=` - exclusive lower bound, inclusive upper bound
- `=..` - inclusive lower bound, exclusive upper bound
- `=.=` - inclusive lower bound, exclusive upper bound

## Ranges are not expressions

_Range checks_ (`val in low ... high`) are expressions, but ranges themselves (`low ... high`) are not, so the following would be illegal:

```sand
let teenRange = 13 =.= 19;
let isTeen = age in teenRange;
```
