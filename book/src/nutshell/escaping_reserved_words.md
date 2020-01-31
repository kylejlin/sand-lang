# Escaping reserved words

There may be a situation where you want name an identifier using a word that would be legal in Java, but illegal in Sand (e.g., `copy`).

You can _escape_ the word by prefixing it with `~`.

For example, this:

```sand
pub class Door {
    pub open() {

    }
}
```

...would not compile, because `open` is a reserved word in Sand.
However, this:

```sand
pub class Door {
    // Notice the `~`
    pub ~open() {

    }
}
```

...compiles successfully.
The generated Java would look something like this:

```java
public class Door {
    public final void open() {

    }
}
```
