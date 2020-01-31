# Aliases

## `use` statements

Use statements alias a _target_ reference with an _alias_ reference (usually with a shorter name).
You can then use the alias reference to refer to the target reference.

### With explicit alias

Syntax: `use target as alias;`

For example, this:

```sand
use System.out.println as p;

pub class App {
    pub static main(args: String[]) {
        p("Hi");
    }
}
```

...compile to this:

```java
public class App {
    public static void main(String[] args) {
        System.out.println("Hi");
    }
}
```

### With implicit alias

Syntax: `use target;`

The alias is named after the identifier after the last `.` (e.g., `use System.out.println;` is equivalent to `use System.out.println as println;`).

For example, this:

```sand
use System.out.println;

pub class App {
    pub static main(args: String[]) {
        println("Hi");
    }
}
```

...compile to this:

```java
public class App {
    public static void main(String[] args) {
        System.out.println("Hi");
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

Same as Java.

## `use` vs `import`

### `use` aliases are "invisible"

For example, this:

```sand
use java.util.ArrayList;

// ...

pub addFoo(list: ArrayList<String>) {
    list.add("foo");
}
```

...compiles to this:

```java
public void addFoo(java.util.ArrayList<String> list) {
    list.add("foo");
}
```

Alias references are replaced with target references (i.e., the compiler emits `addFoo(java.util.ArrayList<String> list)`, not `addFoo(ArrayList<String> list)`).

### `import` aliases appear in the generated Java

For example, this:

```sand
import java.util.ArrayList;

// ...

pub addFoo(list: ArrayList<String>) {
    list.add("foo");
}
```

...compiles to this:

```java
import java.util.ArrayList;

// ...

public void addFoo(ArrayList<String> list) {
    list.add("foo");
}
```

Notice:

1. `import java.util.ArrayList` is emitted in the generated Java file.
2. Alias references are not replaced with target references (i.e., the compiler emits `addFoo(ArrayList<String> list)`, not `addFoo(java.util.ArrayList<String> list)`).
