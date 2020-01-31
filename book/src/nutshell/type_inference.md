# Type inference

Sand reduces code verbosity by inferring variable declaration types.

Instead of this:

```java
Scanner scanner = new Scanner(file);

String[] arr = new String[] { "Hello", "world" };
```

...write this:

```sand
let scanner = Scanner(file);

let arr = ["Hello", "world"];
```

## Ambiguity

In certain situations, the compiler does not have enough information to infer a declared variable's type.

### Number ambiguity

Consider the following Sand:

```sand
let x = 0;
```

What is the type of `x`?
Is it an...

- `int`?
- `short`?
- `long`?
- `byte`?
- `char`?

There is no way to tell.
Therefore, this code will not compile.

To solve this, you can either use [annotate the number](../feature_list/data/primitives.html#explicit-type-annotation), or annotate annotate the variable declaration:

```sand
// Annotated number
let x = 0int;

// Annotated variable declaration
let y: int = 0;
```

### Null ambiguity

Consider the following Sand:

```sand
let x = null;
```

What is the type of `x`?

Just like we saw with numeric literals, there is no way to tell.
Therefore, this code will not compile.

To solve this, annotate the variable declaration:

```sand
let y: String? = null;
```

Sometimes, you cannot add type annotations, such as when you pass `null` to a method.
In these cases, cast null to the desired type:

```sand
System.out.println(null as Object?);
```

## Not all types are inferred

The compiler only infers the types of two declarations:

1. Local variables.
2. Static properties.

All other declarations (instance properties, method return types, method argument types) must be explicitly annotated.

```sand
// Illegal
pub foo() {
    "Hi"
}

// Legal
pub foo(): String {
    "Hi"
}
```
