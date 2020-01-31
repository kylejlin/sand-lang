# Type guards

## Null guard statements

### `if` statements

Instead of this:

```java
String t = nextToken();
if (t != null) {
    return t.length();
}
```

...write this:

```sand
if let t = nextToken() {
    return t.length();
}
```

### `while` statements

Instead of this:

```java
for (String t = nextToken(); t != null; t = nextToken()) {
    tokens.add(t);
}
```

...write this:

```sand
while let t = nextToken() {
    tokens.add(t);
}
```

## Null guard expressions

Instead of this:

```java
final String name = getName();
final String greeting = name != null ? name : "Hello unknown user";
```

...write this:

```sand
let greeting = if let name = getName() {
    getGreeting(name)
} else {
    "Hello unknown user"
};
```

## `instanceof` guard statements

Instead of this:

```java
Animal possibleDog = getAnimal();
if (possibleDog instanceof Dog) {
    Dog dog = (Dog) possibleDog;
    dog.bark();
}
```

...write this:

```sand
if let dog: Dog = getAnimal() {
    dog.bark();
}
```

Instead of this:

```java
for (Animal possibleDog = getAnimal(); possibleDog instanceof Dog; possibleDog = getAnimal()) {
    Dog dog = (Dog) possibleDog;
    dog.bark();
}
```

...write this:

```sand
while let dog: Dog = getAnimal() {
    dog.bark();
}
```

`instanceof` guards do not support `inline` variables.

## Multiple type guards

Instead of this:

```java
String firstName = getFirstName();
String lastName = getLastName();
Animal possibleDog = getAnimal();
if (
    firstName != null &&
    lastName != null &&
    possibleDog instanceof Dog
) {
    Dog dog = (Dog) possibleDog;
    User user = createUser(firstName, lastName);
    user.setPet(dog);
}
```

...write this:

```sand
if let
    firstName = getFirstName(),
    lastName = getLastName(),
    dog: Dog = getAnimal()
{
    let user = createUser(firstName, lastName);
    user.setPet(dog);
}
```

## Inline variables

Consider the following code:

```sand
if let s = getString() {
    doSomething(s);
}
```

...which roughly compiles to this:

```java
final String s = getString();
if (s != null) {
    doSomething(s);
}
```

If you don't want the compiler to generate temporary variables (such as `t` in the above example), you can use an inline type guard, as described in the [inline type guards chapter](./mevlexes/inline_type_guards.md).
