# Aliases

## `use` statements

The generated code will have no trace of `use` statements.

That is, Java generated from Sand written with `use` statements will be identical to the same Sand written without `use` statements.

For example:

```sand
pub class App {
    use System.out.println;

    pub main(args: String[]) {
        println("Hello world");
    }
}
```

and

```sand
pub class App {
    pub main(args: String[]) {
        System.out.println("Hello world");
    }
}
```

both result in

```java
public class App {
    public static void main(String[] args) {
        System.out.println("Hello world");
    }
}
```

## `import` statements

Import statements are emitted as-is.
