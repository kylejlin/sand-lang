/* Builds AST from Sand source. */

/* Uses custom scanner */

/* operator associations and precedence */

%nonassoc "=" "**=" "*=" "/=" "%=" "+=" "-="

%left "||"
%left "&&"

%left "==" "!="
%left "<" "<=" ">" ">="

%left "as!"

%left "+" "-"
%left "*" "/" "%"
%right "**"

%nonassoc "~"

%nonassoc "!"

%nonassoc UMINUS

%nonassoc "["
%nonassoc "("
%nonassoc TYPE

%left "."

%start file

%% /* language grammar */

file
    : optPackage optImports optUseStatements pubClass optPrivClasses EOF
        { return { type: yy.NodeType.File, packageName: $1, imports: $2, useStatements: $3, pubClass: $4, privClasses: $5, location: yy.camelCase(@$) }; }
    ;

optPackage
    : /* empty */
        { $$ = null; }
    | "package" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = $1.map(ident => ident.name).join("."); }
    ;

optImports
    : /* empty */
        { $$ = []; }
    | optImports "import" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = $1.concat([{ type: yy.NodeType.Import, name: $3.map(ident => ident.name).join("."), alias: null, location: yy.merge(@2, @4) }]); }
    ;

optUseStatements
    : /* empty */
        { $$ = []; }
    | optUseStatements "use" oneOrMoreDotSeparatedIdentifiers "as" IDENTIFIER ";"
        { $$ = $1.concat([{ type: yy.NodeType.Use, name: $3.map(ident => ident.name).join("."), alias: $5, location: yy.merge(@2, @6) }]); }
    | optUseStatements "use" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = $1.concat([{ type: yy.NodeType.Use, name: $3.map(ident => ident.name).join("."), alias: null, location: yy.merge(@2, @4) }]); }
    ;

optCopyStatements
    : /* empty */
        { $$ = []; }
    | optCopyStatements "copy" oneOrMoreDotSeparatedIdentifiers "as" IDENTIFIER ";"
        { $$ = $1.concat([{ type: yy.NodeType.Copy, name: $3.map(ident => ident.name).join("."), alias: $5, location: yy.merge(@2, @6) }]); }
    | optCopyStatements "copy" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = $1.concat([{ type: yy.NodeType.Copy, name: $3.map(ident => ident.name).join("."), alias: null, location: yy.merge(@2, @4) }]); }
    ;

pubClass
    : "pub" "class" IDENTIFIER optTypeArgDefs optExtension "{" optCopyStatements optUseStatements optClassItems "}"
        { $$ = { type: yy.NodeType.Class, isPub: true, name: $3, typeArgDefs: $4, superClass: $5, copies: $7, useStatements: $8, items: $9, location: yy.camelCase(@$) }; }
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
    | optPrivClasses "class" IDENTIFIER optTypeArgDefs optExtension "{" optCopyStatements optUseStatements optClassItems "}"
        { $$ = $1.concat([{ type: yy.NodeType.Class, isPub: false, name: $3, typeArgDefs: $4, superClass: $5, copies: $7, useStatements: $8, items: $9, location: yy.merge(@2, @10) }]); }
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
    : oneOrMoreDotSeparatedIdentifiers "<" typeArgs ">" %prec TYPE
        { $$ = { type: yy.NodeType.Type, name: $1.map(ident => ident.name).join('.'), args: $3, location: yy.camelCase(@$) }; }
    | oneOrMoreDotSeparatedIdentifiers
        { $$ = { type: yy.NodeType.Type, name: $1.map(ident => ident.name).join('.'), args: [], location: yy.camelCase(@$) }; }
    | type "[" "]"
        { $$ = { type: yy.NodeType.Type, name: "array", args: [$1], location: yy.camelCase(@$) }; }
    | type "[" "*" "]"
        { $$ = { type: yy.NodeType.Type, name: "rlist", args: [yy.wrapPrimitiveIfNeeded($1)], location: yy.camelCase(@$) }; }
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

optClassItems
    : /* empty */
        { $$ = []; }
    | optClassItems classItem
        { $$ = $1.concat([$2]); }
    ;

classItem
    : optAccessModifier IDENTIFIER ":" type ";"
        { $$ = { type: yy.NodeType.PropertyDeclaration, accessModifier: $1, name: $2, valueType: $4, location: yy.camelCase(@$) }; }
    | optAccessModifier IDENTIFIER optTypeArgDefs "(" optArgDefs ")" ":" type compoundNode
        { $$ = { type: yy.NodeType.MethodDeclaration, accessModifier: $1, name: $2, typeArgs: $3, args: $5, returnType: $8, body: $9, location: yy.camelCase(@$) }; }
    | optAccessModifier IDENTIFIER optTypeArgDefs "(" optArgDefs ")" compoundNode
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

