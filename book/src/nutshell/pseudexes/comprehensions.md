# Array and list comprehensions

## Mapping

### Arrays

Instead of this:

```java
int[] squares = new int[nums.length];
for (int i = 0; i < nums.length; i++) {
    int n = nums[i];
    squares[i] = n * n;
}
```

...write this:

```sand
let squares = [n * n for n in nums];
```

#### Referring to the index

Instead of this:

```java
KeyValuePair[] entries = new KeyValuePair[nums.length];
for (int i = 0; i < nums.length; i++) {
    int n = nums[i];
    entries[i] = new KeyValuePair(i, n);
}
```

...write this:

```sand
let entries = [KeyValuePair(i, n) for @i, n in nums];
```

#### Higher dimensional arrays

Instead of this:

```java
int[][] gridSquared = new int[grid.length][grid[0].length];
for (int row = 0; row < grid.length; row++) {
    for (int col = 0; col < grid[row].length; col++) {
        int n = grid[row][col];
        gridSquared[row][col] = n * n;
    }
}
```

...write this:

```sand
let gridSquared = [n * n for @row, @col, n in grid];
```

Higher dimensional array mapping only has well-defined behavior when using _non-jagged_ arrays.

Non-jagged simply means all the subarrays of the array have the same length, and all the subarrays of those subarrays have the same length, and so on.

Formally, an array **a** is jagged if and only if there exists some series of integers **len<sub>1</sub>**, **len<sub>2</sub>**, ...**len<sub>n</sub>** such that for any series of integers **i<sub>1</sub>**, **i<sub>2</sub>**, ...**i<sub>n</sub>**, the expression **a\[i<sub>1</sub>\]\[i<sub>2</sub>\]...\[i<sub>n</sub>\]** is defined (i.e., will not throw a `ArrayIndexOutOfBoundsException` when evaluated) if and only if **0 <= i<sub>1</sub> < len<sub>1</sub>**, **0 <= i<sub>2</sub> < len<sub>2</sub>**, and **0 <= i<sub>n</sub> < len<sub>n</sub>**.

Using higher dimensional array mapping on jagged arrays will result in undefined behavior.

### Lists

Instead of this:

```java
ArrayList<Integer> squares = new ArrayList<>();
for (int n : squares) {
    squares.add(n * n);
}
```

...write this:

```sand
let squares = +[n * n for n in nums];
```

## Filtering

Note: filtering is only supported with lists, not arrays.

Instead of this:

```java
ArrayList<Integer> squaresOfPrimes = new ArrayList<>();
for (int n : nums) {
    if (isPrime(n)) {
        squaresOfPrimes.add(n * n);
    }
}
```

...write this:

```sand
let squaresOfPrimes = +[n * n for n in nums if isPrime(n)];
```
