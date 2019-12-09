
/* Builds AST from Sand source. */


%lex
%%

\s+                   /* skip whitespace */

"pub" return "pub"
"prot" return "prot"
"class" return "class"
"extends"
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

%start classes

%% /* language grammar */

classes
    : pubClass optPrivClasses EOF
    ;

pubClass
    : "pub" "class" IDENTIFIER optExtension "{" classBody "}"
    ;

optPrivClasses
    : /* empty */
    | optPrivClasses "class" IDENTIFIER optExtension "{" classBody "}"
    ;

optExtension
    : /* empty */
    | "extends" IDENTIFIER
    ;

classBody
    : /* empty */
    | classBody classItem
    ;

classItem
    : optAccessModifier IDENTIFIER ":" IDENTIFIER ";"
    | optAccessModifier IDENTIFIER "(" optArgDefs ")" ":" IDENTIFIER compoundExpression
    ;

optAccessModifier
    : /* empty */
    | "pub"
    | "prot"
    ;

optArgDefs
    : /* empty */
    | optArgDefs IDENTIFIER ":" IDENTIFIER ","
    ;

compoundExpression
    : "{" optStatements expression "}"
    ;

optStatements
    : /* empty */
    | optStatements statement
    ;

statement
    : "if" expression compoundStatement optElseStatement
    | "return" expression ";"
    | IDENTIFIER "(" optArgs ")" ";"
    ;

compoundStatement
    : "{" optStatements "}"
    ;

optStatements
    : /* empty */
    | optStatements statement
    ;

optElseStatement
    : /* empty */
    | optElse "else" "if" expression compoundStatement
    | optElse "else" compoundStatement
    ;

optArgs
    : /* empty */
    | optArgs expression ","
    ;

expression
    : expression "||" expression
    | expression "&&" expression

    | expression "==" expression
    | expression "!=" expression

    | expression "<" expression
    | expression "<=" expression
    | expression ">" expression
    | expression ">=" expression

    | expression "+" expression
    | expression "-" expression

    | expression "*" expression
    | expression "/" expression
    | expression "%" expression

    | expression "**" expression

    | "!" expression

    | "-" expression %prec UMINUS

    | expression "(" optArgs ")"

    | expression "." IDENTIFIER

    | NUMBER
    | STRING
    | IDENTIFIER
    ;