compoundNode
    : "{" "}"
        { $$ = []; }
    | "{" simpleExpression "}"
        { $$ = [$2]; }
    | "{" nodeSequence "}"
        { $$ = $2; }
    | "{" nodeSequence simpleExpression "}"
        { $$ = $2.concat([$3]); }
    ;

nodeSequence
    : simpleExpression ";"
        { $$ = [$1]; }
    | rightDelimitedStatement
        { $$ = [$1]; }
    | nodeSequence simpleExpression ";"
        { $$ = $1.concat([$2]); }
    | nodeSequence rightDelimitedStatement
        { $$ = $1.concat([$2]); }
    ;

rightDelimitedStatement
    : ifNode
    | returnStatement
    | breakStatement
    | continueStatement
    | localVarDeclaration
    | assignment
    ;

ifNode
    : "if" simpleExpression compoundNode optIfAlternatives
        { $$ = { type: yy.NodeType.If, condition: $2, body: $3, alternatives: $4, location: yy.camelCase(@$) }; }
    ;

optIfAlternatives
    : /* empty */
        { $$ = []; }
    | ifAlternatives
    ;

ifAlternatives
    : elseIfs "else" compoundNode
        { $$ = $1.concat([{ type: yy.NodeType.IfAlternative, alternativeType: yy.IfAlternativeType.Else, body: $3, location: yy.merge(@2, @3) }]); }
    | "else" compoundNode
        { $$ = [{ type: yy.NodeType.IfAlternative, alternativeType: yy.IfAlternativeType.Else, body: $2, location: yy.camelCase(@$) }]; }
    ;

elseIfs
    : "else" "if" simpleExpression compoundNode
        { $$ = [{ type: yy.NodeType.IfAlternative, alternativeType: yy.IfAlternativeType.ElseIf, condition: $3, body: $4, location: yy.camelCase(@$) }]; }
    | elseIfs "else" "if" simpleExpression compoundNode
        { $$ = $1.concat([{ type: yy.NodeType.IfAlternative, alternativeType: yy.IfAlternativeType.ElseIf, condition: $4, body: $5, location: yy.merge(@2, @5) }]); }
    ;

returnStatement
    : "return_" simpleExpression ";"
        { $$ = { type: yy.NodeType.Return, value: $2, location: yy.camelCase(@$) }; }
    | "return_" ifNode ";"
        { $$ = { type: yy.NodeType.Return, value: $2, location: yy.camelCase(@$) }; }
    | "return_" ";"
        { $$ = { type: yy.NodeType.Return, value: null, location: yy.camelCase(@$) }; }
    ; 

breakStatement
    : "break" ";"
        { $$ = { type: yy.NodeType.Break, value: null, location: yy.camelCase(@$) }; }
    ;

continueStatement
    : "continue" ";"
        { $$ = { type: yy.NodeType.Continue, location: yy.camelCase(@$) }; }
    ;

localVarDeclaration
    : "let" IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "let!" IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "re" IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "re!" IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }

    | "let" IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "let!" IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "re" IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "re!" IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }

    | "let" IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "let!" IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "re" IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "re!" IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }

    | "let" IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "let!" IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "re" IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "re!" IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    ;

assignment
    : simpleExpression assignmentOperation simpleExpression ";"
        { $$ = { type: yy.NodeType.Assignment, assignee: $1, assignmentType: $2, value: $3, location: yy.camelCase(@$) }; }
    | simpleExpression assignmentOperation ifNode ";"
        { $$ = { type: yy.NodeType.Assignment, assignee: $1, assignmentType: $2, value: $3, location: yy.camelCase(@$) }; }
    ;

assignmentOperation
    : "="
    | "**="
    | "*="
    | "/="
    | "%="
    | "+="
    | "-="
    ;

simpleExpression
    : NUMBER
        { $$ = { type: yy.NodeType.NumberLiteral, value: $1, location: yy.camelCase(@$) }; }
    | STRING
        { $$ = { type: yy.NodeType.StringLiteral, value: $1, location: yy.camelCase(@$) }; }
    | CHARACTER
        { $$ = { type: yy.NodeType.CharacterLiteral, value: $1, location: yy.camelCase(@$) }; }

    | callableExpression
    | functionCall
    | simpleExpression "[" simpleExpression "]"
        { $$ = { type: yy.NodeType.IndexExpr, left: $1, right: $3, location: yy.camelCase(@$) }; }
    
    | "-" simpleExpression %prec UMINUS
        { $$ = { type: yy.NodeType.PrefixExpr, operation: $1, right: $2, location: yy.camelCase(@$) }; }
    | "!" simpleExpression
        { $$ = { type: yy.NodeType.PrefixExpr, operation: $1, right: $2, location: yy.camelCase(@$) }; }
    | "~" simpleExpression
        { $$ = { type: yy.NodeType.PrefixExpr, operation: $1, right: $2, location: yy.camelCase(@$) }; }

    | simpleExpression "**" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | simpleExpression "*" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | simpleExpression "/" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | simpleExpression "%" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | simpleExpression "+" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | simpleExpression "-" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | simpleExpression "<" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | simpleExpression "<=" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | simpleExpression ">" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | simpleExpression ">=" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | simpleExpression "==" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | simpleExpression "!=" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | simpleExpression "&&" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | simpleExpression "||" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.camelCase(@$) }; }
    
    | typedObjectLiteral

    | arrayLiteral

    | castExpression

    | parenthesizedExpression
    ;

