# List literals

## Array literals

Just like in Java, you can describe an array of type `T` by writing `T[]`.

You can create an array using a sequence of zero or more comma-separated expressions enclosed in square brackets.

For example:

```sand
// --snip--

foo() {
    let x: int[] = [1, 2, 3];
}
```

You can also prepend `T` to allow for type inference:

```sand
let x = int [1, 2, 3];
```

## Resizable list literals

In Sand, you can describe a resizable list of type `T` by writing `T[*]`. Currently, resizable lists are implemented by `java.util.ArrayList`, but at some point in the future you may be able to configure this.

You can create a resizable list by creating an array and then using the `~` operator to convert the array to a resizable list.

For example:

```sand
// --snip--

foo() {
    let x: String[*] = ~["foo", "baz", "bar"];
}
```

compiles to

```java
import java.util.ArrayList;

// --snip--

private static void foo(ArrayList<String> x) {
    String[] x_ = {"foo", "baz", "bar"};
    ArrayList<String> x = new ArrayList<>(x_.length);
    for (String elem : x_) {
        x.add(elem);
    }
}
```

This feature (resizable lists) was added because a lot of my projects made extensive use of resizable lists (I chose `ArrayList` as my implementation), but `ArrayList<T>` was significantly much more to type than `T[]`, so this allows you to enjoy the best of both worlds (i.e., resizability and brevity).
