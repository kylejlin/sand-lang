/* Builds AST from Sand source. */

/* Uses custom scanner */

/* operator associations and precedence */

%nonassoc "=" "**=" "*=" "/=" "%=" "+=" "-="

%nonassoc "->"

%left "||"
%left "&&"

%left "==" "!=" "~=" "!~="
%left "<" "<=" ">" ">=" "~<" "~<=" "~>" "~>=" "instanceof" "notinstanceof"

%left "as"

%nonassoc "in" "..." "..=" "=.." "=.="

%left "+" "-"
%left "*" "/" "%"
%right "**"

%nonassoc "!"
%nonassoc "?"

%nonassoc PREFIX
%nonassoc POSTFIX
%nonassoc ANGLE_BRACKETLESS_TYPE
%nonassoc GENERIC_METHOD_TYPE_PARAM_LIST_LEFT_ANGLE_BRACKET

%nonassoc "["
%nonassoc "("

%left "."
%left "#"

%start file

%% /* Sand grammar */

file
    : beginningOfFile optPackageStatement optImportStatements optUseStatements pubClassOrInterfaceDeclaration optPrivClassOrInterfaceDeclarations EOF
        { return yy.createNode(yy.NodeType.FileNode, @$, { packageStatement: $2, importStatements: $3, useStatements: $4, pubClassOrInterfaceDeclaration: $5, privClassOrInterfaceDeclarations: $6 }); }
    ;

beginningOfFile
    : %empty
        { yy.resetNodeIdCounter(); $$ = undefined; }
    ;

optPackageStatement
    : %empty
        { $$ = yy.option.none(); }
    | packageStatement
        { $$ = yy.option.some($1); }
    ;

packageStatement
    : "package" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = yy.createNode(yy.NodeType.PackageStatement, @$, { identifiers: $2 }); }
    ;

oneOrMoreDotSeparatedIdentifiers
    : identifier
        { $$ = [$1]; }
    | oneOrMoreDotSeparatedIdentifiers "." identifier
        { $$ = $1.concat([$3]); }
    ;

identifier
    : UNRESERVED_IDENTIFIER
        { $$ = yy.createNode(yy.NodeType.Identifier, @$, { source: $1 }); }
    | ESCAPED_IDENTIFIER
        { $$ = yy.createNode(yy.NodeType.Identifier, @$, { source: $1 }); }
    | "get"
        { $$ = yy.createNode(yy.NodeType.Identifier, @$, { source: $1 }); }
    | "set"
        { $$ = yy.createNode(yy.NodeType.Identifier, @$, { source: $1 }); }
    | "intenc"
        { $$ = yy.createNode(yy.NodeType.Identifier, @$, { source: $1 }); }
    | "priv"
        { $$ = yy.createNode(yy.NodeType.Identifier, @$, { source: $1 }); }
    ;

optImportStatements
    : %empty
        { $$ = []; }
    | optImportStatements importStatement
        { $$ = $1.concat([$2]); }
    ;

importStatement
    : "import" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = yy.createNode(yy.NodeType.SingleItemImportStatement, @$, { doesShadow: false, isStatic: false, identifiers: $2 }); }
    | "import" "shadow" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = yy.createNode(yy.NodeType.SingleItemImportStatement, @$, { doesShadow: true, isStatic: false, identifiers: $3 }); }
    | "import" oneOrMoreDotSeparatedIdentifiers "." "*" ";"
        { $$ = yy.createNode(yy.NodeType.ImportAllStatement, @$, { isStatic: false, identifiers: $2 }); }

    | "import" "static" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = yy.createNode(yy.NodeType.SingleItemImportStatement, @$, { doesShadow: false, isStatic: true, identifiers: $3 }); }
    | "import" "static" "shadow" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = yy.createNode(yy.NodeType.SingleItemImportStatement, @$, { doesShadow: true, isStatic: true, identifiers: $4 }); }
    | "import" "static" oneOrMoreDotSeparatedIdentifiers "." "*" ";"
        { $$ = yy.createNode(yy.NodeType.ImportAllStatement, @$, { isStatic: true, identifiers: $3 }); }
    ;

optUseStatements
    : %empty
        { $$ = []; }
    | oneOrMoreUseStatements
    ;

oneOrMoreUseStatements
    : useStatement
        { $$ = [$1]; }
    | oneOrMoreUseStatements useStatement
        { $$ = $1.concat([$2]); }
    ;

useStatement
    : useStatementWithExplicitAlias
    | useStatementWithImplicitAlias
    | useAllStatement
    ;

useStatementWithExplicitAlias
    : "use" oneOrMoreDotSeparatedIdentifiers "as" identifier ";"
        { $$ = yy.createNode(yy.NodeType.UseSingleItemStatement, @$, { doesShadow: false, referentIdentifiers: $2, alias: yy.option.some($4) }); }
    | "use" "shadow" oneOrMoreDotSeparatedIdentifiers "as" identifier ";"
        { $$ = yy.createNode(yy.NodeType.UseSingleItemStatement, @$, { doesShadow: true, referentIdentifiers: $3, alias: yy.option.some($5) }); }
    ;

useStatementWithImplicitAlias
    : "use" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = yy.createNode(yy.NodeType.UseSingleItemStatement, @$, { doesShadow: false, referentIdentifiers: $2, alias: yy.option.none() }); }
    | "use" "shadow" oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = yy.createNode(yy.NodeType.UseSingleItemStatement, @$, { doesShadow: true, referentIdentifiers: $3, alias: yy.option.none() }); }
    ;

useAllStatement
    : "use" oneOrMoreDotSeparatedIdentifiers "." "*" ";"
        { $$ = yy.createNode(yy.NodeType.UseAllStatement, @$, { identifiers: $2 }); }
    ;

pubClassOrInterfaceDeclaration
    : pubClassDeclaration
    | pubInterfaceDeclaration
    ;

pubClassDeclaration
    : "pub" classDeclaration
        { $$ = yy.merge($2, { isPub: true }); }
    ;

classDeclaration
    : extensibleClassDeclaration
    | finalClassDeclaration
    ;

extensibleClassDeclaration
    : extensibilityModifier finalClassDeclaration
        { $$ = yy.merge($2, { extensibility: $1 }); }
    ;

extensibilityModifier
    : "open"
        { $$ = yy.ExtensibilityLevel.Open; }
    | "abstract"
        { $$ = yy.ExtensibilityLevel.Abstract; }
    ;

finalClassDeclaration
    : "class" optShadowKeyword identifier optBracketedFormalTypeParams optClassExtensionClause optImplementsClause curlyBraceEnclosedClassBody
        { $$ = yy.createNode(yy.NodeType.ClassDeclaration, @$, { isPub: false, extensibility: yy.ExtensibilityLevel.Final, doesShadow: $2.isSome(), name: $3, typeParams: $4, superClass: $5, implementedInterfaces: $6, methodCopyStatements: $7.methodCopyStatements, useStatements: $7.useStatements, items: $7.items }); }
    ;

optShadowKeyword
    : %empty
        { $$ = yy.option.none(); }
    | "shadow"
        { $$ = yy.option.some($1); }
    ;

optBracketedFormalTypeParams
    : %empty
        { $$ = []; }
    | "<" oneOrMoreFormalTypeParams ">"
        { $$ = $2; }
    ;

oneOrMoreFormalTypeParams
    : formalTypeParam
        { $$ = [$1]; }
    | oneOrMoreFormalTypeParams "," formalTypeParam
        { $$ = $1.concat([$3]); }
    ;

formalTypeParam
    : optShadowKeyword identifier optTypeConstraint
        { $$ = yy.createNode(yy.NodeType.FormalTypeParamDeclaration, @$, { name: $2, constraint: $3 }); }
    ;

optTypeConstraint
    : %empty
        { $$ = yy.option.none(); }
    | typeConstraint
        { $$ = yy.option.some($1); }
    ;

typeConstraint
    : extendsConstraint
    | superConstraint
    ;

extendsConstraint
    : "extends" oneOrMoreAmpersandSeparatedTypes
        { $$ = yy.createNode(yy.NodeType.TypeParamExtendsConstraint, @$, { superTypes: $2 }); }
    ;

oneOrMoreAmpersandSeparatedTypes
    : type
        { $$ = [$1]; }
    | oneOrMoreAmpersandSeparatedTypes "&" type
        { $$ = $1.concat([$3]); }
    ;

type
    : oneOrMoreDotSeparatedIdentifiers optBracketedActualTypeParams
        {
            var niladic = yy.createNode(yy.NodeType.NiladicType, @1, { identifiers: $1 });
            if ($2.length === 0) {
                $$ = niladic;
            } else {
                $$ = yy.createNode(yy.NodeType.InstantiatedGenericType, @$, { baseType: niladic, actualParams: $2 });
            }
        }
    | primitiveTypeLiteral
        {
            var identifier = yy.createNode(yy.NodeType.Identifier, @$, { source: $1 });
            $$ = yy.createNode(yy.NodeType.NiladicType, @$, { identifiers: [identifier] });
        }
    | type "?"
        { $$ = yy.createNode(yy.NodeType.NullableType, @$, { baseType: $1 }); }
    | type "[" "]"
        { $$ = yy.createNode(yy.NodeType.ArrayType, @$, { baseType: $1 }); }
    | type "[" "+" "]"
        { $$ = yy.createNode(yy.NodeType.ListType, @$, { baseType: $1 }); }
    ;

optBracketedActualTypeParams
    : %empty
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

primitiveTypeLiteral
    : "int"
    | "short"
    | "long"
    | "byte"
    | "char"
    | "float"
    | "double"
    | "boolean"
    | "void"
    | "never"
    ;

superConstraint
    : "super" type
        { $$ = yy.createNode(yy.NodeType.TypeParamSuperConstraint, @$, { subType: $2 }); }
    ;

optClassExtensionClause
    : %empty
        { $$ = yy.option.none(); }
    | classExtensionClause
        { $$ = yy.option.some($1); }
    ;

classExtensionClause
    : "extends" type
        { $$ = $2; }
    ;

optImplementsClause
    : %empty
        { $$ = []; }
    | implementsClause
    ;

implementsClause
    : "implements" oneOrMoreCommaSeparatedTypes
        { $$ = $2; }
    ;

