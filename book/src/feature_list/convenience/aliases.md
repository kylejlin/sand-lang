# Aliases

## `use` statements

`use` statements tell Sand to replace all references to one reference with a reference to another at compile time.

You can write `use Foo as Bar;` in a class or method body or at the top of a file. This will make all references to `Bar` be replaced by references to `Foo` at compile time.

For example:

```sand
class TyrannosaurusRex {
    pub weight: int;
    pub inst;
}

pub class App {
    use TyrannosaurusRex as TRex;

    pub main(args: String[]) {
        let dino = TRex { weight: 500 };
    }
}
```

`use` statements must appear at the top of the block they are in, or at the top of a file (beneath the `package` statement if there is one, and beneath the `import` statements if there are any).

### `as` omission

You can omit the `as` portion of a `use` statement if the lefthand value contains one or more `.`s.

`use a.b.c;` is equivalent to `use a.b.c as c;`.

For example:

```sand
pub class App {
    use System.out.println;
    // equivalent to `use System.out.println as println;`

    pub main(args: String[]) {
        println("Hello world");
    }
}
```

### Shadowing with `use!`

By default, you cannot create an alias with the same name as another reference with the same name.

You can do this by writing `use!` in place of `use`:

```
class ArrayList<T> {

}

class App {
    // Illegal
    use java.util.ArrayList;

    // Legal
    use! java.util.ArrayList;
}
```

## `import` statements

Sometimes, you don't want a blind search-and-replace.
For example, if you wrote `use java.util.ArrayList;`, then the generated Java will be littered with `java.util.ArrayList`.

You can use an `import` statement to tell Sand to generate a Java `import` statement and leave references as-is.

Import statements must occur at the top of a file (beneath the `package` statement if there is one).

Example:

```sand
import java.util.ArrayList;

pub class App {
    // ...
}
```

`import` statements cannot shadow.
