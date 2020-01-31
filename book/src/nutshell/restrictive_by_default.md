# "Restrictive by default"

Sand is restrictive by default.
This means that in the absence of any modifier keywords:

- Classes default to being final (non-extensible).
- Methods default to being final (non-overridable).
- Properties and local variables default to being final (non-reassignable).
- Classes, methods, properties, and constructors default to being private.

## Visibility

To make a class, method, property, or constructor non-private, use one of the visibility modifiers:

- `pub` (public)
- `prot` (protected)

## Extensibility and overridability

To make a class extensible or a method overridable, use `open`.

To make a class or method abstract, use `abstract`.

Open or abstract methods are protected by default (instead of private by default).

Note that overriding method declarations must use `override`:

```sand
abstract class Animal {
    abstract getSpecies(): String;
}

class Dog extends Animal {
    // Illegal - missing required `override`
    getSpecies(): String {
        "Canis lupus familiaris"
    }

    // Legal - uses `override`
    override getSpecies(): String {
        "Canis lupus familiaris"
    }
}
```

## Reassignability

To make a property, variable, or method argument reassignable, use `var`:

```sand
let x = 0int;
var y = 18int;

// Illegal - x is non-reassignable
x = 3;

// Legal - y is reassignable
y = 21;
```

## Shadowing

Reference name shadowing is illegal by default.
To make it legal, add `shadow` before the shadowing identifier:

```sand
class MyAwesomeClass {
    foo: String;
    bar: int;

    localVarDeclarations() {
        // Illegal - shadows Foo.foo and Foo.bar without using `shadow`
        let foo = "Hello world";
        re bar = 42int;

        // Legal - uses `shadow`
        let shadow foo = "Hello world";
        re shadow bar = 42int;
    }

    // Illegal - shadows Foo.foo and Foo.bar without using `shadow`
    methodArgs(foo: String, bar: Date, baz: boolean) {

    }

    // Legal - uses `shadow`
    methodArgs(shadow foo: String, shadow bar: Date, baz: boolean) {

    }
}
```

`shadow` cannot be used with instance methods—instance methods are only allowed to `override`.

## Hiding static methods

All methods, including static methods, are final (and therefore unhidable, by definition) by default.
To make a static method hidable, use `open`.
The hiding method must use `shadow`.

Example:

```sand
class Animal {
    pub static open fromName(name: String): Animal {
        Animal(name)
    }

    // ...
}

class Dog extends Animal {
    pub static shadow fromName(name: String): Dog {
        Dog(name)
    }

    // ...
}
```

## Nullability

Types are non-nullable by default.
You can make a type nullable by appending `?`.

```sand
// Illegal
let foo: String = null;

// Legal
let bar: String? = null;
```

### Non-null assertion

You can assert that a nullable type is not null (i.e., convert `T?` to `T`) by appending `!`.

For example, in the following example, `foo` has a type of `String`.

```sand
let x: String? = null;
let foo = x!;
```

The non-null assertion operator does **not** perform any runtime checks, and therfore fails silently.

It is best to avoid using the non-null assertion operator, because doing so voids any guarantees the compiler makes about the nullability of your code.
If you must use it, use it with great care.

Novice Sand programmers who recently came from a Java background may be tempted to write the following Java-esque code:

```sand
if foo() != null {
    let x = foo()!;
}
```

However, rather than manually using the dangerous unchecked assertion operator, it is better to use type guards, because those _are_ checked by the compiler:

```sand
if let x = foo() {

}
```

### Casting

In Java, `null` can be successfully casted to any reference type.
As a result, you cannot directly convert a nullable type to a non-nullable type using type casting.

```sand
let x: Animal? = getPossibleAnimal();

// Illegal
let y = x as Dog;

// Legal
let z = x as Dog?;
```

In the above example, the assignment to `y` is illegal because `x` could possibly be `null`.
If this happens, then the cast to `Dog` will "succeed" at runtime, as per the Java Language Specification, but `y` will not actually be of type `Dog`, because `null` is not a member of type `Dog` (it is only a member of type `Dog?`).

To solve this, you can use the non-null assertion operator (`!`).

```
let x = Animal? = getPossibleAnimal();

let z = x! as Dog;
```

However, as previously stated, you must take great care when using the non-null assertion, as it does not perform any runtime checks, and therefore fails silently.
