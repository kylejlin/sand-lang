# Error handling

## Try statements

Instead of this:

```java
try {

} catch (IOException e) {

} catch (FooException | BarException e) {

}
```

...write this:

```sand
try {

} catch e: IOException {

} catch e: FooException | BarException {

}
```

Formal catch parameters are always non-reassignable (i.e., you cannot write `catch var e:` instead of `catch e:`).

### No `finally` clause

Sand does not support `finally`.

## Other constructs

The syntax of other constructs (such as `throw` and `throws`) is pretty much the same as Java's.

For more details on `throw` and `throws`, read the chapter dedicated to [Error handling](../error_handling.md).
