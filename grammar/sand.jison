
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
        { return { type: yy.NodeType.File, pubClass: $1, privClasses: $2 }; }
    ;

pubClass
    : "pub" "class" IDENTIFIER optTypeArgs optExtension "{" classBody "}"
        { $$ = { type: yy.NodeType.Class, isPub: true, name: $3, typeArgs: $4, superClass: $5, items: $7 }; }
    ;

optTypeArgs
    : /* empty */
        { $$ = []; }
    | typeArgs
    ;

typeArgs
    : IDENTIFIER
        { $$ = [{ name: $1, constraint: { constraintType: yy.ConstraintType.None } }]; }
    | IDENTIFIER "extends" type
        { $$ = [{ name: $1, constraint: { constraintType: yy.ConstraintType.Extends, superClass: $3 } }]; }
    | typeArgs "," IDENTIFIER
        { $$ = $1.concat([{ name: $3, constraint: { constraintType: yy.ConstraintType.None } }]); }
    | typeArgs "," IDENTIFIER "extends" type
        { $$ = $1.concat([{ name: $3, constraint: { constraintType: yy.ConstraintType.Extends, superClass: $5 } }]); }
    ;

optPrivClasses
    : /* empty */
        { $$ = []; }
    | optPrivClasses "class" IDENTIFIER optTypeArgs optExtension "{" classBody "}"
        { $$ = $1.concat([{ type: yy.NodeType.Class, isPub: false, name: $3, typeArgs: $4, superClass: $5, items: $7 }]); }
    ;

optExtension
    : /* empty */
        { $$ = null; }
    | "extends" type
        { $$ = $2; }
    ;

type
    : IDENTIFIER "<" typeArgs ">"
        { $$ = { name: $1, args: $3 }; }
    | IDENTIFIER
        { $$ = { name: $1, args: [] }; }
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
        { $$ = { type: yy.NodeType.PropertyDeclaration, accessModifier: $1, name: $2, valueType: $4 }; }
    | optAccessModifier IDENTIFIER "(" optArgDefs ")" ":" type compoundExpression
        { $$ = { type: yy.NodeType.MethodDeclaration, accessModifier: $1, name: $2, args: $4, returnType: $7, body: $8 }; }
    | optAccessModifier IDENTIFIER "(" optArgDefs ")" compoundExpression
        { $$ = { type: yy.NodeType.MethodDeclaration, accessModifier: $1, name: $2, args: $4, returnType: "void", body: $6 }; }
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
        { $$ = [{ name: $1, valueType: $3 }]; }
    | argDefs "," IDENTIFIER ":" type
        { $$ = $1.concat([{ name: $3, valueType: $5 }]); }
    ;

compoundExpression
    : "{" optExpressions "}"
        { $$ = $2; }
    ;

optExpressions
    : /* empty */
        { $$ = []; }
    | expressions
    ;

expressions
    : expressionsNotEndingWithBrace
    | expressionsNotEndingWithBrace ";"
        { $$ = $1.concat([{ type: yy.NodeType.ImpliedNullExpr }]); }
    | expressionsEndingWithBrace
    ;

expressionsNotEndingWithBrace
    : expressionNotEndingWithBrace
        { $$ = [$1]; }
    | expressionsNotEndingWithBrace ";" expressionNotEndingWithBrace
        { $$ = $1.concat([$3]); }
    | expressionsEndingWithBrace expressionNotEndingWithBrace
        { $$ = $1.concat([$2]); }
    ;

expressionsEndingWithBrace
    : expressionEndingWithBrace
        { $$ = [$1]; }
    | expressionsEndingWithBrace expressionEndingWithBrace
        { $$ = $1.concat([$2]); }
    | expressionsNotEndingWithBrace expressionEndingWithBrace
        { $$ = $1.concat([$2]); }
    ;

expressionEndingWithBrace
    : "if" expression compoundExpression optElseExpression
        { $$ = { type: yy.NodeType.If, condition: $2, body: $3, alternatives: $4 }; }
    ;

optElseExpression
    : optElseIfExpression
    | optElseIfExpression "else" compoundExpression
        { $$ = $1.concat([{ type: yy.IfAlternativeType.Else, body: $3 }]); }
    ;

optElseIfExpression
    : /* empty */
        { $$ = []; }
    | optElseIfExpression "else" "if" expression compoundExpression
        { $$ = $1.concat([{ type: yy.IfAlternativeType.ElseIf, condition: $4, body: $5 }]); }
    ;

expressionNotEndingWithBrace
    : expression "||" expression
        { $$ = yy.binaryExpr("||", $1, $3); }
    | expression "&&" expression
        { $$ = yy.binaryExpr("&&", $1, $3); }

    | expression "==" expression
        { $$ = yy.binaryExpr("==", $1, $3); }
    | expression "!=" expression
        { $$ = yy.binaryExpr("!=", $1, $3); }

    | expression "<" expression
        { $$ = yy.binaryExpr("<", $1, $3); }
    | expression "<=" expression
        { $$ = yy.binaryExpr("<=", $1, $3); }
    | expression ">" expression
        { $$ = yy.binaryExpr(">", $1, $3); }
    | expression ">=" expression
        { $$ = yy.binaryExpr(">=", $1, $3); }

    | expression "+" expression
        { $$ = yy.binaryExpr("+", $1, $3); }
    | expression "-" expression
        { $$ = yy.binaryExpr("-", $1, $3); }

    | expression "*" expression
        { $$ = yy.binaryExpr("*", $1, $3); }
    | expression "/" expression
        { $$ = yy.binaryExpr("/", $1, $3); }
    | expression "%" expression
        { $$ = yy.binaryExpr("%", $1, $3); }

    | expression "**" expression
        { $$ = yy.binaryExpr("**", $1, $3); }

    | "!" expression
        { $$ = yy.unaryExpr("!", $2); }

    | "-" expression %prec UMINUS
        { $$ = yy.unaryExpr("-", $2); }

    | functionCall

    | NUMBER
        { $$ = { type: yy.NodeType.NumberLiteral, value: yytext }; }
    | STRING
        { $$ = { type: yy.NodeType.String, value: yytext }; }
    | assignableExpression
    ;

functionCall
    : assignableExpression "(" optArgs ")"
        { $$ = { type: yy.NodeType.FunctionCall, callee: $1, args: $3 }; }
    ;

assignableExpression
    : IDENTIFIER
        { $$ = { type: yy.NodeType.Identifier, value: yytext }; }
    | assignableExpression "." IDENTIFIER
        { $$ = yy.binaryExpr(".", $1, $3); }
    | functionCall "." IDENTIFIER
        { $$ = yy.binaryExpr(".", $1, $3); }
    | assignableExpression "[" expression "]"
        { $$ = yy.binaryExpr("[", $1, $3); }
    | functionCall "[" expression "]"
        { $$ = yy.binaryExpr("[", $1, $3); }
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