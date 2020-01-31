# Error handling

## Specifying exceptions a method can throw with `throws`

Syntax: same as Java's.

```sand
class Scanner {
    pub next(): String throws NoSuchElementException, IllegalStateException {
        // ...
    }
}
```

Just like in Java, unchecked exceptions (instances of `Error`, `RuntimeException`, and all their subclasses) do not need to be specified in the `throws` clause.

## `throw` pseudexes and the `never` type

In Sand, `throw` is a pseudoexpression instead of a statement.

`throw` pseudoexpressions never evaluate to a value.
As a result, they defined to have the `never` type.

The compiler uses `never` to perform control flow analysis.

For example, consider the following code:

```sand
let age = if scanner.hasNextInt() {
    scanner.nextInt()
} else {
    throw InvalidFileFormatException()
};
```

Normally, each branch of an `if` expression must end with the same type of expression.
Here, the first branch ends with an `int` expression, but the second branch ends with a `never` expression.

`never` is _technically_ not assignable to `int`<sup>\*</sup>, but the compiler knows that a `never` expression will always cause an exception to be thrown, so the above code compiles.

> <sup>\*</sup>...but one could argue `never` is _effectively_ assignable to `int`, or for that matter, any type.

`throw` expressions aren't the only expressions with the `never` type—method invocations can also be of the `never` type.

Simply declare the return type of the method as `never`:

```sand
class App {
    readUsersSelectedFile(user: User): Scanner {
        if let file = getSelectedFile(user) {
            readFile(file)
        } else {
            throwNoFileSelectedException(user)
        }
    }

    throwNoFileSelectedException(user: User): never {
        throw IllegalStateException("{user.getName()} has not selected a file")
    }
}
```