curlyBraceEnclosedClassBody
    : "{" "}"
        { $$ = { methodCopyStatements: [], useStatements: [], items: [] }; }
    | "{" oneOrMoreMethodCopyStatements "}"
        { $$ = { methodCopyStatements: $2, useStatements: [], items: [] }; }
    | "{" oneOrMoreUseStatements "}"
        { $$ = { methodCopyStatements: [], useStatements: $2, items: [] }; }
    | "{" oneOrMoreMethodCopyStatements oneOrMoreUseStatements "}"
        { $$ = { methodCopyStatements: $2, useStatements: $3, items: [] }; }
    | "{" oneOrMoreClassItems "}"
        { $$ = { methodCopyStatements: [], useStatements: [], items: $2 }; }
    | "{" oneOrMoreMethodCopyStatements oneOrMoreClassItems "}"
        { $$ = { methodCopyStatements: $2, useStatements: [], items: $3 }; }
    | "{" oneOrMoreUseStatements oneOrMoreClassItems "}"
        { $$ = { methodCopyStatements: [], useStatements: $2, items: $3 }; }
    | "{" oneOrMoreMethodCopyStatements oneOrMoreUseStatements oneOrMoreClassItems "}"
        { $$ = { methodCopyStatements: $2, useStatements: $3, items: $4 }; }
    ;

oneOrMoreMethodCopyStatements
    : methodCopyStatement
        { $$ = [$1]; }
    | oneOrMoreMethodCopyStatements methodCopyStatement
        { $$ = $1.concat([$2]); }
    ;

methodCopyStatement
    : "copy" optShadowKeyword oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = yy.createNode(yy.NodeType.MethodCopyStatement, @$, { visibility: yy.VisibilityLevel.Private, doesShadow: $2.isSome(), identifiers: $3 }); }
    | "pub" "copy" optShadowKeyword oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = yy.createNode(yy.NodeType.MethodCopyStatement, @$, { visibility: yy.VisibilityLevel.Public, doesShadow: $3.isSome(), identifiers: $4 }); }
    | "prot" "copy" optShadowKeyword oneOrMoreDotSeparatedIdentifiers ";"
        { $$ = yy.createNode(yy.NodeType.MethodCopyStatement, @$, { visibility: yy.VisibilityLevel.Protected, doesShadow: $3.isSome(), identifiers: $4 }); }
    ;

oneOrMoreClassItems
    : classItem
        { $$ = [$1]; }
    | oneOrMoreClassItems classItem
        { $$ = $1.concat([$2]); }
    ;

classItem
    : classConstructorDeclaration
    | classDefaultConstructorDeclaration
    | classStaticPropertyDeclaration
    | classStaticMethodDeclaration
    | classInstancePropertyDeclaration
    | classInstanceMethodDeclaration
    | classInnerClassDeclaration
    | classInnerInterfaceDeclaration
    ;

classConstructorDeclaration
    : optVisibilityModifier "new" parenthesizedFormalMethodParamDeclarations optThrowsClause methodBody
        { $$ = yy.createNode(yy.NodeType.ClassConstructorDeclaration, @$, { visibility: $1.unwrapOr(yy.VisibilityLevel.Private), typeParams: [], params: $3, thrownExceptions: $4, body: $5 }); }
    | optVisibilityModifier "new" angleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optThrowsClause methodBody
        { $$ = yy.createNode(yy.NodeType.ClassConstructorDeclaration, @$, { visibility: $1.unwrapOr(yy.VisibilityLevel.Private), typeParams: $3, params: $4, thrownExceptions: $5, body: $6 }); }
    ;

optVisibilityModifier
    : %empty
        { $$ = yy.option.none(); }
    | visibilityModifier
        { $$ = yy.option.some($1); }
    ;

visibilityModifier
    : "pub"
        { $$ = yy.VisibilityLevel.Public; }
    | "prot"
        { $$ = yy.VisibilityLevel.Protected; }
    ;

classDefaultConstructorDeclaration
    : optVisibilityModifier "default" "new" ";"
        { $$ = yy.createNode(yy.NodeType.ClassDefaultConstructorDeclaration, @$, { visibility: $1.unwrapOr(yy.VisibilityLevel.Private) }); }
    ;

parenthesizedFormalMethodParamDeclarations
    : "(" ")"
        { $$ = []; }
    | "(" oneOrMoreFormalMethodParamDeclarations optTrailingComma ")"
        { $$ = $2; }
    ;

optTrailingComma
    : %empty
        { $$ = undefined; }
    | ","
    ;

oneOrMoreFormalMethodParamDeclarations
    : formalMethodParamDeclaration
        { $$ = [$1]; }
    | oneOrMoreFormalMethodParamDeclarations "," formalMethodParamDeclaration
        { $$ = $1.concat([$3]); }
    ;

formalMethodParamDeclaration
    : optShadowKeyword identifier ":" type
        { $$ = yy.createNode(yy.NodeType.FormalMethodParamDeclaration, @$, { isReassignable: false, doesShadow: $1.isSome(), name: $2, annotatedType: $4 }); }
    | "var" optShadowKeyword identifier ":" type
        { $$ = yy.createNode(yy.NodeType.FormalMethodParamDeclaration, @$, { isReassignable: true, doesShadow: $2.isSome(), name: $3, annotatedType: $5 }); }
    ;

methodBody
    : "{" optUseStatements "}"
        { $$ = yy.createNode(yy.NodeType.MethodBody, @$, { useStatements: $2, statements: [], conclusion: yy.option.none() }); }
    | "{" optUseStatements oneOrMoreStatements "}"
        { $$ = yy.createNode(yy.NodeType.MethodBody, @$, { useStatements: $2, statements: $3, conclusion: yy.option.none() }); }
    | "{" optUseStatements oneOrMoreStatements expression "}"
        { $$ = yy.createNode(yy.NodeType.MethodBody, @$, { useStatements: $2, statements: $3, conclusion: yy.option.some($4) }); }
    | "{" optUseStatements oneOrMoreStatements returnablePseudex "}"
        { $$ = yy.createNode(yy.NodeType.MethodBody, @$, { useStatements: $2, statements: $3, conclusion: yy.option.some($4) }); }
    | "{" optUseStatements expression "}"
        { $$ = yy.createNode(yy.NodeType.MethodBody, @$, { useStatements: $2, statements: [], conclusion: yy.option.some($3) }); }
    | "{" optUseStatements returnablePseudex "}"
        { $$ = yy.createNode(yy.NodeType.MethodBody, @$, { useStatements: $2, statements: [], conclusion: yy.option.some($3) }); }
    ;

oneOrMoreStatements
    : statement
        { $$ = [$1]; }
    | oneOrMoreStatements statement
        { $$ = $1.concat([$2]); }
    ;

classStaticPropertyDeclaration
    : optVisibilityModifier "static" identifier optVariableTypeAnnotation "=" expressionOrAssignmentPseudex ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticPropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel($1),
                accessors: yy.option.none(),
                isReassignable: false,
                doesShadow: false,

                name: $3,
                annotatedType: $4,
                initialValue: $6,
            });
        }
    | optVisibilityModifier "static" "var" identifier optVariableTypeAnnotation "=" expressionOrAssignmentPseudex ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticPropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel($1),
                accessors: yy.option.none(),
                isReassignable: true,
                doesShadow: false,

                name: $4,
                annotatedType: $5,
                initialValue: $7,
            });
        }

    | optVisibilityModifier "static" "shadow" identifier optVariableTypeAnnotation "=" expressionOrAssignmentPseudex ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticPropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel($1),
                accessors: yy.option.none(),
                isReassignable: false,
                doesShadow: true,

                name: $4,
                annotatedType: $5,
                initialValue: $7,
            });
        }
    | optVisibilityModifier "static" "var" "shadow" identifier optVariableTypeAnnotation "=" expressionOrAssignmentPseudex ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticPropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel($1),
                accessors: yy.option.none(),
                isReassignable: true,
                doesShadow: true,

                name: $5,
                annotatedType: $6,
                initialValue: $8,
            });
        }

    | propertyAccessorDeclarations optVisibilityModifier "static" identifier optVariableTypeAnnotation "=" expressionOrAssignmentPseudex ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticPropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel($2),
                accessors: yy.option.some($1),
                isReassignable: false,
                doesShadow: false,

                name: $4,
                annotatedType: $5,
                initialValue: $7,
            });
        }
    | propertyAccessorDeclarations optVisibilityModifier "static" "var" identifier optVariableTypeAnnotation "=" expressionOrAssignmentPseudex ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticPropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel($2),
                accessors: yy.option.some($1),
                isReassignable: true,
                doesShadow: false,

                name: $5,
                annotatedType: $6,
                initialValue: $8,
            });
        }

    | propertyAccessorDeclarations optVisibilityModifier "static" "shadow" identifier optVariableTypeAnnotation "=" expressionOrAssignmentPseudex ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticPropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel($2),
                accessors: yy.option.some($1),
                isReassignable: false,
                doesShadow: true,

                name: $5,
                annotatedType: $6,
                initialValue: $8,
            });
        }
    | propertyAccessorDeclarations optVisibilityModifier "static" "var" "shadow" identifier optVariableTypeAnnotation "=" expressionOrAssignmentPseudex ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticPropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel($2),
                accessors: yy.option.some($1),
                isReassignable: true,
                doesShadow: true,

                name: $6,
                annotatedType: $7,
                initialValue: $9,
            });
        }

    | propertyAccessorDeclarations "intenc" "static" identifier optVariableTypeAnnotation "=" expressionOrAssignmentPseudex ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticPropertyDeclaration, @$, {
                visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
                accessors: yy.option.some($1),
                isReassignable: false,
                doesShadow: false,

                name: $4,
                annotatedType: $5,
                initialValue: $7,
            });
        }
    | propertyAccessorDeclarations "intenc" "static" "var" identifier optVariableTypeAnnotation "=" expressionOrAssignmentPseudex ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticPropertyDeclaration, @$, {
                visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
                accessors: yy.option.some($1),
                isReassignable: true,
                doesShadow: false,

                name: $5,
                annotatedType: $6,
                initialValue: $8,
            });
        }

    | propertyAccessorDeclarations "intenc" "static" "shadow" identifier optVariableTypeAnnotation "=" expressionOrAssignmentPseudex ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticPropertyDeclaration, @$, {
                visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
                accessors: yy.option.some($1),
                isReassignable: false,
                doesShadow: true,

                name: $5,
                annotatedType: $6,
                initialValue: $8,
            });
        }
    | propertyAccessorDeclarations "intenc" "static" "var" "shadow" identifier optVariableTypeAnnotation "=" expressionOrAssignmentPseudex ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticPropertyDeclaration, @$, {
                visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
                accessors: yy.option.some($1),
                isReassignable: true,
                doesShadow: true,

                name: $6,
                annotatedType: $7,
                initialValue: $9,
            });
        }
    ;

