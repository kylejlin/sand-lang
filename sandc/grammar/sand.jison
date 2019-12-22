
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
"return" return "return_"
"let!" return "let!"
"let" return "let"
"re!" return "re!"
"re" return "re"

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

"?" return "?"

"." return "."
"[" return "["
"]" return "]"

"=" return "="

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

%start file

%% /* language grammar */

file
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
        { $$ = [{ type: yy.NodeType.TypeArgDef, name: $1, constraint: { constraintType: yy.ConstraintType.None }, location: yy.camelCase(@$) }]; }
    | IDENTIFIER "extends" type
        { $$ = [{ type: yy.NodeType.TypeArgDef, name: $1, constraint: { constraintType: yy.ConstraintType.Extends, superClass: $3 }, location: yy.camelCase(@$) }]; }
    | typeArgDefs "," IDENTIFIER
        { $$ = $1.concat([{ type: yy.NodeType.TypeArgDef, name: $3, constraint: { constraintType: yy.ConstraintType.None }, location: yy.camelCase(@3) }]); }
    | typeArgDefs "," IDENTIFIER "extends" type
        { $$ = $1.concat([{ type: yy.NodeType.TypeArgDef, name: $3, constraint: { constraintType: yy.ConstraintType.Extends, superClass: $5 }, location: yy.merge(@3, @5) }]); }
    ;

optPrivClasses
    : /* empty */
        { $$ = []; }
    | optPrivClasses "class" IDENTIFIER optTypeArgDefs optExtension "{" classBody "}"
        { $$ = $1.concat([{ type: yy.NodeType.Class, isPub: false, name: $3, typeArgDefs: $4, superClass: $5, items: $7, location: yy.merge(@2, @8) }]); }
    ;

optExtension
    : /* empty */
        { $$ = null; }
    | "extends" type
        { $$ = $2; }
    ;

type
    : nullableType
    | nonNullableType
    ;

nullableType
    : nonNullableType "?"
        { $$ = { type: yy.NodeType.Type, name: "nullable", args: [$1], location: yy.camelCase(@$) }; }
    ;

nonNullableType
    : oneOrMoreDotSeparatedIdentifiers optTypeArgs
        { $$ = { type: yy.NodeType.Type, name: $1.map(ident => ident.value).join('.'), args: $2, location: yy.camelCase(@$) }; }
    | type "[" "]"
        { $$ = { type: yy.NodeType.Type, name: "array", args: [$1], location: yy.camelCase(@$) }; }
    | type "[" "*" "]"
        { $$ = { type: yy.NodeType.Type, name: "java.util.ArrayList", args: [yy.wrapPrimitiveIfNeeded($1)], location: yy.camelCase(@$) }; }
    ;

optTypeArgs
    : /* empty */
        { $$ = []; }
    | "<" typeArgs ">"
        { $$ = $2; }
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
    | optAccessModifier IDENTIFIER optTypeArgDefs "(" optArgDefs ")" ":" type compoundExpression
        { $$ = { type: yy.NodeType.MethodDeclaration, accessModifier: $1, name: $2, typeArgs: $3, args: $5, returnType: $8, body: $9, location: yy.camelCase(@$) }; }
    | optAccessModifier IDENTIFIER optTypeArgDefs "(" optArgDefs ")" compoundExpression
        { $$ = { type: yy.NodeType.MethodDeclaration, accessModifier: $1, name: $2, typeArgs: $3, args: $5, returnType: null, body: $7, location: yy.camelCase(@$) }; }
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
        { $$ = [{ type: yy.NodeType.ArgDef, name: $1, valueType: $3, location: yy.camelCase(@$) }]; }
    | argDefs "," IDENTIFIER ":" type
        { $$ = $1.concat([{ type: yy.NodeType.ArgDef, name: $3, valueType: $5, location: yy.merge(@3, @5) }]); }
    ;

