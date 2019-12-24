# Operators

## Exponentiation

`a ** b` transpiles to `Math.pow(a, b)`.

`a **= b;` transpiles to `a = Math.pow(a, b);`.

## Abstract equality

`a ~= b` transpiles to `a.equals(b)`.

## Array conversion

Suppose `a` is of type `String[]`.

Then `foo(~a, b);` transpiles to

```java
ArrayList<String> aArrList = new ArrayList<>(a.length);
for (String elem : a) {
    aArrList.add(elem);
}
foo(aArrList, b);
```
