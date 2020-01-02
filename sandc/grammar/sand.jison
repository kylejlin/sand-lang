/* Builds AST from Sand source. */

/* Uses custom scanner */

/* operator associations and precedence */

%nonassoc "=" "**=" "*=" "/=" "%=" "+=" "-="

%left "||"
%left "&&"

%left "==" "!="
%left "<" "<=" ">" ">="

%nonassoc "..=" ".."

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
    : %empty
        { $$ = null; }
    | "package" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = $1.map(ident => ident.name).join("."); }
    ;

optImports
    : %empty
        { $$ = []; }
    | optImports "import" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = $1.concat([{ type: yy.NodeType.Import, name: $3.map(ident => ident.name).join("."), alias: null, location: yy.merge(@2, @4) }]); }
    ;

optUseStatements
    : %empty
        { $$ = []; }
    | optUseStatements "use" oneOrMoreDotSeparatedIdentifiers "as" NON_RESERVED_IDENTIFIER ";"
        { $$ = $1.concat([{ type: yy.NodeType.Use, name: $3.map(ident => ident.name).join("."), alias: $5, location: yy.merge(@2, @6) }]); }
    | optUseStatements "use" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = $1.concat([{ type: yy.NodeType.Use, name: $3.map(ident => ident.name).join("."), alias: null, location: yy.merge(@2, @4) }]); }
    ;

optCopyStatements
    : %empty
        { $$ = []; }
    | optCopyStatements "copy" oneOrMoreDotSeparatedIdentifiers "as" NON_RESERVED_IDENTIFIER ";"
        { $$ = $1.concat([{ type: yy.NodeType.Copy, name: $3.map(ident => ident.name).join("."), alias: $5, location: yy.merge(@2, @6) }]); }
    | optCopyStatements "copy" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = $1.concat([{ type: yy.NodeType.Copy, name: $3.map(ident => ident.name).join("."), alias: null, location: yy.merge(@2, @4) }]); }
    ;

pubClass
    : "pub" privClass
        { $$ = { ...$2, isPub: true, location: yy.camelCase(@$) }; }
    ;

optTypeArgDefs
    : %empty
        { $$ = []; }
    | "<" typeArgDefs ">"
        { $$ = $2; }
    ;

typeArgDefs
    : NON_RESERVED_IDENTIFIER
        { $$ = [{ type: yy.NodeType.TypeArgDef, name: $1, constraint: { constraintType: yy.ConstraintType.None }, location: yy.camelCase(@$) }]; }
    | NON_RESERVED_IDENTIFIER "extends" type
        { $$ = [{ type: yy.NodeType.TypeArgDef, name: $1, constraint: { constraintType: yy.ConstraintType.Extends, superClass: $3 }, location: yy.camelCase(@$) }]; }
    | typeArgDefs "," NON_RESERVED_IDENTIFIER
        { $$ = $1.concat([{ type: yy.NodeType.TypeArgDef, name: $3, constraint: { constraintType: yy.ConstraintType.None }, location: yy.camelCase(@3) }]); }
    | typeArgDefs "," NON_RESERVED_IDENTIFIER "extends" type
        { $$ = $1.concat([{ type: yy.NodeType.TypeArgDef, name: $3, constraint: { constraintType: yy.ConstraintType.Extends, superClass: $5 }, location: yy.merge(@3, @5) }]); }
    ;

optPrivClasses
    : %empty
        { $$ = []; }
    | optPrivClasses privClass
        { $$ = $1.concat([$2]); }
    ;

privClass
    : optOpenOrAbstract "class" NON_RESERVED_IDENTIFIER optTypeArgDefs optExtension "{" optCopyStatements optUseStatements optClassItems "}"
        { $$ = { type: yy.NodeType.Class, isPub: false, overridability: $1, name: $3, typeArgDefs: $4, superClass: $5, copies: $7, useStatements: $8, items: $9, location: yy.camelCase(@$) }; }
    ;

optOpenOrAbstract
    : %empty
        { $$ = yy.Overridability.Final; }
    | "open"
        { $$ = yy.Overridability.Open; }
    | "abstract"
        { $$ = yy.Overridability.Abstract; }
    ;

optExtension
    : %empty
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
    | type "[" "+" "]"
        { $$ = { type: yy.NodeType.Type, name: "rlist", args: [yy.wrapPrimitiveIfNeeded($1)], location: yy.camelCase(@$) }; }
    ;

optTypeArgs
    : %empty
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
    : %empty
        { $$ = []; }
    | optClassItems classItem
        { $$ = $1.concat([$2]); }
    ;

