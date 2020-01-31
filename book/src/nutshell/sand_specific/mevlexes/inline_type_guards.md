# Inline type guards

> This chapter assumes you are already familiar with "basic" (non-inline) type guards.
> If you are not, go read [that chapter](../type_guards.md) first.

## A quick refresher on temporary variables

Recall that the compiler emits temporary variables to store the value of evaluating an expression.

For example, this:

```sand
if let s = getString() {
    doSomething(s);
}
```

...compiles to this:

```java
final String s = getString();
if (s != null) {
    doSomething(s);
}
```

What if you _don't want_ the compiler to emit the temporary variable `s`, and want the following code to be generated:

```java
if (getString() != null) {
    doSomething(getString());
}
```

That's what inline type guards are for!

## Inline null guard `if` statements

Instead of this:

```java
if (pureFunctionReturningString() != null) {
    x += pureFunctionReturningString().length();
}
```

...write this:

```sand
if let inline s = pureFunctionReturningString() {
    x += s.length();
}
```

## Inline null guard `if` expressions

Instead of this:

```java
final String greeting = getName() != null ? getGreeting(getName()) : "Hello unknown user";
```

...write this:

```sand
let greeting = if let inline name = getName() {
    getGreeting(name)
} else {
    "Hello unknown user"
};
```

## Multiple type guards

Instead of this:

```java
if (
    getFirstName() != null &&
    getLastName() != null
) {
    User user = createUser(getFirstName(), getLastName());
}
```

...write this:

```sand
if let
    inline firstName = getFirstName(),
    inline lastName = getLastName()
{
    let user = createUser(firstName, lastName);
}
```

## Why there's no inline `while` statements or expressions

Inline `while` guards would be impractical.
To see why, consider the following:

```sand
while let nonNull = pureExpr {
    // ...
}
```

Note that `pureExpr` is just a placeholder for any pure expression—it doesn't have to literally be a variable named `pureExpr`, or even a variable at all.

Assuming `pureExpr` is indeed pure, then `pureExpr != null` will either always be true or always be false.
Therefore, the loop will either never execute or execute infinitely.
