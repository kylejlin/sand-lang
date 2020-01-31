# Repeating fill pseudexes

Repeating fill pseudexes create an array or list that is populated by repeatedly evaluating an expression (called the _fill value_) a specified number of times (called the _repetition quantity_).

## Arrays

Instead of this:

```java
String[] sevenFoos = new String[7];
for (int i = 0; i < sevenFoos.length; i++) {
    sevenFoos[i] = "foo";
}
```

...write this:

```sand
let sevenFoos = ["foo"; 7];
```

Note how you must explicitly specify the value to fill with, as opposed to Java, where number, boolean, and object arrays are implicitly filled with `0`, `false`, and `null`, respectively.
The advantage of doing this is you can choose the value to fill with, instead of being forced to accept `0`, `false`, or `null`.

### Repeating a constant number of times

You might be wondering why repeating array fills are *pseudo*expressions.
After all, can't `["foo"; 3]` just be compiled to the Java expression `new String[] { "foo", "foo", "foo" }`.

Well, it can, but _only if the repetition quantity is known at compile time_ (i.e., if the repetition quantity is a constant).
For example, what Java expression would `["foo"; n]` compile to?

If the repetition quantity is constant, than you can use [repeating array fill expressions](../../sand_specific/repeating_array_fill_expressions.md) (as opposed to repeating array fill *pseudo*expressions, which is this the focus of this chapter).

### Higher dimensional arrays

Instead of this:

```java
String[][] fiveBySixFoos = new String[5][6];
for (String[] sixFoos : fiveBySixFoos) {
    for (int i = 0; i < sixFoos.length; i++) {
        sixFoos[i] = "foo";
    }
}
```

...write this:

```sand
let fiveBySixFoos = ["foo"; 5, 6];
```

## `ArrayList`s

Instead of this:

```java
ArrayList<String> tenFoos = new ArrayList<>();
for (int i = 0; i < 10; i++) {
    list.add("foo");
}
```

...write this:

```sand
let list = +["foo"; 10];
```
