# Null guard pseudexes

Instead of this:

```java
final String name;
final String n = getName();
if (n != null) {
    System.out.println("User is named " + n);
    name = n;
} else {
    System.out.println("User has no real name");
    name = "John Doe";
}
```

...write this:

```sand
let name = if let n = getName() {
    System.out.println("User is named {n}");
    n
} else {
    System.out.println("User has no real name");
    "John Doe"
};
```

## Inline null guard pseudexes

> **Note:** Inline null guard pseudexes are also [mevlexes](../sand_specific/mevlexes/intro.md)
>
> A null guard expression has one critical operand: the expression that may equal null.

Instead of this:

```java
final String name;
if (getName() != null) {
    System.out.println("User is named " + getName());
    name = getName();
} else {
    System.out.println("User has no real name");
    name = "John Doe";
}
```

...write this:

```sand
let name = if let inline n = getName() {
    System.out.println("User is named {n}");
    n
} else {
    System.out.println("User has no real name");
    "John Doe"
};
```
