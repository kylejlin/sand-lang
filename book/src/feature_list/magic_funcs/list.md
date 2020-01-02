# List of built-in magic functions

### `sequence.map(callback)`

Returns a new sequence consisting of the outputs of applying `callback` to `sequence`.

#### Type arguments

- `T`: the type of elements in the original sequence
- `U`: the type of elements in the returned sequence

#### Arguments

- this: `sequence<T>`
- callback: `\T -> U` - due to [squashing], callback must be [pure]

#### Return value

`sequence<U>`

### `sequence.filter(callback)`

Returns a new sequence consisting of the elements of `sequence` for which `callback` returns true.

#### Type arguments

- `T`: the type of elements in the original sequence

#### Arguments

- this: `sequence<T>`
- callback: `\T -> boolean` - due to [squashing], callback must be [pure]

#### Return value

`sequence<T>`

### `sequence.enum()`

Returns an sequence consisting of tuples containing an index and an element from the original sequence.

For example:

```sand
// --snip--

for (i, x) in ["foo", "bar", "baz"].enum() {
    System.out.print(i + x);
}
```

would print `0foo1bar2baz`.

`sequence.enum()` is functionally equivalent to `(0..sequence.len()).uzip(sequence)`.

#### Type arguments

- `T`: the type of elements in the original sequence

#### Arguments

- this: `sequence<T>`

#### Return value

`sequence<(int, T)>`

### `sequence.uzip(otherIterable)`

Returns an sequence containing tuples.
Each tuple has contains an element of `sequence` followed by an element of `otherIterable`.

The "u" in `uzip` stands for "unchecked," meaning the generated code will not check to make sure that both sequences have the same length.
If their lengths differ, it will result in undefined behavior (in practice, most likely an exception, but this is not guaranteed).

The tuples are also "flattened" if one or both of the original element types is a tuple.

For example `(0..3).uzip(3..6).uzip(6..9)` returns a value of type `sequence<(int, int, int)>` rather than `sequence<((int, int), int)>`.

#### Type arguments

- `T`: the type of elements in the original sequence
- `U`: the type of elements in the returned sequence

#### Arguments

- this: `sequence<T>`
- otherIterable: `sequence<U>`

#### Return value

`sequence<flattened<(T, U)>>`

Where `flattened` flattens nested tuples.

### `sequence.arr()`

Returns an array containing the elements of this sequence.

#### Type arguments

- `T`: the type of elements in the original sequence

#### Arguments

- this: `sequence<T>`

#### Return value

`T[]`

### `sequence.rList()`

Returns a resizable list containing the elements of this sequence.

#### Type arguments

- `T`: the type of elements in the original sequence

#### Arguments

- this: `sequence<T>`

#### Return value

`T[+]`

### `sequence.len()`

Returns the number of elements in the sequence.

#### Type arguments

- `T`: the type of elements in the original sequence

#### Arguments

- this: `sequence<T>`

#### Return value

`int`

### `sequence.ulast()`

Returns the last element in the sequence.

The "u" in `ulast` stands for "unchecked". If `sequence` has no elements, this results in undefined behavior.

#### Type arguments

- `T`: the type of elements in the original sequence

#### Arguments

- this: `sequence<T>`

#### Return value

`T`

### `sequence.lastIndex()`

Returns the number of elements in this sequence minus one.

#### Type arguments

- `T`: the type of elements in the original sequence

#### Arguments

- this: `sequence<T>`

#### Return value

`int`

### `sequence.every(callback)`

Determines whether `callback` returns true for every element in `sequence`.

If `sequence` has no elements, returns true.

#### Type arguments

- `T`: the type of elements in the original sequence

#### Arguments

- this: `sequence<T>`
- callback: `\T -> boolean` - due to [squashing], callback must be [pure]

#### Return value

`boolean`

### `sequence.some(callback)`

Determines whether `callback` returns true for any element in `sequence`.

If `sequence` has no elements, returns false.

#### Type arguments

- `T`: the type of elements in the original sequence

#### Arguments

- this: `sequence<T>`
- callback: `\T -> boolean` - due to [squashing], callback must be [pure]

#### Return value

`boolean`

### `sequence.ufind(callback)`

Returns the first element for which `callback(element)` returns true.

The "u" in `ufind` stands for "unchecked," meaning if no element is found, undefined behavior ensues.

#### Type arguments

- `T`: the type of elements in the original sequence

#### Arguments

- this: `sequence<T>`
- callback: `\T -> boolean` - due to [squashing], callback must be [pure]

#### Return value

`int`

### `sequence.findIndex(callback)`

Returns the index of the first element for which `callback(element)` returns true, or `-1` if no such element is found.

#### Type arguments

- `T`: the type of elements in the original sequence

#### Arguments

- this: `sequence<T>`
- callback: `\T -> boolean` - due to [squashing], callback must be [pure]

#### Return value

`int`

[squashing]: ../../code_gen/magic_funcs/squashing.md
[pure]: ./vocab_defs.md#pure-vs-impure-functions
