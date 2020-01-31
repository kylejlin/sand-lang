# Anonymous inner classes

Instead of this:

```java
EventHandler<MouseEvent> onClick = new EventHandler<MouseEvent>() {
    private String message = getMessage();

    @Override
    public void handle() {
        printMessage();
    }

    private void printMessage() {
        System.out.println(message);
    }
}
```

...write this:

```sand
let onClick = new EventHandler<MouseEvent> {
    message = getMessage();

    override handle() {
        printMessage();
    }

    printMessage() {
        System.out.println(message);
    }
}
```

Notice the lack of parentheses after `new EventHandler<MouseEvent>`.

## Anonymous inner class restrictions

In addition to sharing Java's restrictions on anonymous inner classes, Sand imposes some of its own.
Here are all the restrictions on anonymous inner classes in Sand:

- Inner classes cannot have static methods or properties
- Inner classes cannot have constructors
- Inner classes must `override` every abstract method
- Inner classes cannot use visibility modifiers
  - All overriden methods have minimum visibility required by the abstract method declaration
  - All others methods and all properties are private
- Inner classes can only access local variables if they are final (i.e., declared with `let`)
