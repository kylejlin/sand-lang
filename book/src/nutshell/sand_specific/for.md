# Improved for loops

## Index iteration

Instead of this:

```java
for (int i = 0; i < list.size(); i++) {

}
```

...write this:

```sand
for @i in list {

}
```

## Iterating over characters in a string

Instead of this:

```java
for (int i = 0; i < str.length(); i++) {
    char c = str.charAt(i);
}
```

...write this:

```sand
for c in str {

}
```

## Index and value iteration

Instead of this:

```java
for (int i = 0; i < arr.length; i++) {
    String val = arr[i];
}

for (int j = 0; j < list.size(); j++) {
    String val = list.get(j);
}

for (int k = 0; k < str.length(); k++) {
    char c = str.charAt(k);
}
```

...write this:

```sand
for @i, val in arr {

}

for @j, val in list {

}

for @k, c in str {

}
```

## Iterating over higher-dimensional collections

Instead of this:

```java
for (int row = 0; row < table.length; row++) {
    for (int col = 0; col < table[row].length; col++) {
        int val = table[row][col];
    }
}
```

...write this:

```sand
for @row, @col, val in table {

}
```

You cannot use `continue` or `break` in higher-dimensional for loops.

## Looping over a range of integers

Instead of this:

```java
public void printDigits() {
    for (int i = 0; i < 10; i++) {
        System.out.println(i);
    }
}
```

...write this:

```sand
pub printDigits() {
    for i in 0 upuntil 10 {
        System.out.println(i);
    }
}
```

...or this:

```sand
pub printDigits() {
    for i in 0 upto 9 {
        System.out.println(i);
    }
}
```

There are four types of ranges:

- `upuntil` - ascending, excludes end
- `upto` - ascending, includes end
- `downuntil` - descending, excludes end
- `downto` - descending, includes end

All ranges are inclusive of their starting value.
