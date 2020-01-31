# Syntax overview

**You don't need to read this chapter.**
It only exists in case you're impatient to get the answers to questions
like _Is this a semicolon language or a semicolonless language?_ before deciding whether you want to invest more time in learning this language.

If you are already committed to learning Sand, or simply don't care very much about such syntax rules, feel free to skip this chapter.

## Semicolons

Required.

```sand
// Illegal
let x = "Hello world"

// Legal
let x = "Hello world";
```

## Whitespace and formatting

The compiler ignores it, so use it as you please.

Four space indentation is encouraged.

```sand
// Good
if foo {
    System.out.println("Hi");
} else {
    System.out.println("Bye");
}

// Also legal, but discouraged
if foo{System.out.println("Hi");}else{System.out.println("Bye");}
```

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
