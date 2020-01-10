# Magic values

Some values in Sand have no representation in Java.
Those values are referred to as "magic."

Since these values have no Java representation, they cannot be stored in variables or properties and they cannot be returned by methods or passed as arguments into methods.

Additionally, magic values cannot be operands to non-magic expressions, such as `if` expressions.
Unlike the above restriction, this restriction is not intrinsic to magic values, but specific to the current Sand compiler.
Future versions of the compiler may support this.

## Examples

### Ranges

[Ranges](./data.md#ranges) are a magic values.

So the following is valid Sand:

```sand
// --snip--

for i in 0..10 {
    foo(i);
}
```

which compiles to the following Java:

```java
// --snip--

for (int i = 0; i < 10; i++) {
    foo(i);
}
```

However, the following is illegal:

```sand
// --snip--

let x = 0..10;
```

Since ranges have no runtime representation, the compiler does not know how to generate Java for this, and it is therefore illegal.

### Magic sequences

Some [magic functions](./magic_funcs/intro.md) return magic sequences.

For example, the following is valid Sand:

```sand
// --snip--

for s in ["foo", "baz", "bar"]
    .filter(\s -> s.startsWith("b"))
    .map(\s -> s.toUpperCase())
{
    System.out.println(s);
}
```

which compiles to the following Java:

```java
// --snip--

for (String s : ["foo", "baz", "bar"]) {
    if (!s.startsWith("b")) {
        continue;
    }

    String s1 = s.toUpperCase();

    System.out.println(s1);
}
```

However, the following is illegal:

```sand
// --snip--

let x = ["foo", "baz", "bar"]
    .filter(\s -> s.startsWith("b"))
    .map(\s -> s.toUpperCase());
```

Since magic sequences have no runtime representation, the compiler does not know how to generate Java for this, and it is therefore illegal.

To store the elements of the magic sequence in a variable, convert it to a non-magic value, such as a resizable list.

For example, use `iterable.rList()`:

```sand
// --snip--

let x = ["foo", "baz", "bar"]
    .filter(\s -> s.startsWith("b"))
    .map(\s -> s.toUpperCase())
    .rList();
```

This would compile to:

```java
// --snip--

ArrayList<String> x = new ArrayList<>();

for (String s : ["foo", "baz", "bar"]) {
    if (!s.startsWith("b")) {
        continue;
    }

    String s1 = s.toUpperCase();

    x.add(s1);
}
```