propertyAccessorDeclarations
    : "(" pubPropertyAccessorDeclarations optProtPropertyAccessorDeclarations optPrivPropertyAccessorDeclarations ")"
        { $$ = yy.mergePropertyAccessorDeclarations(@$, $2, $3, $4); }
    | "(" protPropertyAccessorDeclarations optPrivPropertyAccessorDeclarations ")"
        { $$ = yy.mergePropertyAccessorDeclarations(@$, [], $2, $3); }
    | "(" privPropertyAccessorDeclarations ")"
        { $$ = yy.mergePropertyAccessorDeclarations(@$, [], [], $2); }
    ;

pubPropertyAccessorDeclarations
    : "pub"
        { $$ = [yy.createNode(yy.NodeType.PropertyGetterDeclaration, @$, { visibility: yy.VisibilityLevel.Public }), yy.createNode(yy.NodeType.PropertySetterDeclaration, @$, { visibility: yy.VisibilityLevel.Public })]; }
    | "pub" "get"
        { $$ = [yy.createNode(yy.NodeType.PropertyGetterDeclaration, @$, { visibility: yy.VisibilityLevel.Public })]; }
    | "pub" "set"
        { $$ = [yy.createNode(yy.NodeType.PropertySetterDeclaration, @$, { visibility: yy.VisibilityLevel.Public })]; }
    ;

optProtPropertyAccessorDeclarations
    : %empty
        { $$ = []; }
    | protPropertyAccessorDeclarations
    ;

protPropertyAccessorDeclarations
    : "prot"
        { $$ = [yy.createNode(yy.NodeType.PropertyGetterDeclaration, @$, { visibility: yy.VisibilityLevel.Protected }), yy.createNode(yy.NodeType.PropertySetterDeclaration, @$, { visibility: yy.VisibilityLevel.Protected })]; }
    | "prot" "get"
        { $$ = [yy.createNode(yy.NodeType.PropertyGetterDeclaration, @$, { visibility: yy.VisibilityLevel.Protected })]; }
    | "prot" "set"
        { $$ = [yy.createNode(yy.NodeType.PropertySetterDeclaration, @$, { visibility: yy.VisibilityLevel.Protected })]; }
    ;

optPrivPropertyAccessorDeclarations
    : %empty
        { $$ = []; }
    | privPropertyAccessorDeclarations
    ;

privPropertyAccessorDeclarations
    : "priv"
        { $$ = [yy.createNode(yy.NodeType.PropertyGetterDeclaration, @$, { visibility: yy.VisibilityLevel.Private }), yy.createNode(yy.NodeType.PropertySetterDeclaration, @$, { visibility: yy.VisibilityLevel.Private })]; }
    | "priv" "get"
        { $$ = [yy.createNode(yy.NodeType.PropertyGetterDeclaration, @$, { visibility: yy.VisibilityLevel.Private })]; }
    | "priv" "set"
        { $$ = [yy.createNode(yy.NodeType.PropertySetterDeclaration, @$, { visibility: yy.VisibilityLevel.Private })]; }
    ;

optVariableTypeAnnotation
    : %empty
        { $$ = yy.option.none(); }
    | variableTypeAnnotation
        { $$ = yy.option.some($1); }
    ;

variableTypeAnnotation
    : ":" type
        { $$ = $2; }
    ;

classStaticMethodDeclaration
    : optVisibilityModifier "static" identifier parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticMethodDeclaration, @$, {
                visibility: $1.unwrapOr(yy.VisibilityLevel.Private),
                doesShadow: false,

                name: $3,
                typeParams: [],
                params: $4,
                returnAnnotation: $5,
                thrownExceptions: $6,
                body: $7,
            });
        }
    | optVisibilityModifier "static" "shadow" identifier parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticMethodDeclaration, @$, {
                visibility: $1.unwrapOr(yy.VisibilityLevel.Private),
                doesShadow: true,

                name: $4,
                typeParams: [],
                params: $5,
                returnAnnotation: $6,
                thrownExceptions: $7,
                body: $8,
            });
        }

    | optVisibilityModifier "static" identifier angleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticMethodDeclaration, @$, {
                visibility: $1.unwrapOr(yy.VisibilityLevel.Private),
                doesShadow: false,

                name: $3,
                typeParams: $4,
                params: $5,
                returnAnnotation: $6,
                thrownExceptions: $7,
                body: $8,
            });
        }
    | optVisibilityModifier "static" "shadow" identifier angleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.ClassStaticMethodDeclaration, @$, {
                visibility: $1.unwrapOr(yy.VisibilityLevel.Private),
                doesShadow: true,

                name: $4,
                typeParams: $5,
                params: $6,
                returnAnnotation: $7,
                thrownExceptions: $8,
                body: $9,
            });
        }
    ;

optReturnTypeAnnotation
    : %empty
        { $$ = yy.option.none(); }
    | returnTypeAnnotation
        { $$ = yy.option.some($1); }
    ;

returnTypeAnnotation
    : ":" type
        { $$ = $2; }
    ;

optThrowsClause
    : %empty
        { $$ = []; }
    | throwsClause
    ;

throwsClause
    : "throws" oneOrMoreCommaSeparatedTypes
        { $$ = $2; }
    ;

angleBracketEnclosedGenericMethodFormalTypeParams
    : GENERIC_METHOD_TYPE_PARAM_LIST_LEFT_ANGLE_BRACKET oneOrMoreFormalTypeParams ">"
        { $$ = $2; }
    ;

classInstancePropertyDeclaration
    : optVisibilityModifier identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel($1),
                accessors: yy.option.none(),
                isReassignable: false,
                doesShadow: false,

                name: $2,
                annotatedType: $3,
            });
        }
    | optVisibilityModifier "var" identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel($1),
                accessors: yy.option.none(),
                isReassignable: true,
                doesShadow: false,

                name: $3,
                annotatedType: $4,
            });
        }

    | optVisibilityModifier "shadow" identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel($1),
                accessors: yy.option.none(),
                isReassignable: false,
                doesShadow: true,

                name: $3,
                annotatedType: $4,
            });
        }
    | optVisibilityModifier "var" "shadow" identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel($1),
                accessors: yy.option.none(),
                isReassignable: true,
                doesShadow: true,

                name: $4,
                annotatedType: $5,
            });
        }

    | propertyAccessorDeclarations identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.PropertyVisibilityLevel.Private,
                accessors: yy.option.some($1),
                isReassignable: false,
                doesShadow: false,

                name: $2,
                annotatedType: $3,
            });
        }
    | propertyAccessorDeclarations "var" identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.PropertyVisibilityLevel.Private,
                accessors: yy.option.some($1),
                isReassignable: true,
                doesShadow: false,

                name: $3,
                annotatedType: $4,
            });
        }

    | propertyAccessorDeclarations "shadow" identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.PropertyVisibilityLevel.Private,
                accessors: yy.option.some($1),
                isReassignable: false,
                doesShadow: true,

                name: $3,
                annotatedType: $4,
            });
        }
    | propertyAccessorDeclarations "var" "shadow" identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.PropertyVisibilityLevel.Private,
                accessors: yy.option.some($1),
                isReassignable: true,
                doesShadow: true,

                name: $4,
                annotatedType: $5,
            });
        }

    | propertyAccessorDeclarations visibilityModifier identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel(yy.option.some($2)),
                accessors: yy.option.some($1),
                isReassignable: false,
                doesShadow: false,

                name: $3,
                annotatedType: $4,
            });
        }
    | propertyAccessorDeclarations visibilityModifier "var" identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel(yy.option.some($2)),
                accessors: yy.option.some($1),
                isReassignable: true,
                doesShadow: false,

                name: $4,
                annotatedType: $5,
            });
        }

    | propertyAccessorDeclarations visibilityModifier "shadow" identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel(yy.option.some($2)),
                accessors: yy.option.some($1),
                isReassignable: false,
                doesShadow: true,

                name: $4,
                annotatedType: $5,
            });
        }
    | propertyAccessorDeclarations visibilityModifier "var" "shadow" identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.convertToPropertyVisibilityLevel(yy.option.some($2)),
                accessors: yy.option.some($1),
                isReassignable: true,
                doesShadow: true,

                name: $5,
                annotatedType: $6,
            });
        }

    | propertyAccessorDeclarations "intenc" identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
                accessors: yy.option.some($1),
                isReassignable: false,
                doesShadow: false,

                name: $3,
                annotatedType: $4,
            });
        }
    | propertyAccessorDeclarations "intenc" "var" identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
                accessors: yy.option.some($1),
                isReassignable: true,
                doesShadow: false,

                name: $4,
                annotatedType: $5,
            });
        }

    | propertyAccessorDeclarations "intenc" "shadow" identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
                accessors: yy.option.some($1),
                isReassignable: false,
                doesShadow: true,

                name: $4,
                annotatedType: $5,
            });
        }
    | propertyAccessorDeclarations "intenc" "var" "shadow" identifier variableTypeAnnotation ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstancePropertyDeclaration, @$, {
                visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
                accessors: yy.option.some($1),
                isReassignable: true,
                doesShadow: true,

                name: $5,
                annotatedType: $6,
            });
        }
    ;

classInstanceMethodDeclaration
    : classFinalNonOverrideInstanceMethodDeclaration
    | classFinalOverrideInstanceMethodDeclaration
    | classOpenInstanceMethodDeclaration
    | classAbstractInstanceMethodDeclaration
    ;

