# Error handling

You can wrap code in `try` blocks, and then catch exceptions thrown in them in `catch` blocks.

For example:

```sand
try {
    let x = "hi".charAt(5);
} catch (e: IndexOutOfBoundsException) {
    System.out.println("An exception has been caught");
    log(e);
}
```

In the above code, `String.charAt()` throws an `IndexOutOfBoundsException`.
The `catch` block catches the exception, storing it in the non-reassignable variable `e`, and executes the code in its body (which prints `An exception has been caught` and passes the exception to the `log` method).

## Multiple catches

You can put multiple `catch` blocks after a `try` to handle different types of exceptions.

For example:

```sand
try {
    // ...
} catch (e: IndexOutOfBoundsException) {
    System.out.println("An index out of bounds exception was caught");
} catch (e: ArithmeticException) {
    System.out.println("An arithmetic exception was caught");
}
```

## Catch binding omission

If you don't need to reference the exception that got thrown, you can omit the binding.
This bindingless `catch` block will catch anything that is thrown.

For example:

```sand
try {
    // ...
} catch {
    // Catches anything, regardless of type
}
```
