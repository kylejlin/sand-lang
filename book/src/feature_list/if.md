# If-else

`if` nodes can be statements or expressions:

```sand
pub class App {
    use System.out.println;

    pub main(args: String[]) {
        // `if` is a statement
        if true {
            println("Hi");
        }

        // `if` is an expression
        let x = if true {
            1
        } else {
            0
        };
    }
}
```

`if` nodes do not require parentheses around their condition, but do require curly braces around their body.

`if` nodes can have zero or more `else if` clauses.

`if` nodes can have at most one `else` clause.

`if` expressions must have exactly one `else` clause.
