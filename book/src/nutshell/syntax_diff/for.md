# For statements

## C-style `for` loops

The syntax for "C-style" for loops (`for (int i = 0; i < 10; i++) {}`) is very similar to that of Java.

However, there are two major differences:

- Sand does have increment (`++`) or decrement (`--`) operators
- The syntax of a C-style for loop is `for (statement expression; statement)`, which usually means there are three semicolons instead of two

Instead of this:

```java
for (int i = 0; i < 10; i++) {

}
```

...write this:

```sand
for (let i = 0int; i < 10; i += 1;) {

}
```

Notice the `;` after `i += 1`.

You shouldn't have to use C-style for loops very much, however, since Sand supports [other variants](../sand_specific/for.md) of the for loop that are often cleaner and thus encouraged.

## For-each loops (`for (Type val : iterable)`)

Instead of this:

```java
for (int i : list) {

}
```

...write this:

```sand
for i in list {

}
```
