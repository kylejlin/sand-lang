# Static method copying

You can copy static methods from other classes by writing `copy SourceClass.methodName as newMethodName;` at top of the class body.

For example:

```sand
class IndexOf {
    pub indexOf<T>(arr: T[], target: T): int {
        for (i, elem) in arr.enum() {
            if elem ~= target {
                return i;
            }
        }

        -1
    }
}

pub class App {
    copy IndexOf.indexOf as foo;

    use System.out.println;

    pub main(args: String[]) {
        let x: int[] = [1, 2, 3];
        println(foo(x, 2));
    }
}
```

will generate

```java
public class App {
    public static void main(String[] args) {
        int[] x = {1, 2, 3};
        System.out.println(foo(x, 2));
    }

    private static <T> int foo(T[] arr, T target) {
        for (int i = 0; i < arr.length; i++) {
            T target = arr[i];
            if (elem.equals(target)) {
                return i;
            }
        }

        return -1;
    }
}
```

## `as` omission

If you don't want to rename the method, you can omit the `as` portion of the statement.

That is, `copy Foo.bar;` is syntactic sugar for `copy Foo.bar as bar;`.

## Accessibility

By default, method copies are private.

If you want them to be public or protected, prepend `pub` or `prot`, respectively.

For example:

```sand
pub class App {
    pub copy IndexOf.indexOf as foo;

    // ...
}
```

## Overloads

By default, all the overloads of a method are copied.

For example, suppose we had

```sand
pub class IndexOf {
    pub indexOf<T>(arr: T[], target: T): int {
        // ...
    }

    pub indexOf<T>(arr: T[], target: T, startIndex: int): int {

    }
}
```

Since all overloads are copied by default, `copy IndexOf.indexOf;` will create both `indexOf<T>(T[], T)` and `indexOf<T>(T[], T, int)`.

If you only want to copy a specific overload, you can specify the signature in the copy statement.

For example:

```sand
pub class App {
    copy IndexOf.indexOf<T>(T[], T);
}
```

## Why copy?

You might wonder why you would want to copy a method instead of just creating a `use` alias.

If you don't want the class being copied from to be included in the generated code, `copy` is the way to go.

For example, notice how the generated Java for the Sand in the previous example didn't mention the `IndexOf` class anywhere. If the above code `use`d `indexOf` instead of copying it, then the generated code would include `IndexOf`:

```java
public class App {
    public static void main(String[] args) {
        int[] x = {1, 2, 3};
        System.out.println(IndexOf.indexOf(x, 2));
    }
}

class IndexOf {
    private static <T> int indexOf(T[] arr, T target) {
        for (int i = 0; i < arr.length; i++) {
            T target = arr[i];
            if (elem.equals(target)) {
                return i;
            }
        }

        return -1;
    }
}
```

## Copy restrictions

In order to be copyable, methods must:

1. Be static.
2. Not reference any static property, unless that property is public.
3. Not reference any static method, unless that method is public.
