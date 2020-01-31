# Sand in a nutshell

This chapter describes Sand's language features by comparing them to those of Java.

## How this chapter is organized

This chapter will make extensive use of the "Instead of this: _\<Java code\>_, write this: _\<Sand code\>_." format.

### Example:

Instead of this:

```java
String[] arr = new String[] {"a", "b", "c"};
for (String s : arr) {
    System.out.println(s);
}
```

...write this:

```sand
let arr = ["a", "b", "c"];
for s in arr {
    System.out.println(s);
}
```