classItem
    : optAccessModifier NON_RESERVED_IDENTIFIER ":" type ";"
        { $$ = { type: yy.NodeType.InstancePropertyDeclaration, accessModifier: $1, isReassignable: false, name: $2, valueType: $4, location: yy.camelCase(@$) }; }
    | optAccessModifier "re" NON_RESERVED_IDENTIFIER ":" type ";"
        { $$ = { type: yy.NodeType.InstancePropertyDeclaration, accessModifier: $1, isReassignable: true, name: $3, valueType: $5, location: yy.camelCase(@$) }; }

    | optAccessModifier "static" NON_RESERVED_IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: false, name: $3, valueType: $5, initialValue: $7, location: yy.camelCase(@$) }; }
    | optAccessModifier "static" "re" NON_RESERVED_IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: true, name: $4, valueType: $6, initialValue: $8, location: yy.camelCase(@$) }; }
    | optAccessModifier "static" NON_RESERVED_IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: false, name: $3, valueType: $5, initialValue: $7, location: yy.camelCase(@$) }; }
    | optAccessModifier "static" "re" NON_RESERVED_IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: true, name: $4, valueType: $6, initialValue: $8, location: yy.camelCase(@$) }; }
    
    | optAccessModifier "static" NON_RESERVED_IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: false, name: $3, valueType: null, initialValue: $5, location: yy.camelCase(@$) }; }
    | optAccessModifier "static" "re" NON_RESERVED_IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: true, name: $4, valueType: null, initialValue: $6, location: yy.camelCase(@$) }; }
    | optAccessModifier "static" NON_RESERVED_IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: false, name: $3, valueType: null, initialValue: $5, location: yy.camelCase(@$) }; }
    | optAccessModifier "static" "re" NON_RESERVED_IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: true, name: $4, valueType: null, initialValue: $6, location: yy.camelCase(@$) }; }

    | optAccessModifier NON_RESERVED_IDENTIFIER optTypeArgDefs "(" optArgDefs ")" ":" type compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: true, isOpen: false, name: $2, typeArgs: $3, args: $5, returnType: $8, body: $9, location: yy.camelCase(@$) }; }
    | optAccessModifier NON_RESERVED_IDENTIFIER optTypeArgDefs "(" optArgDefs ")" compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: true, isOpen: false, name: $2, typeArgs: $3, args: $5, returnType: null, body: $7, location: yy.camelCase(@$) }; }

    | optAccessModifier NON_RESERVED_IDENTIFIER optTypeArgDefs "(" "this" optCommaAndArgDefs ")" ":" type compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: false, isOpen: false, name: $2, typeArgs: $3, args: $6, returnType: $9, body: $10, location: yy.camelCase(@$) }; }
    | optAccessModifier NON_RESERVED_IDENTIFIER optTypeArgDefs "(" "this" optCommaAndArgDefs ")" compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: false, isOpen: false, name: $2, typeArgs: $3, args: $6, returnType: null, body: $8, location: yy.camelCase(@$) }; }

    | optAccessModifier "open" NON_RESERVED_IDENTIFIER optTypeArgDefs "(" optArgDefs ")" ":" type compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: true, isOpen: true, name: $3, typeArgs: $4, args: $6, returnType: $9, body: $10, location: yy.camelCase(@$) }; }
    | optAccessModifier "open" NON_RESERVED_IDENTIFIER optTypeArgDefs "(" optArgDefs ")" compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: true, isOpen: true, name: $3, typeArgs: $4, args: $6, returnType: null, body: $8, location: yy.camelCase(@$) }; }

    | optAccessModifier "open" NON_RESERVED_IDENTIFIER optTypeArgDefs "(" "this" optCommaAndArgDefs ")" ":" type compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: false, isOpen: true, name: $3, typeArgs: $4, args: $7, returnType: $10, body: $11, location: yy.camelCase(@$) }; }
    | optAccessModifier "open" NON_RESERVED_IDENTIFIER optTypeArgDefs "(" "this" optCommaAndArgDefs ")" compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: false, isOpen: true, name: $3, typeArgs: $4, args: $7, returnType: null, body: $9, location: yy.camelCase(@$) }; }

    | optAccessModifier "abstract" NON_RESERVED_IDENTIFIER optTypeArgDefs "(" "this" optCommaAndArgDefs ")" ":" type ";"
        { $$ = { type: yy.NodeType.AbstractMethodDeclaration, accessModifier: $1, isStatic: false, name: $3, typeArgs: $4, args: $7, returnType: $10, location: yy.camelCase(@$) }; }
    | optAccessModifier "abstract" NON_RESERVED_IDENTIFIER optTypeArgDefs "(" "this" optCommaAndArgDefs ")" ";"
        { $$ = { type: yy.NodeType.AbstractMethodDeclaration, accessModifier: $1, isStatic: false, name: $3, typeArgs: $4, args: $7, returnType: null, location: yy.camelCase(@$) }; }
    ;

optAccessModifier
    : %empty
        { $$ = null; }
    | "pub"
        { $$ = "pub"; }
    | "prot"
        { $$ = "prot"; }
    ;

optArgDefs
    : %empty
        { $$ = []; }
    | argDefs
    ;

optCommaAndArgDefs
    : %empty
        { $$ = []; }
    | "," argDefs
        { $$ = $2; }
    ;

