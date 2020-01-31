# Boolean short circuiting

Using the boolean short circuiting operator (`?`) can often improve the readability of your null checks.

Instead of this:

```java
if (getFather() != null && getFather().getAge() > 35) {

}
```

...write this:

```sand
if getFather()?.getAge() > 35 {

}
```

Instead of this:

```java
if (getCard() != null && isTrump(getCard())) {

}
```

...write this:

```sand
if isTrump(getCard()?) {

}
```

## How the compiler determines where to prepend the null check

> You don't really need to read this section, but if you want a more precise definition of how `?` works, feel free to read on.

Consider the following Sand:

```sand
a(b(c?))
```

Where does the compiler prepend `c != null &&`? That is, does the above code compile to `c != null && a(b(c))`, `a(c != null && b(c))`, or `a(b(c != null && c))`?

It turns out this depends on the types of `a`, `b`, and `c`.

- If `c` is a `Boolean`, the following is generated:
  ```sand
  a(b(c != null && c))
  ```
- If `c` is not a `Boolean` but `b` returns a boolean, the following is generated:
  ```sand
  a(c != null & b(c))
  ```
- If `c` is not a `Boolean` and `b` does not return a boolean but `a` returns a boolean, the following is generated:
  ```sand
  c != null && a(b(c))
  ```
- Else: the code will not compile.

In general, if you write `val?`, the compiler will search for the nearest expression that is a boolean, starting with `val` and moving out to enclosing expressions.
Once it finds the nearest boolean expression, it prepends `val != null &&` to it.

For example, consider the expression `getUser()?.getAge() > 18`.
Assume we have the following code:

```sand
class VotingModel {
    canUserVote(): boolean {
        getUser()?.getAge() > 18
    }

    getUser(): User? { /* ... */ }
}

class User {
    getAge(): int { /* ... */ }
}
```

To figure out where to prepend `getUser() != null &&`, the compiler searches for the nearest boolean expression:

1. Is `getUser()` boolean? No; `getUser()` is of type `User?`.
2. Is `getUser().getAge()` boolean? No; `getUser().getAge()` is of type `int`.
3. Is `getUser().getAge() > 18` of type boolean. Yes! The search is over.

Therefore, when the compiler generates the Java output, `getUser != null &&` is prepended to `getUser().getAge() > 18`, resulting in

```java
private boolean canUserVote() {
    return getUser() != null && getUser().getAge() > 18;
}
```
