/* Parses a type */

%lex

%%

\s+ /* skip whitespace */

[a-zA-Z_]\w*(\s*\.\s*[a-zA-Z_]\w*)* return "ONE_OR_MORE_DOT_SEPARATED_IDENTIFIERS"
"<" return "<"
">" return ">"
"," return ","
"?" return "?"
\[\s*\] return "[]"
\[\s*\+\s*\] return "[+]"

<<EOF>> return "EOF"
. return "INVALID"

/lex

%start typeAndEof

%%

typeAndEof
    : type EOF
        { return $1; }
    ;

type
    : nonNullableType
    | nullableType
    ;

nonNullableType
    : ONE_OR_MORE_DOT_SEPARATED_IDENTIFIERS optTypeArgs
        { $$ = { type: yy.NodeType.Type, name: $1.trim(), args: $2, location: yy.camelCase(@$) }; }
    | type "[]"
        { $$ = { type: yy.NodeType.Type, name: "array", args: [$1], location: yy.camelCase(@$) }; }
    | type "[+]"
        { $$ = { type: yy.NodeType.Type, name: "rlist", args: [$1], location: yy.camelCase(@$) }; }
    ;

nullableType
    : nonNullableType "?"
        { $$ = { type: yy.NodeType.Type, name: "nullable", args: [$1], location: yy.camelCase(@$) }; }
    ;

optTypeArgs
    : /* empty */
        { $$ = []; }
    | "<" oneOrMoreCommaSeparatedTypes ">"
        { $$ = $2; }
    ;

oneOrMoreCommaSeparatedTypes
    : type
        { $$ = [$1]; }
    | oneOrMoreCommaSeparatedTypes "," type
        { $$ = $1.concat([$3]); }
    ;