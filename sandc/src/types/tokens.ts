export type TokenType =
  | JavaReservedWord
  | SandReservedWord
  | SandTokenWithSpecialMeaningInCertainContexts
  | NonwordToken
  | NonConstantLiteralToken
  | typeof EOF
  | typeof INVALID;

export type JavaReservedWord =
  | "abstract"
  | "assert"
  | "boolean"
  | "break"
  | "byte"
  | "case"
  | "catch"
  | "char"
  | "class"
  | "const"
  | "continue"
  | "default"
  | "do"
  | "double"
  | "else"
  | "enum"
  | "extends"
  | "final"
  | "finally"
  | "float"
  | "for"
  | "goto"
  | "if"
  | "implements"
  | "import"
  | "instanceof"
  | "int"
  | "interface"
  | "long"
  | "native"
  | "new"
  | "package"
  | "private"
  | "protected"
  | "public"
  | typeof RETURN
  | "short"
  | "static"
  | "strictfp"
  | "super"
  | "switch"
  | "synchronized"
  | "this"
  | "throw"
  | "throws"
  | "transient"
  | "try"
  | "void"
  | "volatile"
  | "while";

export type SandReservedWord =
  | "_"
  | "as"
  | "copy"
  | "downto"
  | "downuntil"
  | "false"
  | "in"
  | "inline"
  | "let"
  | "loop"
  | "never"
  | "notinstanceof"
  | "null"
  | "open"
  | "override"
  | "prot"
  | "pub"
  | "repeat"
  | "shadow"
  | "true"
  | "tryorthrow"
  | "upto"
  | "upuntil"
  | "use"
  | "var";

export type SandTokenWithSpecialMeaningInCertainContexts =
  | "get"
  | "intenc"
  | "set"
  | "priv";

export type NonwordToken =
  | "("
  | ")"
  | "{"
  | "}"
  | "<"
  | typeof GENERIC_METHOD_TYPE_PARAM_LIST_LEFT_ANGLE_BRACKET
  | ">"
  | "["
  | "]"
  | ";"
  | ","
  | "."
  | "#"
  | "&"
  | "|"
  | ":"
  | "="
  | "**="
  | "*="
  | "/="
  | "%="
  | "+="
  | "-="
  | "\\"
  | "->"
  | "||"
  | "&&"
  | "=="
  | "!="
  | "~="
  | "!~="
  | "<"
  | "<="
  | ">"
  | ">="
  | "~<"
  | "~<="
  | "~>"
  | "~>="
  | "..."
  | "..="
  | "=.."
  | "=.="
  | "+"
  | "-"
  | "*"
  | "/"
  | "%"
  | "**"
  | "!"
  | "?"
  | "@";

export type NonConstantLiteralToken =
  | typeof UNRESERVED_IDENTIFIER
  | typeof ESCAPED_IDENTIFIER
  | typeof NUMBER_LITERAL
  | typeof CHAR_LITERAL
  | typeof STRING_LITERAL;

export const RETURN = "return_";
export const GENERIC_METHOD_TYPE_PARAM_LIST_LEFT_ANGLE_BRACKET =
  "GENERIC_METHOD_TYPE_PARAM_LIST_LEFT_ANGLE_BRACKET";

export const UNRESERVED_IDENTIFIER = "UNRESERVED_IDENTIFIER";
export const ESCAPED_IDENTIFIER = "ESCAPED_IDENTIFIER";
export const NUMBER_LITERAL = "NUMBER_LITERAL";
export const CHAR_LITERAL = "CHAR_LITERAL";
export const STRING_LITERAL = "STRING_LITERAL";

export const EOF = "EOF";
export const INVALID = "INVALID";
