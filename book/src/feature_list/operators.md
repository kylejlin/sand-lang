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
- `[]` (sequence element access)

Sand also has the following operator expressions:

- `**` - exponentiation
- `~=` - abstract (`.equals()`) equality
- `~<`, `~<=`, `~>`, `~>=` - abstract (`.compareTo()`) comparison
- `~` - a prefix operator that converts an array to a resizable list

## Statements

### Assignments

Sand supports

- `=`
- `+=`, `-=`, `*=`, `/=`, `%=`, `**=`

Sand does not support post- or pre- increment or decrement (`++` and `--`).
