# Method calls

Methods can be called using the named syntax or unnamed syntax.

## Unnamed syntax

The unnamed syntax is `methodName(val1, val2, valN)`.

In the example below, the `bark` method calls the `makeNoise` method using the unnamed syntax.

```sand
class Dog  {
    pub barkFromOrigin() {
        let origin = Position(0, 0);
        makeNoise("Woof", origin);
    }

    makeNoise(noise: String, position: Position) {
        System.out.println("You hear " + noise + " from " + position);
    }
}
```

## Named syntax

The unnamed syntax is `methodName(arg1Name: val1, arg2Name: val2, arg3Name: valN)`.

In the example below, the `bark` method calls the `makeNoise` method using the named syntax.

```sand
class Dog  {
    pub barkFromOrigin() {
        let origin = Position(0, 0);
        makeNoise(noise: "Woof", position: origin);
    }

    makeNoise(noise: String, position: Position) {
        System.out.println("You hear " + noise + " from " + position);
    }
}
```
