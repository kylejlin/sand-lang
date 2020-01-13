/* Builds AST from Sand source. */

/* Uses custom scanner */

/* operator associations and precedence */

%nonassoc "=" "**=" "*=" "/=" "%=" "+=" "-="

%nonassoc "->"

%left "||"
%left "&&"

%left "==" "!=" "~="
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
        { return { type: yy.NodeType.File, packageName: $1, imports: $2, useStatements: $3, pubClass: $4, privClasses: $5, location: yy.convertToRange(@$) }; }
    ;

optPackage
    : %empty
        { $$ = null; }
    | "package" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = $2.map(ident => ident.name).join("."); }
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
        { $$ = $1.concat([{ type: yy.NodeType.Use, name: $3.map(ident => ident.name).join("."), alias: $5, doesShadow: false, location: yy.merge(@2, @6) }]); }
    | optUseStatements "use" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = $1.concat([{ type: yy.NodeType.Use, name: $3.map(ident => ident.name).join("."), alias: null, doesShadow: false, location: yy.merge(@2, @4) }]); }
    | optUseStatements "use!" oneOrMoreDotSeparatedIdentifiers "as" NON_RESERVED_IDENTIFIER ";"
        { $$ = $1.concat([{ type: yy.NodeType.Use, name: $3.map(ident => ident.name).join("."), alias: $5, doesShadow: true, location: yy.merge(@2, @6) }]); }
    | optUseStatements "use!" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = $1.concat([{ type: yy.NodeType.Use, name: $3.map(ident => ident.name).join("."), alias: null, doesShadow: true, location: yy.merge(@2, @4) }]); }
    ;

optCopyStatements
    : %empty
        { $$ = []; }

    | optCopyStatements "copy" oneOrMoreDotSeparatedIdentifiers optCopySignature "as" NON_RESERVED_IDENTIFIER ";"
        { $$ = $1.concat([{ type: yy.NodeType.StaticMethodCopy, accessModifier: null, name: $3.map(ident => ident.name).join("."), signature: $4, alias: $6, location: yy.merge(@2, @7) }]); }
    | optCopyStatements "copy" oneOrMoreDotSeparatedIdentifiers optCopySignature ";"
        { $$ = $1.concat([{ type: yy.NodeType.StaticMethodCopy, accessModifier: null, name: $3.map(ident => ident.name).join("."), signature: $4, alias: null, location: yy.merge(@2, @5) }]); }

    | optCopyStatements PUB_COPY oneOrMoreDotSeparatedIdentifiers optCopySignature "as" NON_RESERVED_IDENTIFIER ";"
        { $$ = $1.concat([{ type: yy.NodeType.StaticMethodCopy, accessModifier: "pub", name: $3.map(ident => ident.name).join("."), signature: $4, alias: $6, location: yy.merge(@2, @7) }]); }
    | optCopyStatements PUB_COPY oneOrMoreDotSeparatedIdentifiers optCopySignature ";"
        { $$ = $1.concat([{ type: yy.NodeType.StaticMethodCopy, accessModifier: "pub", name: $3.map(ident => ident.name).join("."), signature: $4, alias: null, location: yy.merge(@2, @5) }]); }

    | optCopyStatements PROT_COPY oneOrMoreDotSeparatedIdentifiers optCopySignature "as" NON_RESERVED_IDENTIFIER ";"
        { $$ = $1.concat([{ type: yy.NodeType.StaticMethodCopy, accessModifier: "prot", name: $3.map(ident => ident.name).join("."), signature: $4, alias: $6, location: yy.merge(@2, @7) }]); }
    | optCopyStatements PROT_COPY oneOrMoreDotSeparatedIdentifiers optCopySignature ";"
        { $$ = $1.concat([{ type: yy.NodeType.StaticMethodCopy, accessModifier: "prot", name: $3.map(ident => ident.name).join("."), signature: $4, alias: null, location: yy.merge(@2, @5) }]); }
    ;

optCopySignature
    : %empty
        { $$ = null; }
    | "(" ")"
        { $$ = { type: yy.NodeType.StaticMethodCopySignature, typeArgs: [], argTypes: [], location: yy.convertToRange(@$) }; }
    | "(" typeArgs ")"
        { $$ = { type: yy.NodeType.StaticMethodCopySignature, typeArgs: [], argTypes: $2, location: yy.convertToRange(@$) }; }
    | "<" typeArgDefs ">" "(" ")"
        { $$ = { type: yy.NodeType.StaticMethodCopySignature, typeArgs: $2, argTypes: [], location: yy.convertToRange(@$) }; }
    | "<" typeArgDefs ">" "(" typeArgs ")"
        { $$ = { type: yy.NodeType.StaticMethodCopySignature, typeArgs: $2, argTypes: $5, location: yy.convertToRange(@$) }; }
    ;