classFinalNonOverrideInstanceMethodDeclaration
    : optVisibilityModifier identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.ClassInstanceMethodDeclaration, @$, {
                extensibility: yy.ExtensibilityLevel.Final,
                doesOverride: false,

                visibility: $1.unwrapOr(yy.VisibilityLevel.Private),

                name: $2,
                typeParams: $3,
                params: $4,
                returnAnnotation: $5,
                thrownExceptions: $6,
                body: $7,
            });
        }
    ;

classFinalOverrideInstanceMethodDeclaration
    : "override" identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.ClassInstanceMethodDeclaration, @$, {
                extensibility: yy.ExtensibilityLevel.Final,
                doesOverride: true,

                visibility: yy.VisibilityLevel.Protected,

                name: $2,
                typeParams: $3,
                params: $4,
                returnAnnotation: $5,
                thrownExceptions: $6,
                body: $7,
            });
        }
    | "pub" "override" identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.ClassInstanceMethodDeclaration, @$, {
                extensibility: yy.ExtensibilityLevel.Final,
                doesOverride: true,

                visibility: yy.VisibilityLevel.Public,

                name: $3,
                typeParams: $4,
                params: $5,
                returnAnnotation: $6,
                thrownExceptions: $7,
                body: $8,
            });
        }
    ;

classOpenInstanceMethodDeclaration
    : "open" identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.ClassInstanceMethodDeclaration, @$, {
                extensibility: yy.ExtensibilityLevel.Open,
                doesOverride: false,

                visibility: yy.VisibilityLevel.Protected,

                name: $2,
                typeParams: $3,
                params: $4,
                returnAnnotation: $5,
                thrownExceptions: $6,
                body: $7,
            });
        }
    | "open" "override" identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.ClassInstanceMethodDeclaration, @$, {
                extensibility: yy.ExtensibilityLevel.Open,
                doesOverride: true,

                visibility: yy.VisibilityLevel.Protected,

                name: $3,
                typeParams: $4,
                params: $5,
                returnAnnotation: $6,
                thrownExceptions: $7,
                body: $8,
            });
        }
    | "pub" "open" identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.ClassInstanceMethodDeclaration, @$, {
                extensibility: yy.ExtensibilityLevel.Open,
                doesOverride: false,

                visibility: yy.VisibilityLevel.Public,

                name: $3,
                typeParams: $4,
                params: $5,
                returnAnnotation: $6,
                thrownExceptions: $7,
                body: $8,
            });
        }
    | "pub" "open" "override" identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.ClassInstanceMethodDeclaration, @$, {
                extensibility: yy.ExtensibilityLevel.Open,
                doesOverride: true,

                visibility: yy.VisibilityLevel.Public,

                name: $4,
                typeParams: $5,
                params: $6,
                returnAnnotation: $7,
                thrownExceptions: $8,
                body: $9,
            });
        }
    ;

classAbstractInstanceMethodDeclaration
    : "abstract" identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstanceMethodDeclaration, @$, {
                extensibility: yy.ExtensibilityLevel.Abstract,

                visibility: yy.VisibilityLevel.Protected,

                name: $2,
                typeParams: $3,
                params: $4,
                returnAnnotation: $5,
                thrownExceptions: $6,
            });
        }
    | "pub" "abstract" identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause ";"
        {
            $$ = yy.createNode(yy.NodeType.ClassInstanceMethodDeclaration, @$, {
                extensibility: yy.ExtensibilityLevel.Abstract,

                visibility: yy.VisibilityLevel.Public,

                name: $3,
                typeParams: $4,
                params: $5,
                returnAnnotation: $6,
                thrownExceptions: $7,
            });
        }
    ;

optAngleBracketEnclosedGenericMethodFormalTypeParams
    : %empty
        { $$ = []; }
    | angleBracketEnclosedGenericMethodFormalTypeParams
    ;

classInnerClassDeclaration
    : optVisibilityModifier finalClassDeclaration
        { $$ = yy.createNode(yy.NodeType.ClassInnerClassDeclaration, @$, { visibility: $1.unwrapOr(yy.VisibilityLevel.Private), classDeclaration: $2 }); }
    | extensibleClassDeclaration
        { $$ = yy.createNode(yy.NodeType.ClassInnerClassDeclaration, @$, { visibility: yy.VisibilityLevel.Private, classDeclaration: $1 }); }
    | "prot" extensibleClassDeclaration
        { $$ = yy.createNode(yy.NodeType.ClassInnerClassDeclaration, @$, { visibility: yy.VisibilityLevel.Protected, classDeclaration: $2 }); }
    | "pub" extensibleClassDeclaration
        { $$ = yy.createNode(yy.NodeType.ClassInnerClassDeclaration, @$, { visibility: yy.VisibilityLevel.Public, classDeclaration: $2 }); }
    ;

classInnerInterfaceDeclaration
    : optVisibilityModifier interfaceDeclaration
        { $$ = yy.createNode(yy.NodeType.ClassInnerInterfaceDeclaration, @$, { visibility: $1.unwrapOr(yy.VisibilityLevel.Private), interfaceDeclaration: $2 }); }
    ;

pubInterfaceDeclaration
    : "pub" interfaceDeclaration
        { $$ = yy.merge($2, { isPub: true }); }
    ;

interfaceDeclaration
    : "interface" optShadowKeyword identifier optBracketedFormalTypeParams optInterfaceExtensionClause "{" optUseStatements optInterfaceMethodDeclarations "}"
        { $$ = yy.createNode(yy.NodeType.InterfaceDeclaration, @$, { isPub: false, doesShadow: $2.isSome(), name: $3, typeParams: $4, superInterfaces: $5, useStatements: $7, methods: $8 }); }
    ;

optInterfaceExtensionClause
    : %empty
        { $$ = []; }
    | interfaceExtensionClause
    ;

interfaceExtensionClause
    : "extends" oneOrMoreCommaSeparatedTypes
        { $$ = $2; }
    ;

optInterfaceMethodDeclarations
    : %empty
        { $$ = []; }
    | optInterfaceMethodDeclarations interfaceMethodDeclaration
        { $$ = $1.concat([$2]); }
    ;

interfaceMethodDeclaration
    : identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause ";"
        { $$ = yy.createNode(yy.NodeType.InterfaceAbstractMethodDeclaration, @$, { name: $1, typeParams: $2, params: $3, returnAnnotation: $4, thrownExceptions: $5 }); }
    | "default" identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        { $$ = yy.createNode(yy.NodeType.InterfaceDefaultMethodDeclaration, @$, { name: $2, typeParams: $3, params: $4, returnAnnotation: $5, thrownExceptions: $6, body: $7 }); }
    ;

optPrivClassOrInterfaceDeclarations
    : %empty
        { $$ = []; }
    | optPrivClassOrInterfaceDeclarations classDeclaration
        { $$ = $1.concat([$2]); }
    | optPrivClassOrInterfaceDeclarations interfaceDeclaration
        { $$ = $1.concat([$2]); }
    ;

statement
    : expression ";"
        { $$ = yy.createNode(yy.NodeType.StatementExpression, @$, { expression: $1 }); }
    | blockStatement
    | ifStatement
    | switchStatement
    | returnStatement
    | breakStatement
    | continueStatement
    | variableDeclaration
    | variableAssignment
    | throwStatement
    | whileStatement
    | doWhileStatement
    | loopStatement
    | repeatStatement
    | forStatement
    | tryStatement
    | ifTypeGuardStatement
    | whileTypeGuardStatement
    ;

blockStatement
    : "{" optUseStatements "}"
        { $$ = yy.createNode(yy.NodeType.BlockStatement, @$, { useStatements: $2, statements: [] }); }
    | "{" optUseStatements oneOrMoreStatements "}"
        { $$ = yy.createNode(yy.NodeType.BlockStatement, @$, { useStatements: $2, statements: $3 }); }
    ;

ifStatement
    : "if" expression blockStatement optStatementElseIfClauses
        { $$ = yy.createNode(yy.NodeType.IfStatement, @$, { condition: $2, body: $3, elseIfClauses: $4, elseBody: yy.option.none() }); }
    | "if" expression blockStatement optStatementElseIfClauses statementElseClause
        { $$ = yy.createNode(yy.NodeType.IfStatement, @$, { condition: $2, body: $3, elseIfClauses: $4, elseBody: yy.option.some($5) }); }
    ;

optStatementElseIfClauses
    : %empty
        { $$ = []; }
    | optStatementElseIfClauses statementElseIfClause
        { $$ = $1.concat([$2]); }
    ;

statementElseIfClause
    : "else" "if" expression blockStatement
        { $$ = yy.createNode(yy.NodeType.StatementElseIfClause, @$, { condition: $3, body: $4 }); }
    ;

statementElseClause
    : "else" blockStatement
        { $$ = $2; }
    ;

switchStatement
    : "switch" expression "{" oneOrMoreStatementCaseClauses "}"
        { $$ = yy.createNode(yy.NodeType.SwitchStatement, @$, { comparedExpression: $2, caseClauses: $4, elseBody: yy.option.none() }); }
    | "switch" expression "{" statementElseClause "}"
        { $$ = yy.createNode(yy.NodeType.SwitchStatement, @$, { comparedExpression: $2, caseClauses: [], elseBody: yy.option.some($4) }); }
    | "switch" expression "{" oneOrMoreStatementCaseClauses statementElseClause "}"
        { $$ = yy.createNode(yy.NodeType.SwitchStatement, @$, { comparedExpression: $2, caseClauses: $4, elseBody: yy.option.some($5) }); }
    ;

oneOrMoreStatementCaseClauses
    : statementCaseClause
        { $$ = [$1]; }
    | oneOrMoreStatementCaseClauses statementCaseClause
        { $$ = $1.concat([$2]); }
    ;

statementCaseClause
    : "case" oneOrMorePipeSeparatedExpressions blockStatement
        { $$ = yy.createNode(yy.NodeType.StatementCaseClause, @$, { matches: $2, body: $3 }); }
    ;

oneOrMorePipeSeparatedExpressions
    : expression
        { $$ = [$1]; }
    | oneOrMorePipeSeparatedExpressions "|" expression
        { $$ = $1.concat([$3]); }
    ;