compoundExpression
    : "{" "}"
        { $$ = []; }
    | "{" expressionLackingRightDelimiter "}"
        { $$ = [$2]; }
    | "{" expressionLackingRightDelimiter ";" "}"
        { $$ = [$2]; }
    | "{" expressionIncludingRightDelimiter "}"
        { $$ = [$2]; }
    | "{" statement "}"
        { $$ = [$2]; }
    | "{" twoOrMoreExpressionsWhereTheLastLacksRightDelimiter "}"
        { $$ = $2; }
    | "{" twoOrMoreExpressionsWhereTheLastLacksRightDelimiter ";" "}"
        { $$ = $2; }
    | "{" twoOrMoreExpressionsWhereTheLastIncludesRightDelimiter "}"
        { $$ = $2; }
    ;

// The sequence does not end with a semicolon.
twoOrMoreExpressionsWhereTheLastLacksRightDelimiter
    : expressionLackingRightDelimiter ";" expressionLackingRightDelimiter
        { $$ = [$1, $3]; }
    | expressionIncludingRightDelimiter expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = [$1, $2]; }
    | statement expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = [$1, $2]; }
    | twoOrMoreExpressionsWhereTheLastLacksRightDelimiter ";" expressionLackingRightDelimiter
        { $$ = $1.concat([$3]); }
    | twoOrMoreExpressionsWhereTheLastIncludesRightDelimiter expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = $1.concat([$2]); }
    ;

twoOrMoreExpressionsWhereTheLastIncludesRightDelimiter
    : expressionLackingRightDelimiter ";" expressionIncludingRightDelimiter
        { $$ = [$1, $3]; }
    | expressionIncludingRightDelimiter expressionIncludingRightDelimiter
        { $$ = [$1, $2]; }
    | statement expressionIncludingRightDelimiter
        { $$ = [$1, $2]; }
        
    | expressionLackingRightDelimiter ";" statement
        { $$ = [$1, $3]; }
    | expressionIncludingRightDelimiter statement
        { $$ = [$1, $2]; }
    | statement statement
        { $$ = [$1, $2]; }
    
    | twoOrMoreExpressionsWhereTheLastLacksRightDelimiter ";" expressionIncludingRightDelimiter
        { $$ = $1.concat([$3]); }
    | twoOrMoreExpressionsWhereTheLastIncludesRightDelimiter expressionIncludingRightDelimiter
        { $$ = $1.concat([$2]); }

    | twoOrMoreExpressionsWhereTheLastLacksRightDelimiter ";" statement
        { $$ = $1.concat([$3]); }
    | twoOrMoreExpressionsWhereTheLastIncludesRightDelimiter statement
        { $$ = $1.concat([$2]); }
    ;

// Statements include semicolons
statement
    : localVariableDeclaration
    | assignment
    | return
    ;

localVariableDeclaration
    : "let" IDENTIFIER "=" expression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "let!" IDENTIFIER "=" expression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "re" IDENTIFIER "=" expression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "re!" IDENTIFIER "=" expression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }

    | "let" IDENTIFIER ":" type "=" expression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "let!" IDENTIFIER ":" type "=" expression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "re" IDENTIFIER ":" type "=" expression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "re!" IDENTIFIER ":" type "=" expression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    ;

assignment
    : oneOrMoreDotSeparatedIdentifiers "=" expression ";"
        { $$ = { type: yy.NodeType.Assignment, assignee: yy.buildDotChainIfNeeded($1), value: $3, location: yy.camelCase(@$) }; }
    | heterogeneousDotExpr "=" expression ";"
        { $$ = { type: yy.NodeType.Assignment, assignee: $1, value: $3, location: yy.camelCase(@$) }; }
    | index "=" expression ";"
        { $$ = { type: yy.NodeType.Assignment, assignee: $1, value: $3, location: yy.camelCase(@$) }; }
    ;

return
    : "return_" expression ";"
        { $$ = { type: yy.NodeType.Return, value: $2, location: yy.camelCase(@$) }; }
    | "return_" ";"
        { $$ = { type: yy.NodeType.Return, value: null, location: yy.camelCase(@$) }; }
    ;

expressionIncludingRightDelimiter
    : "if" expression compoundExpression optElseExpression
        { $$ = { type: yy.NodeType.If, condition: $2, body: $3, alternatives: $4, location: yy.camelCase(@$) }; }
    ;

