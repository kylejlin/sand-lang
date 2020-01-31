# If pseudexes

Instead of this:

```java
int x;

if (cond1) {
    doStuff();
    x = foo();
} else if (cond2) {
    doOtherStuff();
    x = bar();
} else {
    x = baz;
}
```

...write this:

```sand
let x = if cond1 {
    doStuff();
    foo()
} else if cond2 {
    doOtherStuff();
    bar()
} else {
    baz
}
```