argDefs
    : NON_RESERVED_IDENTIFIER ":" type
        { $$ = [{ type: yy.NodeType.ArgDef, name: $1, valueType: $3, location: yy.camelCase(@$) }]; }
    | argDefs "," NON_RESERVED_IDENTIFIER ":" type
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
    : %empty
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
    : "let" NON_RESERVED_IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "let!" NON_RESERVED_IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "re" NON_RESERVED_IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "re!" NON_RESERVED_IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }

    | "let" NON_RESERVED_IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "let!" NON_RESERVED_IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "re" NON_RESERVED_IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "re!" NON_RESERVED_IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }

    | "let" NON_RESERVED_IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "let!" NON_RESERVED_IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "re" NON_RESERVED_IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }
    | "re!" NON_RESERVED_IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.camelCase(@$) }; }

    | "let" NON_RESERVED_IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "let!" NON_RESERVED_IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "re" NON_RESERVED_IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.camelCase(@$) }; }
    | "re!" NON_RESERVED_IDENTIFIER ":" type "=" ifNode ";"
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
    | indexExpression
    
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

    | range

    | castExpression

    | parenthesizedExpression
    ;

parenthesizedExpression
    : "(" simpleExpression ")"
        { $$ = $2; }
    | "(" ifNode ")"
        { $$ = $2; }
    ;

indexExpression
    : simpleExpression "[" simpleExpression "]"
        { $$ = { type: yy.NodeType.IndexExpr, left: $1, right: $3, location: yy.camelCase(@$) }; }
    ;

callableExpression
    : identifier
        { $$ = { type: yy.NodeType.Identifier, name: $1, location: yy.camelCase(@$) }; }
    | callableExpression "." NON_RESERVED_IDENTIFIER
        { $$ = { type: yy.NodeType.DotExpr, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | functionCall "." NON_RESERVED_IDENTIFIER
        { $$ = { type: yy.NodeType.DotExpr, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | indexExpression "." NON_RESERVED_IDENTIFIER
        { $$ = { type: yy.NodeType.DotExpr, left: $1, right: $3, location: yy.camelCase(@$) }; }
    | parenthesizedExpression "." NON_RESERVED_IDENTIFIER
        { $$ = { type: yy.NodeType.DotExpr, left: $1, right: $3, location: yy.camelCase(@$) }; }
    ;

functionCall
    : callableExpression optFunctionCallTypeArgs "(" optArgs ")"
        { $$ = { type: yy.NodeType.FunctionCall, callee: $1, typeArgs: $2, args: $4, location: yy.camelCase(@$) }; }
    ;

optFunctionCallTypeArgs
    : %empty
        { $$ = []; }
    | FUNCTION_CALL_TYPE_ARG_LEFT_ANGLE_BRACKET typeArgs ">"
        { $$ = $2; }
    ;

optArgs
    : %empty
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
    : identifier
        { $$ = [{ type: yy.NodeType.Identifier, name: $1, location: yy.camelCase(@$) }]; }
    | oneOrMoreDotSeparatedIdentifiers "." NON_RESERVED_IDENTIFIER
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
    : NON_RESERVED_IDENTIFIER ":" simpleExpression
        { $$ = [{ type: yy.NodeType.ObjectEntry, key: $1, value: $3, location: yy.camelCase(@$) }]; }
    | NON_RESERVED_IDENTIFIER ":" ifNode
        { $$ = [{ type: yy.NodeType.ObjectEntry, key: $1, value: $3, location: yy.camelCase(@$) }]; }
    | objectEntries "," NON_RESERVED_IDENTIFIER ":" simpleExpression
        { $$ = $1.concat([{ type: yy.NodeType.ObjectEntry, key: $3, value: $5, location: yy.merge(@3, @5) }]); }
    | objectEntries "," NON_RESERVED_IDENTIFIER ":" ifNode
        { $$ = $1.concat([{ type: yy.NodeType.ObjectEntry, key: $3, value: $5, location: yy.merge(@3, @5) }]); }
    ;

arrayLiteral
    : "[" "]"
        { $$ = { type: yy.NodeType.ArrayLiteral, elements: [], location: yy.camelCase(@$) }; }
    | "[" expressionSequence "]"
        { $$ = { type: yy.NodeType.ArrayLiteral, elements: $2, location: yy.camelCase(@$) }; }
    | "[" expressionSequence "," "]"
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

range
    : endInclusiveRange
    | endExclusiveRange
    ;

endInclusiveRange
    : simpleExpression "..=" simpleExpression
        { $$ = { type: yy.NodeType.RangeLiteral, start: $1, end: $3, includesEnd: true, location: yy.camelCase(@$) }; }
    ;

endExclusiveRange
    : simpleExpression ".." simpleExpression
        { $$ = { type: yy.NodeType.RangeLiteral, start: $1, end: $3, includesEnd: false, location: yy.camelCase(@$) }; }
    ;

castExpression
    : simpleExpression "as!" CAST_EXPRESSION_TARGET_TYPE
        { $$ = { type: yy.NodeType.CastExpr, value: $1, targetType: yy.parseType($3, @3), location: yy.camelCase(@$) }; }
    ;

identifier
    : NON_RESERVED_IDENTIFIER
    | "this"
    | "super"
    ;