returnStatement
    : "return_" ";"
        { $$ = yy.createNode(yy.NodeType.ReturnStatement, @$, { returnedValue: yy.option.none() }); }
    | "return_" expression ";"
        { $$ = yy.createNode(yy.NodeType.ReturnStatement, @$, { returnedValue: yy.option.some($2) }); }
    | "return_" returnablePseudex ";"
        { $$ = yy.createNode(yy.NodeType.ReturnStatement, @$, { returnedValue: yy.option.some($2) }); }
    ;

breakStatement
    : "break" ";"
        { $$ = yy.createNode(yy.NodeType.BreakStatement, @$, {}); }
    ;

continueStatement
    : "continue" ";"
        { $$ = yy.createNode(yy.NodeType.ContinueStatement, @$, {}); }
    ;

variableDeclaration
    : variableDeclarationKeyword optShadowKeyword identifier optVariableTypeAnnotation "=" expressionOrAssignmentPseudex ";"
        { $$ = yy.createNode(yy.NodeType.VariableDeclaration, @$, { isReassignable: $1 === "var", doesShadow: $2.isSome(), name: $3, annotatedType: $4, initialValue: $6 }); }
    ;

expressionOrAssignmentPseudex
    : expression
    | assignmentPseudex
    ;

variableDeclarationKeyword
    : "let"
    | "var"
    ;

assignmentPseudex
    : returnablePseudex
    | nonReturnablePseudex
    | blockPseudex
    ;

nonReturnablePseudex
    : repeatingArrayFillPseudex
    | repeatingListFillPseudex
    | sequentialListFillPseudex
    | arrayMapPseudex
    | listMapPseudex
    | listFilterMapPseudex
    ;

repeatingArrayFillPseudex
    : "[" expression ";" oneOrMoreCommaSeparatedExpressions "]"
        { $$ = yy.createNode(yy.NodeType.RepeatingArrayFillPseudex, @$, { fillExpression: $2, dimensions: $4 }); }
    ;

repeatingListFillPseudex
    : "+" "[" expression ";" oneOrMoreCommaSeparatedExpressions "]"
        { $$ = yy.createNode(yy.NodeType.RepeatingListFillPseudex, @$, { fillExpression: $3, dimensions: $5 }); }
    ;

oneOrMoreCommaSeparatedExpressions
    : expression
        { $$ = [$1]; }
    | oneOrMoreCommaSeparatedExpressions "," expression
        { $$ = $1.concat([$3]); }
    ;

sequentialListFillPseudex
    : "+" "[" "]"
        { $$ = yy.createNode(yy.NodeType.SequentialListFillPseudex, @$, { elements: [] }); }
    | "+" "[" "oneOrMoreCommaSeparatedExpressions" optTrailingComma "]"
        { $$ = yy.createNode(yy.NodeType.SequentialListFillPseudex, @$, { elements: $3 }); }
    ;

arrayMapPseudex
    : "[" expression "for" oneOrMoreForBindings "in" expression "]"
        { $$ = yy.createNode(yy.NodeType.ArrayMapPseudex, @$, { output: $2, bindings: $4, iteratee: $6 }); }
    | "[" assignmentPseudex "for" oneOrMoreForBindings "in" expression "]"
        { $$ = yy.createNode(yy.NodeType.ArrayMapPseudex, @$, { output: $2, bindings: $4, iteratee: $6 }); }
    ;

oneOrMoreForBindings
    : forBinding
        { $$ = [$1]; }
    | oneOrMoreForBindings "," forBinding
        { $$ = $1.concat([$3]); }
    ;

forBinding
    : forValueBinding
    | forIndexBinding
    ;

forValueBinding
    : optShadowKeyword identifier
        { $$ = yy.createNode(yy.NodeType.ForBinding, @$, { bindingType: yy.ForBindingType.ValueBinding, doesShadow: $1.isSome(), name: $2 }); }
    ;

forIndexBinding
    : optShadowKeyword "@" identifier
        { $$ = yy.createNode(yy.NodeType.ForBinding, @$, { bindingType: yy.ForBindingType.IndexBinding, doesShadow: $1.isSome(), name: $3 }); }
    ;

listMapPseudex
    : "+" "[" expression "for" oneOrMoreForBindings "in" expression "]"
        { $$ = yy.createNode(yy.NodeType.ListMapPseudex, @$, { output: $3, bindings: $5, iteratee: $7 }); }
    | "+" "[" assignmentPseudex "for" oneOrMoreForBindings "in" expression "]"
        { $$ = yy.createNode(yy.NodeType.ListMapPseudex, @$, { output: $3, bindings: $5, iteratee: $7 }); }
    ;

listFilterMapPseudex
    : "+" "[" expression "for" oneOrMoreForBindings "in" expression "if" expression "]"
        { $$ = yy.createNode(yy.NodeType.ListFilterMapPseudex, @$, { output: $3, bindings: $5, iteratee: $7, predicate: $9 }); }
    | "+" "[" assignmentPseudex "for" oneOrMoreForBindings "in" expression "if" expression "]"
        { $$ = yy.createNode(yy.NodeType.ListFilterMapPseudex, @$, { output: $3, bindings: $5, iteratee: $7, predicate: $9 }); }
    ;

returnablePseudex
    : ifPseudex
    | switchPseudex
    | tryPseudex
    | tryOrThrowPseudex
    | throwPseudex
    | ifTypeGuardPseudex
    ;

ifPseudex
    : ifPseudexWithIfBodyPseudex
    | ifPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause
    | ifPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses
    ;

ifPseudexWithIfBodyPseudex
    : "if" expression blockPseudex "else" blockExpressionOrBlockPseudex
        { $$ = yy.createNode(yy.NodeType.IfPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyPseudex, condition: $2, body: $3, elseIfClauses: [], elseBody: $5 }); }
    | "if" expression blockPseudex oneOrMoreExpressionElseIfClauses "else" blockExpressionOrBlockPseudex
        { $$ = yy.createNode(yy.NodeType.IfPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyPseudex, condition: $2, body: $3, elseIfClauses: $4, elseBody: $6 }); }
    | "if" expression blockPseudex oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses "else" blockExpressionOrBlockPseudex
        { $$ = yy.createNode(yy.NodeType.IfPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyPseudex, condition: $2, body: $3, elseIfClauses: $4, elseBody: $6 }); }
    ;

ifPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause
    : "if" expression blockExpression oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses "else" blockExpressionOrBlockPseudex
        { $$ = yy.createNode(yy.NodeType.IfPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyExpressionAndAtLeastOnePseudexElseIfClause, condition: $2, body: $3, elseIfClauses: $4, elseBody: $6 }); }
    ;

ifPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses
    : "if" expression blockExpression "else" blockPseudex
        { $$ = yy.createNode(yy.NodeType.IfPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses, condition: $2, body: $3, elseIfClauses: [], elseBody: $5 }); }
    | "if" expression blockExpression oneOrMoreExpressionElseIfClauses "else" blockPseudex
        { $$ = yy.createNode(yy.NodeType.IfPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses, condition: $2, body: $3, elseIfClauses: $4, elseBody: $6 }); }
    ;

blockPseudex
    : "{" optUseStatements oneOrMoreStatements expression "}"
        { $$ = yy.createNode(yy.NodeType.BlockPseudex, @$, { useStatements: $2, statements: $3, conclusion: $4 }); }
    | "{" optUseStatements returnablePseudex "}"
        { $$ = yy.createNode(yy.NodeType.BlockPseudex, @$, { useStatements: $2, statements: [], conclusion: $3 }); }
    | "{" optUseStatements oneOrMoreStatements returnablePseudex "}"
        { $$ = yy.createNode(yy.NodeType.BlockPseudex, @$, { useStatements: $2, statements: $3, conclusion: $4 }); }
    ;

oneOrMoreExpressionElseIfClauses
    : expressionElseIfClause
        { $$ = [$1]; }
    | oneOrMoreExpressionElseIfClauses expressionElseIfClause
        { $$ = $1.concat([$2]); }
    ;

expressionElseIfClause
    : "else" "if" expression blockExpression
        { $$ = yy.createNode(yy.NodeType.ExpressionElseIfClause, @$, { condition: $3, body: $4 }); }
    ;

oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses
    : pseudexElseIfClause
        { $$ = [$1]; }
    | oneOrMoreExpressionElseIfClauses pseudexElseIfClause
        { $$ = yy.concat($1, [$2]); }
    | oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses expressionElseIfClause
        { $$ = $1.concat([$2]); }
    | oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses pseudexElseIfClause
        { $$ = $1.concat([$2]); }
    ;

pseudexElseIfClause
    : "else" "if" expression blockPseudex
        { $$ = yy.createNode(yy.NodeType.PseudexElseIfClause, @$, { condition: $3, body: $4 }); }
    ;

switchPseudex
    : switchPseudexWithAtLeastOnePseudexCaseClause
    | switchPseudexWithOneOrMoreExpressionCaseClauses
    | switchPseudexWithNoCaseClauses
    ;

switchPseudexWithAtLeastOnePseudexCaseClause
    : "switch" expression "{" oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses "else" blockExpressionOrBlockPseudex "}"
        { $$ = yy.createNode(yy.NodeType.SwitchPseudex, @$, { pseudexType: yy.SwitchPseudexType.WithAtLeastOnePseudexCaseClause, comparedExpression: $2, caseClauses: $4, elseBody: $6 }); }
    ;

switchPseudexWithOneOrMoreExpressionCaseClauses
    : "switch" expression "{" oneOrMoreExpressionCaseClauses "else" blockPseudex "}"
        { $$ = yy.createNode(yy.NodeType.SwitchPseudex, @$, { pseudexType: yy.SwitchPseudexType.WithOneOrMoreExpressionCaseClauses, comparedExpression: $2, caseClauses: $4, elseBody: $6 }); }
    ;

switchPseudexWithNoCaseClauses
    : "switch" expression "{" "else" blockPseudex "}"
        { $$ = yy.createNode(yy.NodeType.SwitchPseudex, @$, { pseudexType: yy.SwitchPseudexType.WithNoCaseClauses, comparedExpression: $2, caseClauses: [], elseBody: $5 }); }
    ;

oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses
    : pseudexCaseClause
        { $$ = [$1]; }
    | oneOrMoreExpressionCaseClauses pseudexCaseClause
        { $$ = yy.concat($1, [$2]); }
    | oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses expressionCaseClause
        { $$ = $1.concat([$2]); }
    | oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses pseudexCaseClause
        { $$ = $1.concat([$2]); }
    ;

pseudexCaseClause
    : "case" oneOrMorePipeSeparatedExpressions blockPseudex
        { $$ = yy.createNode(yy.NodeType.PseudexCaseClause, @$, { matches: $2, body: $3 }); }
    ;

oneOrMoreExpressionCaseClauses
    : expressionCaseClause
        { $$ = [$1]; }
    | oneOrMoreExpressionCaseClauses expressionCaseClause
        { $$ = $1.concat([$2]); }
    ;

expressionCaseClause
    : "case" oneOrMorePipeSeparatedExpressions blockExpression
        { $$ = yy.createNode(yy.NodeType.ExpressionCaseClause, @$, { matches: $2, body: $3 }); }
    ;

blockExpressionOrBlockPseudex
    : blockExpression
    | blockPseudex
    ;

tryPseudex
    : "try" blockExpressionOrBlockPseudex oneOrMoreExpressionOrPseudexCatchClauses
        { $$ = yy.createNode(yy.NodeType.TryPseudex, @$, { body: $2, catchClauses: $3 }); }
    ;

oneOrMoreExpressionOrPseudexCatchClauses
    : expressionOrPseudexCatchClause
        { $$ = [$1]; }
    | oneOrMoreExpressionOrPseudexCatchClauses expressionOrPseudexCatchClause
        { $$ = $1.concat([$2]); }
    ;

expressionOrPseudexCatchClause
    : "catch" identifier ":" oneOrMorePipeSeparatedTypes blockExpressionOrBlockPseudex
        {
            if ($5.nodeType === yy.NodeType.BlockExpression) {
                $$ = yy.createNode(yy.NodeType.ExpressionCatchClause, @$, { exceptionName: $2, exceptionTypes: $4, body: $5 });
            } else {
                $$ = yy.createNode(yy.NodeType.PseudexCatchClause, @$, { exceptionName: $2, exceptionTypes: $4, body: $5 });
            }
        }
    ;

tryOrThrowPseudex
    : "tryorthrow" expression
        { $$ = yy.createNode(yy.NodeType.TryOrThrowPseudex, @$, { expression: $2 }); }
    ;

throwPseudex
    : "throw" expression
        { $$ = yy.createNode(yy.NodeType.ThrowPseudex, @$, { thrownValue: $2 }); }
    | "throw" returnablePseudex
        { $$ = yy.createNode(yy.NodeType.ThrowPseudex, @$, { thrownValue: $2 }); }
    ;

ifTypeGuardPseudex
    : ifTypeGuardPseudexWithIfBodyPseudex
    | ifTypeGuardPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause
    | ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses
    ;

ifTypeGuardPseudexWithIfBodyPseudex
    : "if" "let" oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockPseudex "else" blockExpressionOrBlockPseudex
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyPseudex, declarations: $3, body: $5, elseIfClauses: [], elseBody: $7 }); }
    | "if" "let" oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockPseudex oneOrMoreExpressionElseIfClauses "else" blockExpressionOrBlockPseudex
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyPseudex, declarations: $3, body: $5, elseIfClauses: $6, elseBody: $8 }); }
    | "if" "let" oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockPseudex oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses "else" blockExpressionOrBlockPseudex
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyPseudex, declarations: $3, body: $5, elseIfClauses: $6, elseBody: $8 }); }

    | "if" "let" oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockPseudex "else" blockExpressionOrBlockPseudex
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyPseudex, declarations: $3, body: $5, elseIfClauses: [], elseBody: $7 }); }
    | "if" "let" oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockPseudex oneOrMoreExpressionElseIfClauses "else" blockExpressionOrBlockPseudex
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyPseudex, declarations: $3, body: $5, elseIfClauses: $6, elseBody: $8 }); }
    | "if" "let" oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockPseudex oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses "else" blockExpressionOrBlockPseudex
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyPseudex, declarations: $3, body: $5, elseIfClauses: $6, elseBody: $8 }); }
    ;

ifTypeGuardPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause
    : "if" "let" oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockExpression oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses "else" blockExpressionOrBlockPseudex
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyExpressionAndAtLeastOnePseudexElseIfClause, declarations: $3, body: $5, elseIfClauses: $6, elseBody: $8 }); }
    | "if" "let" oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockExpression oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses "else" blockExpressionOrBlockPseudex
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyExpressionAndAtLeastOnePseudexElseIfClause, declarations: $3, body: $5, elseIfClauses: $6, elseBody: $8 }); }
    ;

ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses
    : "if" "let" oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockExpression "else" blockPseudex
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses, declarations: $3, body: $5, elseIfClauses: [], elseBody: $7 }); }
    | "if" "let" oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockExpression oneOrMoreExpressionElseIfClauses "else" blockPseudex
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses, declarations: $3, body: $5, elseIfClauses: $6, elseBody: $8 }); }

    | "if" "let" oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockExpression "else" blockPseudex
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses, declarations: $3, body: $5, elseIfClauses: [], elseBody: $7 }); }
    | "if" "let" oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockExpression oneOrMoreExpressionElseIfClauses "else" blockPseudex
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, @$, { pseudexType: yy.IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses, declarations: $3, body: $5, elseIfClauses: $6, elseBody: $8 }); }
    ;

variableAssignment
    : assignableExpression "=" expressionOrAssignmentPseudex ";"
        { $$ = yy.createNode(yy.NodeType.VariableAssignment, @$, { assignee: $1, assignmentType: $2, assignment: $3 }); }

    | assignableExpression "**=" expressionOrAssignmentPseudex ";"
        { $$ = yy.createNode(yy.NodeType.VariableAssignment, @$, { assignee: $1, assignmentType: $2, assignment: $3 }); }
    | assignableExpression "*=" expressionOrAssignmentPseudex ";"
        { $$ = yy.createNode(yy.NodeType.VariableAssignment, @$, { assignee: $1, assignmentType: $2, assignment: $3 }); }
    | assignableExpression "/=" expressionOrAssignmentPseudex ";"
        { $$ = yy.createNode(yy.NodeType.VariableAssignment, @$, { assignee: $1, assignmentType: $2, assignment: $3 }); }
    | assignableExpression "%=" expressionOrAssignmentPseudex ";"
        { $$ = yy.createNode(yy.NodeType.VariableAssignment, @$, { assignee: $1, assignmentType: $2, assignment: $3 }); }
    | assignableExpression "+=" expressionOrAssignmentPseudex ";"
        { $$ = yy.createNode(yy.NodeType.VariableAssignment, @$, { assignee: $1, assignmentType: $2, assignment: $3 }); }
    | assignableExpression "-=" expressionOrAssignmentPseudex ";"
        { $$ = yy.createNode(yy.NodeType.VariableAssignment, @$, { assignee: $1, assignmentType: $2, assignment: $3 }); }
    ;

throwStatement
    : throwPseudex ";"
        { $$ = yy.createNode(yy.NodeType.ThrowStatement, @$, { thrownValue: $1.thrownValue }); }
    ;

whileStatement
    : "while" expression blockStatement
        { $$ = yy.createNode(yy.NodeType.WhileStatement, @$, { condition: $2, body: $3 }); }
    ;

doWhileStatement
    : "do" blockStatement "while" expression ";"
        { $$ = yy.createNode(yy.NodeType.DoWhileStatement, @$, { body: $2, condition: $4 }); }
    ;

loopStatement
    : "loop" blockStatement
        { $$ = yy.createNode(yy.NodeType.LoopStatement, @$, { body: $2 }); }
    ;

repeatStatement
    : "repeat" expression blockStatement
        { $$ = yy.createNode(yy.NodeType.RepeatStatement, @$, { repetitionQuantity: $2, body: $3 }); }
    ;

forStatement
    : cStyleForStatement
    | collectionIterationForStatement
    | rangeForStatement
    ;

cStyleForStatement
    : "for" "(" statement expression ";" statement ")" blockStatement
        { $$ = yy.createNode(yy.NodeType.CStyleForStatement, @$, { initialStatement: $3, condition: $4, afterthought: $6, body: $8 }); }
    ;

collectionIterationForStatement
    : "for" forValueBinding "in" expression blockStatement
        { $$ = yy.createNode(yy.NodeType.CollectionIterationForStatement, @$, { bindings: [$2], iteratee: $4, body: $5 }); }
    | "for" forIndexBinding "in" expression blockStatement
        { $$ = yy.createNode(yy.NodeType.CollectionIterationForStatement, @$, { bindings: [$2], iteratee: $4, body: $5 }); }
    | "for" twoOrMoreForBindings "in" expression blockStatement
        { $$ = yy.createNode(yy.NodeType.CollectionIterationForStatement, @$, { bindings: $2, iteratee: $4, body: $5 }); }
    ;

twoOrMoreForBindings
    : forBinding "," forBinding
        { $$ = [$1, $3]; }
    | twoOrMoreForBindings "," forBinding
        { $$ = $1.concat([$3]); }
    ;

rangeForStatement
    : "for" forValueBinding "in" expression forRangeKeyword expression blockStatement
        { $$ = yy.createNode(yy.NodeType.RangeForStatement, @$, { binding: $2, start: $4, rangeType: $5, end: $6, body: $7 }); }
    ;

forRangeKeyword
    : "upuntil"
        { $$ = yy.ForStatementRangeType.UpUntil; }
    | "upto"
        { $$ = yy.ForStatementRangeType.UpTo; }
    | "downuntil"
        { $$ = yy.ForStatementRangeType.DownUntil; }
    | "downto"
        { $$ = yy.ForStatementRangeType.DownTo; }
    ;

tryStatement
    : "try" blockStatement oneOrMoreStatementCatchClauses
        { $$ = yy.createNode(yy.NodeType.TryStatement, @$, { body: $2, catchClauses: $3 }); }
    ;

