# Do

`do` nodes execute a series of nodes, evaluating to the value of the last node.

Like `if`, `while`, `loop`, `repeat`, `for`, and other nodes with compound node bodies, `do` nodes create a new scope.

For example, consider the following code:

```sand
pub main(args: String[]) {
    let y = do {
        let x: String[+] = ~[];
        x.add("foo");
        x.add("bar");
        x.add("baz);
        x
    };

    x // Error: x is not defined
}
```

In the above code:

1. The `do` node creates a new scope.
2. A variable `x` is declared in that scope.
3. `x` is mutated (i.e., values are added to `x`).
4. The `do` node evaluates to the value of its last node (`x`).
5. Therefore, `y` is assigned that value.
6. `x` cannot be used outside the `do` node because it is scoped to the `do` node.

As previously stated, `do` nodes evaluate to the value of their last node.
Thus, if a `do` node ends with a statement, the node is a statement.
Likewise, if a `do` node ends with an expression, the node is an expression.
