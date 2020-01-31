# Custom comparisons

Java provides `Object.equals()` and `Comparable.compareTo()` to compare objects, but invoking these methods is often syntactically verbose.

## Equality

Instead of this:

```java
if (a.equals(b) || !c.equals(d)) {

}
```

...write this:

```sand
if a ~= b || c !~= d {

}
```

There are 2 custom equality operators:

- `~=` - compiles to `a.equals(b)`
- `!~=` - compiles to `!a.equals(b)`

## Inequality

Instead of this:

```java
if (a.compareTo(b) > 0 || c.compareTo(d) <= 0) {

}
```

...write this:

```sand
if a ~> b || c ~<= d {

}
```

There are 4 custom inequality operators:

- `~<` - compiles to `a.compareTo(b) < 0`
- `~<=` - compiles to `a.compareTo(b) <= 0`
- `~>` - compiles to `a.compareTo(b) > 0`
- `~>=` - compiles to `a.compareTo(b) >= 0`