oneOrMoreStatementCatchClauses
    : statementCatchClause
        { $$ = [$1]; }
    | oneOrMoreStatementCatchClauses statementCatchClause
        { $$ = $1.concat([$2]); }
    ;

statementCatchClause
    : "catch" identifier ":" oneOrMorePipeSeparatedTypes blockStatement
        { $$ = yy.createNode(yy.NodeType.StatementCatchClause, @$, { exceptionName: $2, exceptionTypes: $4, body: $5 }); }
    ;

oneOrMorePipeSeparatedTypes
    : type
        { $$ = [$1]; }
    | oneOrMorePipeSeparatedTypes "|" type
        { $$ = $1.concat([$3]); }
    ;

ifTypeGuardStatement
    : "if" "let" oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockStatement optStatementElseIfClauses
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardStatement, @$, { declarations: $3, body: $5, elseIfClauses: $6, elseBody: yy.option.none() }); }
    | "if" "let" oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockStatement optStatementElseIfClauses statementElseClause
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardStatement, @$, { declarations: $3, body: $5, elseIfClauses: $6, elseBody: yy.option.some($7) }); }
    | "if" "let" oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockStatement optStatementElseIfClauses
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardStatement, @$, { declarations: $3, body: $5, elseIfClauses: $6, elseBody: yy.option.none() }); }
    | "if" "let" oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockStatement optStatementElseIfClauses statementElseClause
        { $$ = yy.createNode(yy.NodeType.IfTypeGuardStatement, @$, { declarations: $3, body: $5, elseIfClauses: $6, elseBody: yy.option.some($7) }); }
    ;

oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration
    : nonInlineTypeGuardVariableDeclaration
        { $$ = [$1]; }
    | oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations "," nonInlineTypeGuardVariableDeclaration
        { $$ = yy.concat($1, [$3]); }
    | oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration "," inlineTypeGuardVariableDeclaration
        { $$ = $1.concat([$3]); }
    | oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration "," nonInlineTypeGuardVariableDeclaration
        { $$ = $1.concat([$3]); }
    ;

nonInlineTypeGuardVariableDeclaration
    : nonInlineNullGuardVariableDeclaration
    | nonInlineInstanceofGuardVariableDeclaration
    ;

nonInlineNullGuardVariableDeclaration
    : identifier "=" expressionOrAssignmentPseudex
        { $$ = yy.createNode(yy.NodeType.NullGuardVariableDeclaration, @$, { isInline: false, name: $1, assignment: $3 }); }
    ;

nonInlineInstanceofGuardVariableDeclaration
    : identifier ":" angleBracketlessType "=" expressionOrAssignmentPseudex
        { $$ = yy.createNode(yy.NodeType.InstanceofGuardVariableDeclaration, @$, { name: $1, annotatedType: $3, assignment: $5 }); }
    ;

oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations
    : inlineNullGuardVariableDeclaration
        { $$ = [$1]; }
    | oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations "," inlineNullGuardVariableDeclaration
        { $$ = $1.concat($3); }
    ;

inlineTypeGuardVariableDeclaration
    : inlineNullGuardVariableDeclaration
    ;

inlineNullGuardVariableDeclaration
    : "inline" identifier "=" expressionOrAssignmentPseudex
        { $$ = yy.createNode(yy.NodeType.NullGuardVariableDeclaration, @$, { isInline: true, name: $2, assignment: $4 }); }
    ;

whileTypeGuardStatement
    : "while" "let" oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockStatement
        { $$ = yy.createNode(yy.NodeType.WhileTypeGuardStatement, @$, { declarations: $3, body: $5 }); }
    | "while" "let" oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockStatement
        { $$ = yy.createNode(yy.NodeType.WhileTypeGuardStatement, @$, { declarations: $3, body: $5 }); }
    ;

expression
    : assignableExpression
    | nonassignableExpression
    ;

assignableExpression
    : identifier
    | "#" identifier
        { $$ = yy.createNode(yy.NodeType.ThisHashExpression, @$, { right: $2 }); }
    | expression "." identifier
        { $$ = yy.createNode(yy.NodeType.DotExpression, @$, { left: $1, right: $3 }); }
    | expression "#" identifier
        { $$ = yy.createNode(yy.NodeType.HashExpression, @$, { left: $1, right: $3 }); }
    | expression "[" expression "]"
        { $$ = yy.createNode(yy.NodeType.IndexExpression, @$, { collection: $1, index: $3 }); }
    ;

nonassignableExpression
    : literalExpression
    | methodInvocationExpression

    | castExpression
    | anonymousInnerClassInstantiationExpression

    | lambdaExpression

    | rangeCheckExpression
    | instanceofExpression
    | notinstanceofExpression

    | postfixExpression
    | prefixExpression
    | infixExpression

    | ifExpression
    | switchExpression

    | ifInlineTypeGuardExpression

    | parenthesizedExpression
    ;

literalExpression
    : nullLiteral
    | trueLiteral
    | falseLiteral
    | numberLiteral
    | charLiteral
    | stringLiteral
    | arrayLiteral
    ;

nullLiteral
    : "null"
        { $$ = yy.createNode(yy.NodeType.LiteralExpression, @$, { literalType: yy.LiteralType.Null }); }
    ;

trueLiteral
    : "true"
        { $$ = yy.createNode(yy.NodeType.LiteralExpression, @$, { literalType: yy.LiteralType.Boolean, value: true }); }
    ;

falseLiteral
    : "false"
        { $$ = yy.createNode(yy.NodeType.LiteralExpression, @$, { literalType: yy.LiteralType.Boolean, value: false }); }
    ;

numberLiteral
    : NUMBER_LITERAL
        { $$ = yy.createNode(yy.NodeType.LiteralExpression, @$, { literalType: yy.LiteralType.Number, source: $1 }); }
    ;

charLiteral
    : CHAR_LITERAL
        { $$ = yy.createNode(yy.NodeType.LiteralExpression, @$, { literalType: yy.LiteralType.Character, source: $1 }); }
    ;

stringLiteral
    : STRING_LITERAL
        { $$ = yy.createNode(yy.NodeType.LiteralExpression, @$, { literalType: yy.LiteralType.String, source: $1 }); }
    ;

arrayLiteral
    : sequentialArrayLiteral
    | defaultValueArrayLiteral
    | repeatingArrayLiteral
    ;

sequentialArrayLiteral
    : "[" "]"
        { $$ = yy.createNode(yy.NodeType.LiteralExpression, @$, { literalType: yy.LiteralType.Array, arrayType: yy.ArrayLiteralType.Sequential, elements: [] }); }
    | "[" oneOrMoreCommaSeparatedExpressions optTrailingComma "]"
        { $$ = yy.createNode(yy.NodeType.LiteralExpression, @$, { literalType: yy.LiteralType.Array, arrayType: yy.ArrayLiteralType.Sequential, elements: $2 }); }
    ;

defaultValueArrayLiteral
    : "[" "static" defaultArrayValue ";" oneOrMoreCommaSeparatedExpressions "]"
        { $$ = yy.createNode(yy.NodeType.LiteralExpression, @$, { literalType: yy.LiteralType.Array, arrayType: yy.ArrayLiteralType.Default, fill: $3, dimensions: $5 }); }
    ;

defaultArrayValue
    : numberLiteral
    | falseLiteral
    | nullLiteral
    ;

repeatingArrayLiteral
    : "[" expression ";" "static" oneOrMoreCommaSeparatedNumberLiterals "]"
        { $$ = yy.createNode(yy.NodeType.LiteralExpression, @$, { literalType: yy.LiteralType.Array, arrayType: yy.ArrayLiteralType.Repeating, fill: $2, dimensions: $5 }); }
    ;

oneOrMoreCommaSeparatedNumberLiterals
    : numberLiteral
        { $$ = [$1]; }
    | oneOrMoreCommaSeparatedNumberLiterals "," numberLiteral
        { $$ = $1.concat([$3]); }
    ;

methodInvocationExpression
    : methodInvocationExpressionWithUnlabeledActualParams
    | methodInvocationExpressionWithLabeledActualParams
    ;

methodInvocationExpressionWithUnlabeledActualParams
    : expression "(" ")"
        { $$ = yy.createNode(yy.NodeType.MethodInvocationExpression, @$, { isLabeled: false, callee: $1, typeParams: [], params: [] }); }
    | expression "(" oneOrMoreCommaSeparatedExpressions optTrailingComma ")"
        { $$ = yy.createNode(yy.NodeType.MethodInvocationExpression, @$, { isLabeled: false, callee: $1, typeParams: [], params: $3 }); }
    | expression angleBracketEnclosedGenericMethodActualTypeParams "(" ")"
        { $$ = yy.createNode(yy.NodeType.MethodInvocationExpression, @$, { isLabeled: false, callee: $1, typeParams: $2, params: [] }); }
    | expression angleBracketEnclosedGenericMethodActualTypeParams "(" oneOrMoreCommaSeparatedExpressions optTrailingComma ")"
        { $$ = yy.createNode(yy.NodeType.MethodInvocationExpression, @$, { isLabeled: false, callee: $1, typeParams: $2, params: $4 }); }
    ;

methodInvocationExpressionWithLabeledActualParams
    : expression "(" oneOrMoreLabeledActualMethodParams optTrailingComma ")"
        { $$ = yy.createNode(yy.NodeType.MethodInvocationExpression, @$, { isLabeled: true, callee: $1, typeParams: [], params: $3 }); }
    | expression angleBracketEnclosedGenericMethodActualTypeParams "(" oneOrMoreLabeledActualMethodParams optTrailingComma ")"
        { $$ = yy.createNode(yy.NodeType.MethodInvocationExpression, @$, { isLabeled: true, callee: $1, typeParams: $2, params: $4 }); }
    ;

angleBracketEnclosedGenericMethodActualTypeParams
    : GENERIC_METHOD_TYPE_PARAM_LIST_LEFT_ANGLE_BRACKET oneOrMoreCommaSeparatedTypes ">"
        { $$ = $2; }
    ;

oneOrMoreLabeledActualMethodParams
    : labeledActualMethodParam
        { $$ = [$1]; }
    | oneOrMoreLabeledActualMethodParams "," labeledActualMethodParam
        { $$ = $1.concat([$3]); }
    ;

