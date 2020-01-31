# If-else

## Parentheses and curly braces

Curly braces are required.
Parentheses are discouraged.

```sand
// Illegal - missing curly braces
if (foo)
    System.out.println("Hi");

// Good
if foo {
    System.out.println("Hi");
}

// Also legal, but parentheses are discouraged
if (foo) {
    System.out.println("Hi");
}
```

## Else and else-if

```sand
if cond1 {
    System.out.println("cond1 is true");
} else {
    System.out.println("cond1 is false");
}

if cond1 {
    System.out.println("cond1 is true");
} else if cond2 {
    System.out.println("cond1 is false but cond2 is true");
}

if cond1 {
    System.out.println("cond1 is true");
} else if cond2 {
    System.out.println("cond1 is false but cond2 is true");
} else {
    System.out.println("cond1 is false and cond2 is also false");
}
```

## If-else as an expression

An if-else node can be an expression if each clause has exactly one node it its body and each of those nodes is an expression.

```sand
let greeting = if leaving {
    "Bye"
} else if seenThemBefore {
    "Hello again"
} else {
    "Hello, nice to meet you"
};
```

Each clause can only have one node.
For example, the following is illegal:

```sand
let greeting = if leaving {
    // Illegal - this clause's body has 2 nodes

    peopleWhoLeft += 1;
    "Bye"
} else if seenThemBefore {
    "Hello again"
} else {
    "Hello, nice to meet you"
};
```

Sand does **not** support Java's `cond ? trueVal : falseVal` syntax, so you must use the `if` expression syntax instead.
