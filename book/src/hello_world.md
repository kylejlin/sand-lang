# Hello World

Let's get started by printing "Hello world!" to the console.

Create a file called `HelloWorld.sand`:

```sand
pub class HelloWorld {
    use System.out.println;

    pub static main(args: String[]) {
        println("Hello world!");
    }
}
```

Not much should surprise you.
This class has the typical `main` method signature you've seen hundreds of times, which serves as an entry point for the program.
Methods are static by default in Sand, and return types default to `void`, so instead of Java's `public static void main`, you simply write `pub main`.

## Computing factorials

Let's compute factorials to introduce you to some more Sand concepts.

```sand
pub class HelloWorld {
    // --snip--

    pub main(args: String[]) {
        // --snip--
        println("5! = " factorial(5));

    }

    factorial(n: int): int {
        re product = 1;

        while n > 1 {
            product *= n;
            n -= 1;
        }

        return n;
    }
}
```

`re` is short for "reassignable."
By default, variables in Sand are final (non-reassignable), so you have to explicitly use the `re` keyword if you want to make a variable reassignable.

Sand does not support increment or decrement operators, so you must write `n -= 1` instead of `n--`.

## Expressions and statements

Similar to Rust, Sand distinguishes between statement nodes and expression nodes, or simply statements and expressions.
The difference between the two is that expressions have a value, while statements do not.

For example, a `return` node is a statement, because it does not have a value. To illustrate this, consider the following question: If you wrote `let x = return 8;;`, would be the value of `x`? The question doesn't make sense, because `return 8;` does not have a value.

On the other hand, an addition node is an expression, because it does have value. If you wrote `let x = 2 + 2;`, what would be the value of `x`? `4`. The node `2 + 2` does have a value, so it is therefore an expression.

Some nodes can be expressions in some circumstances and statements in others.
One example of this is the function call node, in the following, `foo();` has no value, so it is a statement.

```sand
example() {
    foo();
}
```

On the other hand, in the next example, `foo()` does have a value (which is being assigned to `x`).

```sand
example() {
    let x = foo();
}
```

Generally, statements end with semicolons and expressions do not.

There are two exceptions:

1. `if-else` nodes
2. Method bodies.
   The exception is nodes method declarations.
   These nodes are expressions if their last node is an expression, and a statement if their last node is a statement.

For instance, the `if` in the following code is a statement:

```sand
reportWeather(raining: boolean) {
    re message = "";

    if raining {
        message = "It's raining.";
    } else {
        message = "It's sunny.";
    }

    myLogger.log(message);
    System.out.println(message);
}
```

The `if`'s body ends with an assignment (`message = "It's raining";`), which is a statement, so it is therefore a statement itself.

On the other hand:

```sand
sign(n: int) {
    let x = if baz {
        0
    } else {
        1
    };
}
```

The bodies end with `0` and `1`, respectively, which are both expressions.
Therefore, the `if-else` node is an expression.

With your new knowledge of expressions, you can replace the `return n;` with `n`:

```sand
factorial(n: int): int {
    re product = 1;

    while n > 1 {
        product *= n;
        n -= 1;
    }

    n
}
```

In fact, using recursion, you could rewrite this as:

```sand
factorial(n: int): int {
    if n == 0 {
        1
    } else {
        n * factorial(n - 1)
    }
}
```
