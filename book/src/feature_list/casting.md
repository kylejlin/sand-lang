# Type casting

Casting syntax is `(Type value)`.

For example:

```sand
fn primCasting() {
    let x = 42int;
    let y = (float x); // cast to float
    let z = (char x); // cast to char
}

fn objCasting(dog: Dog) {
    let x = (Animal dog); // upcast to Animal
    let y = (Puppy dog); // downcast to Puppy
}
```
