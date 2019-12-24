# List literals

## Arrays

Arrays are left as-is.

That is, `T[]` transpiles to `T[]`.

## Resizable lists

If a file uses `[*]` syntax, then `import java.util.ArrayList` will be added to the generated Java file, and `T[*]` will transpile to `ArrayList<T>`.

If the name `ArrayList` conflicts with another reference, then the import will not be added, and `T[*]` will transpile to `java.util.ArrayList<T>`.

In either case, primitives will be boxed.

For example, `int[*]` transpiles to `ArrayList<Integer>`, since primitives cannot be passed as type arguments.
