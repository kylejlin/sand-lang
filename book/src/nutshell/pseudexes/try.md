# Try pseudexes

Instead of this:

```java
final Scanner s;

try {
    s = new Scanner(file);
} catch (IOException e) {
    System.out.println("File not found. Falling back to default.");
    s = fallbackScanner;
}
```

...write this:

```sand
let s = try {
    Scanner(file)
} catch e: IOException {
    System.out.println("File not found. Falling back to default.");
    fallBackScanner
};
```

The bodies of the `try` clause and each `case` clause must end with an expression.

## Using `tryorthrow` to rethrow caught checked exceptions as unchecked exceptions

Sometimes you want to catch a checked exception and throw an unchecked exception.

You could write this:

```sand
let s = try {
    Scanner(file)
} catch e: IOException {
    throw RuntimeException(e)
};
```

...or you could write this as shorthand:

```sand
let s = tryorthrow Scanner(file);
```

> It should be noted that the practice of rethrowing checked exceptions as unchecked exceptions is [generally discouraged by Oracle](https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html).
>
> Sand does not take an official stance on the matter.