pubClass
    : "pub" privClass
        { $$ = { ...$2, isPub: true, location: yy.convertToRange(@$) }; }
    ;

optAngleEnclosedTypeArgDefs
    : %empty
        { $$ = []; }
    | "<" typeArgDefs ">"
        { $$ = $2; }
    ;

typeArgDefs
    : NON_RESERVED_IDENTIFIER
        { $$ = [{ type: yy.NodeType.TypeArgDef, name: $1, constraint: { constraintType: yy.ConstraintType.None }, location: yy.convertToRange(@$) }]; }
    | NON_RESERVED_IDENTIFIER "extends" type
        { $$ = [{ type: yy.NodeType.TypeArgDef, name: $1, constraint: { constraintType: yy.ConstraintType.Extends, superType: $3 }, location: yy.convertToRange(@$) }]; }
    | typeArgDefs "," NON_RESERVED_IDENTIFIER
        { $$ = $1.concat([{ type: yy.NodeType.TypeArgDef, name: $3, constraint: { constraintType: yy.ConstraintType.None }, location: yy.convertToRange(@3) }]); }
    | typeArgDefs "," NON_RESERVED_IDENTIFIER "extends" type
        { $$ = $1.concat([{ type: yy.NodeType.TypeArgDef, name: $3, constraint: { constraintType: yy.ConstraintType.Extends, superType: $5 }, location: yy.merge(@3, @5) }]); }
    ;

optPrivClasses
    : %empty
        { $$ = []; }
    | optPrivClasses privClass
        { $$ = $1.concat([$2]); }
    ;

privClass
    : optOpenOrAbstract "class" NON_RESERVED_IDENTIFIER optAngleEnclosedTypeArgDefs optExtension "{" optCopyStatements optUseStatements optClassItems "}"
        { $$ = { type: yy.NodeType.Class, isPub: false, overridability: $1, name: $3, typeArgDefs: $4, superClass: $5, copies: $7, useStatements: $8, items: $9, location: yy.convertToRange(@$) }; }
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
        { $$ = { type: yy.NodeType.Type, name: "nullable", args: [$1], location: yy.convertToRange(@$) }; }
    ;

