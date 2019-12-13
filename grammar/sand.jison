
/* Builds AST from Sand source. */


%lex
%%

\s+                   /* skip whitespace */

"pub" return "pub"
"prot" return "prot"
"class" return "class"
"extends" return "extends"
"if" return "if"
"else" return "else"
"return" return "return"

\-?\d+(\.\d+)?(e-?[1-9]\d*)?\b  return "NUMBER"
\"(\\(u[0-9a-fA-F]{4}|[\\"nt])|[^\\"])*\" return "STRING"
[_a-zA-Z]\w* return "IDENTIFIER"

"**"                   return "**"
"*"                   return "*"
"/"                   return "/"
"%" return "%"
"-"                   return "-"
"+"                   return "+"

"==" return "=="
"!=" return "!="
"<" return "<"
"<=" return "<="
">" return ">"
">=" return ">="

"!"                   return "!"
"&&" return "&&"
"||" return "||"

"." return "."
"[" return "["
"]" return "]"

"("                   return "("
")"                   return ")"

"{" return "{"
"}" return "}"
":" return ":"
"," return ","
";" return ";"

<<EOF>>               return "EOF"
.                     return "INVALID"

/lex

/* operator associations and precedence */

%left "||"
%left "&&"

%left "==" "!="
%left "<" "<=" ">" ">="

%left "+" "-"
%left "*" "/" "%"
%right "**"

%right "!"

%right UMINUS

%left "."

%start classes

%% /* language grammar */

classes
    : pubClass optPrivClasses EOF
        { return { type: yy.NodeType.File, pubClass: $1, privClasses: $2, location: yy.camelCase(@$) }; }
    ;

pubClass
    : "pub" "class" IDENTIFIER optTypeArgDefs optExtension "{" classBody "}"
        { $$ = { type: yy.NodeType.Class, isPub: true, name: $3, typeArgDefs: $4, superClass: $5, items: $7, location: yy.camelCase(@$) }; }
    ;

optTypeArgDefs
    : /* empty */
        { $$ = []; }
    | "<" typeArgDefs ">"
        { $$ = $2; }
    ;

typeArgDefs
    : IDENTIFIER
        { $$ = [{ name: $1, constraint: { constraintType: yy.ConstraintType.None }, location: yy.camelCase(@$) }]; }
    | IDENTIFIER "extends" type
        { $$ = [{ name: $1, constraint: { constraintType: yy.ConstraintType.Extends, superClass: $3 }, location: yy.camelCase(@$) }]; }
    | typeArgDefs "," IDENTIFIER
        { $$ = $1.concat([{ name: $3, constraint: { constraintType: yy.ConstraintType.None }, location: yy.camelCase(@3) }]); }
    | typeArgDefs "," IDENTIFIER "extends" type
        { $$ = $1.concat([{ name: $3, constraint: { constraintType: yy.ConstraintType.Extends, superClass: $5 }, location: yy.camelCase(yy.merge(@3, @5)) }]); }
    ;

optPrivClasses
    : /* empty */
        { $$ = []; }
    | optPrivClasses "class" IDENTIFIER optTypeArgDefs optExtension "{" classBody "}"
        { $$ = $1.concat([{ type: yy.NodeType.Class, isPub: false, name: $3, typeArgDefs: $4, superClass: $5, items: $7, location: yy.camelCase(yy.merge(@2, @8)) }]); }
    ;

optExtension
    : /* empty */
        { $$ = null; }
    | "extends" type
        { $$ = $2; }
    ;

type
    : IDENTIFIER "<" typeArgs ">"
        { $$ = { name: $1, args: $3, location: yy.camelCase(@$) }; }
    | IDENTIFIER
        { $$ = { name: $1, args: [], location: yy.camelCase(@$) }; }
    | type "[" "]"
        { $$ = { name: "array", args: [$1], location: yy.camelCase(@$) }; }
    | type "[" ":" "]"
        { $$ = { name: "java.util.ArrayList", args: [yy.wrapPrimitiveIfNeeded($1)], location: yy.camelCase(@$) }; }
    ;

typeArgs
    : type
        { $$ = [$1]; }
    | typeArgs "," type
        { $$ = $1.concat([$3]); }
    ;

classBody
    : /* empty */
        { $$ = []; }
    | classBody classItem
        { $$ = $1.concat([$2]); }
    ;

classItem
    : optAccessModifier IDENTIFIER ":" type ";"
        { $$ = { type: yy.NodeType.PropertyDeclaration, accessModifier: $1, name: $2, valueType: $4, location: yy.camelCase(@$) }; }
    | optAccessModifier IDENTIFIER "(" optArgDefs ")" ":" type compoundExpression
        { $$ = { type: yy.NodeType.MethodDeclaration, accessModifier: $1, name: $2, args: $4, returnType: $7, body: $8, location: yy.camelCase(@$) }; }
    | optAccessModifier IDENTIFIER "(" optArgDefs ")" compoundExpression
        { $$ = { type: yy.NodeType.MethodDeclaration, accessModifier: $1, name: $2, args: $4, returnType: "void", body: $6, location: yy.camelCase(@$) }; }
    ;

optAccessModifier
    : /* empty */
        { $$ = null; }
    | "pub"
        { $$ = "pub"; }
    | "prot"
        { $$ = "prot"; }
    ;

optArgDefs
    : /* empty */
        { $$ = []; }
    | argDefs
    ;

argDefs
    : IDENTIFIER ":" type
        { $$ = [{ name: $1, valueType: $3, location: yy.camelCase(@$) }]; }
    | argDefs "," IDENTIFIER ":" type
        { $$ = $1.concat([{ name: $3, valueType: $5, location: yy.camelCase(yy.merge(@3, @5)) }]); }
    ;

compoundExpression
    : "{" "}"
        { $$ = []; }
    | "{" expressionNotEndingWithBrace "}"
        { $$ = [$2]; }
    | "{" expressionNotEndingWithBrace ";" "}"
        { $$ = [$2]; }
    | "{" expressionEndingWithBrace "}"
        { $$ = [$2]; }
    | "{" twoOrMoreExpressionsNotEndingWithBrace "}"
        { $$ = $2; }
    | "{" twoOrMoreExpressionsNotEndingWithBrace ";" "}"
        { $$ = $2; }
    | "{" twoOrMoreExpressionsEndingWithBrace "}"
        { $$ = $2; }
    ;

// The last expression does not end with a brace
//   but the others may.
// The sequence does not end with a semicolon.
twoOrMoreExpressionsNotEndingWithBrace
    : expressionNotEndingWithBrace ";" expressionNotEndingWithBrace
        { $$ = [$1, $3]; }
    | expressionEndingWithBrace expressionNotEndingWithBrace
        { $$ = [$1, $2]; }
    | twoOrMoreExpressionsNotEndingWithBrace ";" expressionNotEndingWithBrace
        { $$ = $1.concat([$3]); }
    | twoOrMoreExpressionsEndingWithBrace expressionNotEndingWithBrace
        { $$ = $1.concat([$2]); }
    ;

// The last expression ends with a brace
//   but the others may not.
twoOrMoreExpressionsEndingWithBrace
    : expressionNotEndingWithBrace ";" expressionEndingWithBrace
        { $$ = [$1, $3]; }
    | expressionEndingWithBrace expressionEndingWithBrace
        { $$ = [$1, $2]; }
    | twoOrMoreExpressionsNotEndingWithBrace ";" expressionEndingWithBrace
        { $$ = $1.concat([$3]); }
    | twoOrMoreExpressionsEndingWithBrace expressionEndingWithBrace
        { $$ = $1.concat([$2]); }
    ;

expressionEndingWithBrace
    : "if" expression compoundExpression optElseExpression
        { $$ = { type: yy.NodeType.If, condition: $2, body: $3, alternatives: $4, location: yy.camelCase(@$) }; }
    ;

optElseExpression
    : optElseIfExpression
    | optElseIfExpression "else" compoundExpression
        { $$ = $1.concat([{ type: yy.IfAlternativeType.Else, body: $3, location: yy.camelCase(yy.merge(@2, @3)) }]); }
    ;

optElseIfExpression
    : /* empty */
        { $$ = []; }
    | optElseIfExpression "else" "if" expression compoundExpression
        { $$ = $1.concat([{ type: yy.IfAlternativeType.ElseIf, condition: $4, body: $5, location: yy.camelCase(yy.merge(@2, @5)) }]); }
    ;

expressionNotEndingWithBrace
    : expression "||" expression
        { $$ = yy.binaryExpr("||", $1, $3, @$); }
    | expression "&&" expression
        { $$ = yy.binaryExpr("&&", $1, $3, @$); }

    | expression "==" expression
        { $$ = yy.binaryExpr("==", $1, $3, @$); }
    | expression "!=" expression
        { $$ = yy.binaryExpr("!=", $1, $3, @$); }

    | expression "<" expression
        { $$ = yy.binaryExpr("<", $1, $3, @$); }
    | expression "<=" expression
        { $$ = yy.binaryExpr("<=", $1, $3, @$); }
    | expression ">" expression
        { $$ = yy.binaryExpr(">", $1, $3, @$); }
    | expression ">=" expression
        { $$ = yy.binaryExpr(">=", $1, $3, @$); }

    | expression "+" expression
        { $$ = yy.binaryExpr("+", $1, $3, @$); }
    | expression "-" expression
        { $$ = yy.binaryExpr("-", $1, $3, @$); }

    | expression "*" expression
        { $$ = yy.binaryExpr("*", $1, $3, @$); }
    | expression "/" expression
        { $$ = yy.binaryExpr("/", $1, $3, @$); }
    | expression "%" expression
        { $$ = yy.binaryExpr("%", $1, $3, @$); }

    | expression "**" expression
        { $$ = yy.binaryExpr("**", $1, $3, @$); }

    | "!" expression
        { $$ = yy.unaryExpr("!", $2, @$); }

    | "-" expression %prec UMINUS
        { $$ = yy.unaryExpr("-", $2, @$); }

    | functionCall

    | NUMBER
        { $$ = { type: yy.NodeType.NumberLiteral, value: yytext, location: yy.camelCase(@$) }; }
    | STRING
        { $$ = { type: yy.NodeType.StringLiteral, value: yytext, location: yy.camelCase(@$) }; }
    | assignableExpression
    ;

functionCall
    : assignableExpression "(" optArgs ")"
        { $$ = { type: yy.NodeType.FunctionCall, callee: $1, args: $3, location: yy.camelCase(@$) }; }
    ;

assignableExpression
    : IDENTIFIER
        { $$ = { type: yy.NodeType.Identifier, value: yytext, location: yy.camelCase(@$) }; }
    | assignableExpression "." IDENTIFIER
        { $$ = yy.binaryExpr(".", $1, $3, @$); }
    | functionCall "." IDENTIFIER
        { $$ = yy.binaryExpr(".", $1, $3, @$); }
    | assignableExpression "[" expression "]"
        { $$ = yy.binaryExpr("[", $1, $3, @$); }
    | functionCall "[" expression "]"
        { $$ = yy.binaryExpr("[", $1, $3, @$); }
    ;

expression
    : expressionEndingWithBrace
    | expressionNotEndingWithBrace
    ;

optArgs
    : /* empty */
        { $$ = []; }
    | args
    ;

args
    : expression
        { $$ = [$1]; }
    | args "," expression
        { $$ = $1.concat([$3]); }
    ;