# Array literals

Instead of this:

```java
abc = new char[] { 'a', 'b', 'c' };

String tenNulls = new String[10];
int[] tenZeros = new int[10];
```

...write this:

```sand
abc = ['a', 'b', 'c'];

let tenNulls: String?[] = [static null; 10];
let tenZeros = [static 0int; 10];
```