nonNullableType
    : oneOrMoreDotSeparatedIdentifiers "<" typeArgs ">" %prec TYPE
        { $$ = { type: yy.NodeType.Type, name: $1.map(ident => ident.name).join('.'), args: $3, location: yy.convertToRange(@$) }; }
    | oneOrMoreDotSeparatedIdentifiers
        { $$ = { type: yy.NodeType.Type, name: $1.map(ident => ident.name).join('.'), args: [], location: yy.convertToRange(@$) }; }
    | type "[" "]"
        { $$ = { type: yy.NodeType.Type, name: "array", args: [$1], location: yy.convertToRange(@$) }; }
    | type "[" "+" "]"
        { $$ = { type: yy.NodeType.Type, name: "rlist", args: [yy.wrapPrimitiveIfNeeded($1)], location: yy.convertToRange(@$) }; }
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
        { $$ = { type: yy.NodeType.InstancePropertyDeclaration, accessModifier: $1, isReassignable: false, name: $2, valueType: $4, location: yy.convertToRange(@$) }; }
    | optAccessModifier "re" NON_RESERVED_IDENTIFIER ":" type ";"
        { $$ = { type: yy.NodeType.InstancePropertyDeclaration, accessModifier: $1, isReassignable: true, name: $3, valueType: $5, location: yy.convertToRange(@$) }; }

    | optAccessModifier "static" NON_RESERVED_IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: false, name: $3, valueType: $5, initialValue: $7, location: yy.convertToRange(@$) }; }
    | optAccessModifier "static" "re" NON_RESERVED_IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: true, name: $4, valueType: $6, initialValue: $8, location: yy.convertToRange(@$) }; }
    | optAccessModifier "static" NON_RESERVED_IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: false, name: $3, valueType: $5, initialValue: $7, location: yy.convertToRange(@$) }; }
    | optAccessModifier "static" "re" NON_RESERVED_IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: true, name: $4, valueType: $6, initialValue: $8, location: yy.convertToRange(@$) }; }
    
    | optAccessModifier "static" NON_RESERVED_IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: false, name: $3, valueType: null, initialValue: $5, location: yy.convertToRange(@$) }; }
    | optAccessModifier "static" "re" NON_RESERVED_IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: true, name: $4, valueType: null, initialValue: $6, location: yy.convertToRange(@$) }; }
    | optAccessModifier "static" NON_RESERVED_IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: false, name: $3, valueType: null, initialValue: $5, location: yy.convertToRange(@$) }; }
    | optAccessModifier "static" "re" NON_RESERVED_IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.StaticPropertyDeclaration, accessModifier: $1, isReassignable: true, name: $4, valueType: null, initialValue: $6, location: yy.convertToRange(@$) }; }

    | "pub" "inst" ";"
        { $$ = { type: yy.NodeType.InstantiationRestriction, level: "pub", location: yy.convertToRange(@$) }; }
    | "prot" "inst" ";"
        { $$ = { type: yy.NodeType.InstantiationRestriction, level: "prot", location: yy.convertToRange(@$) }; }

    | optAccessModifier NON_RESERVED_IDENTIFIER optAngleEnclosedTypeArgDefs "(" optArgDefs ")" ":" type compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: true, isOpen: false, isOverride: false, name: $2, typeArgs: $3, args: $5, returnType: $8, body: $9, location: yy.convertToRange(@$) }; }
    | optAccessModifier NON_RESERVED_IDENTIFIER optAngleEnclosedTypeArgDefs "(" optArgDefs ")" compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: true, isOpen: false, isOverride: false, name: $2, typeArgs: $3, args: $5, returnType: null, body: $7, location: yy.convertToRange(@$) }; }

    | optAccessModifier NON_RESERVED_IDENTIFIER optAngleEnclosedTypeArgDefs "(" "this" optCommaAndArgDefs ")" ":" type compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: false, isOpen: false, isOverride: false, name: $2, typeArgs: $3, args: $6, returnType: $9, body: $10, location: yy.convertToRange(@$) }; }
    | optAccessModifier NON_RESERVED_IDENTIFIER optAngleEnclosedTypeArgDefs "(" "this" optCommaAndArgDefs ")" compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: false, isOpen: false, isOverride: false, name: $2, typeArgs: $3, args: $6, returnType: null, body: $8, location: yy.convertToRange(@$) }; }

    | optAccessModifier "open" NON_RESERVED_IDENTIFIER optAngleEnclosedTypeArgDefs "(" "this" optCommaAndArgDefs ")" ":" type compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: false, isOpen: true, isOverride: false, name: $3, typeArgs: $4, args: $7, returnType: $10, body: $11, location: yy.convertToRange(@$) }; }
    | optAccessModifier "open" NON_RESERVED_IDENTIFIER optAngleEnclosedTypeArgDefs "(" "this" optCommaAndArgDefs ")" compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: false, isOpen: true, isOverride: false, name: $3, typeArgs: $4, args: $7, returnType: null, body: $9, location: yy.convertToRange(@$) }; }

    | optAccessModifier "override" NON_RESERVED_IDENTIFIER optAngleEnclosedTypeArgDefs "(" "this" optCommaAndArgDefs ")" ":" type compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: false, isOpen: false, isOverride: true, name: $3, typeArgs: $4, args: $7, returnType: $10, body: $11, location: yy.convertToRange(@$) }; }
    | optAccessModifier "override" NON_RESERVED_IDENTIFIER optAngleEnclosedTypeArgDefs "(" "this" optCommaAndArgDefs ")" compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: false, isOpen: false, isOverride: true, name: $3, typeArgs: $4, args: $7, returnType: null, body: $9, location: yy.convertToRange(@$) }; }
    
    | optAccessModifier "open" "override" NON_RESERVED_IDENTIFIER optAngleEnclosedTypeArgDefs "(" "this" optCommaAndArgDefs ")" ":" type compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: false, isOpen: true, isOverride: true, name: $4, typeArgs: $5, args: $8, returnType: $11, body: $12, location: yy.convertToRange(@$) }; }
    | optAccessModifier "open" "override" NON_RESERVED_IDENTIFIER optAngleEnclosedTypeArgDefs "(" "this" optCommaAndArgDefs ")" compoundNode
        { $$ = { type: yy.NodeType.ConcreteMethodDeclaration, accessModifier: $1, isStatic: false, isOpen: true, isOverride: true, name: $4, typeArgs: $5, args: $8, returnType: null, body: $10, location: yy.convertToRange(@$) }; }

    | optAccessModifier "abstract" NON_RESERVED_IDENTIFIER optAngleEnclosedTypeArgDefs "(" "this" optCommaAndArgDefs ")" ":" type ";"
        { $$ = { type: yy.NodeType.AbstractMethodDeclaration, accessModifier: $1, isStatic: false, name: $3, typeArgs: $4, args: $7, returnType: $10, location: yy.convertToRange(@$) }; }
    | optAccessModifier "abstract" NON_RESERVED_IDENTIFIER optAngleEnclosedTypeArgDefs "(" "this" optCommaAndArgDefs ")" ";"
        { $$ = { type: yy.NodeType.AbstractMethodDeclaration, accessModifier: $1, isStatic: false, name: $3, typeArgs: $4, args: $7, returnType: null, location: yy.convertToRange(@$) }; }
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
        { $$ = [{ type: yy.NodeType.ArgDef, name: $1, valueType: $3, location: yy.convertToRange(@$) }]; }
    | argDefs "," NON_RESERVED_IDENTIFIER ":" type
        { $$ = $1.concat([{ type: yy.NodeType.ArgDef, name: $3, valueType: $5, location: yy.merge(@3, @5) }]); }
    ;

