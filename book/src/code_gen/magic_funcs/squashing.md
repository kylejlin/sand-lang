# Squashing

Consider the following Sand:

```sand
// --snip--

for s in ["Foo", "Bar", "baz"]
    .map(\s -> s.toLowerCase())
    .filter(\s -> s.startsWith("b"))
    .map(\s -> s.toUpperCase())
    .filter(\s -> s.length() == 3)
{
    System.out.println(s);
}
```

We could compile it to the following Java, using a separate loop for each sequence operation:

```java
// --snip--

ArrayList<String> temp = new ArrayList<>();

for (String s : ["Foo", "Bar", "baz"]) {
    s1.add(s.toLowerCase());
}

ArrayList<String> temp2 = new ArrayList<>();

for (String s : temp) {
    if (s.startsWith(b)) {
        temp2.add(s);
    }
}

ArrayList<String> temp3 = new ArrayList<>();

for (String s : temp2) {
    temp3.add(s.toUpperCase());
}

ArrayList<String> temp4 = new ArrayList<>();

for (String s : temp3) {
    if (s.length() == 3) {
        temp4.add(s);
    }
}

for (String s : temp4) {
    System.out.println(s);
}
```

This works, but it's an eyesore (not to mention inefficient).

If we assume that each of the callbacks passed to `.map` and `.filter` are [pure](../../feature_list/magic_funcs/vocab_defs.md#pure-vs-impure-functions), we can concisely "squash" the operations into a single for loop:

```java
// --snip--

for (String s : ["Foo", "Bar", "baz"]) {
    String s1 = s.toLowerCase();

    if (!s1.startsWith("b")) {
        continue;
    }

    String s2 = s1.toLowerCase();

    if (!s2.length() == 3) {
        continue;
    }

    System.out.println(s2);
}
```

This is what the current Sand compiler does.

## Implications on purity requirements

Since squashing changes the order magic functions are called, the magic functions must be pure, or else behavior might be changed.

For instance, consider the following:

```sand
// --snip--

use System.out.println;

for n in (1..=3)
    .map(\n -> {
        println("Calling map on " + n);
        n * n
    })
    .filter(\n -> {
        println("Calling filter on " + n);
        n % 2 != 0
    })
{
    foo(n);
}
```

You might expect stdout to look like:

```text
Calling map on 1
Calling map on 2
Calling map on 3
Calling filter on 1
Calling filter on 4
Calling filter on 9
```

However, in reality, stdout will probably look like:

```text
Calling map on 1
Calling filter on 1
Calling map on 2
Calling filter on 4
Calling map on 3
Calling filter on 9
```

This is because if Sand peforms operation-squashing, the resulting Java will be:

```java
// --snip--

for (int n = 1; n <= 3; n++) {
    System.out.println("Calling map on " + n);
    int n1 = n * n;

    System.out.println("Calling filter on " + n1);
    if (!(n1 % 2 != 0)) {
        continue;
    }

    foo(n1);
}
```

In short, Sand does not make any guarantee about the order in which magic functions passed to iterable operations will be called, so to avoid unexpected behavior, callbacks must be pure.
