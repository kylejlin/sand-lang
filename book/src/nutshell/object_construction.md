# Object construction

## Writing constructors

Instead of this:

```java
public class Dog {
    private String name;

    public Dog(String name) {
        this.name = name;
    }
}
```

...write this:

```sand
pub class Dog {
    name: String;

    pub new(name: String) {
        this.name = name;
    }
}
```

## Default constructors

Unlike Java, classes do not have a no-op constructor implicitly generated for them if none are explicilty declared.
Instead, you _must_ declare at least explicit constructor.

## Shorthand syntax

In Java, you probably find yourself frequently writing constructors that initialize every field with a provided argument.

In Sand, you can use `<optional modifier> new;` as shorthand for creating one of those constructors that initializes every field.

Instead of this:

```java
public class Dog {
    private int age;
    private String name;

    public Dog(int age, String name) {
        this.age = age;
        this.name = name;
    }
}
```

...write this:

```sand
pub class Dog {
    age: int;
    name: String;

    pub new;
}
```

## Invoking constructors

Don't use the `new` keyword.

Instead of this:

```java
Dog spot = new Dog(2, "Spot");
```

...write this:

```sand
let spot = Dog(2, "Spot");
```

### Named constructor arguments

You can also used the named syntax.

Instead of this:

```java
Dog spot = new Dog(2, "Spot");
```

...write this:

```sand
let spot = Dog(age: 2, name: "Spot");
```

The argument names in the constructor invocation must match the argument names in the constructor declaration.