compoundNode
    : "{" optUseStatements "}"
        { $$ = { type: yy.NodeType.CompoundNode, useStatements: $2, nodes: [], definitelyDoesNotEndWithSemicolon: false, location: yy.convertToRange(@$) }; }
    | "{" optUseStatements simpleExpression "}"
        { $$ = { type: yy.NodeType.CompoundNode, useStatements: $2, nodes: [$3], definitelyDoesNotEndWithSemicolon: true, location: yy.convertToRange(@$) }; }
    | "{" optUseStatements nodeSequence "}"
        { $$ = { type: yy.NodeType.CompoundNode, useStatements: $2, nodes: $3, definitelyDoesNotEndWithSemicolon: false, location: yy.convertToRange(@$) }; }
    | "{" optUseStatements nodeSequence simpleExpression "}"
        { $$ = { type: yy.NodeType.CompoundNode, useStatements: $2, nodes: $3.concat([$4]), definitelyDoesNotEndWithSemicolon: true, location: yy.convertToRange(@$) }; }
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
    | doNode
    | returnStatement
    | breakStatement
    | continueStatement
    | localVarDeclaration
    | assignment
    | throwStatement
    | whileStatement
    | loopStatement
    | repeatStatement
    | forStatement
    | tryStatement
    ;

ifNode
    : "if" simpleExpression compoundNode optIfAlternatives
        { $$ = { type: yy.NodeType.If, condition: $2, body: $3, alternatives: $4, location: yy.convertToRange(@$) }; }
    ;

optIfAlternatives
    : %empty
        { $$ = []; }
    | ifAlternatives
    ;

ifAlternatives
    : "else" compoundNode
        { $$ = [{ type: yy.NodeType.IfAlternative, alternativeType: yy.IfAlternativeType.Else, body: $2, location: yy.convertToRange(@$) }]; }
    | elseIfs
    | elseIfs "else" compoundNode
        { $$ = $1.concat([{ type: yy.NodeType.IfAlternative, alternativeType: yy.IfAlternativeType.Else, body: $3, location: yy.merge(@2, @3) }]); }
    ;

elseIfs
    : "else" "if" simpleExpression compoundNode
        { $$ = [{ type: yy.NodeType.IfAlternative, alternativeType: yy.IfAlternativeType.ElseIf, condition: $3, body: $4, location: yy.convertToRange(@$) }]; }
    | elseIfs "else" "if" simpleExpression compoundNode
        { $$ = $1.concat([{ type: yy.NodeType.IfAlternative, alternativeType: yy.IfAlternativeType.ElseIf, condition: $4, body: $5, location: yy.merge(@2, @5) }]); }
    ;

doNode
    : "do" compoundNode
        { $$ = { type: yy.NodeType.Do, body: $2, location: yy.convertToRange(@$) }; }
    ;

returnStatement
    : "return_" simpleExpression ";"
        { $$ = { type: yy.NodeType.Return, value: $2, location: yy.convertToRange(@$) }; }
    | "return_" ifNode ";"
        { $$ = { type: yy.NodeType.Return, value: $2, location: yy.convertToRange(@$) }; }
    | "return_" doNode ";"
        { $$ = { type: yy.NodeType.Return, value: $2, location: yy.convertToRange(@$) }; }
    | "return_" ";"
        { $$ = { type: yy.NodeType.Return, value: null, location: yy.convertToRange(@$) }; }
    ; 

