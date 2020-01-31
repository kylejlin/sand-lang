# Pseudoexpressions (pseudexes)

> ## TL;DR
>
> Pseudexes are basically expressions that can only be used in certain contexts, such as variable declarations.
>
> Pseudexes are not technically expressions (which is why their called *pseudo*expressions), but they are often effectively the same.

> **Pronunciation**
>
> - "Pseudex" is pronounced "sue-decks".
> - "Pseudexes" is pronounced "sue-decks-sizz"
> - "STR" is pronounced "sooter", rhyming with "footer"
> - "MTR" is pronounced "mooter", also rhyming with "footer"

As a quick refresher, most constructs in the Sand programming language are either _expressions_, which evaluate to a value, or _statements_, which do not evaluate to a value.

Every expression in Sand can be represented by a corresponding expression in Java.
For example, `if a { b } else { c }` is a Sand expression because it can be represented by `a ? b : c` in Java.

A _pseudoexpression_ (or _pseudex_ for short) is a Sand construct that, similar to an expression, evaluates to a value, but unlike an expression, cannot be represented by a single Java expression.

For example, the `+["foo"; 8]` is a pseudoexpression (representing an `ArrayList` containing eight `"foo"`s), because there is no Java expression to create and return an `ArrayList` of 8 `"foo"`s.

As a result, the compiler has to use multiple Java expressions and/or statements to represent the value and behavior represented by such a pseudoexpression.

For example, consider the following code:

```sand
let eightFoos = +["foo"; 8];
```

The above code creates a variable `eightFoos` that points to an `ArrayList` containing eight `"foo"`s.

To achieve the same result in Java, we would need to write this:

```java
ArrayList<String> eightFoos = new ArrayList<>();
for (int i = 0; i < 8; i++) {
  eightFoos.add("foo");
}
```

As you can see, it takes multiple expressions and statements to achieve the same result in Java.

Notice how the variable `eightFoos` was referred to in the for loop.

This means if we tried to write this:

```sand
pub getEightFoos(): String[+] {
  +["foo"; 8]
}
```

...we would have no way of representing that in Java without using a temporary variable to store the returned `ArrayList`.
The compiler would not know what to name that variable.
For this reason, you cannot use list fill pseudexes (i.e., constructs of the form `+[val; quantity]`) in a return statement.

In short, pseudexes can only be used in certain places, such as in a return statement.

The set of all pseudexes can be partitioned into two subsets:

- _Single target reference_ (STR) pseudexes
- _Multiple target reference_ (MTR) pseudexes

Each subset of pseudexes has its own rules for where pseudexes of that subset are permitted to be used.

## STR pseudexes

> Pronounced "sooter<sup>\*</sup> sue-decks-sizz"
>
> <sup>\*</sup>rhymes with "footer"

There are five STR pseudexes:

- [`if` pseudexes](./if.md)
- [`switch` pseudexes](./switch.md)
- [`try` pseudexes](./try.md)
- [`~~` (`try` shorthand syntax) pseudexes](./try.md#using--to-rethrow-caught-checked-exceptions-as-unchecked-exceptions)
- [Null guard pseudexes](./null_guard.md)
- [`throw` pseudexes](./throw.md)

For any STR pseudoexpression `v`, `v` is allowed in the following locations:

- The end of a method body (implicit return):
  ```sand
  class MyClass {
      myMethod() {
          v
      }
  }
  ```
- The end of another pseudex body:
  ```sand
  let x = if cond {
      System.out.println("This was printed by a method invocation statement.");
      v
  } else {
      otherValue
  };
  ```
- Return statements:
  ```sand
  return v;
  ```
- Throw statements:
  ```sand
  return v;
  ```
- Variable declarations:
  ```sand
  let myVar = v;
  ```
- Variable assignments:
  ```sand
  myVar = v;
  ```

## MTR pseudexes

> Pronounced "mooter<sup>\*</sup> sue-decks-sizz"
>
> <sup>\*</sup>rhymes with "footer"

There are four MTR pseudoexpressions:

- A [repeating array fill pseudoex](./fill/repeating.md#arrays)
- A list fill expression (including [repeating](./fill/repeating.md#arraylists) and [sequential](./fill/sequential.md#arraylists) fills)
- An [array or list comprehension](./comprehensions.md)

For any MTR pseudoexpression `v`, `v` is allowed in the following locations:

- Variable declarations:
  ```sand
  let myVar = v;
  ```
- Variable assignments:
  ```sand
  myVar = v;
  ```
