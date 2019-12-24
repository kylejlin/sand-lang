# Configuration

## Properties

### `.emitFinalClasses`

Determines whether `final` should be prepended to generated Java classes corresponding to non-open Sand classes.

#### Possible values

- `true`
- `false` (default)

### `.emitFinalMethods`

Determines whether `final` should be prepended to generated Java methods corresponding to non-open Sand methods.

#### Possible values

- `true`
- `false` (default)

### `.ifExprOutput`

Dictates how the compiler should generate Java for `if` expressions.

#### Possible values

- `"TERNARY_WHEN_POSSIBLE"` (default)
- `"TERNARY_WHEN_SIMPLE"`
- `"ALWAYS_DEFERRED"`

#### Explanation

The default value, `"TERNARY_WHEN_POSSIBLE"`, instructs the compiler to generate ternary expressions when possible.

`"TERNARY_WHEN_SIMPLE"` instructs the compiler to choose ternary expressions over deferred initialization if and only if the Sand expression is an `if` expression with zero `else-if` clauses and the bodies of the `if` clause and the `else` clause each have exactly one non-if expression.

`"ALWAYS_DEFERRED"` instructs the compiler to always generate code using deferred initialization.