breakStatement
    : "break" ";"
        { $$ = { type: yy.NodeType.Break, value: null, location: yy.convertToRange(@$) }; }
    ;

continueStatement
    : "continue" ";"
        { $$ = { type: yy.NodeType.Continue, location: yy.convertToRange(@$) }; }
    ;

localVarDeclaration
    : "let" NON_RESERVED_IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.convertToRange(@$) }; }
    | "let!" NON_RESERVED_IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.convertToRange(@$) }; }
    | "re" NON_RESERVED_IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.convertToRange(@$) }; }
    | "re!" NON_RESERVED_IDENTIFIER "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.convertToRange(@$) }; }

    | "let" NON_RESERVED_IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.convertToRange(@$) }; }
    | "let!" NON_RESERVED_IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.convertToRange(@$) }; }
    | "re" NON_RESERVED_IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.convertToRange(@$) }; }
    | "re!" NON_RESERVED_IDENTIFIER ":" type "=" simpleExpression ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.convertToRange(@$) }; }

    | "let" NON_RESERVED_IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.convertToRange(@$) }; }
    | "let!" NON_RESERVED_IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.convertToRange(@$) }; }
    | "re" NON_RESERVED_IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.convertToRange(@$) }; }
    | "re!" NON_RESERVED_IDENTIFIER "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.convertToRange(@$) }; }

    | "let" NON_RESERVED_IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.convertToRange(@$) }; }
    | "let!" NON_RESERVED_IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.convertToRange(@$) }; }
    | "re" NON_RESERVED_IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.convertToRange(@$) }; }
    | "re!" NON_RESERVED_IDENTIFIER ":" type "=" ifNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.convertToRange(@$) }; }

    | "let" NON_RESERVED_IDENTIFIER "=" doNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.convertToRange(@$) }; }
    | "let!" NON_RESERVED_IDENTIFIER "=" doNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.convertToRange(@$) }; }
    | "re" NON_RESERVED_IDENTIFIER "=" doNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $4, valueType: null, location: yy.convertToRange(@$) }; }
    | "re!" NON_RESERVED_IDENTIFIER "=" doNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $4, valueType: null, location: yy.convertToRange(@$) }; }

    | "let" NON_RESERVED_IDENTIFIER ":" type "=" doNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.convertToRange(@$) }; }
    | "let!" NON_RESERVED_IDENTIFIER ":" type "=" doNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: false, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.convertToRange(@$) }; }
    | "re" NON_RESERVED_IDENTIFIER ":" type "=" doNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: false, name: $2, initialValue: $6, valueType: $4, location: yy.convertToRange(@$) }; }
    | "re!" NON_RESERVED_IDENTIFIER ":" type "=" doNode ";"
        { $$ = { type: yy.NodeType.LocalVariableDeclaration, isReassignable: true, doesShadow: true, name: $2, initialValue: $6, valueType: $4, location: yy.convertToRange(@$) }; }
    ;

