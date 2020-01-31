# Local variables

You can declare local variables with `let`:

```sand
pub class App {
    pub main(args: String[]) {
        let x = "Hello world";
        System.out.println(x);
    }
}
```

## Scoping

Variables are scoped to the set of curly braces (`{}`) they are declared within.

Hence, the following is illegal:

```sand
pub class App {
    pub main(args: String[]) {
        if true {
            let x = "Hello world";
        } // x goes out of scope here
        System.out.println(x);
    }
}
```

Since methods, `if`, `while`, `loop`, `repeat`, and `for` nodes all have braces, they all have their own variable scopes.

## Reassignability

Variables are non-reassignable by default.
You can make them assignable by declaring them with `re` (short for "reassignable"):

```sand
pub class App {
    pub main(args: String[]) {
        let x = "Hello world";

        // Illegal - x is not reassignable
        x = "Hi";

        re y = "Hello world";

        // Legal - y is reassignable
        y = "Hi";

        System.out.println(y);
    }
}
```

## Shadowing

By default, you cannot declare a variable that "shadows" another variable.
That is, you cannot declare a variable that has the same name as another variable currently in scope.
To shadow a variable, use `let!` or `re!`:

```sand
pub class App {
    pub main(args: String[]) {
        let x = "Hello world";

        // Illegal
        let x = "Hello world";

        // Legal
        let! x = "Hello world";

        System.out.println(x);
    }
}
```

## Type annotation

Variable types are inferred from their initial value when possible.

However, type inference is not always possible.

For example, integer literals could be multiple types (e.g., `int`, `short`, `long`) and float literals could also be multiple types (e.g., `float`, `double`).

To fix this, explicitly annotate a variable's type:

```sand
// --snip--

foo() {
    let x: int = 42;
}
```
