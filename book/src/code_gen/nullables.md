# Explicit nullables

Since types are always nullable in Java, both non-nullable and nullable Sand types produce the same Java.

For example, this:

```sand
// --snip--

foo(x: String?) {
    System.out.println(x);
}
```

and this:

```sand
// --snip--

foo(x: String) {
    System.out.println(x);
}
```

both produce this:

```java
// --snip

private static void foo(String x) {
    System.out.println(x);
}
```
