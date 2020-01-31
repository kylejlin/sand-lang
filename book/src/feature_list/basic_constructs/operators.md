# Operators

## Expressions

Sand has most of the operator expressions you're familiar with from Java:

- `+` (concatentation)
- `*`, `/`, `%`
- `+` (addition), `-` (subtraction)
- `-` (negative)
- `!`
- `&&`, `||`
- `==`, `!=`, `<` `>`, `<=`, `>=`
- `[]` (array element access)

Sand also has the following operator expressions:

- `**` - exponentiation
- `~=` - abstract (`.equals()`) equality
- `!~=` - abstract (`.equals()`) inequality
- `~<`, `~<=`, `~>`, `~>=` - abstract (`.compareTo()`) comparison
- `[]` - list element access (syntactic sugar for `.get()` and `.set()`)

## Statements

### Assignments

Sand supports

- `=`
- `+=`, `-=`, `*=`, `/=`, `%=`, `**=`

Sand does not support post- or pre- increment or decrement (`++` and `--`).
