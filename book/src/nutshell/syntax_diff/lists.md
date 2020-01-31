# List syntax

## List type shorthand

`T[+]` is shorthand for `java.util.List<T>`.

For example, instead of this:

```java
public double getAverage(java.util.List<Integer> nums) {
    // ...
}
```

...write this:

```sand
pub getAverage(nums: int[+]): double {
    // ...
}
```

## Getting elements

`list[i]` is shorthand for `list.get(i)`.

For example, instead of this:

```java
int foo = list.get(0);
```

...write this:

```sand
int foo = list[0];
```

## Setting elements

`list[i] = val;` is shorthand for `list.set(i, val);`.

For example, instead of this:

```java
list.set(0, "foo");
```

...write this:

```sand
list[0] = "foo";
```
