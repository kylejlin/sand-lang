# Type casting

Casting syntax is `value as! Type`.

For example:

```sand
fn primCasting() {
    let x = 42int;
    let y = x as! float;
    let z = x as! char;
}

fn objCasting(dog: Dog) {
    let x = dog as! Animal; // upcast to Animal
    let y = dog as! Puppy; // downcast to Puppy
}
```