parenthesizedExpression
    : "(" simpleExpression ")"
        { $$ = $2; }
    | "(" ifNode ")"
        { $$ = $2; }
    ;

callableExpression
    : IDENTIFIER
        { $$ = { type: yy.NodeType.Identifier, name: $1, location: yy.camelCase(@$) }; }
    | callableExpression "." IDENTIFIER
        { $$ = { type: yy.NodeType.DotExpr, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | functionCall "." IDENTIFIER
        { $$ = { type: yy.NodeType.DotExpr, left: $1, right: $3, location: yy.camelCase(@$) }; }
    ;

functionCall
    : callableExpression optFunctionCallTypeArgs "(" optArgs ")"
        { $$ = { type: yy.NodeType.FunctionCall, callee: $1, typeArgs: $2, args: $4, location: yy.camelCase(@$) }; }
    ;

optFunctionCallTypeArgs
    : /* empty */
        { $$ = []; }
    | FUNCTION_CALL_TYPE_ARG_LEFT_ANGLE_BRACKET typeArgs ">"
        { $$ = $2; }
    ;

optArgs
    : /* empty */
        { $$ = []; }
    | args
    ;

args
    : simpleExpression
        { $$ = [$1]; }
    | ifNode
        { $$ = [$1]; }
    | args "," simpleExpression
        { $$ = $1.concat([$3]); }
    | args "," ifNode
        { $$ = $1.concat([$3]); }
    ;

oneOrMoreDotSeparatedIdentifiers
    : IDENTIFIER
        { $$ = [{ type: yy.NodeType.Identifier, name: $1, location: yy.camelCase(@$) }]; }
    | oneOrMoreDotSeparatedIdentifiers "." IDENTIFIER
        { $$ = $1.concat([{ type: yy.NodeType.Identifier, name: $3, location: yy.camelCase(@3) }]); }
    ;

typedObjectLiteral
    : OBJECT_LITERAL_TYPE "{" "}"
        { $$ = { type: yy.NodeType.TypedObjectLiteral, valueType: yy.parseType($1, @1), entries: [], location: yy.camelCase(@$) }; }
    | OBJECT_LITERAL_TYPE "{" objectEntries "}"
        { $$ = { type: yy.NodeType.TypedObjectLiteral, valueType: yy.parseType($1, @1), entries: $3, location: yy.camelCase(@$) }; }
    | OBJECT_LITERAL_TYPE "{" objectEntries "," "}"
        { $$ = { type: yy.NodeType.TypedObjectLiteral, valueType: yy.parseType($1, @1), entries: $3, location: yy.camelCase(@$) }; }
    ;

objectEntries
    : IDENTIFIER ":" simpleExpression
        { $$ = [{ type: yy.NodeType.ObjectEntry, key: $1, value: $3, location: yy.camelCase(@$) }]; }
    | IDENTIFIER ":" ifNode
        { $$ = [{ type: yy.NodeType.ObjectEntry, key: $1, value: $3, location: yy.camelCase(@$) }]; }
    | objectEntries "," IDENTIFIER ":" expression
        { $$ = $1.concat([{ type: yy.NodeType.ObjectEntry, key: $3, value: $5, location: yy.merge(@3, @5) }]); }
    | objectEntries "," IDENTIFIER ":" ifNode
        { $$ = $1.concat([{ type: yy.NodeType.ObjectEntry, key: $3, value: $5, location: yy.merge(@3, @5) }]); }
    ;

arrayLiteral
    : "[" "]"
        { $$ = { type: yy.NodeType.ArrayLiteral, elements: [], location: yy.camelCase(@$) }; }
    | "[" expressionSequence "]"
        { $$ = { type: yy.NodeType.ArrayLiteral, elements: $2, location: yy.camelCase(@$) }; }
    ;

expressionSequence
    : simpleExpression
        { $$ = [$1]; }
    | ifNode
        { $$ = [$1]; }
    | expressionSequence "," simpleExpression
        { $$ = $1.concat([$3]); }
    | expressionSequence "," ifNode
        { $$ = $1.concat([$3]); }
    ;

castExpression
    : simpleExpression "as!" CAST_EXPRESSION_TARGET_TYPE
        { $$ = { type: yy.NodeType.CastExpr, value: $1, targetType: yy.parseType($3, @3), location: yy.camelCase(@$) }; }
    ;