assignment
    : simpleExpression assignmentOperation simpleExpression ";"
        { $$ = { type: yy.NodeType.Assignment, assignee: $1, assignmentType: $2, value: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression assignmentOperation ifNode ";"
        { $$ = { type: yy.NodeType.Assignment, assignee: $1, assignmentType: $2, value: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression assignmentOperation doNode ";"
        { $$ = { type: yy.NodeType.Assignment, assignee: $1, assignmentType: $2, value: $3, location: yy.convertToRange(@$) }; }
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

throwStatement
    : "throw" simpleExpression ";"
        { $$ = { type: yy.NodeType.Throw, value: $2, location: yy.convertToRange(@$) }; }
    | "throw" ifNode ";"
        { $$ = { type: yy.NodeType.Throw, value: $2, location: yy.convertToRange(@$) }; }
    | "throw" doNode ";"
        { $$ = { type: yy.NodeType.Throw, value: $2, location: yy.convertToRange(@$) }; }
    ;

whileStatement
    : "while" simpleExpression compoundNode
        { $$ = { type: yy.NodeType.While, condition: $2, body: $3, location: yy.convertToRange(@$) }; }
    ;

loopStatement
    : "loop" compoundNode
        { $$ = { type: yy.NodeType.Loop, body: $2, location: yy.convertToRange(@$) }; }
    ;

repeatStatement
    : "repeat" simpleExpression compoundNode
        { $$ = { type: yy.NodeType.Repeat, repetitions: $2, body: $3, location: yy.convertToRange(@$) }; }
    ;

forStatement
    : "for" binding "in" simpleExpression compoundNode
        { $$ = { type: yy.NodeType.For, binding: $2, iteratee: $4, body: $5, location: yy.convertToRange(@$) }; }
    ;

binding
    : singleBinding
    | flatTupleBinding
    ;

singleBinding
    : NON_RESERVED_IDENTIFIER
        { $$ = { type: yy.NodeType.SingleBinding, name: $1, location: yy.convertToRange(@$) }; }
    ;

flatTupleBinding
    : "(" singleBindings ")"
        { $$ = { type: yy.NodeType.FlatTupleBinding, bindings: $2, location: yy.convertToRange(@$) }; }
    ;

singleBindings
    : singleBinding
        { $$ = [$1]; }
    | singleBindings "," singleBinding
        { $$ = $1.concat($3); }
    ;

tryStatement
    : "try" compoundNode catchClauses
        { $$ = { type: yy.NodeType.Try, body: $2, catches: $3, finallyNode: null, location: yy.convertToRange(@$) }; }
    ;

catchClauses
    : catchClause
        { $$ = [$1]; }
    | catchClauses catchClause
        { $$ = $1.concat([$2]); }
    ;

catchClause
    : "catch" NON_RESERVED_IDENTIFIER ":" type compoundNode
        { $$ = { type: yy.NodeType.Catch, catchType: yy.CatchType.BoundCatch, arg: { type: yy.NodeType.ArgDef, name: $2, valueType: $4, location: yy.merge(@2, @4) }, body: $5, location: yy.convertToRange(@$) }; }
    | "catch" ":" unionOfOneOrMoreCatchTypes compoundNode
        { $$ = { type: yy.NodeType.Catch, catchType: yy.CatchType.RestrictedBindinglessCatch, caughtTypes: $3, body: $4, location: yy.convertToRange(@$) }; }
    | "catch" compoundNode
        { $$ = { type: yy.NodeType.Catch, catchType: yy.CatchType.CatchAll, body: $2, location: yy.convertToRange(@$) }; }
    ;

unionOfOneOrMoreCatchTypes
    : type
        { $$ = [$1]; }
    | unionOfOneOrMoreCatchTypes "|" type
        { $$ = $1.concat([$3]); }
    ;

simpleExpression
    : NUMBER
        { $$ = { type: yy.NodeType.NumberLiteral, value: $1, location: yy.convertToRange(@$) }; }
    | STRING
        { $$ = { type: yy.NodeType.StringLiteral, value: $1, location: yy.convertToRange(@$) }; }
    | CHARACTER
        { $$ = { type: yy.NodeType.CharacterLiteral, value: $1, location: yy.convertToRange(@$) }; }

    | callableExpression
    | functionCall
    | indexExpression
    
    | "-" simpleExpression %prec UMINUS
        { $$ = { type: yy.NodeType.PrefixExpr, operation: $1, right: $2, location: yy.convertToRange(@$) }; }
    | "!" simpleExpression
        { $$ = { type: yy.NodeType.PrefixExpr, operation: $1, right: $2, location: yy.convertToRange(@$) }; }
    | "~" simpleExpression
        { $$ = { type: yy.NodeType.PrefixExpr, operation: $1, right: $2, location: yy.convertToRange(@$) }; }

    | simpleExpression "**" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "*" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "/" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "%" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "+" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "-" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "<" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "<=" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression ">" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression ">=" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "==" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "!=" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "~=" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "&&" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "||" simpleExpression
        { $$ = { type: yy.NodeType.InfixExpr, operation: $2, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    
    | typedObjectLiteral

    | arrayLiteral

    | range

    | magicFunctionLiteral

    | castExpression

    | parenthesizedExpression
    ;

parenthesizedExpression
    : "(" simpleExpression ")"
        { $$ = $2; }
    | "(" ifNode ")"
        { $$ = $2; }
    | "(" doNode ")"
        { $$ = $2; }
    ;

indexExpression
    : simpleExpression "[" simpleExpression "]"
        { $$ = { type: yy.NodeType.IndexExpr, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "[" ifNode "]"
        { $$ = { type: yy.NodeType.IndexExpr, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | simpleExpression "[" doNode "]"
        { $$ = { type: yy.NodeType.IndexExpr, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    ;

callableExpression
    : identifier
        { $$ = { type: yy.NodeType.Identifier, name: $1, location: yy.convertToRange(@$) }; }
    | callableExpression "." NON_RESERVED_IDENTIFIER
        { $$ = { type: yy.NodeType.DotExpr, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | functionCall "." NON_RESERVED_IDENTIFIER
        { $$ = { type: yy.NodeType.DotExpr, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | indexExpression "." NON_RESERVED_IDENTIFIER
        { $$ = { type: yy.NodeType.DotExpr, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    | parenthesizedExpression "." NON_RESERVED_IDENTIFIER
        { $$ = { type: yy.NodeType.DotExpr, left: $1, right: $3, location: yy.convertToRange(@$) }; }
    ;

functionCall
    : callableExpression optFunctionCallTypeArgs "(" ")"
        { $$ = { type: yy.NodeType.FunctionCall, callee: $1, typeArgs: $2, args: [], location: yy.convertToRange(@$) }; }
    | callableExpression optFunctionCallTypeArgs "(" expressions ")"
        { $$ = { type: yy.NodeType.FunctionCall, callee: $1, typeArgs: $2, args: $4, location: yy.convertToRange(@$) }; }
    ;

optFunctionCallTypeArgs
    : %empty
        { $$ = []; }
    | FUNCTION_CALL_TYPE_ARG_LEFT_ANGLE_BRACKET typeArgs ">"
        { $$ = $2; }
    ;

oneOrMoreDotSeparatedIdentifiers
    : identifier
        { $$ = [{ type: yy.NodeType.Identifier, name: $1, location: yy.convertToRange(@$) }]; }
    | oneOrMoreDotSeparatedIdentifiers "." NON_RESERVED_IDENTIFIER
        { $$ = $1.concat([{ type: yy.NodeType.Identifier, name: $3, location: yy.convertToRange(@3) }]); }
    ;

typedObjectLiteral
    : OBJECT_LITERAL_TYPE "{" "}"
        { $$ = { type: yy.NodeType.TypedObjectLiteral, valueType: yy.parseType($1, @1), copies: [], entries: [], location: yy.convertToRange(@$) }; }
    | OBJECT_LITERAL_TYPE "{" objectEntries "}"
        { $$ = { type: yy.NodeType.TypedObjectLiteral, valueType: yy.parseType($1, @1), copies: [], entries: $3, location: yy.convertToRange(@$) }; }
    | OBJECT_LITERAL_TYPE "{" objectEntries "," "}"
        { $$ = { type: yy.NodeType.TypedObjectLiteral, valueType: yy.parseType($1, @1), copies: [], entries: $3, location: yy.convertToRange(@$) }; }

    | OBJECT_LITERAL_TYPE "{" objectCopies "}"
        { $$ = { type: yy.NodeType.TypedObjectLiteral, valueType: yy.parseType($1, @1), copies: $3, entries: [], location: yy.convertToRange(@$) }; }
    | OBJECT_LITERAL_TYPE "{" objectCopies "," "}"
        { $$ = { type: yy.NodeType.TypedObjectLiteral, valueType: yy.parseType($1, @1), copies: $3, entries: [], location: yy.convertToRange(@$) }; }
    | OBJECT_LITERAL_TYPE "{" objectCopies "," objectEntries "}"
        { $$ = { type: yy.NodeType.TypedObjectLiteral, valueType: yy.parseType($1, @1), copies: $3, entries: $5, location: yy.convertToRange(@$) }; }
    | OBJECT_LITERAL_TYPE "{" objectCopies "," objectEntries "," "}"
        { $$ = { type: yy.NodeType.TypedObjectLiteral, valueType: yy.parseType($1, @1), copies: $3, entries: $5, location: yy.convertToRange(@$) }; }
    ;

objectCopies
    : "..." simpleExpression
        { $$ = [{ type: yy.NodeType.ObjectCopy, source: $2, location: yy.convertToRange(@$) }]; }
    | objectCopies "," "..." simpleExpression
        { $$ = $1.concat([{ type: yy.NodeType.ObjectCopy, source: $4, location: yy.merge(@3, @4) }]); }
    ;

objectEntries
    : NON_RESERVED_IDENTIFIER ":" simpleExpression
        { $$ = [{ type: yy.NodeType.ObjectEntry, key: $1, value: $3, location: yy.convertToRange(@$) }]; }
    | NON_RESERVED_IDENTIFIER ":" ifNode
        { $$ = [{ type: yy.NodeType.ObjectEntry, key: $1, value: $3, location: yy.convertToRange(@$) }]; }
    | NON_RESERVED_IDENTIFIER ":" doNode
        { $$ = [{ type: yy.NodeType.ObjectEntry, key: $1, value: $3, location: yy.convertToRange(@$) }]; }
    | NON_RESERVED_IDENTIFIER
        { $$ = [{ type: yy.NodeType.ObjectEntry, key: $1, value: null, location: yy.convertToRange(@$) }]; }
    | objectEntries "," NON_RESERVED_IDENTIFIER ":" simpleExpression
        { $$ = $1.concat([{ type: yy.NodeType.ObjectEntry, key: $3, value: $5, location: yy.merge(@3, @5) }]); }
    | objectEntries "," NON_RESERVED_IDENTIFIER ":" ifNode
        { $$ = $1.concat([{ type: yy.NodeType.ObjectEntry, key: $3, value: $5, location: yy.merge(@3, @5) }]); }
    | objectEntries "," NON_RESERVED_IDENTIFIER ":" doNode
        { $$ = $1.concat([{ type: yy.NodeType.ObjectEntry, key: $3, value: $5, location: yy.merge(@3, @5) }]); }
    | objectEntries "," NON_RESERVED_IDENTIFIER
        { $$ = $1.concat([{ type: yy.NodeType.ObjectEntry, key: $3, value: null, location: yy.convertToRange(@3) }]); }
    ;

arrayLiteral
    : "[" "]"
        { $$ = { type: yy.NodeType.ArrayLiteral, elements: [], location: yy.convertToRange(@$) }; }
    | "[" expressions "]"
        { $$ = { type: yy.NodeType.ArrayLiteral, elements: $2, location: yy.convertToRange(@$) }; }
    | "[" expressions "," "]"
        { $$ = { type: yy.NodeType.ArrayLiteral, elements: $2, location: yy.convertToRange(@$) }; }
    ;

expressions
    : simpleExpression
        { $$ = [$1]; }
    | ifNode
        { $$ = [$1]; }
    | doNode
        { $$ = [$1]; }
    | expressions "," simpleExpression
        { $$ = $1.concat([$3]); }
    | expressions "," ifNode
        { $$ = $1.concat([$3]); }
    | expressions "," doNode
        { $$ = $1.concat([$3]); }
    ;

range
    : endInclusiveRange
    | endExclusiveRange
    ;

endInclusiveRange
    : simpleExpression "..=" simpleExpression
        { $$ = { type: yy.NodeType.RangeLiteral, start: $1, end: $3, includesEnd: true, location: yy.convertToRange(@$) }; }
    ;

endExclusiveRange
    : simpleExpression ".." simpleExpression
        { $$ = { type: yy.NodeType.RangeLiteral, start: $1, end: $3, includesEnd: false, location: yy.convertToRange(@$) }; }
    ;

magicFunctionLiteral
    : "\" optUntypedArgDefs "->" simpleExpression
        { $$ = { type: yy.NodeType.MagicFunctionLiteral, args: $2, body: $4, location: yy.convertToRange(@$) }; }
    | "\" optUntypedArgDefs "->" ifNode
        { $$ = { type: yy.NodeType.MagicFunctionLiteral, args: $2, body: $4, location: yy.convertToRange(@$) }; }
    | "\" optUntypedArgDefs "->" doNode
        { $$ = { type: yy.NodeType.MagicFunctionLiteral, args: $2, body: $4, location: yy.convertToRange(@$) }; }
    | "\" optUntypedArgDefs "->" compoundNode
        { $$ = { type: yy.NodeType.MagicFunctionLiteral, args: $2, body: $4, location: yy.convertToRange(@$) }; }
    ;

optUntypedArgDefs
    : %empty
        { $$ = []; }
    | untypedArgDefs
    ;

untypedArgDefs
    : NON_RESERVED_IDENTIFIER
        { $$ = [{ type: yy.NodeType.UntypedArgDef, name: $1, location: yy.convertToRange(@$) }]; }
    | untypedArgDefs "," NON_RESERVED_IDENTIFIER
        { $$ = $1.concat([{ type: yy.NodeType.UntypedArgDef, name: $3, location: yy.convertToRange(@3) }]); }
    ;

castExpression
    : simpleExpression "as!" CAST_EXPRESSION_TARGET_TYPE
        { $$ = { type: yy.NodeType.CastExpr, value: $1, targetType: yy.parseType($3, @3), location: yy.convertToRange(@$) }; }
    ;

identifier
    : NON_RESERVED_IDENTIFIER
    | "this"
    | "super"
    ;