labeledActualMethodParam
    : identifier ":" expression
        { $$ = yy.createNode(yy.NodeType.LabeledActualParam, @$, { label: $1, value: $3 }); }
    ;

castExpression
    : expression "as" angleBracketlessType
        { $$ = yy.createNode(yy.NodeType.CastExpression, @$, { castee: $1, targetType: $3 }); }
    ;

angleBracketlessType
    : primitiveTypeLiteral
        {
            var identifier = yy.createNode(yy.NodeType.Identifier, @$, { source: $1 });
            $$ = yy.createNode(yy.NodeType.NiladicType, @$, { identifiers: [identifier] });
        }
    | oneOrMoreDotSeparatedIdentifiers %prec ANGLE_BRACKETLESS_TYPE
        { $$ = yy.createNode(yy.NodeType.NiladicType, @$, { identifiers: $1 }); }
    | angleBracketlessType "?"
        { $$ = yy.createNode(yy.NodeType.NullableType, @$, { baseType: $1 }); }
    | angleBracketlessType "[" "]"
        { $$ = yy.createNode(yy.NodeType.ArrayType, @$, { baseType: $1 }); }
    ;

anonymousInnerClassInstantiationExpression
    : "new" anonymousInnerClassInstantiationType anonymousInnerClassBody
        { $$ = yy.createNode(yy.NodeType.AnonymousInnerClassInstantiationExpression, @$, { instantiationType: $2, useStatements: $3.useStatements, items: $3.items }); }
    ;

anonymousInnerClassInstantiationType
    : oneOrMoreDotSeparatedIdentifiers optBracketedActualTypeParams
        {
            var niladic = yy.createNode(yy.NodeType.NiladicType, @1, { identifiers: $1 });
            if ($2.length === 0) {
                $$ = niladic;
            } else {
                $$ = yy.createNode(yy.NodeType.InstantiatedGenericType, @$, { baseType: niladic, actualParams: $2 });
            }
        }
    | oneOrMoreDotSeparatedIdentifiers optBracketedActualTypeParams "?"
        {
            var niladic = yy.createNode(yy.NodeType.NiladicType, @1, { identifiers: $1 });
            var nullBase = $2.length === 0
                ? niladic
                : yy.createNode(yy.NodeType.InstantiatedGenericType, yy.mergeLocations(@1, @2), { baseType: niladic, actualParams: $2 });
            $$ = yy.createNode(yy.NodeType.NullableType, @$, { baseType: nullBase });
        }
    ;

anonymousInnerClassBody
    : "{" optUseStatements optAnonymousInnerClassItems "}"
        { $$ = { useStatements: $2, items: $3 }; }
    ;

optAnonymousInnerClassItems
    : %empty
        { $$ = []; }
    | optAnonymousInnerClassItems anonymousInnerClassItem
        { $$ = $1.concat([$2]); }
    ;

anonymousInnerClassItem
    : identifier optVariableTypeAnnotation "=" expression ";"
        { $$ = yy.createNode(yy.NodeType.AnonymousInnerClassPropertyDeclaration, @$, { name: $1, annotatedType: $2, initialValue: $4 }); }
    | identifier optVariableTypeAnnotation "=" assignmentPseudex ";"
        { $$ = yy.createNode(yy.NodeType.AnonymousInnerClassPropertyDeclaration, @$, { name: $1, annotatedType: $2, initialValue: $4 }); }
    
    | blockStatement

    | identifier parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.AnonymousInnerClassMethodDeclaration, @$, {
                doesOverride: false,
                name: $1,
                typeParams: [],
                params: $2,
                returnAnnotation: $3,
                thrownExceptions: $4,
                body: $5,
            });
        }
    | identifier angleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.AnonymousInnerClassMethodDeclaration, @$, {
                doesOverride: false,
                name: $1,
                typeParams: $2,
                params: $3,
                returnAnnotation: $4,
                thrownExceptions: $5,
                body: $6,
            });
        }
    
    | "override" identifier parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.AnonymousInnerClassMethodDeclaration, @$, {
                doesOverride: true,
                name: $2,
                typeParams: [],
                params: $3,
                returnAnnotation: $4,
                thrownExceptions: $5,
                body: $6,
            });
        }
    | "override" identifier angleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody
        {
            $$ = yy.createNode(yy.NodeType.AnonymousInnerClassMethodDeclaration, @$, {
                doesOverride: true,
                name: $2,
                typeParams: $3,
                params: $4,
                returnAnnotation: $5,
                thrownExceptions: $6,
                body: $7,
            });
        }
    ;

lambdaExpression
    : "\" oneOrMoreCommaSeparatedIdentifiers "->" expression
        { $$ = yy.createNode(yy.NodeType.LambdaExpression, @$, { params: $2, body: $4 }); }
    | "\" oneOrMoreCommaSeparatedIdentifiers "->" methodBody
        { $$ = yy.createNode(yy.NodeType.LambdaExpression, @$, { params: $2, body: $4 }); }
    ;

oneOrMoreCommaSeparatedIdentifiers
    : identifier
        { $$ = [$1]; }
    | oneOrMoreCommaSeparatedIdentifiers "," identifier
        { $$ = $1.concat([$3]); }
    ;

rangeCheckExpression
    : expression "in" expression "..." expression
        { $$ = yy.createNode(yy.NodeType.RangeCheckExpression, @$, { left: $1, lowerBound: $3, rangeType: yy.RangeCheckRangeType[$4], upperBound: $5 }); }
    | expression "in" expression "..=" expression
        { $$ = yy.createNode(yy.NodeType.RangeCheckExpression, @$, { left: $1, lowerBound: $3, rangeType: yy.RangeCheckRangeType[$4], upperBound: $5 }); }
    | expression "in" expression "=.." expression
        { $$ = yy.createNode(yy.NodeType.RangeCheckExpression, @$, { left: $1, lowerBound: $3, rangeType: yy.RangeCheckRangeType[$4], upperBound: $5 }); }
    | expression "in" expression "=.=" expression
        { $$ = yy.createNode(yy.NodeType.RangeCheckExpression, @$, { left: $1, lowerBound: $3, rangeType: yy.RangeCheckRangeType[$4], upperBound: $5 }); }
    ;

instanceofExpression
    : expression "instanceof" angleBracketlessType
        { $$ = yy.createNode(yy.NodeType.InstanceofExpression, @$, { value: $1, comparedType: $3 }); }
    ;

oneOrMoreSquareBracketPairs
    : "[" "]"
        { $$ = { pairCount: 1 }; }
    | oneOrMoreSquareBracketPairs "[" "]"
        { $$ = { pairCount: $1.pairCount + 1 }; }
    ;

notinstanceofExpression
    : expression "notinstanceof" angleBracketlessType
        { $$ = yy.createNode(yy.NodeType.NotinstanceofExpression, @$, { value: $1, comparedType: $3 }); }
    ;

postfixExpression
    : expression "!" %prec POSTFIX
        { $$ = yy.createNode(yy.NodeType.PostfixExpression, @$, { left: $1, operator: yy.PostfixOperatorType[$2] }); }
    | expression "?" %prec POSTFIX
        { $$ = yy.createNode(yy.NodeType.PostfixExpression, @$, { left: $1, operator: yy.PostfixOperatorType[$2] }); }
    ;

prefixExpression
    : "!" expression %prec PREFIX
        { $$ = yy.createNode(yy.NodeType.PrefixExpression, @$, { operator: yy.PrefixOperatorType[$1], right: $2 }); }
    | "-" expression %prec PREFIX
        { $$ = yy.createNode(yy.NodeType.PrefixExpression, @$, { operator: yy.PrefixOperatorType[$1], right: $2 }); }
    ;

infixExpression
    : expression "**" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }

    | expression "*" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression "/" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression "%" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }

    | expression "+" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression "-" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }

    | expression "<" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression "<=" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression ">" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression ">=" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression "~<" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression "~<=" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression "~>" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression "~>=" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }

    | expression "==" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression "!=" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression "~=" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression "!~=" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }

    | expression "&&" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    | expression "||" expression
        { $$ = yy.createNode(yy.NodeType.InfixExpression, @$, { left: $1, operator: yy.InfixOperatorType[$2], right: $3 }); }
    ;

blockExpression
    : "{" optUseStatements expression "}"
        { $$ = yy.createNode(yy.NodeType.BlockExpression, @$, { useStatements: $2, conclusion: $3 }); }
    ;

ifExpression
    : "if" expression blockExpression "else" blockExpression
        { $$ = yy.createNode(yy.NodeType.IfExpression, @$, { condition: $2, body: $3, elseIfClauses: [], elseBody: $5 }); }
    | "if" expression blockExpression oneOrMoreExpressionElseIfClauses "else" blockExpression
        { $$ = yy.createNode(yy.NodeType.IfExpression, @$, { condition: $2, body: $3, elseIfClauses: $4, elseBody: $6 }); }
    ;

switchExpression
    : "switch" expression "{" "else" blockExpression "}"
        { $$ = yy.createNode(yy.NodeType.SwitchExpression, @$, { comparedExpression: $2, caseClauses: [], elseBody: $5 }); }
    | "switch" expression "{" oneOrMoreExpressionCaseClauses "else" blockExpression "}"
        { $$ = yy.createNode(yy.NodeType.SwitchExpression, @$, { comparedExpression: $2, caseClauses: $4, elseBody: $6 }); }
    ;

ifInlineTypeGuardExpression
    : "if" "let" oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockExpression "else" blockExpression
        { $$ = yy.createNode(yy.NodeType.IfInlineTypeGuardExpression, @$, { variableDeclarations: $3, body: $5, elseIfClauses: [], elseBody: $7 }); }
    | "if" "let" oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockExpression oneOrMoreExpressionElseIfClauses "else" blockExpression
        { $$ = yy.createNode(yy.NodeType.IfInlineTypeGuardExpression, @$, { variableDeclarations: $3, body: $5, elseIfClauses: $6, elseBody: $8 }); }
    ;

parenthesizedExpression
    : "(" expression ")"
        { $$ = yy.createNode(yy.NodeType.ParenthesizedExpression, @$, { innerValue: $2 }); }
    ;