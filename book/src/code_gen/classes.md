# Classes

## Non-open classes

By default, Sand does not mark generated Java classes corresponding to non-open Sand classes with `final`, but this can be enabled through `sandConfig.emitFinalClasses`.

## Non-open methods

Similar to classes, Sand does not by default mark generated Java methods corresponding to non-open Sand methods with `final`, but this can be enabled through `sandConfig.emitFinalMethods`.

## Object literals

If a class contains `pub inst;` or `prot inst;`, then a Java constructor with the appropriate visibility is generated.

For example

```sand
class Dog {
    name: String;
    age: int;

    pub inst;
}
```

generates

```java
class Dog {
    private String name;
    private int age;

    public Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

If a class is only privately instantiable, then the generated Java constructor will also be private.

All object literals are transpiled to constructor calls (e.g., `Foo { baz: "bar" }` is transpiled to `new Foo("bar")`) .

## Shorthand

Not surprisingly, `Foo { baz }` is transpiled to `new Foo(baz)`.

## Object-copying

The objects to be copied are created, and then their attributes are passed to the constructor.
For example:

```sand
open class Animal {
    use System.out.println;

    pub(get) species: String;

    pub fromSpecies(species): Animal {
        println("Creating an animal of species " + species);
        Animal { species }
    }
}

class Dog extends Animal {
    breed: String;

    pub fromBreed(breed: String): Dog {
        Dog { ...fromSpecies("Canis lupus"), breed }
    }
}
```

becomes

```java
class Animal {
    private String species;

    protected Animal(String species) {
        this.species = species;
    }

    public static Animal fromSpecies(String species) {
        System.out.println("Creating an animal of species " + species);
        return new Animal(species);
    }

    public String getSpecies() {
        return species;
    }
}

class Dog {
    private String breed;

    private Dog(String species, String breed) {
        super(species);

        this.breed = breed;
    }

    public static Dog fromBreed(String breed) {
        Animal animal = Animal.fromSpecies("Canis lupus");

        return new Dog(animal.getSpecies(), breed);
    }
}
```

This is why making a class `open` requires you to give child classes read-access to its properties (either via `prot` or `prot(get)`, `pub`, or `pub(get)`), because the generated class needs to be able to access the attributes to copy.