optElseExpression
    : optElseIfExpression
    | optElseIfExpression "else" compoundExpression
        { $$ = $1.concat([{ type: yy.NodeType.IfAlternative, alternativeType: yy.IfAlternativeType.Else, body: $3, location: yy.merge(@2, @3) }]); }
    ;

optElseIfExpression
    : /* empty */
        { $$ = []; }
    | optElseIfExpression "else" "if" expression compoundExpression
        { $$ = $1.concat([{ type: yy.NodeType.IfAlternative, alternativeType: yy.IfAlternativeType.ElseIf, condition: $4, body: $5, location: yy.merge(@2, @5) }]); }
    ;

expressionLackingRightDelimiter
    : expressionLackingRightDelimiterStartingWithInfixToken
    | expressionLackingRightDelimiterNotStartingWithInfixToken
    ;

expressionLackingRightDelimiterStartingWithInfixToken
    : "-" oneOrMoreDotSeparatedIdentifiers %prec UMINUS
        { $$ = yy.unaryExpr("-", yy.buildDotChainIfNeeded($2), @$); }
    | "-" heterogeneousDotExpr %prec UMINUS
        { $$ = yy.unaryExpr("-", $2, @$); }
    | "-" functionCall %prec UMINUS
        { $$ = yy.unaryExpr("-", $2, @$); }
    | "-" index %prec UMINUS
        { $$ = yy.unaryExpr("-", $2, @$); }
    | "-" expressionIncludingRightDelimiter %prec UMINUS
        { $$ = yy.unaryExpr("-", $2, @$); }

    // elrdswit OPERATOR elrdswit

    | expressionLackingRightDelimiterStartingWithInfixToken "||" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("||", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "&&" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("&&", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "==" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("==", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "!=" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("!=", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "<" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("<", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "<=" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("<=", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken ">" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr(">", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken ">=" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr(">=", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "+" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("+", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "-" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("-", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "*" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("*", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "/" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("/", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "%" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("%", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "**" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("**", $1, $3, @$); }

    // elrdswit OPERATOR elrdnswit

    | expressionLackingRightDelimiterStartingWithInfixToken "||" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("||", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "&&" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("&&", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "==" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("==", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "!=" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("!=", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "<" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("<", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "<=" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("<=", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken ">" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr(">", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken ">=" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr(">=", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "+" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("+", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "-" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("-", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "*" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("*", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "/" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("/", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "%" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("%", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "**" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("**", $1, $3, @$); }

    // elrdswit OPERATOR eird

    | expressionLackingRightDelimiterStartingWithInfixToken "||" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("||", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "&&" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("&&", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "==" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("==", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "!=" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("!=", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "<" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("<", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "<=" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("<=", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken ">" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr(">", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken ">=" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr(">=", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "+" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("+", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "-" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("-", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "*" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("*", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "/" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("/", $1, $3, @$); }
    | expressionLackingRightDelimiterStartingWithInfixToken "%" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("%", $1, $3, @$); }

    | expressionLackingRightDelimiterStartingWithInfixToken "**" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("**", $1, $3, @$); }
    ;

expressionLackingRightDelimiterNotStartingWithInfixToken
    // elrdnswit OPERATOR elrdswit

    : expressionLackingRightDelimiterNotStartingWithInfixToken "||" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("||", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "&&" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("&&", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "==" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("==", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "!=" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("!=", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "<" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("<", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "<=" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("<=", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken ">" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr(">", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken ">=" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr(">=", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "+" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("+", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "-" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("-", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "*" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("*", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "/" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("/", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "%" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("%", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "**" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("**", $1, $3, @$); }

    // elrdnswit OPERATOR elrdnswit

    | expressionLackingRightDelimiterNotStartingWithInfixToken "||" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("||", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "&&" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("&&", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "==" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("==", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "!=" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("!=", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "<" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("<", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "<=" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("<=", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken ">" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr(">", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken ">=" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr(">=", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "+" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("+", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "-" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("-", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "*" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("*", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "/" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("/", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "%" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("%", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "**" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("**", $1, $3, @$); }
    
    // elrdnswit OPERATOR eird

    | expressionLackingRightDelimiterNotStartingWithInfixToken "||" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("||", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "&&" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("&&", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "==" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("==", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "!=" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("!=", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "<" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("<", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "<=" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("<=", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken ">" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr(">", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken ">=" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr(">=", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "+" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("+", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "-" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("-", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "*" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("*", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "/" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("/", $1, $3, @$); }
    | expressionLackingRightDelimiterNotStartingWithInfixToken "%" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("%", $1, $3, @$); }

    | expressionLackingRightDelimiterNotStartingWithInfixToken "**" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("**", $1, $3, @$); }

    // eird OPERATOR elrdswit

    | expressionIncludingRightDelimiter "||" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("||", $1, $3, @$); }
    | expressionIncludingRightDelimiter "&&" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("&&", $1, $3, @$); }

    | expressionIncludingRightDelimiter "==" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("==", $1, $3, @$); }
    | expressionIncludingRightDelimiter "!=" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("!=", $1, $3, @$); }

    | expressionIncludingRightDelimiter "<" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("<", $1, $3, @$); }
    | expressionIncludingRightDelimiter "<=" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("<=", $1, $3, @$); }
    | expressionIncludingRightDelimiter ">" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr(">", $1, $3, @$); }
    | expressionIncludingRightDelimiter ">=" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr(">=", $1, $3, @$); }

    | expressionIncludingRightDelimiter "+" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("+", $1, $3, @$); }
    | expressionIncludingRightDelimiter "-" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("-", $1, $3, @$); }

    | expressionIncludingRightDelimiter "*" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("*", $1, $3, @$); }
    | expressionIncludingRightDelimiter "/" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("/", $1, $3, @$); }
    | expressionIncludingRightDelimiter "%" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("%", $1, $3, @$); }

    | expressionIncludingRightDelimiter "**" expressionLackingRightDelimiterStartingWithInfixToken
        { $$ = yy.binaryExpr("**", $1, $3, @$); }

    // eird OPERATOR elrdnswit

    | expressionIncludingRightDelimiter "||" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("||", $1, $3, @$); }
    | expressionIncludingRightDelimiter "&&" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("&&", $1, $3, @$); }

    | expressionIncludingRightDelimiter "==" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("==", $1, $3, @$); }
    | expressionIncludingRightDelimiter "!=" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("!=", $1, $3, @$); }

    | expressionIncludingRightDelimiter "<" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("<", $1, $3, @$); }
    | expressionIncludingRightDelimiter "<=" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("<=", $1, $3, @$); }
    | expressionIncludingRightDelimiter ">" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr(">", $1, $3, @$); }
    | expressionIncludingRightDelimiter ">=" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr(">=", $1, $3, @$); }

    | expressionIncludingRightDelimiter "+" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("+", $1, $3, @$); }
    | expressionIncludingRightDelimiter "-" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("-", $1, $3, @$); }

    | expressionIncludingRightDelimiter "*" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("*", $1, $3, @$); }
    | expressionIncludingRightDelimiter "/" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("/", $1, $3, @$); }
    | expressionIncludingRightDelimiter "%" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("%", $1, $3, @$); }

    | expressionIncludingRightDelimiter "**" expressionLackingRightDelimiterNotStartingWithInfixToken
        { $$ = yy.binaryExpr("**", $1, $3, @$); }
    
    // eird OPERATOR eird

    | expressionIncludingRightDelimiter "||" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("||", $1, $3, @$); }
    | expressionIncludingRightDelimiter "&&" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("&&", $1, $3, @$); }

    | expressionIncludingRightDelimiter "==" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("==", $1, $3, @$); }
    | expressionIncludingRightDelimiter "!=" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("!=", $1, $3, @$); }

    | expressionIncludingRightDelimiter "<" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("<", $1, $3, @$); }
    | expressionIncludingRightDelimiter "<=" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("<=", $1, $3, @$); }
    | expressionIncludingRightDelimiter ">" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr(">", $1, $3, @$); }
    | expressionIncludingRightDelimiter ">=" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr(">=", $1, $3, @$); }

    | expressionIncludingRightDelimiter "+" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("+", $1, $3, @$); }
    | expressionIncludingRightDelimiter "-" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("-", $1, $3, @$); }

    | expressionIncludingRightDelimiter "*" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("*", $1, $3, @$); }
    | expressionIncludingRightDelimiter "/" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("/", $1, $3, @$); }
    | expressionIncludingRightDelimiter "%" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("%", $1, $3, @$); }

    | expressionIncludingRightDelimiter "**" expressionIncludingRightDelimiter
        { $$ = yy.binaryExpr("**", $1, $3, @$); }

    | "!" expression
        { $$ = yy.unaryExpr("!", $2, @$); }

    | functionCall

    | typedObjectLiteral

    | NUMBER
        { $$ = { type: yy.NodeType.NumberLiteral, value: yytext, location: yy.camelCase(@$) }; }
    | STRING
        { $$ = { type: yy.NodeType.StringLiteral, value: yytext, location: yy.camelCase(@$) }; }
    
    | oneOrMoreDotSeparatedIdentifiers
        { $$ = yy.buildDotChainIfNeeded($1); }
    | heterogeneousDotExpr
    | functionCall
    | index
    ;

oneOrMoreDotSeparatedIdentifiers
    : IDENTIFIER
        { $$ = [{ type: yy.NodeType.Identifier, value: $1, location: yy.camelCase(@$) }]; }
    | oneOrMoreDotSeparatedIdentifiers "." IDENTIFIER
        { $$ = $1.concat([{ type: yy.NodeType.Identifier, value: $3, location: yy.camelCase(@3) }]); }
    ;

heterogeneousDotExpr
    : functionCall "." IDENTIFIER
        { $$ = { type: yy.NodeType.DotExpr, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | index "." IDENTIFIER
        { $$ = { type: yy.NodeType.DotExpr, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | heterogeneousDotExpr "." IDENTIFIER
        { $$ = { type: yy.NodeType.DotExpr, left: $1, right: $3, location: yy.camelCase(@$) }; }
    ;

functionCall
    : oneOrMoreDotSeparatedIdentifiers optTypeArgs "(" optArgs ")"
        { $$ = { type: yy.NodeType.FunctionCall, callee: yy.buildDotChainIfNeeded($1), typeArgs: $2, args: $4, location: yy.camelCase(@$) }; }
    | heterogeneousDotExpr optTypeArgs "(" optArgs ")"
        { $$ = { type: yy.NodeType.FunctionCall, callee: $1, typeArgs: $2, args: $4, location: yy.camelCase(@$) }; }
    ;

index
    : oneOrMoreDotSeparatedIdentifiers "[" expression "]"
        { $$ = {type: yy.NodeType.BinaryExpr, operation: "[", left: yy.buildDotChainIfNeeded($1), right: $3, location: yy.camelCase(@$) }; }
    | functionCall "[" expression "]"
        { $$ = {type: yy.NodeType.BinaryExpr, operation: "[", left: $1, right: $3, location: yy.camelCase(@$) }; }
    | heterogeneousDotExpr "[" expression "]"
        { $$ = {type: yy.NodeType.BinaryExpr, operation: "[", left: $1, right: $3, location: yy.camelCase(@$) }; }
    | index "[" expression "]"
        { $$ = {type: yy.NodeType.BinaryExpr, operation: "[", left: $1, right: $3, location: yy.camelCase(@$) }; }
    ;

typedObjectLiteral
    : type "{" "}"
        { $$ = { type: yy.NodeType.TypedObjectLiteral, valueType: $1, entries: [], location: yy.camelCase(@$) }; }
    | type "{" objectEntries "}"
        { $$ = { type: yy.NodeType.TypedObjectLiteral, valueType: $1, entries: $3, location: yy.camelCase(@$) }; }
    | type "{" objectEntries "," "}"
        { $$ = { type: yy.NodeType.TypedObjectLiteral, valueType: $1, entries: $3, location: yy.camelCase(@$) }; }
    ;

objectEntries
    : IDENTIFIER ":" expression
        { $$ = [{ type: yy.NodeType.ObjectEntry, key: $1, value: $3, location: yy.camelCase(@$) }]; }
    | objectEntries "," IDENTIFIER ":" expression
        { $$ = $1.concat([{ type: yy.NodeType.ObjectEntry, key: $3, value: $5, location: yy.merge(@3, @5) }]); }
    ;

expression
    : expressionIncludingRightDelimiter
    | expressionLackingRightDelimiter
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