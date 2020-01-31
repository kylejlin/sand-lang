# Lambda expressions

Instead of this:

```java
button.setOnMouseClicked(e -> System.out.println("You clicked me"));

nums.sort((a, b) -> a - b);
```

...write this:

```sand
button.setOnMouseClicked(\e -> {
    System.out.println("You clicked me");
});

nums.sort(\a, b -> a - b);
```
