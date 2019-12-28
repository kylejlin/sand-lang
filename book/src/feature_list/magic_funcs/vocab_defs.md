# Preliminary definitions

Before you continue reading, we'll need to define a few terms.

## Undefined behavior

_Undefined behavior_ means anything can happen.
It typically results from using an unchecked inline function an neglecting to perform the checks yourself.
If something results in undefined behavior, all bets are off—any guarantees Sand made about the behavior of your program are now void.

Undefined behavior might mean an exception is thrown.

Even worse, it might mean an exception is not thrown.

When undefined behavior ensues, if values that should be `int`s are now `String`s, don't blame us.

Undefined behavior will likely vary with each implementation of Sand.

In short, undefined behavior should be avoided at all costs.

## Pure vs. impure functions

A function is pure if and only if satisfies all of the following:

- The function does not have any side effects (such as writing to stdout, modifying a file, sending a network request).
- The function will always return the same output for the same inputs.

For example, suppose we had

```sand
pub class App {
    pub main(args: String[]) {
        System.out.println("Hello world");
    }

    factorial(n: int): int {
        if n == 0 {
            1
        } else {
            n * factorial(n - 1)
        }
    }

    flipCoin(): String {
        if Math.random() > 0.5 {
            "Heads"
        } else {
            "Tails"
        }
    }
}
```

In the above example, `main` is not pure because it has a side effect (`System.out.println`).

`flipCoin` is also not pure because it does not consistently return the same output for the same (empty) set of inputs.
That is, `flipCoin() == flipCoin()` is not guaranteed to be true.

`factorial` is pure, because it does not have any side effects and `factorial(n) == factorial(n)` will always be true for any `n` no matter how many times you test it.
