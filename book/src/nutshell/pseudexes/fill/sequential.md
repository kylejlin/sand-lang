# Sequential fills

Sequential fill pseudexes fill an array or list with the sequence of values that you specify.

## Arrays

Instead of this:

```java
String[] arr = { "Hello", "great", "big", "world" };
```

...write this:

```sand
let arr = ["Hello", "great", "big", "world"];
```

## `ArrayList`s

Instead of this:

```java
ArrayList<String> list = new ArrayList<>();
list.add("Hello");
list.add("great");
list.add("big");
list.add("world.");
```

...write this:

```sand
let list = +["Hello", "great", "big", "world"];
```
