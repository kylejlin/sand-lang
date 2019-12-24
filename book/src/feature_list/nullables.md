# Explicit nullables

In Sand, types are non-nullable by default.

Hence, the following is illegal:

```sand
re x: String = null;
```

To make a type nullable, append `?`:

```sand
re x: String? = null;
```

Not surprisingly, a non-nullable version of a type is assignable to the nullable version, but the nullable version is not assignable to the non-nullable version.
