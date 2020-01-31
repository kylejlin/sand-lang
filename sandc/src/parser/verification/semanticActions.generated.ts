import { TysonTypeDict, yy } from "../../types/tysonTypeDict";

interface TokenLocation {
  first_line: number;
  last_line: number;
  first_column: number;
  last_column: number;
  range: [number, number];
}

const semanticActions = {
  "file -> beginningOfFile optPackageStatement optImportStatements optUseStatements pubClassOrInterfaceDeclaration optPrivClassOrInterfaceDeclarations EOF"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optPackageStatement"],
    $3: TysonTypeDict["optImportStatements"],
    $4: TysonTypeDict["optUseStatements"],
    $5: TysonTypeDict["pubClassOrInterfaceDeclaration"],
    $6: TysonTypeDict["optPrivClassOrInterfaceDeclarations"],
  ): TysonTypeDict["file"] {
    let $$: TysonTypeDict["file"];
    return yy.createNode(yy.NodeType.FileNode, yylstack["@$"], {
      packageStatement: $2,
      importStatements: $3,
      useStatements: $4,
      pubClassOrInterfaceDeclaration: $5,
      privClassOrInterfaceDeclarations: $6,
    });
  },

  "beginningOfFile -> "(): TysonTypeDict["beginningOfFile"] {
    let $$: TysonTypeDict["beginningOfFile"];
    yy.resetNodeIdCounter();
    $$ = undefined;
    return $$;
  },

  "optPackageStatement -> "(): TysonTypeDict["optPackageStatement"] {
    let $$: TysonTypeDict["optPackageStatement"];
    $$ = yy.option.none();
    return $$;
  },

  "optPackageStatement -> packageStatement"(
    $1: TysonTypeDict["packageStatement"],
  ): TysonTypeDict["optPackageStatement"] {
    let $$: TysonTypeDict["optPackageStatement"];
    $$ = yy.option.some($1);
    return $$;
  },

  "packageStatement -> package oneOrMoreDotSeparatedIdentifiers ;"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["packageStatement"] {
    let $$: TysonTypeDict["packageStatement"];
    $$ = yy.createNode(yy.NodeType.PackageStatement, yylstack["@$"], {
      identifiers: $2,
    });
    return $$;
  },

  "oneOrMoreDotSeparatedIdentifiers -> identifier"(
    $1: TysonTypeDict["identifier"],
  ): TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"] {
    let $$: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreDotSeparatedIdentifiers -> oneOrMoreDotSeparatedIdentifiers . identifier"(
    $1: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
    $3: TysonTypeDict["identifier"],
  ): TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"] {
    let $$: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "identifier -> UNRESERVED_IDENTIFIER"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["UNRESERVED_IDENTIFIER"],
  ): TysonTypeDict["identifier"] {
    let $$: TysonTypeDict["identifier"];
    $$ = yy.createNode(yy.NodeType.Identifier, yylstack["@$"], { source: $1 });
    return $$;
  },

  "identifier -> ESCAPED_IDENTIFIER"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["ESCAPED_IDENTIFIER"],
  ): TysonTypeDict["identifier"] {
    let $$: TysonTypeDict["identifier"];
    $$ = yy.createNode(yy.NodeType.Identifier, yylstack["@$"], { source: $1 });
    return $$;
  },

  "identifier -> get"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["get"],
  ): TysonTypeDict["identifier"] {
    let $$: TysonTypeDict["identifier"];
    $$ = yy.createNode(yy.NodeType.Identifier, yylstack["@$"], { source: $1 });
    return $$;
  },

  "identifier -> set"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["set"],
  ): TysonTypeDict["identifier"] {
    let $$: TysonTypeDict["identifier"];
    $$ = yy.createNode(yy.NodeType.Identifier, yylstack["@$"], { source: $1 });
    return $$;
  },

  "identifier -> intenc"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["intenc"],
  ): TysonTypeDict["identifier"] {
    let $$: TysonTypeDict["identifier"];
    $$ = yy.createNode(yy.NodeType.Identifier, yylstack["@$"], { source: $1 });
    return $$;
  },

  "identifier -> priv"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["priv"],
  ): TysonTypeDict["identifier"] {
    let $$: TysonTypeDict["identifier"];
    $$ = yy.createNode(yy.NodeType.Identifier, yylstack["@$"], { source: $1 });
    return $$;
  },

  "optImportStatements -> "(): TysonTypeDict["optImportStatements"] {
    let $$: TysonTypeDict["optImportStatements"];
    $$ = [];
    return $$;
  },

  "optImportStatements -> optImportStatements importStatement"(
    $1: TysonTypeDict["optImportStatements"],
    $2: TysonTypeDict["importStatement"],
  ): TysonTypeDict["optImportStatements"] {
    let $$: TysonTypeDict["optImportStatements"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "importStatement -> import oneOrMoreDotSeparatedIdentifiers ;"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["importStatement"] {
    let $$: TysonTypeDict["importStatement"];
    $$ = yy.createNode(yy.NodeType.SingleItemImportStatement, yylstack["@$"], {
      doesShadow: false,
      isStatic: false,
      identifiers: $2,
    });
    return $$;
  },

  "importStatement -> import shadow oneOrMoreDotSeparatedIdentifiers ;"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["importStatement"] {
    let $$: TysonTypeDict["importStatement"];
    $$ = yy.createNode(yy.NodeType.SingleItemImportStatement, yylstack["@$"], {
      doesShadow: true,
      isStatic: false,
      identifiers: $3,
    });
    return $$;
  },

  "importStatement -> import oneOrMoreDotSeparatedIdentifiers . * ;"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["importStatement"] {
    let $$: TysonTypeDict["importStatement"];
    $$ = yy.createNode(yy.NodeType.ImportAllStatement, yylstack["@$"], {
      isStatic: false,
      identifiers: $2,
    });
    return $$;
  },

  "importStatement -> import static oneOrMoreDotSeparatedIdentifiers ;"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["importStatement"] {
    let $$: TysonTypeDict["importStatement"];
    $$ = yy.createNode(yy.NodeType.SingleItemImportStatement, yylstack["@$"], {
      doesShadow: false,
      isStatic: true,
      identifiers: $3,
    });
    return $$;
  },

  "importStatement -> import static shadow oneOrMoreDotSeparatedIdentifiers ;"(
    yylstack: { "@$": TokenLocation },

    $4: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["importStatement"] {
    let $$: TysonTypeDict["importStatement"];
    $$ = yy.createNode(yy.NodeType.SingleItemImportStatement, yylstack["@$"], {
      doesShadow: true,
      isStatic: true,
      identifiers: $4,
    });
    return $$;
  },

  "importStatement -> import static oneOrMoreDotSeparatedIdentifiers . * ;"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["importStatement"] {
    let $$: TysonTypeDict["importStatement"];
    $$ = yy.createNode(yy.NodeType.ImportAllStatement, yylstack["@$"], {
      isStatic: true,
      identifiers: $3,
    });
    return $$;
  },

  "optUseStatements -> "(): TysonTypeDict["optUseStatements"] {
    let $$: TysonTypeDict["optUseStatements"];
    $$ = [];
    return $$;
  },

  "optUseStatements -> oneOrMoreUseStatements"(
    $1: TysonTypeDict["oneOrMoreUseStatements"],
  ): TysonTypeDict["optUseStatements"] {
    let $$: TysonTypeDict["optUseStatements"];
    $$ = $1;
    return $$;
  },

  "oneOrMoreUseStatements -> useStatement"(
    $1: TysonTypeDict["useStatement"],
  ): TysonTypeDict["oneOrMoreUseStatements"] {
    let $$: TysonTypeDict["oneOrMoreUseStatements"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreUseStatements -> oneOrMoreUseStatements useStatement"(
    $1: TysonTypeDict["oneOrMoreUseStatements"],
    $2: TysonTypeDict["useStatement"],
  ): TysonTypeDict["oneOrMoreUseStatements"] {
    let $$: TysonTypeDict["oneOrMoreUseStatements"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "useStatement -> useStatementWithExplicitAlias"(
    $1: TysonTypeDict["useStatementWithExplicitAlias"],
  ): TysonTypeDict["useStatement"] {
    let $$: TysonTypeDict["useStatement"];
    $$ = $1;
    return $$;
  },

  "useStatement -> useStatementWithImplicitAlias"(
    $1: TysonTypeDict["useStatementWithImplicitAlias"],
  ): TysonTypeDict["useStatement"] {
    let $$: TysonTypeDict["useStatement"];
    $$ = $1;
    return $$;
  },

  "useStatement -> useAllStatement"(
    $1: TysonTypeDict["useAllStatement"],
  ): TysonTypeDict["useStatement"] {
    let $$: TysonTypeDict["useStatement"];
    $$ = $1;
    return $$;
  },

  "useStatementWithExplicitAlias -> use oneOrMoreDotSeparatedIdentifiers as identifier ;"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
    $4: TysonTypeDict["identifier"],
  ): TysonTypeDict["useStatementWithExplicitAlias"] {
    let $$: TysonTypeDict["useStatementWithExplicitAlias"];
    $$ = yy.createNode(yy.NodeType.UseSingleItemStatement, yylstack["@$"], {
      doesShadow: false,
      referentIdentifiers: $2,
      alias: yy.option.some($4),
    });
    return $$;
  },

  "useStatementWithExplicitAlias -> use shadow oneOrMoreDotSeparatedIdentifiers as identifier ;"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
    $5: TysonTypeDict["identifier"],
  ): TysonTypeDict["useStatementWithExplicitAlias"] {
    let $$: TysonTypeDict["useStatementWithExplicitAlias"];
    $$ = yy.createNode(yy.NodeType.UseSingleItemStatement, yylstack["@$"], {
      doesShadow: true,
      referentIdentifiers: $3,
      alias: yy.option.some($5),
    });
    return $$;
  },

  "useStatementWithImplicitAlias -> use oneOrMoreDotSeparatedIdentifiers ;"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["useStatementWithImplicitAlias"] {
    let $$: TysonTypeDict["useStatementWithImplicitAlias"];
    $$ = yy.createNode(yy.NodeType.UseSingleItemStatement, yylstack["@$"], {
      doesShadow: false,
      referentIdentifiers: $2,
      alias: yy.option.none(),
    });
    return $$;
  },

  "useStatementWithImplicitAlias -> use shadow oneOrMoreDotSeparatedIdentifiers ;"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["useStatementWithImplicitAlias"] {
    let $$: TysonTypeDict["useStatementWithImplicitAlias"];
    $$ = yy.createNode(yy.NodeType.UseSingleItemStatement, yylstack["@$"], {
      doesShadow: true,
      referentIdentifiers: $3,
      alias: yy.option.none(),
    });
    return $$;
  },

  "useAllStatement -> use oneOrMoreDotSeparatedIdentifiers . * ;"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["useAllStatement"] {
    let $$: TysonTypeDict["useAllStatement"];
    $$ = yy.createNode(yy.NodeType.UseAllStatement, yylstack["@$"], {
      identifiers: $2,
    });
    return $$;
  },

  "pubClassOrInterfaceDeclaration -> pubClassDeclaration"(
    $1: TysonTypeDict["pubClassDeclaration"],
  ): TysonTypeDict["pubClassOrInterfaceDeclaration"] {
    let $$: TysonTypeDict["pubClassOrInterfaceDeclaration"];
    $$ = $1;
    return $$;
  },

  "pubClassOrInterfaceDeclaration -> pubInterfaceDeclaration"(
    $1: TysonTypeDict["pubInterfaceDeclaration"],
  ): TysonTypeDict["pubClassOrInterfaceDeclaration"] {
    let $$: TysonTypeDict["pubClassOrInterfaceDeclaration"];
    $$ = $1;
    return $$;
  },

  "pubClassDeclaration -> pub classDeclaration"(
    $2: TysonTypeDict["classDeclaration"],
  ): TysonTypeDict["pubClassDeclaration"] {
    let $$: TysonTypeDict["pubClassDeclaration"];
    $$ = yy.merge($2, { isPub: true });
    return $$;
  },

  "classDeclaration -> extensibleClassDeclaration"(
    $1: TysonTypeDict["extensibleClassDeclaration"],
  ): TysonTypeDict["classDeclaration"] {
    let $$: TysonTypeDict["classDeclaration"];
    $$ = $1;
    return $$;
  },

  "classDeclaration -> finalClassDeclaration"(
    $1: TysonTypeDict["finalClassDeclaration"],
  ): TysonTypeDict["classDeclaration"] {
    let $$: TysonTypeDict["classDeclaration"];
    $$ = $1;
    return $$;
  },

  "extensibleClassDeclaration -> extensibilityModifier finalClassDeclaration"(
    $1: TysonTypeDict["extensibilityModifier"],
    $2: TysonTypeDict["finalClassDeclaration"],
  ): TysonTypeDict["extensibleClassDeclaration"] {
    let $$: TysonTypeDict["extensibleClassDeclaration"];
    $$ = yy.merge($2, { extensibility: $1 });
    return $$;
  },

  "extensibilityModifier -> open"(): TysonTypeDict["extensibilityModifier"] {
    let $$: TysonTypeDict["extensibilityModifier"];
    $$ = yy.ExtensibilityLevel.Open;
    return $$;
  },

  "extensibilityModifier -> abstract"(): TysonTypeDict["extensibilityModifier"] {
    let $$: TysonTypeDict["extensibilityModifier"];
    $$ = yy.ExtensibilityLevel.Abstract;
    return $$;
  },

  "finalClassDeclaration -> class optShadowKeyword identifier optBracketedFormalTypeParams optClassExtensionClause optImplementsClause curlyBraceEnclosedClassBody"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optShadowKeyword"],
    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["optBracketedFormalTypeParams"],
    $5: TysonTypeDict["optClassExtensionClause"],
    $6: TysonTypeDict["optImplementsClause"],
    $7: TysonTypeDict["curlyBraceEnclosedClassBody"],
  ): TysonTypeDict["finalClassDeclaration"] {
    let $$: TysonTypeDict["finalClassDeclaration"];
    $$ = yy.createNode(yy.NodeType.ClassDeclaration, yylstack["@$"], {
      isPub: false,
      extensibility: yy.ExtensibilityLevel.Final,
      doesShadow: $2.isSome(),
      name: $3,
      typeParams: $4,
      superClass: $5,
      implementedInterfaces: $6,
      methodCopyStatements: $7.methodCopyStatements,
      useStatements: $7.useStatements,
      items: $7.items,
    });
    return $$;
  },

  "optShadowKeyword -> "(): TysonTypeDict["optShadowKeyword"] {
    let $$: TysonTypeDict["optShadowKeyword"];
    $$ = yy.option.none();
    return $$;
  },

  "optShadowKeyword -> shadow"(
    $1: TysonTypeDict["shadow"],
  ): TysonTypeDict["optShadowKeyword"] {
    let $$: TysonTypeDict["optShadowKeyword"];
    $$ = yy.option.some($1);
    return $$;
  },

  "optBracketedFormalTypeParams -> "(): TysonTypeDict["optBracketedFormalTypeParams"] {
    let $$: TysonTypeDict["optBracketedFormalTypeParams"];
    $$ = [];
    return $$;
  },

  "optBracketedFormalTypeParams -> < oneOrMoreFormalTypeParams >"(
    $2: TysonTypeDict["oneOrMoreFormalTypeParams"],
  ): TysonTypeDict["optBracketedFormalTypeParams"] {
    let $$: TysonTypeDict["optBracketedFormalTypeParams"];
    $$ = $2;
    return $$;
  },

  "oneOrMoreFormalTypeParams -> formalTypeParam"(
    $1: TysonTypeDict["formalTypeParam"],
  ): TysonTypeDict["oneOrMoreFormalTypeParams"] {
    let $$: TysonTypeDict["oneOrMoreFormalTypeParams"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreFormalTypeParams -> oneOrMoreFormalTypeParams , formalTypeParam"(
    $1: TysonTypeDict["oneOrMoreFormalTypeParams"],
    $3: TysonTypeDict["formalTypeParam"],
  ): TysonTypeDict["oneOrMoreFormalTypeParams"] {
    let $$: TysonTypeDict["oneOrMoreFormalTypeParams"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "formalTypeParam -> optShadowKeyword identifier optTypeConstraint"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["identifier"],
    $3: TysonTypeDict["optTypeConstraint"],
  ): TysonTypeDict["formalTypeParam"] {
    let $$: TysonTypeDict["formalTypeParam"];
    $$ = yy.createNode(yy.NodeType.FormalTypeParamDeclaration, yylstack["@$"], {
      name: $2,
      constraint: $3,
    });
    return $$;
  },

  "optTypeConstraint -> "(): TysonTypeDict["optTypeConstraint"] {
    let $$: TysonTypeDict["optTypeConstraint"];
    $$ = yy.option.none();
    return $$;
  },

  "optTypeConstraint -> typeConstraint"(
    $1: TysonTypeDict["typeConstraint"],
  ): TysonTypeDict["optTypeConstraint"] {
    let $$: TysonTypeDict["optTypeConstraint"];
    $$ = yy.option.some($1);
    return $$;
  },

  "typeConstraint -> extendsConstraint"(
    $1: TysonTypeDict["extendsConstraint"],
  ): TysonTypeDict["typeConstraint"] {
    let $$: TysonTypeDict["typeConstraint"];
    $$ = $1;
    return $$;
  },

  "typeConstraint -> superConstraint"(
    $1: TysonTypeDict["superConstraint"],
  ): TysonTypeDict["typeConstraint"] {
    let $$: TysonTypeDict["typeConstraint"];
    $$ = $1;
    return $$;
  },

  "extendsConstraint -> extends oneOrMoreAmpersandSeparatedTypes"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["oneOrMoreAmpersandSeparatedTypes"],
  ): TysonTypeDict["extendsConstraint"] {
    let $$: TysonTypeDict["extendsConstraint"];
    $$ = yy.createNode(yy.NodeType.TypeParamExtendsConstraint, yylstack["@$"], {
      superTypes: $2,
    });
    return $$;
  },

  "oneOrMoreAmpersandSeparatedTypes -> type"(
    $1: TysonTypeDict["type"],
  ): TysonTypeDict["oneOrMoreAmpersandSeparatedTypes"] {
    let $$: TysonTypeDict["oneOrMoreAmpersandSeparatedTypes"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreAmpersandSeparatedTypes -> oneOrMoreAmpersandSeparatedTypes & type"(
    $1: TysonTypeDict["oneOrMoreAmpersandSeparatedTypes"],
    $3: TysonTypeDict["type"],
  ): TysonTypeDict["oneOrMoreAmpersandSeparatedTypes"] {
    let $$: TysonTypeDict["oneOrMoreAmpersandSeparatedTypes"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "type -> oneOrMoreDotSeparatedIdentifiers optBracketedActualTypeParams"(
    yylstack: { "@$": TokenLocation; "@1": TokenLocation },

    $1: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
    $2: TysonTypeDict["optBracketedActualTypeParams"],
  ): TysonTypeDict["type"] {
    let $$: TysonTypeDict["type"];
    var niladic = yy.createNode(yy.NodeType.NiladicType, yylstack["@1"], {
      identifiers: $1,
    });
    if ($2.length === 0) {
      $$ = niladic;
    } else {
      $$ = yy.createNode(yy.NodeType.InstantiatedGenericType, yylstack["@$"], {
        baseType: niladic,
        actualParams: $2,
      });
    }

    return $$;
  },

  "type -> primitiveTypeLiteral"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["primitiveTypeLiteral"],
  ): TysonTypeDict["type"] {
    let $$: TysonTypeDict["type"];
    var identifier = yy.createNode(yy.NodeType.Identifier, yylstack["@$"], {
      source: $1,
    });
    $$ = yy.createNode(yy.NodeType.NiladicType, yylstack["@$"], {
      identifiers: [identifier],
    });

    return $$;
  },

  "type -> type ?"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["type"],
  ): TysonTypeDict["type"] {
    let $$: TysonTypeDict["type"];
    $$ = yy.createNode(yy.NodeType.NullableType, yylstack["@$"], {
      baseType: $1,
    });
    return $$;
  },

  "type -> type [ ]"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["type"],
  ): TysonTypeDict["type"] {
    let $$: TysonTypeDict["type"];
    $$ = yy.createNode(yy.NodeType.ArrayType, yylstack["@$"], { baseType: $1 });
    return $$;
  },

  "type -> type [ + ]"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["type"],
  ): TysonTypeDict["type"] {
    let $$: TysonTypeDict["type"];
    $$ = yy.createNode(yy.NodeType.ListType, yylstack["@$"], { baseType: $1 });
    return $$;
  },

  "optBracketedActualTypeParams -> "(): TysonTypeDict["optBracketedActualTypeParams"] {
    let $$: TysonTypeDict["optBracketedActualTypeParams"];
    $$ = [];
    return $$;
  },

  "optBracketedActualTypeParams -> < oneOrMoreCommaSeparatedTypes >"(
    $2: TysonTypeDict["oneOrMoreCommaSeparatedTypes"],
  ): TysonTypeDict["optBracketedActualTypeParams"] {
    let $$: TysonTypeDict["optBracketedActualTypeParams"];
    $$ = $2;
    return $$;
  },

  "oneOrMoreCommaSeparatedTypes -> type"(
    $1: TysonTypeDict["type"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedTypes"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedTypes"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreCommaSeparatedTypes -> oneOrMoreCommaSeparatedTypes , type"(
    $1: TysonTypeDict["oneOrMoreCommaSeparatedTypes"],
    $3: TysonTypeDict["type"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedTypes"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedTypes"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "primitiveTypeLiteral -> int"(
    $1: TysonTypeDict["int"],
  ): TysonTypeDict["primitiveTypeLiteral"] {
    let $$: TysonTypeDict["primitiveTypeLiteral"];
    $$ = $1;
    return $$;
  },

  "primitiveTypeLiteral -> short"(
    $1: TysonTypeDict["short"],
  ): TysonTypeDict["primitiveTypeLiteral"] {
    let $$: TysonTypeDict["primitiveTypeLiteral"];
    $$ = $1;
    return $$;
  },

  "primitiveTypeLiteral -> long"(
    $1: TysonTypeDict["long"],
  ): TysonTypeDict["primitiveTypeLiteral"] {
    let $$: TysonTypeDict["primitiveTypeLiteral"];
    $$ = $1;
    return $$;
  },

  "primitiveTypeLiteral -> byte"(
    $1: TysonTypeDict["byte"],
  ): TysonTypeDict["primitiveTypeLiteral"] {
    let $$: TysonTypeDict["primitiveTypeLiteral"];
    $$ = $1;
    return $$;
  },

  "primitiveTypeLiteral -> char"(
    $1: TysonTypeDict["char"],
  ): TysonTypeDict["primitiveTypeLiteral"] {
    let $$: TysonTypeDict["primitiveTypeLiteral"];
    $$ = $1;
    return $$;
  },

  "primitiveTypeLiteral -> float"(
    $1: TysonTypeDict["float"],
  ): TysonTypeDict["primitiveTypeLiteral"] {
    let $$: TysonTypeDict["primitiveTypeLiteral"];
    $$ = $1;
    return $$;
  },

  "primitiveTypeLiteral -> double"(
    $1: TysonTypeDict["double"],
  ): TysonTypeDict["primitiveTypeLiteral"] {
    let $$: TysonTypeDict["primitiveTypeLiteral"];
    $$ = $1;
    return $$;
  },

  "primitiveTypeLiteral -> boolean"(
    $1: TysonTypeDict["boolean"],
  ): TysonTypeDict["primitiveTypeLiteral"] {
    let $$: TysonTypeDict["primitiveTypeLiteral"];
    $$ = $1;
    return $$;
  },

  "primitiveTypeLiteral -> void"(
    $1: TysonTypeDict["void"],
  ): TysonTypeDict["primitiveTypeLiteral"] {
    let $$: TysonTypeDict["primitiveTypeLiteral"];
    $$ = $1;
    return $$;
  },

  "primitiveTypeLiteral -> never"(
    $1: TysonTypeDict["never"],
  ): TysonTypeDict["primitiveTypeLiteral"] {
    let $$: TysonTypeDict["primitiveTypeLiteral"];
    $$ = $1;
    return $$;
  },

  "superConstraint -> super type"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["type"],
  ): TysonTypeDict["superConstraint"] {
    let $$: TysonTypeDict["superConstraint"];
    $$ = yy.createNode(yy.NodeType.TypeParamSuperConstraint, yylstack["@$"], {
      subType: $2,
    });
    return $$;
  },

  "optClassExtensionClause -> "(): TysonTypeDict["optClassExtensionClause"] {
    let $$: TysonTypeDict["optClassExtensionClause"];
    $$ = yy.option.none();
    return $$;
  },

  "optClassExtensionClause -> classExtensionClause"(
    $1: TysonTypeDict["classExtensionClause"],
  ): TysonTypeDict["optClassExtensionClause"] {
    let $$: TysonTypeDict["optClassExtensionClause"];
    $$ = yy.option.some($1);
    return $$;
  },

  "classExtensionClause -> extends type"(
    $2: TysonTypeDict["type"],
  ): TysonTypeDict["classExtensionClause"] {
    let $$: TysonTypeDict["classExtensionClause"];
    $$ = $2;
    return $$;
  },

  "optImplementsClause -> "(): TysonTypeDict["optImplementsClause"] {
    let $$: TysonTypeDict["optImplementsClause"];
    $$ = [];
    return $$;
  },

  "optImplementsClause -> implementsClause"(
    $1: TysonTypeDict["implementsClause"],
  ): TysonTypeDict["optImplementsClause"] {
    let $$: TysonTypeDict["optImplementsClause"];
    $$ = $1;
    return $$;
  },

  "implementsClause -> implements oneOrMoreCommaSeparatedTypes"(
    $2: TysonTypeDict["oneOrMoreCommaSeparatedTypes"],
  ): TysonTypeDict["implementsClause"] {
    let $$: TysonTypeDict["implementsClause"];
    $$ = $2;
    return $$;
  },

  "curlyBraceEnclosedClassBody -> { }"(): TysonTypeDict["curlyBraceEnclosedClassBody"] {
    let $$: TysonTypeDict["curlyBraceEnclosedClassBody"];
    $$ = { methodCopyStatements: [], useStatements: [], items: [] };
    return $$;
  },

  "curlyBraceEnclosedClassBody -> { oneOrMoreMethodCopyStatements }"(
    $2: TysonTypeDict["oneOrMoreMethodCopyStatements"],
  ): TysonTypeDict["curlyBraceEnclosedClassBody"] {
    let $$: TysonTypeDict["curlyBraceEnclosedClassBody"];
    $$ = { methodCopyStatements: $2, useStatements: [], items: [] };
    return $$;
  },

  "curlyBraceEnclosedClassBody -> { oneOrMoreUseStatements }"(
    $2: TysonTypeDict["oneOrMoreUseStatements"],
  ): TysonTypeDict["curlyBraceEnclosedClassBody"] {
    let $$: TysonTypeDict["curlyBraceEnclosedClassBody"];
    $$ = { methodCopyStatements: [], useStatements: $2, items: [] };
    return $$;
  },

  "curlyBraceEnclosedClassBody -> { oneOrMoreMethodCopyStatements oneOrMoreUseStatements }"(
    $2: TysonTypeDict["oneOrMoreMethodCopyStatements"],
    $3: TysonTypeDict["oneOrMoreUseStatements"],
  ): TysonTypeDict["curlyBraceEnclosedClassBody"] {
    let $$: TysonTypeDict["curlyBraceEnclosedClassBody"];
    $$ = { methodCopyStatements: $2, useStatements: $3, items: [] };
    return $$;
  },

  "curlyBraceEnclosedClassBody -> { oneOrMoreClassItems }"(
    $2: TysonTypeDict["oneOrMoreClassItems"],
  ): TysonTypeDict["curlyBraceEnclosedClassBody"] {
    let $$: TysonTypeDict["curlyBraceEnclosedClassBody"];
    $$ = { methodCopyStatements: [], useStatements: [], items: $2 };
    return $$;
  },

  "curlyBraceEnclosedClassBody -> { oneOrMoreMethodCopyStatements oneOrMoreClassItems }"(
    $2: TysonTypeDict["oneOrMoreMethodCopyStatements"],
    $3: TysonTypeDict["oneOrMoreClassItems"],
  ): TysonTypeDict["curlyBraceEnclosedClassBody"] {
    let $$: TysonTypeDict["curlyBraceEnclosedClassBody"];
    $$ = { methodCopyStatements: $2, useStatements: [], items: $3 };
    return $$;
  },

  "curlyBraceEnclosedClassBody -> { oneOrMoreUseStatements oneOrMoreClassItems }"(
    $2: TysonTypeDict["oneOrMoreUseStatements"],
    $3: TysonTypeDict["oneOrMoreClassItems"],
  ): TysonTypeDict["curlyBraceEnclosedClassBody"] {
    let $$: TysonTypeDict["curlyBraceEnclosedClassBody"];
    $$ = { methodCopyStatements: [], useStatements: $2, items: $3 };
    return $$;
  },

  "curlyBraceEnclosedClassBody -> { oneOrMoreMethodCopyStatements oneOrMoreUseStatements oneOrMoreClassItems }"(
    $2: TysonTypeDict["oneOrMoreMethodCopyStatements"],
    $3: TysonTypeDict["oneOrMoreUseStatements"],
    $4: TysonTypeDict["oneOrMoreClassItems"],
  ): TysonTypeDict["curlyBraceEnclosedClassBody"] {
    let $$: TysonTypeDict["curlyBraceEnclosedClassBody"];
    $$ = { methodCopyStatements: $2, useStatements: $3, items: $4 };
    return $$;
  },

  "oneOrMoreMethodCopyStatements -> methodCopyStatement"(
    $1: TysonTypeDict["methodCopyStatement"],
  ): TysonTypeDict["oneOrMoreMethodCopyStatements"] {
    let $$: TysonTypeDict["oneOrMoreMethodCopyStatements"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreMethodCopyStatements -> oneOrMoreMethodCopyStatements methodCopyStatement"(
    $1: TysonTypeDict["oneOrMoreMethodCopyStatements"],
    $2: TysonTypeDict["methodCopyStatement"],
  ): TysonTypeDict["oneOrMoreMethodCopyStatements"] {
    let $$: TysonTypeDict["oneOrMoreMethodCopyStatements"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "methodCopyStatement -> copy optShadowKeyword oneOrMoreDotSeparatedIdentifiers ;"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optShadowKeyword"],
    $3: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["methodCopyStatement"] {
    let $$: TysonTypeDict["methodCopyStatement"];
    $$ = yy.createNode(yy.NodeType.MethodCopyStatement, yylstack["@$"], {
      visibility: yy.VisibilityLevel.Private,
      doesShadow: $2.isSome(),
      identifiers: $3,
    });
    return $$;
  },

  "methodCopyStatement -> pub copy optShadowKeyword oneOrMoreDotSeparatedIdentifiers ;"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["optShadowKeyword"],
    $4: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["methodCopyStatement"] {
    let $$: TysonTypeDict["methodCopyStatement"];
    $$ = yy.createNode(yy.NodeType.MethodCopyStatement, yylstack["@$"], {
      visibility: yy.VisibilityLevel.Public,
      doesShadow: $3.isSome(),
      identifiers: $4,
    });
    return $$;
  },

  "methodCopyStatement -> prot copy optShadowKeyword oneOrMoreDotSeparatedIdentifiers ;"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["optShadowKeyword"],
    $4: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["methodCopyStatement"] {
    let $$: TysonTypeDict["methodCopyStatement"];
    $$ = yy.createNode(yy.NodeType.MethodCopyStatement, yylstack["@$"], {
      visibility: yy.VisibilityLevel.Protected,
      doesShadow: $3.isSome(),
      identifiers: $4,
    });
    return $$;
  },

  "oneOrMoreClassItems -> classItem"(
    $1: TysonTypeDict["classItem"],
  ): TysonTypeDict["oneOrMoreClassItems"] {
    let $$: TysonTypeDict["oneOrMoreClassItems"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreClassItems -> oneOrMoreClassItems classItem"(
    $1: TysonTypeDict["oneOrMoreClassItems"],
    $2: TysonTypeDict["classItem"],
  ): TysonTypeDict["oneOrMoreClassItems"] {
    let $$: TysonTypeDict["oneOrMoreClassItems"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "classItem -> classConstructorDeclaration"(
    $1: TysonTypeDict["classConstructorDeclaration"],
  ): TysonTypeDict["classItem"] {
    let $$: TysonTypeDict["classItem"];
    $$ = $1;
    return $$;
  },

  "classItem -> classDefaultConstructorDeclaration"(
    $1: TysonTypeDict["classDefaultConstructorDeclaration"],
  ): TysonTypeDict["classItem"] {
    let $$: TysonTypeDict["classItem"];
    $$ = $1;
    return $$;
  },

  "classItem -> classStaticPropertyDeclaration"(
    $1: TysonTypeDict["classStaticPropertyDeclaration"],
  ): TysonTypeDict["classItem"] {
    let $$: TysonTypeDict["classItem"];
    $$ = $1;
    return $$;
  },

  "classItem -> classStaticMethodDeclaration"(
    $1: TysonTypeDict["classStaticMethodDeclaration"],
  ): TysonTypeDict["classItem"] {
    let $$: TysonTypeDict["classItem"];
    $$ = $1;
    return $$;
  },

  "classItem -> classInstancePropertyDeclaration"(
    $1: TysonTypeDict["classInstancePropertyDeclaration"],
  ): TysonTypeDict["classItem"] {
    let $$: TysonTypeDict["classItem"];
    $$ = $1;
    return $$;
  },

  "classItem -> classInstanceMethodDeclaration"(
    $1: TysonTypeDict["classInstanceMethodDeclaration"],
  ): TysonTypeDict["classItem"] {
    let $$: TysonTypeDict["classItem"];
    $$ = $1;
    return $$;
  },

  "classItem -> classInnerClassDeclaration"(
    $1: TysonTypeDict["classInnerClassDeclaration"],
  ): TysonTypeDict["classItem"] {
    let $$: TysonTypeDict["classItem"];
    $$ = $1;
    return $$;
  },

  "classItem -> classInnerInterfaceDeclaration"(
    $1: TysonTypeDict["classInnerInterfaceDeclaration"],
  ): TysonTypeDict["classItem"] {
    let $$: TysonTypeDict["classItem"];
    $$ = $1;
    return $$;
  },

  "classConstructorDeclaration -> optVisibilityModifier new parenthesizedFormalMethodParamDeclarations optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $3: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $4: TysonTypeDict["optThrowsClause"],
    $5: TysonTypeDict["methodBody"],
  ): TysonTypeDict["classConstructorDeclaration"] {
    let $$: TysonTypeDict["classConstructorDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassConstructorDeclaration,
      yylstack["@$"],
      {
        visibility: $1.unwrapOr(yy.VisibilityLevel.Private),
        typeParams: [],
        params: $3,
        thrownExceptions: $4,
        body: $5,
      },
    );
    return $$;
  },

  "classConstructorDeclaration -> optVisibilityModifier new angleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $3: TysonTypeDict["angleBracketEnclosedGenericMethodFormalTypeParams"],
    $4: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $5: TysonTypeDict["optThrowsClause"],
    $6: TysonTypeDict["methodBody"],
  ): TysonTypeDict["classConstructorDeclaration"] {
    let $$: TysonTypeDict["classConstructorDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassConstructorDeclaration,
      yylstack["@$"],
      {
        visibility: $1.unwrapOr(yy.VisibilityLevel.Private),
        typeParams: $3,
        params: $4,
        thrownExceptions: $5,
        body: $6,
      },
    );
    return $$;
  },

  "optVisibilityModifier -> "(): TysonTypeDict["optVisibilityModifier"] {
    let $$: TysonTypeDict["optVisibilityModifier"];
    $$ = yy.option.none();
    return $$;
  },

  "optVisibilityModifier -> visibilityModifier"(
    $1: TysonTypeDict["visibilityModifier"],
  ): TysonTypeDict["optVisibilityModifier"] {
    let $$: TysonTypeDict["optVisibilityModifier"];
    $$ = yy.option.some($1);
    return $$;
  },

  "visibilityModifier -> pub"(): TysonTypeDict["visibilityModifier"] {
    let $$: TysonTypeDict["visibilityModifier"];
    $$ = yy.VisibilityLevel.Public;
    return $$;
  },

  "visibilityModifier -> prot"(): TysonTypeDict["visibilityModifier"] {
    let $$: TysonTypeDict["visibilityModifier"];
    $$ = yy.VisibilityLevel.Protected;
    return $$;
  },

  "classDefaultConstructorDeclaration -> optVisibilityModifier default new ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
  ): TysonTypeDict["classDefaultConstructorDeclaration"] {
    let $$: TysonTypeDict["classDefaultConstructorDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassDefaultConstructorDeclaration,
      yylstack["@$"],
      { visibility: $1.unwrapOr(yy.VisibilityLevel.Private) },
    );
    return $$;
  },

  "parenthesizedFormalMethodParamDeclarations -> ( )"(): TysonTypeDict["parenthesizedFormalMethodParamDeclarations"] {
    let $$: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"];
    $$ = [];
    return $$;
  },

  "parenthesizedFormalMethodParamDeclarations -> ( oneOrMoreFormalMethodParamDeclarations optTrailingComma )"(
    $2: TysonTypeDict["oneOrMoreFormalMethodParamDeclarations"],
  ): TysonTypeDict["parenthesizedFormalMethodParamDeclarations"] {
    let $$: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"];
    $$ = $2;
    return $$;
  },

  "optTrailingComma -> "(): TysonTypeDict["optTrailingComma"] {
    let $$: TysonTypeDict["optTrailingComma"];
    $$ = undefined;
    return $$;
  },

  "optTrailingComma -> ,"(
    $1: TysonTypeDict[","],
  ): TysonTypeDict["optTrailingComma"] {
    let $$: TysonTypeDict["optTrailingComma"];
    $$ = $1;
    return $$;
  },

  "oneOrMoreFormalMethodParamDeclarations -> formalMethodParamDeclaration"(
    $1: TysonTypeDict["formalMethodParamDeclaration"],
  ): TysonTypeDict["oneOrMoreFormalMethodParamDeclarations"] {
    let $$: TysonTypeDict["oneOrMoreFormalMethodParamDeclarations"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreFormalMethodParamDeclarations -> oneOrMoreFormalMethodParamDeclarations , formalMethodParamDeclaration"(
    $1: TysonTypeDict["oneOrMoreFormalMethodParamDeclarations"],
    $3: TysonTypeDict["formalMethodParamDeclaration"],
  ): TysonTypeDict["oneOrMoreFormalMethodParamDeclarations"] {
    let $$: TysonTypeDict["oneOrMoreFormalMethodParamDeclarations"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "formalMethodParamDeclaration -> optShadowKeyword identifier : type"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optShadowKeyword"],
    $2: TysonTypeDict["identifier"],
    $4: TysonTypeDict["type"],
  ): TysonTypeDict["formalMethodParamDeclaration"] {
    let $$: TysonTypeDict["formalMethodParamDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.FormalMethodParamDeclaration,
      yylstack["@$"],
      {
        isReassignable: false,
        doesShadow: $1.isSome(),
        name: $2,
        annotatedType: $4,
      },
    );
    return $$;
  },

  "formalMethodParamDeclaration -> var optShadowKeyword identifier : type"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optShadowKeyword"],
    $3: TysonTypeDict["identifier"],
    $5: TysonTypeDict["type"],
  ): TysonTypeDict["formalMethodParamDeclaration"] {
    let $$: TysonTypeDict["formalMethodParamDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.FormalMethodParamDeclaration,
      yylstack["@$"],
      {
        isReassignable: true,
        doesShadow: $2.isSome(),
        name: $3,
        annotatedType: $5,
      },
    );
    return $$;
  },

  "methodBody -> { optUseStatements }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optUseStatements"],
  ): TysonTypeDict["methodBody"] {
    let $$: TysonTypeDict["methodBody"];
    $$ = yy.createNode(yy.NodeType.MethodBody, yylstack["@$"], {
      useStatements: $2,
      statements: [],
      conclusion: yy.option.none(),
    });
    return $$;
  },

  "methodBody -> { optUseStatements oneOrMoreStatements }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optUseStatements"],
    $3: TysonTypeDict["oneOrMoreStatements"],
  ): TysonTypeDict["methodBody"] {
    let $$: TysonTypeDict["methodBody"];
    $$ = yy.createNode(yy.NodeType.MethodBody, yylstack["@$"], {
      useStatements: $2,
      statements: $3,
      conclusion: yy.option.none(),
    });
    return $$;
  },

  "methodBody -> { optUseStatements oneOrMoreStatements expression }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optUseStatements"],
    $3: TysonTypeDict["oneOrMoreStatements"],
    $4: TysonTypeDict["expression"],
  ): TysonTypeDict["methodBody"] {
    let $$: TysonTypeDict["methodBody"];
    $$ = yy.createNode(yy.NodeType.MethodBody, yylstack["@$"], {
      useStatements: $2,
      statements: $3,
      conclusion: yy.option.some($4),
    });
    return $$;
  },

  "methodBody -> { optUseStatements oneOrMoreStatements returnablePseudex }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optUseStatements"],
    $3: TysonTypeDict["oneOrMoreStatements"],
    $4: TysonTypeDict["returnablePseudex"],
  ): TysonTypeDict["methodBody"] {
    let $$: TysonTypeDict["methodBody"];
    $$ = yy.createNode(yy.NodeType.MethodBody, yylstack["@$"], {
      useStatements: $2,
      statements: $3,
      conclusion: yy.option.some($4),
    });
    return $$;
  },

  "methodBody -> { optUseStatements expression }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optUseStatements"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["methodBody"] {
    let $$: TysonTypeDict["methodBody"];
    $$ = yy.createNode(yy.NodeType.MethodBody, yylstack["@$"], {
      useStatements: $2,
      statements: [],
      conclusion: yy.option.some($3),
    });
    return $$;
  },

  "methodBody -> { optUseStatements returnablePseudex }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optUseStatements"],
    $3: TysonTypeDict["returnablePseudex"],
  ): TysonTypeDict["methodBody"] {
    let $$: TysonTypeDict["methodBody"];
    $$ = yy.createNode(yy.NodeType.MethodBody, yylstack["@$"], {
      useStatements: $2,
      statements: [],
      conclusion: yy.option.some($3),
    });
    return $$;
  },

  "oneOrMoreStatements -> statement"(
    $1: TysonTypeDict["statement"],
  ): TysonTypeDict["oneOrMoreStatements"] {
    let $$: TysonTypeDict["oneOrMoreStatements"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreStatements -> oneOrMoreStatements statement"(
    $1: TysonTypeDict["oneOrMoreStatements"],
    $2: TysonTypeDict["statement"],
  ): TysonTypeDict["oneOrMoreStatements"] {
    let $$: TysonTypeDict["oneOrMoreStatements"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "classStaticPropertyDeclaration -> optVisibilityModifier static identifier optVariableTypeAnnotation = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["optVariableTypeAnnotation"],
    $6: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["classStaticPropertyDeclaration"] {
    let $$: TysonTypeDict["classStaticPropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticPropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel($1),
        accessors: yy.option.none(),
        isReassignable: false,
        doesShadow: false,

        name: $3,
        annotatedType: $4,
        initialValue: $6,
      },
    );

    return $$;
  },

  "classStaticPropertyDeclaration -> optVisibilityModifier static var identifier optVariableTypeAnnotation = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $4: TysonTypeDict["identifier"],
    $5: TysonTypeDict["optVariableTypeAnnotation"],
    $7: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["classStaticPropertyDeclaration"] {
    let $$: TysonTypeDict["classStaticPropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticPropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel($1),
        accessors: yy.option.none(),
        isReassignable: true,
        doesShadow: false,

        name: $4,
        annotatedType: $5,
        initialValue: $7,
      },
    );

    return $$;
  },

  "classStaticPropertyDeclaration -> optVisibilityModifier static shadow identifier optVariableTypeAnnotation = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $4: TysonTypeDict["identifier"],
    $5: TysonTypeDict["optVariableTypeAnnotation"],
    $7: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["classStaticPropertyDeclaration"] {
    let $$: TysonTypeDict["classStaticPropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticPropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel($1),
        accessors: yy.option.none(),
        isReassignable: false,
        doesShadow: true,

        name: $4,
        annotatedType: $5,
        initialValue: $7,
      },
    );

    return $$;
  },

  "classStaticPropertyDeclaration -> optVisibilityModifier static var shadow identifier optVariableTypeAnnotation = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $5: TysonTypeDict["identifier"],
    $6: TysonTypeDict["optVariableTypeAnnotation"],
    $8: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["classStaticPropertyDeclaration"] {
    let $$: TysonTypeDict["classStaticPropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticPropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel($1),
        accessors: yy.option.none(),
        isReassignable: true,
        doesShadow: true,

        name: $5,
        annotatedType: $6,
        initialValue: $8,
      },
    );

    return $$;
  },

  "classStaticPropertyDeclaration -> propertyAccessorDeclarations optVisibilityModifier static identifier optVariableTypeAnnotation = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $2: TysonTypeDict["optVisibilityModifier"],
    $4: TysonTypeDict["identifier"],
    $5: TysonTypeDict["optVariableTypeAnnotation"],
    $7: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["classStaticPropertyDeclaration"] {
    let $$: TysonTypeDict["classStaticPropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticPropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel($2),
        accessors: yy.option.some($1),
        isReassignable: false,
        doesShadow: false,

        name: $4,
        annotatedType: $5,
        initialValue: $7,
      },
    );

    return $$;
  },

  "classStaticPropertyDeclaration -> propertyAccessorDeclarations optVisibilityModifier static var identifier optVariableTypeAnnotation = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $2: TysonTypeDict["optVisibilityModifier"],
    $5: TysonTypeDict["identifier"],
    $6: TysonTypeDict["optVariableTypeAnnotation"],
    $8: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["classStaticPropertyDeclaration"] {
    let $$: TysonTypeDict["classStaticPropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticPropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel($2),
        accessors: yy.option.some($1),
        isReassignable: true,
        doesShadow: false,

        name: $5,
        annotatedType: $6,
        initialValue: $8,
      },
    );

    return $$;
  },

  "classStaticPropertyDeclaration -> propertyAccessorDeclarations optVisibilityModifier static shadow identifier optVariableTypeAnnotation = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $2: TysonTypeDict["optVisibilityModifier"],
    $5: TysonTypeDict["identifier"],
    $6: TysonTypeDict["optVariableTypeAnnotation"],
    $8: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["classStaticPropertyDeclaration"] {
    let $$: TysonTypeDict["classStaticPropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticPropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel($2),
        accessors: yy.option.some($1),
        isReassignable: false,
        doesShadow: true,

        name: $5,
        annotatedType: $6,
        initialValue: $8,
      },
    );

    return $$;
  },

  "classStaticPropertyDeclaration -> propertyAccessorDeclarations optVisibilityModifier static var shadow identifier optVariableTypeAnnotation = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $2: TysonTypeDict["optVisibilityModifier"],
    $6: TysonTypeDict["identifier"],
    $7: TysonTypeDict["optVariableTypeAnnotation"],
    $9: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["classStaticPropertyDeclaration"] {
    let $$: TysonTypeDict["classStaticPropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticPropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel($2),
        accessors: yy.option.some($1),
        isReassignable: true,
        doesShadow: true,

        name: $6,
        annotatedType: $7,
        initialValue: $9,
      },
    );

    return $$;
  },

  "classStaticPropertyDeclaration -> propertyAccessorDeclarations intenc static identifier optVariableTypeAnnotation = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $4: TysonTypeDict["identifier"],
    $5: TysonTypeDict["optVariableTypeAnnotation"],
    $7: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["classStaticPropertyDeclaration"] {
    let $$: TysonTypeDict["classStaticPropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticPropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
        accessors: yy.option.some($1),
        isReassignable: false,
        doesShadow: false,

        name: $4,
        annotatedType: $5,
        initialValue: $7,
      },
    );

    return $$;
  },

  "classStaticPropertyDeclaration -> propertyAccessorDeclarations intenc static var identifier optVariableTypeAnnotation = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $5: TysonTypeDict["identifier"],
    $6: TysonTypeDict["optVariableTypeAnnotation"],
    $8: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["classStaticPropertyDeclaration"] {
    let $$: TysonTypeDict["classStaticPropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticPropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
        accessors: yy.option.some($1),
        isReassignable: true,
        doesShadow: false,

        name: $5,
        annotatedType: $6,
        initialValue: $8,
      },
    );

    return $$;
  },

  "classStaticPropertyDeclaration -> propertyAccessorDeclarations intenc static shadow identifier optVariableTypeAnnotation = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $5: TysonTypeDict["identifier"],
    $6: TysonTypeDict["optVariableTypeAnnotation"],
    $8: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["classStaticPropertyDeclaration"] {
    let $$: TysonTypeDict["classStaticPropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticPropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
        accessors: yy.option.some($1),
        isReassignable: false,
        doesShadow: true,

        name: $5,
        annotatedType: $6,
        initialValue: $8,
      },
    );

    return $$;
  },

  "classStaticPropertyDeclaration -> propertyAccessorDeclarations intenc static var shadow identifier optVariableTypeAnnotation = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $6: TysonTypeDict["identifier"],
    $7: TysonTypeDict["optVariableTypeAnnotation"],
    $9: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["classStaticPropertyDeclaration"] {
    let $$: TysonTypeDict["classStaticPropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticPropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
        accessors: yy.option.some($1),
        isReassignable: true,
        doesShadow: true,

        name: $6,
        annotatedType: $7,
        initialValue: $9,
      },
    );

    return $$;
  },

  "propertyAccessorDeclarations -> ( pubPropertyAccessorDeclarations optProtPropertyAccessorDeclarations optPrivPropertyAccessorDeclarations )"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["pubPropertyAccessorDeclarations"],
    $3: TysonTypeDict["optProtPropertyAccessorDeclarations"],
    $4: TysonTypeDict["optPrivPropertyAccessorDeclarations"],
  ): TysonTypeDict["propertyAccessorDeclarations"] {
    let $$: TysonTypeDict["propertyAccessorDeclarations"];
    $$ = yy.mergePropertyAccessorDeclarations(yylstack["@$"], $2, $3, $4);
    return $$;
  },

  "propertyAccessorDeclarations -> ( protPropertyAccessorDeclarations optPrivPropertyAccessorDeclarations )"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["protPropertyAccessorDeclarations"],
    $3: TysonTypeDict["optPrivPropertyAccessorDeclarations"],
  ): TysonTypeDict["propertyAccessorDeclarations"] {
    let $$: TysonTypeDict["propertyAccessorDeclarations"];
    $$ = yy.mergePropertyAccessorDeclarations(yylstack["@$"], [], $2, $3);
    return $$;
  },

  "propertyAccessorDeclarations -> ( privPropertyAccessorDeclarations )"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["privPropertyAccessorDeclarations"],
  ): TysonTypeDict["propertyAccessorDeclarations"] {
    let $$: TysonTypeDict["propertyAccessorDeclarations"];
    $$ = yy.mergePropertyAccessorDeclarations(yylstack["@$"], [], [], $2);
    return $$;
  },

  "pubPropertyAccessorDeclarations -> pub"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["pubPropertyAccessorDeclarations"] {
    let $$: TysonTypeDict["pubPropertyAccessorDeclarations"];
    $$ = [
      yy.createNode(yy.NodeType.PropertyGetterDeclaration, yylstack["@$"], {
        visibility: yy.VisibilityLevel.Public,
      }),
      yy.createNode(yy.NodeType.PropertySetterDeclaration, yylstack["@$"], {
        visibility: yy.VisibilityLevel.Public,
      }),
    ];
    return $$;
  },

  "pubPropertyAccessorDeclarations -> pub get"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["pubPropertyAccessorDeclarations"] {
    let $$: TysonTypeDict["pubPropertyAccessorDeclarations"];
    $$ = [
      yy.createNode(yy.NodeType.PropertyGetterDeclaration, yylstack["@$"], {
        visibility: yy.VisibilityLevel.Public,
      }),
    ];
    return $$;
  },

  "pubPropertyAccessorDeclarations -> pub set"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["pubPropertyAccessorDeclarations"] {
    let $$: TysonTypeDict["pubPropertyAccessorDeclarations"];
    $$ = [
      yy.createNode(yy.NodeType.PropertySetterDeclaration, yylstack["@$"], {
        visibility: yy.VisibilityLevel.Public,
      }),
    ];
    return $$;
  },

  "optProtPropertyAccessorDeclarations -> "(): TysonTypeDict["optProtPropertyAccessorDeclarations"] {
    let $$: TysonTypeDict["optProtPropertyAccessorDeclarations"];
    $$ = [];
    return $$;
  },

  "optProtPropertyAccessorDeclarations -> protPropertyAccessorDeclarations"(
    $1: TysonTypeDict["protPropertyAccessorDeclarations"],
  ): TysonTypeDict["optProtPropertyAccessorDeclarations"] {
    let $$: TysonTypeDict["optProtPropertyAccessorDeclarations"];
    $$ = $1;
    return $$;
  },

  "protPropertyAccessorDeclarations -> prot"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["protPropertyAccessorDeclarations"] {
    let $$: TysonTypeDict["protPropertyAccessorDeclarations"];
    $$ = [
      yy.createNode(yy.NodeType.PropertyGetterDeclaration, yylstack["@$"], {
        visibility: yy.VisibilityLevel.Protected,
      }),
      yy.createNode(yy.NodeType.PropertySetterDeclaration, yylstack["@$"], {
        visibility: yy.VisibilityLevel.Protected,
      }),
    ];
    return $$;
  },

  "protPropertyAccessorDeclarations -> prot get"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["protPropertyAccessorDeclarations"] {
    let $$: TysonTypeDict["protPropertyAccessorDeclarations"];
    $$ = [
      yy.createNode(yy.NodeType.PropertyGetterDeclaration, yylstack["@$"], {
        visibility: yy.VisibilityLevel.Protected,
      }),
    ];
    return $$;
  },

  "protPropertyAccessorDeclarations -> prot set"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["protPropertyAccessorDeclarations"] {
    let $$: TysonTypeDict["protPropertyAccessorDeclarations"];
    $$ = [
      yy.createNode(yy.NodeType.PropertySetterDeclaration, yylstack["@$"], {
        visibility: yy.VisibilityLevel.Protected,
      }),
    ];
    return $$;
  },

  "optPrivPropertyAccessorDeclarations -> "(): TysonTypeDict["optPrivPropertyAccessorDeclarations"] {
    let $$: TysonTypeDict["optPrivPropertyAccessorDeclarations"];
    $$ = [];
    return $$;
  },

  "optPrivPropertyAccessorDeclarations -> privPropertyAccessorDeclarations"(
    $1: TysonTypeDict["privPropertyAccessorDeclarations"],
  ): TysonTypeDict["optPrivPropertyAccessorDeclarations"] {
    let $$: TysonTypeDict["optPrivPropertyAccessorDeclarations"];
    $$ = $1;
    return $$;
  },

  "privPropertyAccessorDeclarations -> priv"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["privPropertyAccessorDeclarations"] {
    let $$: TysonTypeDict["privPropertyAccessorDeclarations"];
    $$ = [
      yy.createNode(yy.NodeType.PropertyGetterDeclaration, yylstack["@$"], {
        visibility: yy.VisibilityLevel.Private,
      }),
      yy.createNode(yy.NodeType.PropertySetterDeclaration, yylstack["@$"], {
        visibility: yy.VisibilityLevel.Private,
      }),
    ];
    return $$;
  },

  "privPropertyAccessorDeclarations -> priv get"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["privPropertyAccessorDeclarations"] {
    let $$: TysonTypeDict["privPropertyAccessorDeclarations"];
    $$ = [
      yy.createNode(yy.NodeType.PropertyGetterDeclaration, yylstack["@$"], {
        visibility: yy.VisibilityLevel.Private,
      }),
    ];
    return $$;
  },

  "privPropertyAccessorDeclarations -> priv set"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["privPropertyAccessorDeclarations"] {
    let $$: TysonTypeDict["privPropertyAccessorDeclarations"];
    $$ = [
      yy.createNode(yy.NodeType.PropertySetterDeclaration, yylstack["@$"], {
        visibility: yy.VisibilityLevel.Private,
      }),
    ];
    return $$;
  },

  "optVariableTypeAnnotation -> "(): TysonTypeDict["optVariableTypeAnnotation"] {
    let $$: TysonTypeDict["optVariableTypeAnnotation"];
    $$ = yy.option.none();
    return $$;
  },

  "optVariableTypeAnnotation -> variableTypeAnnotation"(
    $1: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["optVariableTypeAnnotation"] {
    let $$: TysonTypeDict["optVariableTypeAnnotation"];
    $$ = yy.option.some($1);
    return $$;
  },

  "variableTypeAnnotation -> : type"(
    $2: TysonTypeDict["type"],
  ): TysonTypeDict["variableTypeAnnotation"] {
    let $$: TysonTypeDict["variableTypeAnnotation"];
    $$ = $2;
    return $$;
  },

  "classStaticMethodDeclaration -> optVisibilityModifier static identifier parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $5: TysonTypeDict["optReturnTypeAnnotation"],
    $6: TysonTypeDict["optThrowsClause"],
    $7: TysonTypeDict["methodBody"],
  ): TysonTypeDict["classStaticMethodDeclaration"] {
    let $$: TysonTypeDict["classStaticMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticMethodDeclaration,
      yylstack["@$"],
      {
        visibility: $1.unwrapOr(yy.VisibilityLevel.Private),
        doesShadow: false,

        name: $3,
        typeParams: [],
        params: $4,
        returnAnnotation: $5,
        thrownExceptions: $6,
        body: $7,
      },
    );

    return $$;
  },

  "classStaticMethodDeclaration -> optVisibilityModifier static shadow identifier parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $4: TysonTypeDict["identifier"],
    $5: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $6: TysonTypeDict["optReturnTypeAnnotation"],
    $7: TysonTypeDict["optThrowsClause"],
    $8: TysonTypeDict["methodBody"],
  ): TysonTypeDict["classStaticMethodDeclaration"] {
    let $$: TysonTypeDict["classStaticMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticMethodDeclaration,
      yylstack["@$"],
      {
        visibility: $1.unwrapOr(yy.VisibilityLevel.Private),
        doesShadow: true,

        name: $4,
        typeParams: [],
        params: $5,
        returnAnnotation: $6,
        thrownExceptions: $7,
        body: $8,
      },
    );

    return $$;
  },

  "classStaticMethodDeclaration -> optVisibilityModifier static identifier angleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["angleBracketEnclosedGenericMethodFormalTypeParams"],
    $5: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $6: TysonTypeDict["optReturnTypeAnnotation"],
    $7: TysonTypeDict["optThrowsClause"],
    $8: TysonTypeDict["methodBody"],
  ): TysonTypeDict["classStaticMethodDeclaration"] {
    let $$: TysonTypeDict["classStaticMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticMethodDeclaration,
      yylstack["@$"],
      {
        visibility: $1.unwrapOr(yy.VisibilityLevel.Private),
        doesShadow: false,

        name: $3,
        typeParams: $4,
        params: $5,
        returnAnnotation: $6,
        thrownExceptions: $7,
        body: $8,
      },
    );

    return $$;
  },

  "classStaticMethodDeclaration -> optVisibilityModifier static shadow identifier angleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $4: TysonTypeDict["identifier"],
    $5: TysonTypeDict["angleBracketEnclosedGenericMethodFormalTypeParams"],
    $6: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $7: TysonTypeDict["optReturnTypeAnnotation"],
    $8: TysonTypeDict["optThrowsClause"],
    $9: TysonTypeDict["methodBody"],
  ): TysonTypeDict["classStaticMethodDeclaration"] {
    let $$: TysonTypeDict["classStaticMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassStaticMethodDeclaration,
      yylstack["@$"],
      {
        visibility: $1.unwrapOr(yy.VisibilityLevel.Private),
        doesShadow: true,

        name: $4,
        typeParams: $5,
        params: $6,
        returnAnnotation: $7,
        thrownExceptions: $8,
        body: $9,
      },
    );

    return $$;
  },

  "optReturnTypeAnnotation -> "(): TysonTypeDict["optReturnTypeAnnotation"] {
    let $$: TysonTypeDict["optReturnTypeAnnotation"];
    $$ = yy.option.none();
    return $$;
  },

  "optReturnTypeAnnotation -> returnTypeAnnotation"(
    $1: TysonTypeDict["returnTypeAnnotation"],
  ): TysonTypeDict["optReturnTypeAnnotation"] {
    let $$: TysonTypeDict["optReturnTypeAnnotation"];
    $$ = yy.option.some($1);
    return $$;
  },

  "returnTypeAnnotation -> : type"(
    $2: TysonTypeDict["type"],
  ): TysonTypeDict["returnTypeAnnotation"] {
    let $$: TysonTypeDict["returnTypeAnnotation"];
    $$ = $2;
    return $$;
  },

  "optThrowsClause -> "(): TysonTypeDict["optThrowsClause"] {
    let $$: TysonTypeDict["optThrowsClause"];
    $$ = [];
    return $$;
  },

  "optThrowsClause -> throwsClause"(
    $1: TysonTypeDict["throwsClause"],
  ): TysonTypeDict["optThrowsClause"] {
    let $$: TysonTypeDict["optThrowsClause"];
    $$ = $1;
    return $$;
  },

  "throwsClause -> throws oneOrMoreCommaSeparatedTypes"(
    $2: TysonTypeDict["oneOrMoreCommaSeparatedTypes"],
  ): TysonTypeDict["throwsClause"] {
    let $$: TysonTypeDict["throwsClause"];
    $$ = $2;
    return $$;
  },

  "angleBracketEnclosedGenericMethodFormalTypeParams -> GENERIC_METHOD_TYPE_PARAM_LIST_LEFT_ANGLE_BRACKET oneOrMoreFormalTypeParams >"(
    $2: TysonTypeDict["oneOrMoreFormalTypeParams"],
  ): TysonTypeDict["angleBracketEnclosedGenericMethodFormalTypeParams"] {
    let $$: TysonTypeDict["angleBracketEnclosedGenericMethodFormalTypeParams"];
    $$ = $2;
    return $$;
  },

  "classInstancePropertyDeclaration -> optVisibilityModifier identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $2: TysonTypeDict["identifier"],
    $3: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel($1),
        accessors: yy.option.none(),
        isReassignable: false,
        doesShadow: false,

        name: $2,
        annotatedType: $3,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> optVisibilityModifier var identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel($1),
        accessors: yy.option.none(),
        isReassignable: true,
        doesShadow: false,

        name: $3,
        annotatedType: $4,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> optVisibilityModifier shadow identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel($1),
        accessors: yy.option.none(),
        isReassignable: false,
        doesShadow: true,

        name: $3,
        annotatedType: $4,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> optVisibilityModifier var shadow identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $4: TysonTypeDict["identifier"],
    $5: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel($1),
        accessors: yy.option.none(),
        isReassignable: true,
        doesShadow: true,

        name: $4,
        annotatedType: $5,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> propertyAccessorDeclarations identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $2: TysonTypeDict["identifier"],
    $3: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.PropertyVisibilityLevel.Private,
        accessors: yy.option.some($1),
        isReassignable: false,
        doesShadow: false,

        name: $2,
        annotatedType: $3,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> propertyAccessorDeclarations var identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.PropertyVisibilityLevel.Private,
        accessors: yy.option.some($1),
        isReassignable: true,
        doesShadow: false,

        name: $3,
        annotatedType: $4,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> propertyAccessorDeclarations shadow identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.PropertyVisibilityLevel.Private,
        accessors: yy.option.some($1),
        isReassignable: false,
        doesShadow: true,

        name: $3,
        annotatedType: $4,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> propertyAccessorDeclarations var shadow identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $4: TysonTypeDict["identifier"],
    $5: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.PropertyVisibilityLevel.Private,
        accessors: yy.option.some($1),
        isReassignable: true,
        doesShadow: true,

        name: $4,
        annotatedType: $5,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> propertyAccessorDeclarations visibilityModifier identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $2: TysonTypeDict["visibilityModifier"],
    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel(yy.option.some($2)),
        accessors: yy.option.some($1),
        isReassignable: false,
        doesShadow: false,

        name: $3,
        annotatedType: $4,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> propertyAccessorDeclarations visibilityModifier var identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $2: TysonTypeDict["visibilityModifier"],
    $4: TysonTypeDict["identifier"],
    $5: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel(yy.option.some($2)),
        accessors: yy.option.some($1),
        isReassignable: true,
        doesShadow: false,

        name: $4,
        annotatedType: $5,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> propertyAccessorDeclarations visibilityModifier shadow identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $2: TysonTypeDict["visibilityModifier"],
    $4: TysonTypeDict["identifier"],
    $5: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel(yy.option.some($2)),
        accessors: yy.option.some($1),
        isReassignable: false,
        doesShadow: true,

        name: $4,
        annotatedType: $5,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> propertyAccessorDeclarations visibilityModifier var shadow identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $2: TysonTypeDict["visibilityModifier"],
    $5: TysonTypeDict["identifier"],
    $6: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.convertToPropertyVisibilityLevel(yy.option.some($2)),
        accessors: yy.option.some($1),
        isReassignable: true,
        doesShadow: true,

        name: $5,
        annotatedType: $6,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> propertyAccessorDeclarations intenc identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
        accessors: yy.option.some($1),
        isReassignable: false,
        doesShadow: false,

        name: $3,
        annotatedType: $4,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> propertyAccessorDeclarations intenc var identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $4: TysonTypeDict["identifier"],
    $5: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
        accessors: yy.option.some($1),
        isReassignable: true,
        doesShadow: false,

        name: $4,
        annotatedType: $5,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> propertyAccessorDeclarations intenc shadow identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $4: TysonTypeDict["identifier"],
    $5: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
        accessors: yy.option.some($1),
        isReassignable: false,
        doesShadow: true,

        name: $4,
        annotatedType: $5,
      },
    );

    return $$;
  },

  "classInstancePropertyDeclaration -> propertyAccessorDeclarations intenc var shadow identifier variableTypeAnnotation ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["propertyAccessorDeclarations"],
    $5: TysonTypeDict["identifier"],
    $6: TysonTypeDict["variableTypeAnnotation"],
  ): TysonTypeDict["classInstancePropertyDeclaration"] {
    let $$: TysonTypeDict["classInstancePropertyDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstancePropertyDeclaration,
      yylstack["@$"],
      {
        visibility: yy.PropertyVisibilityLevel.InternallyEncapsulated,
        accessors: yy.option.some($1),
        isReassignable: true,
        doesShadow: true,

        name: $5,
        annotatedType: $6,
      },
    );

    return $$;
  },

  "classInstanceMethodDeclaration -> classFinalNonOverrideInstanceMethodDeclaration"(
    $1: TysonTypeDict["classFinalNonOverrideInstanceMethodDeclaration"],
  ): TysonTypeDict["classInstanceMethodDeclaration"] {
    let $$: TysonTypeDict["classInstanceMethodDeclaration"];
    $$ = $1;
    return $$;
  },

  "classInstanceMethodDeclaration -> classFinalOverrideInstanceMethodDeclaration"(
    $1: TysonTypeDict["classFinalOverrideInstanceMethodDeclaration"],
  ): TysonTypeDict["classInstanceMethodDeclaration"] {
    let $$: TysonTypeDict["classInstanceMethodDeclaration"];
    $$ = $1;
    return $$;
  },

  "classInstanceMethodDeclaration -> classOpenInstanceMethodDeclaration"(
    $1: TysonTypeDict["classOpenInstanceMethodDeclaration"],
  ): TysonTypeDict["classInstanceMethodDeclaration"] {
    let $$: TysonTypeDict["classInstanceMethodDeclaration"];
    $$ = $1;
    return $$;
  },

  "classInstanceMethodDeclaration -> classAbstractInstanceMethodDeclaration"(
    $1: TysonTypeDict["classAbstractInstanceMethodDeclaration"],
  ): TysonTypeDict["classInstanceMethodDeclaration"] {
    let $$: TysonTypeDict["classInstanceMethodDeclaration"];
    $$ = $1;
    return $$;
  },

  "classFinalNonOverrideInstanceMethodDeclaration -> optVisibilityModifier identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $2: TysonTypeDict["identifier"],
    $3: TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"],
    $4: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $5: TysonTypeDict["optReturnTypeAnnotation"],
    $6: TysonTypeDict["optThrowsClause"],
    $7: TysonTypeDict["methodBody"],
  ): TysonTypeDict["classFinalNonOverrideInstanceMethodDeclaration"] {
    let $$: TysonTypeDict["classFinalNonOverrideInstanceMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstanceMethodDeclaration,
      yylstack["@$"],
      {
        extensibility: yy.ExtensibilityLevel.Final,
        doesOverride: false,

        visibility: $1.unwrapOr(yy.VisibilityLevel.Private),

        name: $2,
        typeParams: $3,
        params: $4,
        returnAnnotation: $5,
        thrownExceptions: $6,
        body: $7,
      },
    );

    return $$;
  },

  "classFinalOverrideInstanceMethodDeclaration -> override identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["identifier"],
    $3: TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"],
    $4: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $5: TysonTypeDict["optReturnTypeAnnotation"],
    $6: TysonTypeDict["optThrowsClause"],
    $7: TysonTypeDict["methodBody"],
  ): TysonTypeDict["classFinalOverrideInstanceMethodDeclaration"] {
    let $$: TysonTypeDict["classFinalOverrideInstanceMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstanceMethodDeclaration,
      yylstack["@$"],
      {
        extensibility: yy.ExtensibilityLevel.Final,
        doesOverride: true,

        visibility: yy.VisibilityLevel.Protected,

        name: $2,
        typeParams: $3,
        params: $4,
        returnAnnotation: $5,
        thrownExceptions: $6,
        body: $7,
      },
    );

    return $$;
  },

  "classFinalOverrideInstanceMethodDeclaration -> pub override identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"],
    $5: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $6: TysonTypeDict["optReturnTypeAnnotation"],
    $7: TysonTypeDict["optThrowsClause"],
    $8: TysonTypeDict["methodBody"],
  ): TysonTypeDict["classFinalOverrideInstanceMethodDeclaration"] {
    let $$: TysonTypeDict["classFinalOverrideInstanceMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstanceMethodDeclaration,
      yylstack["@$"],
      {
        extensibility: yy.ExtensibilityLevel.Final,
        doesOverride: true,

        visibility: yy.VisibilityLevel.Public,

        name: $3,
        typeParams: $4,
        params: $5,
        returnAnnotation: $6,
        thrownExceptions: $7,
        body: $8,
      },
    );

    return $$;
  },

  "classOpenInstanceMethodDeclaration -> open identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["identifier"],
    $3: TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"],
    $4: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $5: TysonTypeDict["optReturnTypeAnnotation"],
    $6: TysonTypeDict["optThrowsClause"],
    $7: TysonTypeDict["methodBody"],
  ): TysonTypeDict["classOpenInstanceMethodDeclaration"] {
    let $$: TysonTypeDict["classOpenInstanceMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstanceMethodDeclaration,
      yylstack["@$"],
      {
        extensibility: yy.ExtensibilityLevel.Open,
        doesOverride: false,

        visibility: yy.VisibilityLevel.Protected,

        name: $2,
        typeParams: $3,
        params: $4,
        returnAnnotation: $5,
        thrownExceptions: $6,
        body: $7,
      },
    );

    return $$;
  },

  "classOpenInstanceMethodDeclaration -> open override identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"],
    $5: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $6: TysonTypeDict["optReturnTypeAnnotation"],
    $7: TysonTypeDict["optThrowsClause"],
    $8: TysonTypeDict["methodBody"],
  ): TysonTypeDict["classOpenInstanceMethodDeclaration"] {
    let $$: TysonTypeDict["classOpenInstanceMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstanceMethodDeclaration,
      yylstack["@$"],
      {
        extensibility: yy.ExtensibilityLevel.Open,
        doesOverride: true,

        visibility: yy.VisibilityLevel.Protected,

        name: $3,
        typeParams: $4,
        params: $5,
        returnAnnotation: $6,
        thrownExceptions: $7,
        body: $8,
      },
    );

    return $$;
  },

  "classOpenInstanceMethodDeclaration -> pub open identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"],
    $5: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $6: TysonTypeDict["optReturnTypeAnnotation"],
    $7: TysonTypeDict["optThrowsClause"],
    $8: TysonTypeDict["methodBody"],
  ): TysonTypeDict["classOpenInstanceMethodDeclaration"] {
    let $$: TysonTypeDict["classOpenInstanceMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstanceMethodDeclaration,
      yylstack["@$"],
      {
        extensibility: yy.ExtensibilityLevel.Open,
        doesOverride: false,

        visibility: yy.VisibilityLevel.Public,

        name: $3,
        typeParams: $4,
        params: $5,
        returnAnnotation: $6,
        thrownExceptions: $7,
        body: $8,
      },
    );

    return $$;
  },

  "classOpenInstanceMethodDeclaration -> pub open override identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $4: TysonTypeDict["identifier"],
    $5: TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"],
    $6: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $7: TysonTypeDict["optReturnTypeAnnotation"],
    $8: TysonTypeDict["optThrowsClause"],
    $9: TysonTypeDict["methodBody"],
  ): TysonTypeDict["classOpenInstanceMethodDeclaration"] {
    let $$: TysonTypeDict["classOpenInstanceMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstanceMethodDeclaration,
      yylstack["@$"],
      {
        extensibility: yy.ExtensibilityLevel.Open,
        doesOverride: true,

        visibility: yy.VisibilityLevel.Public,

        name: $4,
        typeParams: $5,
        params: $6,
        returnAnnotation: $7,
        thrownExceptions: $8,
        body: $9,
      },
    );

    return $$;
  },

  "classAbstractInstanceMethodDeclaration -> abstract identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause ;"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["identifier"],
    $3: TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"],
    $4: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $5: TysonTypeDict["optReturnTypeAnnotation"],
    $6: TysonTypeDict["optThrowsClause"],
  ): TysonTypeDict["classAbstractInstanceMethodDeclaration"] {
    let $$: TysonTypeDict["classAbstractInstanceMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstanceMethodDeclaration,
      yylstack["@$"],
      {
        extensibility: yy.ExtensibilityLevel.Abstract,

        visibility: yy.VisibilityLevel.Protected,

        name: $2,
        typeParams: $3,
        params: $4,
        returnAnnotation: $5,
        thrownExceptions: $6,
      },
    );

    return $$;
  },

  "classAbstractInstanceMethodDeclaration -> pub abstract identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause ;"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"],
    $5: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $6: TysonTypeDict["optReturnTypeAnnotation"],
    $7: TysonTypeDict["optThrowsClause"],
  ): TysonTypeDict["classAbstractInstanceMethodDeclaration"] {
    let $$: TysonTypeDict["classAbstractInstanceMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInstanceMethodDeclaration,
      yylstack["@$"],
      {
        extensibility: yy.ExtensibilityLevel.Abstract,

        visibility: yy.VisibilityLevel.Public,

        name: $3,
        typeParams: $4,
        params: $5,
        returnAnnotation: $6,
        thrownExceptions: $7,
      },
    );

    return $$;
  },

  "optAngleBracketEnclosedGenericMethodFormalTypeParams -> "(): TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"] {
    let $$: TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"];
    $$ = [];
    return $$;
  },

  "optAngleBracketEnclosedGenericMethodFormalTypeParams -> angleBracketEnclosedGenericMethodFormalTypeParams"(
    $1: TysonTypeDict["angleBracketEnclosedGenericMethodFormalTypeParams"],
  ): TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"] {
    let $$: TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"];
    $$ = $1;
    return $$;
  },

  "classInnerClassDeclaration -> optVisibilityModifier finalClassDeclaration"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $2: TysonTypeDict["finalClassDeclaration"],
  ): TysonTypeDict["classInnerClassDeclaration"] {
    let $$: TysonTypeDict["classInnerClassDeclaration"];
    $$ = yy.createNode(yy.NodeType.ClassInnerClassDeclaration, yylstack["@$"], {
      visibility: $1.unwrapOr(yy.VisibilityLevel.Private),
      classDeclaration: $2,
    });
    return $$;
  },

  "classInnerClassDeclaration -> extensibleClassDeclaration"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["extensibleClassDeclaration"],
  ): TysonTypeDict["classInnerClassDeclaration"] {
    let $$: TysonTypeDict["classInnerClassDeclaration"];
    $$ = yy.createNode(yy.NodeType.ClassInnerClassDeclaration, yylstack["@$"], {
      visibility: yy.VisibilityLevel.Private,
      classDeclaration: $1,
    });
    return $$;
  },

  "classInnerClassDeclaration -> prot extensibleClassDeclaration"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["extensibleClassDeclaration"],
  ): TysonTypeDict["classInnerClassDeclaration"] {
    let $$: TysonTypeDict["classInnerClassDeclaration"];
    $$ = yy.createNode(yy.NodeType.ClassInnerClassDeclaration, yylstack["@$"], {
      visibility: yy.VisibilityLevel.Protected,
      classDeclaration: $2,
    });
    return $$;
  },

  "classInnerClassDeclaration -> pub extensibleClassDeclaration"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["extensibleClassDeclaration"],
  ): TysonTypeDict["classInnerClassDeclaration"] {
    let $$: TysonTypeDict["classInnerClassDeclaration"];
    $$ = yy.createNode(yy.NodeType.ClassInnerClassDeclaration, yylstack["@$"], {
      visibility: yy.VisibilityLevel.Public,
      classDeclaration: $2,
    });
    return $$;
  },

  "classInnerInterfaceDeclaration -> optVisibilityModifier interfaceDeclaration"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optVisibilityModifier"],
    $2: TysonTypeDict["interfaceDeclaration"],
  ): TysonTypeDict["classInnerInterfaceDeclaration"] {
    let $$: TysonTypeDict["classInnerInterfaceDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.ClassInnerInterfaceDeclaration,
      yylstack["@$"],
      {
        visibility: $1.unwrapOr(yy.VisibilityLevel.Private),
        interfaceDeclaration: $2,
      },
    );
    return $$;
  },

  "pubInterfaceDeclaration -> pub interfaceDeclaration"(
    $2: TysonTypeDict["interfaceDeclaration"],
  ): TysonTypeDict["pubInterfaceDeclaration"] {
    let $$: TysonTypeDict["pubInterfaceDeclaration"];
    $$ = yy.merge($2, { isPub: true });
    return $$;
  },

  "interfaceDeclaration -> interface optShadowKeyword identifier optBracketedFormalTypeParams optInterfaceExtensionClause { optUseStatements optInterfaceMethodDeclarations }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optShadowKeyword"],
    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["optBracketedFormalTypeParams"],
    $5: TysonTypeDict["optInterfaceExtensionClause"],
    $7: TysonTypeDict["optUseStatements"],
    $8: TysonTypeDict["optInterfaceMethodDeclarations"],
  ): TysonTypeDict["interfaceDeclaration"] {
    let $$: TysonTypeDict["interfaceDeclaration"];
    $$ = yy.createNode(yy.NodeType.InterfaceDeclaration, yylstack["@$"], {
      isPub: false,
      doesShadow: $2.isSome(),
      name: $3,
      typeParams: $4,
      superInterfaces: $5,
      useStatements: $7,
      methods: $8,
    });
    return $$;
  },

  "optInterfaceExtensionClause -> "(): TysonTypeDict["optInterfaceExtensionClause"] {
    let $$: TysonTypeDict["optInterfaceExtensionClause"];
    $$ = [];
    return $$;
  },

  "optInterfaceExtensionClause -> interfaceExtensionClause"(
    $1: TysonTypeDict["interfaceExtensionClause"],
  ): TysonTypeDict["optInterfaceExtensionClause"] {
    let $$: TysonTypeDict["optInterfaceExtensionClause"];
    $$ = $1;
    return $$;
  },

  "interfaceExtensionClause -> extends oneOrMoreCommaSeparatedTypes"(
    $2: TysonTypeDict["oneOrMoreCommaSeparatedTypes"],
  ): TysonTypeDict["interfaceExtensionClause"] {
    let $$: TysonTypeDict["interfaceExtensionClause"];
    $$ = $2;
    return $$;
  },

  "optInterfaceMethodDeclarations -> "(): TysonTypeDict["optInterfaceMethodDeclarations"] {
    let $$: TysonTypeDict["optInterfaceMethodDeclarations"];
    $$ = [];
    return $$;
  },

  "optInterfaceMethodDeclarations -> optInterfaceMethodDeclarations interfaceMethodDeclaration"(
    $1: TysonTypeDict["optInterfaceMethodDeclarations"],
    $2: TysonTypeDict["interfaceMethodDeclaration"],
  ): TysonTypeDict["optInterfaceMethodDeclarations"] {
    let $$: TysonTypeDict["optInterfaceMethodDeclarations"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "interfaceMethodDeclaration -> identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["identifier"],
    $2: TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"],
    $3: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $4: TysonTypeDict["optReturnTypeAnnotation"],
    $5: TysonTypeDict["optThrowsClause"],
  ): TysonTypeDict["interfaceMethodDeclaration"] {
    let $$: TysonTypeDict["interfaceMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.InterfaceAbstractMethodDeclaration,
      yylstack["@$"],
      {
        name: $1,
        typeParams: $2,
        params: $3,
        returnAnnotation: $4,
        thrownExceptions: $5,
      },
    );
    return $$;
  },

  "interfaceMethodDeclaration -> default identifier optAngleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["identifier"],
    $3: TysonTypeDict["optAngleBracketEnclosedGenericMethodFormalTypeParams"],
    $4: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $5: TysonTypeDict["optReturnTypeAnnotation"],
    $6: TysonTypeDict["optThrowsClause"],
    $7: TysonTypeDict["methodBody"],
  ): TysonTypeDict["interfaceMethodDeclaration"] {
    let $$: TysonTypeDict["interfaceMethodDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.InterfaceDefaultMethodDeclaration,
      yylstack["@$"],
      {
        name: $2,
        typeParams: $3,
        params: $4,
        returnAnnotation: $5,
        thrownExceptions: $6,
        body: $7,
      },
    );
    return $$;
  },

  "optPrivClassOrInterfaceDeclarations -> "(): TysonTypeDict["optPrivClassOrInterfaceDeclarations"] {
    let $$: TysonTypeDict["optPrivClassOrInterfaceDeclarations"];
    $$ = [];
    return $$;
  },

  "optPrivClassOrInterfaceDeclarations -> optPrivClassOrInterfaceDeclarations classDeclaration"(
    $1: TysonTypeDict["optPrivClassOrInterfaceDeclarations"],
    $2: TysonTypeDict["classDeclaration"],
  ): TysonTypeDict["optPrivClassOrInterfaceDeclarations"] {
    let $$: TysonTypeDict["optPrivClassOrInterfaceDeclarations"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "optPrivClassOrInterfaceDeclarations -> optPrivClassOrInterfaceDeclarations interfaceDeclaration"(
    $1: TysonTypeDict["optPrivClassOrInterfaceDeclarations"],
    $2: TysonTypeDict["interfaceDeclaration"],
  ): TysonTypeDict["optPrivClassOrInterfaceDeclarations"] {
    let $$: TysonTypeDict["optPrivClassOrInterfaceDeclarations"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "statement -> expression ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = yy.createNode(yy.NodeType.StatementExpression, yylstack["@$"], {
      expression: $1,
    });
    return $$;
  },

  "statement -> blockStatement"(
    $1: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> ifStatement"(
    $1: TysonTypeDict["ifStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> switchStatement"(
    $1: TysonTypeDict["switchStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> returnStatement"(
    $1: TysonTypeDict["returnStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> breakStatement"(
    $1: TysonTypeDict["breakStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> continueStatement"(
    $1: TysonTypeDict["continueStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> variableDeclaration"(
    $1: TysonTypeDict["variableDeclaration"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> variableAssignment"(
    $1: TysonTypeDict["variableAssignment"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> throwStatement"(
    $1: TysonTypeDict["throwStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> whileStatement"(
    $1: TysonTypeDict["whileStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> doWhileStatement"(
    $1: TysonTypeDict["doWhileStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> loopStatement"(
    $1: TysonTypeDict["loopStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> repeatStatement"(
    $1: TysonTypeDict["repeatStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> forStatement"(
    $1: TysonTypeDict["forStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> tryStatement"(
    $1: TysonTypeDict["tryStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> ifTypeGuardStatement"(
    $1: TysonTypeDict["ifTypeGuardStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "statement -> whileTypeGuardStatement"(
    $1: TysonTypeDict["whileTypeGuardStatement"],
  ): TysonTypeDict["statement"] {
    let $$: TysonTypeDict["statement"];
    $$ = $1;
    return $$;
  },

  "blockStatement -> { optUseStatements }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optUseStatements"],
  ): TysonTypeDict["blockStatement"] {
    let $$: TysonTypeDict["blockStatement"];
    $$ = yy.createNode(yy.NodeType.BlockStatement, yylstack["@$"], {
      useStatements: $2,
      statements: [],
    });
    return $$;
  },

  "blockStatement -> { optUseStatements oneOrMoreStatements }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optUseStatements"],
    $3: TysonTypeDict["oneOrMoreStatements"],
  ): TysonTypeDict["blockStatement"] {
    let $$: TysonTypeDict["blockStatement"];
    $$ = yy.createNode(yy.NodeType.BlockStatement, yylstack["@$"], {
      useStatements: $2,
      statements: $3,
    });
    return $$;
  },

  "ifStatement -> if expression blockStatement optStatementElseIfClauses"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $3: TysonTypeDict["blockStatement"],
    $4: TysonTypeDict["optStatementElseIfClauses"],
  ): TysonTypeDict["ifStatement"] {
    let $$: TysonTypeDict["ifStatement"];
    $$ = yy.createNode(yy.NodeType.IfStatement, yylstack["@$"], {
      condition: $2,
      body: $3,
      elseIfClauses: $4,
      elseBody: yy.option.none(),
    });
    return $$;
  },

  "ifStatement -> if expression blockStatement optStatementElseIfClauses statementElseClause"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $3: TysonTypeDict["blockStatement"],
    $4: TysonTypeDict["optStatementElseIfClauses"],
    $5: TysonTypeDict["statementElseClause"],
  ): TysonTypeDict["ifStatement"] {
    let $$: TysonTypeDict["ifStatement"];
    $$ = yy.createNode(yy.NodeType.IfStatement, yylstack["@$"], {
      condition: $2,
      body: $3,
      elseIfClauses: $4,
      elseBody: yy.option.some($5),
    });
    return $$;
  },

  "optStatementElseIfClauses -> "(): TysonTypeDict["optStatementElseIfClauses"] {
    let $$: TysonTypeDict["optStatementElseIfClauses"];
    $$ = [];
    return $$;
  },

  "optStatementElseIfClauses -> optStatementElseIfClauses statementElseIfClause"(
    $1: TysonTypeDict["optStatementElseIfClauses"],
    $2: TysonTypeDict["statementElseIfClause"],
  ): TysonTypeDict["optStatementElseIfClauses"] {
    let $$: TysonTypeDict["optStatementElseIfClauses"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "statementElseIfClause -> else if expression blockStatement"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["expression"],
    $4: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["statementElseIfClause"] {
    let $$: TysonTypeDict["statementElseIfClause"];
    $$ = yy.createNode(yy.NodeType.StatementElseIfClause, yylstack["@$"], {
      condition: $3,
      body: $4,
    });
    return $$;
  },

  "statementElseClause -> else blockStatement"(
    $2: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["statementElseClause"] {
    let $$: TysonTypeDict["statementElseClause"];
    $$ = $2;
    return $$;
  },

  "switchStatement -> switch expression { oneOrMoreStatementCaseClauses }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $4: TysonTypeDict["oneOrMoreStatementCaseClauses"],
  ): TysonTypeDict["switchStatement"] {
    let $$: TysonTypeDict["switchStatement"];
    $$ = yy.createNode(yy.NodeType.SwitchStatement, yylstack["@$"], {
      comparedExpression: $2,
      caseClauses: $4,
      elseBody: yy.option.none(),
    });
    return $$;
  },

  "switchStatement -> switch expression { statementElseClause }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $4: TysonTypeDict["statementElseClause"],
  ): TysonTypeDict["switchStatement"] {
    let $$: TysonTypeDict["switchStatement"];
    $$ = yy.createNode(yy.NodeType.SwitchStatement, yylstack["@$"], {
      comparedExpression: $2,
      caseClauses: [],
      elseBody: yy.option.some($4),
    });
    return $$;
  },

  "switchStatement -> switch expression { oneOrMoreStatementCaseClauses statementElseClause }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $4: TysonTypeDict["oneOrMoreStatementCaseClauses"],
    $5: TysonTypeDict["statementElseClause"],
  ): TysonTypeDict["switchStatement"] {
    let $$: TysonTypeDict["switchStatement"];
    $$ = yy.createNode(yy.NodeType.SwitchStatement, yylstack["@$"], {
      comparedExpression: $2,
      caseClauses: $4,
      elseBody: yy.option.some($5),
    });
    return $$;
  },

  "oneOrMoreStatementCaseClauses -> statementCaseClause"(
    $1: TysonTypeDict["statementCaseClause"],
  ): TysonTypeDict["oneOrMoreStatementCaseClauses"] {
    let $$: TysonTypeDict["oneOrMoreStatementCaseClauses"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreStatementCaseClauses -> oneOrMoreStatementCaseClauses statementCaseClause"(
    $1: TysonTypeDict["oneOrMoreStatementCaseClauses"],
    $2: TysonTypeDict["statementCaseClause"],
  ): TysonTypeDict["oneOrMoreStatementCaseClauses"] {
    let $$: TysonTypeDict["oneOrMoreStatementCaseClauses"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "statementCaseClause -> case oneOrMorePipeSeparatedExpressions blockStatement"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["oneOrMorePipeSeparatedExpressions"],
    $3: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["statementCaseClause"] {
    let $$: TysonTypeDict["statementCaseClause"];
    $$ = yy.createNode(yy.NodeType.StatementCaseClause, yylstack["@$"], {
      matches: $2,
      body: $3,
    });
    return $$;
  },

  "oneOrMorePipeSeparatedExpressions -> expression"(
    $1: TysonTypeDict["expression"],
  ): TysonTypeDict["oneOrMorePipeSeparatedExpressions"] {
    let $$: TysonTypeDict["oneOrMorePipeSeparatedExpressions"];
    $$ = [$1];
    return $$;
  },

  "oneOrMorePipeSeparatedExpressions -> oneOrMorePipeSeparatedExpressions | expression"(
    $1: TysonTypeDict["oneOrMorePipeSeparatedExpressions"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["oneOrMorePipeSeparatedExpressions"] {
    let $$: TysonTypeDict["oneOrMorePipeSeparatedExpressions"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "returnStatement -> return_ ;"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["returnStatement"] {
    let $$: TysonTypeDict["returnStatement"];
    $$ = yy.createNode(yy.NodeType.ReturnStatement, yylstack["@$"], {
      returnedValue: yy.option.none(),
    });
    return $$;
  },

  "returnStatement -> return_ expression ;"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
  ): TysonTypeDict["returnStatement"] {
    let $$: TysonTypeDict["returnStatement"];
    $$ = yy.createNode(yy.NodeType.ReturnStatement, yylstack["@$"], {
      returnedValue: yy.option.some($2),
    });
    return $$;
  },

  "returnStatement -> return_ returnablePseudex ;"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["returnablePseudex"],
  ): TysonTypeDict["returnStatement"] {
    let $$: TysonTypeDict["returnStatement"];
    $$ = yy.createNode(yy.NodeType.ReturnStatement, yylstack["@$"], {
      returnedValue: yy.option.some($2),
    });
    return $$;
  },

  "breakStatement -> break ;"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["breakStatement"] {
    let $$: TysonTypeDict["breakStatement"];
    $$ = yy.createNode(yy.NodeType.BreakStatement, yylstack["@$"], {});
    return $$;
  },

  "continueStatement -> continue ;"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["continueStatement"] {
    let $$: TysonTypeDict["continueStatement"];
    $$ = yy.createNode(yy.NodeType.ContinueStatement, yylstack["@$"], {});
    return $$;
  },

  "variableDeclaration -> variableDeclarationKeyword optShadowKeyword identifier optVariableTypeAnnotation = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["variableDeclarationKeyword"],
    $2: TysonTypeDict["optShadowKeyword"],
    $3: TysonTypeDict["identifier"],
    $4: TysonTypeDict["optVariableTypeAnnotation"],
    $6: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["variableDeclaration"] {
    let $$: TysonTypeDict["variableDeclaration"];
    $$ = yy.createNode(yy.NodeType.VariableDeclaration, yylstack["@$"], {
      isReassignable: $1 === "var",
      doesShadow: $2.isSome(),
      name: $3,
      annotatedType: $4,
      initialValue: $6,
    });
    return $$;
  },

  "expressionOrAssignmentPseudex -> expression"(
    $1: TysonTypeDict["expression"],
  ): TysonTypeDict["expressionOrAssignmentPseudex"] {
    let $$: TysonTypeDict["expressionOrAssignmentPseudex"];
    $$ = $1;
    return $$;
  },

  "expressionOrAssignmentPseudex -> assignmentPseudex"(
    $1: TysonTypeDict["assignmentPseudex"],
  ): TysonTypeDict["expressionOrAssignmentPseudex"] {
    let $$: TysonTypeDict["expressionOrAssignmentPseudex"];
    $$ = $1;
    return $$;
  },

  "variableDeclarationKeyword -> let"(
    $1: TysonTypeDict["let"],
  ): TysonTypeDict["variableDeclarationKeyword"] {
    let $$: TysonTypeDict["variableDeclarationKeyword"];
    $$ = $1;
    return $$;
  },

  "variableDeclarationKeyword -> var"(
    $1: TysonTypeDict["var"],
  ): TysonTypeDict["variableDeclarationKeyword"] {
    let $$: TysonTypeDict["variableDeclarationKeyword"];
    $$ = $1;
    return $$;
  },

  "assignmentPseudex -> returnablePseudex"(
    $1: TysonTypeDict["returnablePseudex"],
  ): TysonTypeDict["assignmentPseudex"] {
    let $$: TysonTypeDict["assignmentPseudex"];
    $$ = $1;
    return $$;
  },

  "assignmentPseudex -> nonReturnablePseudex"(
    $1: TysonTypeDict["nonReturnablePseudex"],
  ): TysonTypeDict["assignmentPseudex"] {
    let $$: TysonTypeDict["assignmentPseudex"];
    $$ = $1;
    return $$;
  },

  "assignmentPseudex -> blockPseudex"(
    $1: TysonTypeDict["blockPseudex"],
  ): TysonTypeDict["assignmentPseudex"] {
    let $$: TysonTypeDict["assignmentPseudex"];
    $$ = $1;
    return $$;
  },

  "nonReturnablePseudex -> repeatingArrayFillPseudex"(
    $1: TysonTypeDict["repeatingArrayFillPseudex"],
  ): TysonTypeDict["nonReturnablePseudex"] {
    let $$: TysonTypeDict["nonReturnablePseudex"];
    $$ = $1;
    return $$;
  },

  "nonReturnablePseudex -> repeatingListFillPseudex"(
    $1: TysonTypeDict["repeatingListFillPseudex"],
  ): TysonTypeDict["nonReturnablePseudex"] {
    let $$: TysonTypeDict["nonReturnablePseudex"];
    $$ = $1;
    return $$;
  },

  "nonReturnablePseudex -> sequentialListFillPseudex"(
    $1: TysonTypeDict["sequentialListFillPseudex"],
  ): TysonTypeDict["nonReturnablePseudex"] {
    let $$: TysonTypeDict["nonReturnablePseudex"];
    $$ = $1;
    return $$;
  },

  "nonReturnablePseudex -> arrayMapPseudex"(
    $1: TysonTypeDict["arrayMapPseudex"],
  ): TysonTypeDict["nonReturnablePseudex"] {
    let $$: TysonTypeDict["nonReturnablePseudex"];
    $$ = $1;
    return $$;
  },

  "nonReturnablePseudex -> listMapPseudex"(
    $1: TysonTypeDict["listMapPseudex"],
  ): TysonTypeDict["nonReturnablePseudex"] {
    let $$: TysonTypeDict["nonReturnablePseudex"];
    $$ = $1;
    return $$;
  },

  "nonReturnablePseudex -> listFilterMapPseudex"(
    $1: TysonTypeDict["listFilterMapPseudex"],
  ): TysonTypeDict["nonReturnablePseudex"] {
    let $$: TysonTypeDict["nonReturnablePseudex"];
    $$ = $1;
    return $$;
  },

  "repeatingArrayFillPseudex -> [ expression ; oneOrMoreCommaSeparatedExpressions ]"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $4: TysonTypeDict["oneOrMoreCommaSeparatedExpressions"],
  ): TysonTypeDict["repeatingArrayFillPseudex"] {
    let $$: TysonTypeDict["repeatingArrayFillPseudex"];
    $$ = yy.createNode(yy.NodeType.RepeatingArrayFillPseudex, yylstack["@$"], {
      fillExpression: $2,
      dimensions: $4,
    });
    return $$;
  },

  "repeatingListFillPseudex -> + [ expression ; oneOrMoreCommaSeparatedExpressions ]"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["expression"],
    $5: TysonTypeDict["oneOrMoreCommaSeparatedExpressions"],
  ): TysonTypeDict["repeatingListFillPseudex"] {
    let $$: TysonTypeDict["repeatingListFillPseudex"];
    $$ = yy.createNode(yy.NodeType.RepeatingListFillPseudex, yylstack["@$"], {
      fillExpression: $3,
      dimensions: $5,
    });
    return $$;
  },

  "oneOrMoreCommaSeparatedExpressions -> expression"(
    $1: TysonTypeDict["expression"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedExpressions"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedExpressions"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreCommaSeparatedExpressions -> oneOrMoreCommaSeparatedExpressions , expression"(
    $1: TysonTypeDict["oneOrMoreCommaSeparatedExpressions"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedExpressions"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedExpressions"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "sequentialListFillPseudex -> + [ ]"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["sequentialListFillPseudex"] {
    let $$: TysonTypeDict["sequentialListFillPseudex"];
    $$ = yy.createNode(yy.NodeType.SequentialListFillPseudex, yylstack["@$"], {
      elements: [],
    });
    return $$;
  },

  "sequentialListFillPseudex -> + [ oneOrMoreCommaSeparatedExpressions optTrailingComma ]"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedExpressions"],
  ): TysonTypeDict["sequentialListFillPseudex"] {
    let $$: TysonTypeDict["sequentialListFillPseudex"];
    $$ = yy.createNode(yy.NodeType.SequentialListFillPseudex, yylstack["@$"], {
      elements: $3,
    });
    return $$;
  },

  "arrayMapPseudex -> [ expression for oneOrMoreForBindings in expression ]"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $4: TysonTypeDict["oneOrMoreForBindings"],
    $6: TysonTypeDict["expression"],
  ): TysonTypeDict["arrayMapPseudex"] {
    let $$: TysonTypeDict["arrayMapPseudex"];
    $$ = yy.createNode(yy.NodeType.ArrayMapPseudex, yylstack["@$"], {
      output: $2,
      bindings: $4,
      iteratee: $6,
    });
    return $$;
  },

  "arrayMapPseudex -> [ assignmentPseudex for oneOrMoreForBindings in expression ]"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["assignmentPseudex"],
    $4: TysonTypeDict["oneOrMoreForBindings"],
    $6: TysonTypeDict["expression"],
  ): TysonTypeDict["arrayMapPseudex"] {
    let $$: TysonTypeDict["arrayMapPseudex"];
    $$ = yy.createNode(yy.NodeType.ArrayMapPseudex, yylstack["@$"], {
      output: $2,
      bindings: $4,
      iteratee: $6,
    });
    return $$;
  },

  "oneOrMoreForBindings -> forBinding"(
    $1: TysonTypeDict["forBinding"],
  ): TysonTypeDict["oneOrMoreForBindings"] {
    let $$: TysonTypeDict["oneOrMoreForBindings"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreForBindings -> oneOrMoreForBindings , forBinding"(
    $1: TysonTypeDict["oneOrMoreForBindings"],
    $3: TysonTypeDict["forBinding"],
  ): TysonTypeDict["oneOrMoreForBindings"] {
    let $$: TysonTypeDict["oneOrMoreForBindings"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "forBinding -> forValueBinding"(
    $1: TysonTypeDict["forValueBinding"],
  ): TysonTypeDict["forBinding"] {
    let $$: TysonTypeDict["forBinding"];
    $$ = $1;
    return $$;
  },

  "forBinding -> forIndexBinding"(
    $1: TysonTypeDict["forIndexBinding"],
  ): TysonTypeDict["forBinding"] {
    let $$: TysonTypeDict["forBinding"];
    $$ = $1;
    return $$;
  },

  "forValueBinding -> optShadowKeyword identifier"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optShadowKeyword"],
    $2: TysonTypeDict["identifier"],
  ): TysonTypeDict["forValueBinding"] {
    let $$: TysonTypeDict["forValueBinding"];
    $$ = yy.createNode(yy.NodeType.ForBinding, yylstack["@$"], {
      bindingType: yy.ForBindingType.ValueBinding,
      doesShadow: $1.isSome(),
      name: $2,
    });
    return $$;
  },

  "forIndexBinding -> optShadowKeyword @ identifier"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["optShadowKeyword"],
    $3: TysonTypeDict["identifier"],
  ): TysonTypeDict["forIndexBinding"] {
    let $$: TysonTypeDict["forIndexBinding"];
    $$ = yy.createNode(yy.NodeType.ForBinding, yylstack["@$"], {
      bindingType: yy.ForBindingType.IndexBinding,
      doesShadow: $1.isSome(),
      name: $3,
    });
    return $$;
  },

  "listMapPseudex -> + [ expression for oneOrMoreForBindings in expression ]"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["expression"],
    $5: TysonTypeDict["oneOrMoreForBindings"],
    $7: TysonTypeDict["expression"],
  ): TysonTypeDict["listMapPseudex"] {
    let $$: TysonTypeDict["listMapPseudex"];
    $$ = yy.createNode(yy.NodeType.ListMapPseudex, yylstack["@$"], {
      output: $3,
      bindings: $5,
      iteratee: $7,
    });
    return $$;
  },

  "listMapPseudex -> + [ assignmentPseudex for oneOrMoreForBindings in expression ]"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["assignmentPseudex"],
    $5: TysonTypeDict["oneOrMoreForBindings"],
    $7: TysonTypeDict["expression"],
  ): TysonTypeDict["listMapPseudex"] {
    let $$: TysonTypeDict["listMapPseudex"];
    $$ = yy.createNode(yy.NodeType.ListMapPseudex, yylstack["@$"], {
      output: $3,
      bindings: $5,
      iteratee: $7,
    });
    return $$;
  },

  "listFilterMapPseudex -> + [ expression for oneOrMoreForBindings in expression if expression ]"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["expression"],
    $5: TysonTypeDict["oneOrMoreForBindings"],
    $7: TysonTypeDict["expression"],
    $9: TysonTypeDict["expression"],
  ): TysonTypeDict["listFilterMapPseudex"] {
    let $$: TysonTypeDict["listFilterMapPseudex"];
    $$ = yy.createNode(yy.NodeType.ListFilterMapPseudex, yylstack["@$"], {
      output: $3,
      bindings: $5,
      iteratee: $7,
      predicate: $9,
    });
    return $$;
  },

  "listFilterMapPseudex -> + [ assignmentPseudex for oneOrMoreForBindings in expression if expression ]"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["assignmentPseudex"],
    $5: TysonTypeDict["oneOrMoreForBindings"],
    $7: TysonTypeDict["expression"],
    $9: TysonTypeDict["expression"],
  ): TysonTypeDict["listFilterMapPseudex"] {
    let $$: TysonTypeDict["listFilterMapPseudex"];
    $$ = yy.createNode(yy.NodeType.ListFilterMapPseudex, yylstack["@$"], {
      output: $3,
      bindings: $5,
      iteratee: $7,
      predicate: $9,
    });
    return $$;
  },

  "returnablePseudex -> ifPseudex"(
    $1: TysonTypeDict["ifPseudex"],
  ): TysonTypeDict["returnablePseudex"] {
    let $$: TysonTypeDict["returnablePseudex"];
    $$ = $1;
    return $$;
  },

  "returnablePseudex -> switchPseudex"(
    $1: TysonTypeDict["switchPseudex"],
  ): TysonTypeDict["returnablePseudex"] {
    let $$: TysonTypeDict["returnablePseudex"];
    $$ = $1;
    return $$;
  },

  "returnablePseudex -> tryPseudex"(
    $1: TysonTypeDict["tryPseudex"],
  ): TysonTypeDict["returnablePseudex"] {
    let $$: TysonTypeDict["returnablePseudex"];
    $$ = $1;
    return $$;
  },

  "returnablePseudex -> tryOrThrowPseudex"(
    $1: TysonTypeDict["tryOrThrowPseudex"],
  ): TysonTypeDict["returnablePseudex"] {
    let $$: TysonTypeDict["returnablePseudex"];
    $$ = $1;
    return $$;
  },

  "returnablePseudex -> throwPseudex"(
    $1: TysonTypeDict["throwPseudex"],
  ): TysonTypeDict["returnablePseudex"] {
    let $$: TysonTypeDict["returnablePseudex"];
    $$ = $1;
    return $$;
  },

  "returnablePseudex -> ifTypeGuardPseudex"(
    $1: TysonTypeDict["ifTypeGuardPseudex"],
  ): TysonTypeDict["returnablePseudex"] {
    let $$: TysonTypeDict["returnablePseudex"];
    $$ = $1;
    return $$;
  },

  "ifPseudex -> ifPseudexWithIfBodyPseudex"(
    $1: TysonTypeDict["ifPseudexWithIfBodyPseudex"],
  ): TysonTypeDict["ifPseudex"] {
    let $$: TysonTypeDict["ifPseudex"];
    $$ = $1;
    return $$;
  },

  "ifPseudex -> ifPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause"(
    $1: TysonTypeDict["ifPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause"],
  ): TysonTypeDict["ifPseudex"] {
    let $$: TysonTypeDict["ifPseudex"];
    $$ = $1;
    return $$;
  },

  "ifPseudex -> ifPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"(
    $1: TysonTypeDict["ifPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"],
  ): TysonTypeDict["ifPseudex"] {
    let $$: TysonTypeDict["ifPseudex"];
    $$ = $1;
    return $$;
  },

  "ifPseudexWithIfBodyPseudex -> if expression blockPseudex else blockExpressionOrBlockPseudex"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $3: TysonTypeDict["blockPseudex"],
    $5: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["ifPseudexWithIfBodyPseudex"] {
    let $$: TysonTypeDict["ifPseudexWithIfBodyPseudex"];
    $$ = yy.createNode(yy.NodeType.IfPseudex, yylstack["@$"], {
      pseudexType: yy.IfPseudexType.WithIfBodyPseudex,
      condition: $2,
      body: $3,
      elseIfClauses: [],
      elseBody: $5,
    });
    return $$;
  },

  "ifPseudexWithIfBodyPseudex -> if expression blockPseudex oneOrMoreExpressionElseIfClauses else blockExpressionOrBlockPseudex"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $3: TysonTypeDict["blockPseudex"],
    $4: TysonTypeDict["oneOrMoreExpressionElseIfClauses"],
    $6: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["ifPseudexWithIfBodyPseudex"] {
    let $$: TysonTypeDict["ifPseudexWithIfBodyPseudex"];
    $$ = yy.createNode(yy.NodeType.IfPseudex, yylstack["@$"], {
      pseudexType: yy.IfPseudexType.WithIfBodyPseudex,
      condition: $2,
      body: $3,
      elseIfClauses: $4,
      elseBody: $6,
    });
    return $$;
  },

  "ifPseudexWithIfBodyPseudex -> if expression blockPseudex oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses else blockExpressionOrBlockPseudex"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $3: TysonTypeDict["blockPseudex"],
    $4: TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"],
    $6: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["ifPseudexWithIfBodyPseudex"] {
    let $$: TysonTypeDict["ifPseudexWithIfBodyPseudex"];
    $$ = yy.createNode(yy.NodeType.IfPseudex, yylstack["@$"], {
      pseudexType: yy.IfPseudexType.WithIfBodyPseudex,
      condition: $2,
      body: $3,
      elseIfClauses: $4,
      elseBody: $6,
    });
    return $$;
  },

  "ifPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause -> if expression blockExpression oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses else blockExpressionOrBlockPseudex"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $3: TysonTypeDict["blockExpression"],
    $4: TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"],
    $6: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["ifPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause"] {
    let $$: TysonTypeDict["ifPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause"];
    $$ = yy.createNode(yy.NodeType.IfPseudex, yylstack["@$"], {
      pseudexType:
        yy.IfPseudexType.WithIfBodyExpressionAndAtLeastOnePseudexElseIfClause,
      condition: $2,
      body: $3,
      elseIfClauses: $4,
      elseBody: $6,
    });
    return $$;
  },

  "ifPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses -> if expression blockExpression else blockPseudex"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $3: TysonTypeDict["blockExpression"],
    $5: TysonTypeDict["blockPseudex"],
  ): TysonTypeDict["ifPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"] {
    let $$: TysonTypeDict["ifPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"];
    $$ = yy.createNode(yy.NodeType.IfPseudex, yylstack["@$"], {
      pseudexType:
        yy.IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses,
      condition: $2,
      body: $3,
      elseIfClauses: [],
      elseBody: $5,
    });
    return $$;
  },

  "ifPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses -> if expression blockExpression oneOrMoreExpressionElseIfClauses else blockPseudex"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $3: TysonTypeDict["blockExpression"],
    $4: TysonTypeDict["oneOrMoreExpressionElseIfClauses"],
    $6: TysonTypeDict["blockPseudex"],
  ): TysonTypeDict["ifPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"] {
    let $$: TysonTypeDict["ifPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"];
    $$ = yy.createNode(yy.NodeType.IfPseudex, yylstack["@$"], {
      pseudexType:
        yy.IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses,
      condition: $2,
      body: $3,
      elseIfClauses: $4,
      elseBody: $6,
    });
    return $$;
  },

  "blockPseudex -> { optUseStatements oneOrMoreStatements expression }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optUseStatements"],
    $3: TysonTypeDict["oneOrMoreStatements"],
    $4: TysonTypeDict["expression"],
  ): TysonTypeDict["blockPseudex"] {
    let $$: TysonTypeDict["blockPseudex"];
    $$ = yy.createNode(yy.NodeType.BlockPseudex, yylstack["@$"], {
      useStatements: $2,
      statements: $3,
      conclusion: $4,
    });
    return $$;
  },

  "blockPseudex -> { optUseStatements returnablePseudex }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optUseStatements"],
    $3: TysonTypeDict["returnablePseudex"],
  ): TysonTypeDict["blockPseudex"] {
    let $$: TysonTypeDict["blockPseudex"];
    $$ = yy.createNode(yy.NodeType.BlockPseudex, yylstack["@$"], {
      useStatements: $2,
      statements: [],
      conclusion: $3,
    });
    return $$;
  },

  "blockPseudex -> { optUseStatements oneOrMoreStatements returnablePseudex }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optUseStatements"],
    $3: TysonTypeDict["oneOrMoreStatements"],
    $4: TysonTypeDict["returnablePseudex"],
  ): TysonTypeDict["blockPseudex"] {
    let $$: TysonTypeDict["blockPseudex"];
    $$ = yy.createNode(yy.NodeType.BlockPseudex, yylstack["@$"], {
      useStatements: $2,
      statements: $3,
      conclusion: $4,
    });
    return $$;
  },

  "oneOrMoreExpressionElseIfClauses -> expressionElseIfClause"(
    $1: TysonTypeDict["expressionElseIfClause"],
  ): TysonTypeDict["oneOrMoreExpressionElseIfClauses"] {
    let $$: TysonTypeDict["oneOrMoreExpressionElseIfClauses"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreExpressionElseIfClauses -> oneOrMoreExpressionElseIfClauses expressionElseIfClause"(
    $1: TysonTypeDict["oneOrMoreExpressionElseIfClauses"],
    $2: TysonTypeDict["expressionElseIfClause"],
  ): TysonTypeDict["oneOrMoreExpressionElseIfClauses"] {
    let $$: TysonTypeDict["oneOrMoreExpressionElseIfClauses"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "expressionElseIfClause -> else if expression blockExpression"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["expression"],
    $4: TysonTypeDict["blockExpression"],
  ): TysonTypeDict["expressionElseIfClause"] {
    let $$: TysonTypeDict["expressionElseIfClause"];
    $$ = yy.createNode(yy.NodeType.ExpressionElseIfClause, yylstack["@$"], {
      condition: $3,
      body: $4,
    });
    return $$;
  },

  "oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses -> pseudexElseIfClause"(
    $1: TysonTypeDict["pseudexElseIfClause"],
  ): TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"] {
    let $$: TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"];
    $$ = [$1];
    return $$;
  },

  "oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses -> oneOrMoreExpressionElseIfClauses pseudexElseIfClause"(
    $1: TysonTypeDict["oneOrMoreExpressionElseIfClauses"],
    $2: TysonTypeDict["pseudexElseIfClause"],
  ): TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"] {
    let $$: TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"];
    $$ = yy.concat($1, [$2]);
    return $$;
  },

  "oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses -> oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses expressionElseIfClause"(
    $1: TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"],
    $2: TysonTypeDict["expressionElseIfClause"],
  ): TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"] {
    let $$: TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses -> oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses pseudexElseIfClause"(
    $1: TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"],
    $2: TysonTypeDict["pseudexElseIfClause"],
  ): TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"] {
    let $$: TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "pseudexElseIfClause -> else if expression blockPseudex"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["expression"],
    $4: TysonTypeDict["blockPseudex"],
  ): TysonTypeDict["pseudexElseIfClause"] {
    let $$: TysonTypeDict["pseudexElseIfClause"];
    $$ = yy.createNode(yy.NodeType.PseudexElseIfClause, yylstack["@$"], {
      condition: $3,
      body: $4,
    });
    return $$;
  },

  "switchPseudex -> switchPseudexWithAtLeastOnePseudexCaseClause"(
    $1: TysonTypeDict["switchPseudexWithAtLeastOnePseudexCaseClause"],
  ): TysonTypeDict["switchPseudex"] {
    let $$: TysonTypeDict["switchPseudex"];
    $$ = $1;
    return $$;
  },

  "switchPseudex -> switchPseudexWithOneOrMoreExpressionCaseClauses"(
    $1: TysonTypeDict["switchPseudexWithOneOrMoreExpressionCaseClauses"],
  ): TysonTypeDict["switchPseudex"] {
    let $$: TysonTypeDict["switchPseudex"];
    $$ = $1;
    return $$;
  },

  "switchPseudex -> switchPseudexWithNoCaseClauses"(
    $1: TysonTypeDict["switchPseudexWithNoCaseClauses"],
  ): TysonTypeDict["switchPseudex"] {
    let $$: TysonTypeDict["switchPseudex"];
    $$ = $1;
    return $$;
  },

  "switchPseudexWithAtLeastOnePseudexCaseClause -> switch expression { oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses else blockExpressionOrBlockPseudex }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $4: TysonTypeDict["oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses"],
    $6: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["switchPseudexWithAtLeastOnePseudexCaseClause"] {
    let $$: TysonTypeDict["switchPseudexWithAtLeastOnePseudexCaseClause"];
    $$ = yy.createNode(yy.NodeType.SwitchPseudex, yylstack["@$"], {
      pseudexType: yy.SwitchPseudexType.WithAtLeastOnePseudexCaseClause,
      comparedExpression: $2,
      caseClauses: $4,
      elseBody: $6,
    });
    return $$;
  },

  "switchPseudexWithOneOrMoreExpressionCaseClauses -> switch expression { oneOrMoreExpressionCaseClauses else blockPseudex }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $4: TysonTypeDict["oneOrMoreExpressionCaseClauses"],
    $6: TysonTypeDict["blockPseudex"],
  ): TysonTypeDict["switchPseudexWithOneOrMoreExpressionCaseClauses"] {
    let $$: TysonTypeDict["switchPseudexWithOneOrMoreExpressionCaseClauses"];
    $$ = yy.createNode(yy.NodeType.SwitchPseudex, yylstack["@$"], {
      pseudexType: yy.SwitchPseudexType.WithOneOrMoreExpressionCaseClauses,
      comparedExpression: $2,
      caseClauses: $4,
      elseBody: $6,
    });
    return $$;
  },

  "switchPseudexWithNoCaseClauses -> switch expression { else blockPseudex }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $5: TysonTypeDict["blockPseudex"],
  ): TysonTypeDict["switchPseudexWithNoCaseClauses"] {
    let $$: TysonTypeDict["switchPseudexWithNoCaseClauses"];
    $$ = yy.createNode(yy.NodeType.SwitchPseudex, yylstack["@$"], {
      pseudexType: yy.SwitchPseudexType.WithNoCaseClauses,
      comparedExpression: $2,
      caseClauses: [],
      elseBody: $5,
    });
    return $$;
  },

  "oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses -> pseudexCaseClause"(
    $1: TysonTypeDict["pseudexCaseClause"],
  ): TysonTypeDict["oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses"] {
    let $$: TysonTypeDict["oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses"];
    $$ = [$1];
    return $$;
  },

  "oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses -> oneOrMoreExpressionCaseClauses pseudexCaseClause"(
    $1: TysonTypeDict["oneOrMoreExpressionCaseClauses"],
    $2: TysonTypeDict["pseudexCaseClause"],
  ): TysonTypeDict["oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses"] {
    let $$: TysonTypeDict["oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses"];
    $$ = yy.concat($1, [$2]);
    return $$;
  },

  "oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses -> oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses expressionCaseClause"(
    $1: TysonTypeDict["oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses"],
    $2: TysonTypeDict["expressionCaseClause"],
  ): TysonTypeDict["oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses"] {
    let $$: TysonTypeDict["oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses -> oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses pseudexCaseClause"(
    $1: TysonTypeDict["oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses"],
    $2: TysonTypeDict["pseudexCaseClause"],
  ): TysonTypeDict["oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses"] {
    let $$: TysonTypeDict["oneOrMorePseudexCaseClausesAndOptExpressionCaseClauses"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "pseudexCaseClause -> case oneOrMorePipeSeparatedExpressions blockPseudex"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["oneOrMorePipeSeparatedExpressions"],
    $3: TysonTypeDict["blockPseudex"],
  ): TysonTypeDict["pseudexCaseClause"] {
    let $$: TysonTypeDict["pseudexCaseClause"];
    $$ = yy.createNode(yy.NodeType.PseudexCaseClause, yylstack["@$"], {
      matches: $2,
      body: $3,
    });
    return $$;
  },

  "oneOrMoreExpressionCaseClauses -> expressionCaseClause"(
    $1: TysonTypeDict["expressionCaseClause"],
  ): TysonTypeDict["oneOrMoreExpressionCaseClauses"] {
    let $$: TysonTypeDict["oneOrMoreExpressionCaseClauses"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreExpressionCaseClauses -> oneOrMoreExpressionCaseClauses expressionCaseClause"(
    $1: TysonTypeDict["oneOrMoreExpressionCaseClauses"],
    $2: TysonTypeDict["expressionCaseClause"],
  ): TysonTypeDict["oneOrMoreExpressionCaseClauses"] {
    let $$: TysonTypeDict["oneOrMoreExpressionCaseClauses"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "expressionCaseClause -> case oneOrMorePipeSeparatedExpressions blockExpression"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["oneOrMorePipeSeparatedExpressions"],
    $3: TysonTypeDict["blockExpression"],
  ): TysonTypeDict["expressionCaseClause"] {
    let $$: TysonTypeDict["expressionCaseClause"];
    $$ = yy.createNode(yy.NodeType.ExpressionCaseClause, yylstack["@$"], {
      matches: $2,
      body: $3,
    });
    return $$;
  },

  "blockExpressionOrBlockPseudex -> blockExpression"(
    $1: TysonTypeDict["blockExpression"],
  ): TysonTypeDict["blockExpressionOrBlockPseudex"] {
    let $$: TysonTypeDict["blockExpressionOrBlockPseudex"];
    $$ = $1;
    return $$;
  },

  "blockExpressionOrBlockPseudex -> blockPseudex"(
    $1: TysonTypeDict["blockPseudex"],
  ): TysonTypeDict["blockExpressionOrBlockPseudex"] {
    let $$: TysonTypeDict["blockExpressionOrBlockPseudex"];
    $$ = $1;
    return $$;
  },

  "tryPseudex -> try blockExpressionOrBlockPseudex oneOrMoreExpressionOrPseudexCatchClauses"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["blockExpressionOrBlockPseudex"],
    $3: TysonTypeDict["oneOrMoreExpressionOrPseudexCatchClauses"],
  ): TysonTypeDict["tryPseudex"] {
    let $$: TysonTypeDict["tryPseudex"];
    $$ = yy.createNode(yy.NodeType.TryPseudex, yylstack["@$"], {
      body: $2,
      catchClauses: $3,
    });
    return $$;
  },

  "oneOrMoreExpressionOrPseudexCatchClauses -> expressionOrPseudexCatchClause"(
    $1: TysonTypeDict["expressionOrPseudexCatchClause"],
  ): TysonTypeDict["oneOrMoreExpressionOrPseudexCatchClauses"] {
    let $$: TysonTypeDict["oneOrMoreExpressionOrPseudexCatchClauses"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreExpressionOrPseudexCatchClauses -> oneOrMoreExpressionOrPseudexCatchClauses expressionOrPseudexCatchClause"(
    $1: TysonTypeDict["oneOrMoreExpressionOrPseudexCatchClauses"],
    $2: TysonTypeDict["expressionOrPseudexCatchClause"],
  ): TysonTypeDict["oneOrMoreExpressionOrPseudexCatchClauses"] {
    let $$: TysonTypeDict["oneOrMoreExpressionOrPseudexCatchClauses"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "expressionOrPseudexCatchClause -> catch identifier : oneOrMorePipeSeparatedTypes blockExpressionOrBlockPseudex"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["identifier"],
    $4: TysonTypeDict["oneOrMorePipeSeparatedTypes"],
    $5: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["expressionOrPseudexCatchClause"] {
    let $$: TysonTypeDict["expressionOrPseudexCatchClause"];
    if ($5.nodeType === yy.NodeType.BlockExpression) {
      $$ = yy.createNode(yy.NodeType.ExpressionCatchClause, yylstack["@$"], {
        exceptionName: $2,
        exceptionTypes: $4,
        body: $5,
      });
    } else {
      $$ = yy.createNode(yy.NodeType.PseudexCatchClause, yylstack["@$"], {
        exceptionName: $2,
        exceptionTypes: $4,
        body: $5,
      });
    }

    return $$;
  },

  "tryOrThrowPseudex -> tryorthrow expression"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
  ): TysonTypeDict["tryOrThrowPseudex"] {
    let $$: TysonTypeDict["tryOrThrowPseudex"];
    $$ = yy.createNode(yy.NodeType.TryOrThrowPseudex, yylstack["@$"], {
      expression: $2,
    });
    return $$;
  },

  "throwPseudex -> throw expression"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
  ): TysonTypeDict["throwPseudex"] {
    let $$: TysonTypeDict["throwPseudex"];
    $$ = yy.createNode(yy.NodeType.ThrowPseudex, yylstack["@$"], {
      thrownValue: $2,
    });
    return $$;
  },

  "throwPseudex -> throw returnablePseudex"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["returnablePseudex"],
  ): TysonTypeDict["throwPseudex"] {
    let $$: TysonTypeDict["throwPseudex"];
    $$ = yy.createNode(yy.NodeType.ThrowPseudex, yylstack["@$"], {
      thrownValue: $2,
    });
    return $$;
  },

  "ifTypeGuardPseudex -> ifTypeGuardPseudexWithIfBodyPseudex"(
    $1: TysonTypeDict["ifTypeGuardPseudexWithIfBodyPseudex"],
  ): TysonTypeDict["ifTypeGuardPseudex"] {
    let $$: TysonTypeDict["ifTypeGuardPseudex"];
    $$ = $1;
    return $$;
  },

  "ifTypeGuardPseudex -> ifTypeGuardPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause"(
    $1: TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause"],
  ): TysonTypeDict["ifTypeGuardPseudex"] {
    let $$: TysonTypeDict["ifTypeGuardPseudex"];
    $$ = $1;
    return $$;
  },

  "ifTypeGuardPseudex -> ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"(
    $1: TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"],
  ): TysonTypeDict["ifTypeGuardPseudex"] {
    let $$: TysonTypeDict["ifTypeGuardPseudex"];
    $$ = $1;
    return $$;
  },

  "ifTypeGuardPseudexWithIfBodyPseudex -> if let oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockPseudex else blockExpressionOrBlockPseudex"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"],
    $5: TysonTypeDict["blockPseudex"],
    $7: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["ifTypeGuardPseudexWithIfBodyPseudex"] {
    let $$: TysonTypeDict["ifTypeGuardPseudexWithIfBodyPseudex"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, yylstack["@$"], {
      pseudexType: yy.IfPseudexType.WithIfBodyPseudex,
      declarations: $3,
      body: $5,
      elseIfClauses: [],
      elseBody: $7,
    });
    return $$;
  },

  "ifTypeGuardPseudexWithIfBodyPseudex -> if let oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockPseudex oneOrMoreExpressionElseIfClauses else blockExpressionOrBlockPseudex"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"],
    $5: TysonTypeDict["blockPseudex"],
    $6: TysonTypeDict["oneOrMoreExpressionElseIfClauses"],
    $8: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["ifTypeGuardPseudexWithIfBodyPseudex"] {
    let $$: TysonTypeDict["ifTypeGuardPseudexWithIfBodyPseudex"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, yylstack["@$"], {
      pseudexType: yy.IfPseudexType.WithIfBodyPseudex,
      declarations: $3,
      body: $5,
      elseIfClauses: $6,
      elseBody: $8,
    });
    return $$;
  },

  "ifTypeGuardPseudexWithIfBodyPseudex -> if let oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockPseudex oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses else blockExpressionOrBlockPseudex"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"],
    $5: TysonTypeDict["blockPseudex"],
    $6: TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"],
    $8: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["ifTypeGuardPseudexWithIfBodyPseudex"] {
    let $$: TysonTypeDict["ifTypeGuardPseudexWithIfBodyPseudex"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, yylstack["@$"], {
      pseudexType: yy.IfPseudexType.WithIfBodyPseudex,
      declarations: $3,
      body: $5,
      elseIfClauses: $6,
      elseBody: $8,
    });
    return $$;
  },

  "ifTypeGuardPseudexWithIfBodyPseudex -> if let oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockPseudex else blockExpressionOrBlockPseudex"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"],
    $5: TysonTypeDict["blockPseudex"],
    $7: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["ifTypeGuardPseudexWithIfBodyPseudex"] {
    let $$: TysonTypeDict["ifTypeGuardPseudexWithIfBodyPseudex"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, yylstack["@$"], {
      pseudexType: yy.IfPseudexType.WithIfBodyPseudex,
      declarations: $3,
      body: $5,
      elseIfClauses: [],
      elseBody: $7,
    });
    return $$;
  },

  "ifTypeGuardPseudexWithIfBodyPseudex -> if let oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockPseudex oneOrMoreExpressionElseIfClauses else blockExpressionOrBlockPseudex"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"],
    $5: TysonTypeDict["blockPseudex"],
    $6: TysonTypeDict["oneOrMoreExpressionElseIfClauses"],
    $8: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["ifTypeGuardPseudexWithIfBodyPseudex"] {
    let $$: TysonTypeDict["ifTypeGuardPseudexWithIfBodyPseudex"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, yylstack["@$"], {
      pseudexType: yy.IfPseudexType.WithIfBodyPseudex,
      declarations: $3,
      body: $5,
      elseIfClauses: $6,
      elseBody: $8,
    });
    return $$;
  },

  "ifTypeGuardPseudexWithIfBodyPseudex -> if let oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockPseudex oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses else blockExpressionOrBlockPseudex"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"],
    $5: TysonTypeDict["blockPseudex"],
    $6: TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"],
    $8: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["ifTypeGuardPseudexWithIfBodyPseudex"] {
    let $$: TysonTypeDict["ifTypeGuardPseudexWithIfBodyPseudex"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, yylstack["@$"], {
      pseudexType: yy.IfPseudexType.WithIfBodyPseudex,
      declarations: $3,
      body: $5,
      elseIfClauses: $6,
      elseBody: $8,
    });
    return $$;
  },

  "ifTypeGuardPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause -> if let oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockExpression oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses else blockExpressionOrBlockPseudex"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"],
    $5: TysonTypeDict["blockExpression"],
    $6: TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"],
    $8: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause"] {
    let $$: TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, yylstack["@$"], {
      pseudexType:
        yy.IfPseudexType.WithIfBodyExpressionAndAtLeastOnePseudexElseIfClause,
      declarations: $3,
      body: $5,
      elseIfClauses: $6,
      elseBody: $8,
    });
    return $$;
  },

  "ifTypeGuardPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause -> if let oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockExpression oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses else blockExpressionOrBlockPseudex"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"],
    $5: TysonTypeDict["blockExpression"],
    $6: TysonTypeDict["oneOrMorePseudexElseIfClausesAndOptExpressionElseIfClauses"],
    $8: TysonTypeDict["blockExpressionOrBlockPseudex"],
  ): TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause"] {
    let $$: TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, yylstack["@$"], {
      pseudexType:
        yy.IfPseudexType.WithIfBodyExpressionAndAtLeastOnePseudexElseIfClause,
      declarations: $3,
      body: $5,
      elseIfClauses: $6,
      elseBody: $8,
    });
    return $$;
  },

  "ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses -> if let oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockExpression else blockPseudex"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"],
    $5: TysonTypeDict["blockExpression"],
    $7: TysonTypeDict["blockPseudex"],
  ): TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"] {
    let $$: TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, yylstack["@$"], {
      pseudexType:
        yy.IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses,
      declarations: $3,
      body: $5,
      elseIfClauses: [],
      elseBody: $7,
    });
    return $$;
  },

  "ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses -> if let oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockExpression oneOrMoreExpressionElseIfClauses else blockPseudex"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"],
    $5: TysonTypeDict["blockExpression"],
    $6: TysonTypeDict["oneOrMoreExpressionElseIfClauses"],
    $8: TysonTypeDict["blockPseudex"],
  ): TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"] {
    let $$: TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, yylstack["@$"], {
      pseudexType:
        yy.IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses,
      declarations: $3,
      body: $5,
      elseIfClauses: $6,
      elseBody: $8,
    });
    return $$;
  },

  "ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses -> if let oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockExpression else blockPseudex"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"],
    $5: TysonTypeDict["blockExpression"],
    $7: TysonTypeDict["blockPseudex"],
  ): TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"] {
    let $$: TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, yylstack["@$"], {
      pseudexType:
        yy.IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses,
      declarations: $3,
      body: $5,
      elseIfClauses: [],
      elseBody: $7,
    });
    return $$;
  },

  "ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses -> if let oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockExpression oneOrMoreExpressionElseIfClauses else blockPseudex"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"],
    $5: TysonTypeDict["blockExpression"],
    $6: TysonTypeDict["oneOrMoreExpressionElseIfClauses"],
    $8: TysonTypeDict["blockPseudex"],
  ): TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"] {
    let $$: TysonTypeDict["ifTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardPseudex, yylstack["@$"], {
      pseudexType:
        yy.IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses,
      declarations: $3,
      body: $5,
      elseIfClauses: $6,
      elseBody: $8,
    });
    return $$;
  },

  "variableAssignment -> assignableExpression = expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["assignableExpression"],
    $2: TysonTypeDict["="],
    $3: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["variableAssignment"] {
    let $$: TysonTypeDict["variableAssignment"];
    $$ = yy.createNode(yy.NodeType.VariableAssignment, yylstack["@$"], {
      assignee: $1,
      assignmentType: $2,
      assignment: $3,
    });
    return $$;
  },

  "variableAssignment -> assignableExpression **= expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["assignableExpression"],
    $2: TysonTypeDict["**="],
    $3: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["variableAssignment"] {
    let $$: TysonTypeDict["variableAssignment"];
    $$ = yy.createNode(yy.NodeType.VariableAssignment, yylstack["@$"], {
      assignee: $1,
      assignmentType: $2,
      assignment: $3,
    });
    return $$;
  },

  "variableAssignment -> assignableExpression *= expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["assignableExpression"],
    $2: TysonTypeDict["*="],
    $3: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["variableAssignment"] {
    let $$: TysonTypeDict["variableAssignment"];
    $$ = yy.createNode(yy.NodeType.VariableAssignment, yylstack["@$"], {
      assignee: $1,
      assignmentType: $2,
      assignment: $3,
    });
    return $$;
  },

  "variableAssignment -> assignableExpression /= expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["assignableExpression"],
    $2: TysonTypeDict["/="],
    $3: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["variableAssignment"] {
    let $$: TysonTypeDict["variableAssignment"];
    $$ = yy.createNode(yy.NodeType.VariableAssignment, yylstack["@$"], {
      assignee: $1,
      assignmentType: $2,
      assignment: $3,
    });
    return $$;
  },

  "variableAssignment -> assignableExpression %= expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["assignableExpression"],
    $2: TysonTypeDict["%="],
    $3: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["variableAssignment"] {
    let $$: TysonTypeDict["variableAssignment"];
    $$ = yy.createNode(yy.NodeType.VariableAssignment, yylstack["@$"], {
      assignee: $1,
      assignmentType: $2,
      assignment: $3,
    });
    return $$;
  },

  "variableAssignment -> assignableExpression += expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["assignableExpression"],
    $2: TysonTypeDict["+="],
    $3: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["variableAssignment"] {
    let $$: TysonTypeDict["variableAssignment"];
    $$ = yy.createNode(yy.NodeType.VariableAssignment, yylstack["@$"], {
      assignee: $1,
      assignmentType: $2,
      assignment: $3,
    });
    return $$;
  },

  "variableAssignment -> assignableExpression -= expressionOrAssignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["assignableExpression"],
    $2: TysonTypeDict["-="],
    $3: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["variableAssignment"] {
    let $$: TysonTypeDict["variableAssignment"];
    $$ = yy.createNode(yy.NodeType.VariableAssignment, yylstack["@$"], {
      assignee: $1,
      assignmentType: $2,
      assignment: $3,
    });
    return $$;
  },

  "throwStatement -> throwPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["throwPseudex"],
  ): TysonTypeDict["throwStatement"] {
    let $$: TysonTypeDict["throwStatement"];
    $$ = yy.createNode(yy.NodeType.ThrowStatement, yylstack["@$"], {
      thrownValue: $1.thrownValue,
    });
    return $$;
  },

  "whileStatement -> while expression blockStatement"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $3: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["whileStatement"] {
    let $$: TysonTypeDict["whileStatement"];
    $$ = yy.createNode(yy.NodeType.WhileStatement, yylstack["@$"], {
      condition: $2,
      body: $3,
    });
    return $$;
  },

  "doWhileStatement -> do blockStatement while expression ;"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["blockStatement"],
    $4: TysonTypeDict["expression"],
  ): TysonTypeDict["doWhileStatement"] {
    let $$: TysonTypeDict["doWhileStatement"];
    $$ = yy.createNode(yy.NodeType.DoWhileStatement, yylstack["@$"], {
      body: $2,
      condition: $4,
    });
    return $$;
  },

  "loopStatement -> loop blockStatement"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["loopStatement"] {
    let $$: TysonTypeDict["loopStatement"];
    $$ = yy.createNode(yy.NodeType.LoopStatement, yylstack["@$"], { body: $2 });
    return $$;
  },

  "repeatStatement -> repeat expression blockStatement"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $3: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["repeatStatement"] {
    let $$: TysonTypeDict["repeatStatement"];
    $$ = yy.createNode(yy.NodeType.RepeatStatement, yylstack["@$"], {
      repetitionQuantity: $2,
      body: $3,
    });
    return $$;
  },

  "forStatement -> cStyleForStatement"(
    $1: TysonTypeDict["cStyleForStatement"],
  ): TysonTypeDict["forStatement"] {
    let $$: TysonTypeDict["forStatement"];
    $$ = $1;
    return $$;
  },

  "forStatement -> collectionIterationForStatement"(
    $1: TysonTypeDict["collectionIterationForStatement"],
  ): TysonTypeDict["forStatement"] {
    let $$: TysonTypeDict["forStatement"];
    $$ = $1;
    return $$;
  },

  "forStatement -> rangeForStatement"(
    $1: TysonTypeDict["rangeForStatement"],
  ): TysonTypeDict["forStatement"] {
    let $$: TysonTypeDict["forStatement"];
    $$ = $1;
    return $$;
  },

  "cStyleForStatement -> for ( statement expression ; statement ) blockStatement"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["statement"],
    $4: TysonTypeDict["expression"],
    $6: TysonTypeDict["statement"],
    $8: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["cStyleForStatement"] {
    let $$: TysonTypeDict["cStyleForStatement"];
    $$ = yy.createNode(yy.NodeType.CStyleForStatement, yylstack["@$"], {
      initialStatement: $3,
      condition: $4,
      afterthought: $6,
      body: $8,
    });
    return $$;
  },

  "collectionIterationForStatement -> for forValueBinding in expression blockStatement"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["forValueBinding"],
    $4: TysonTypeDict["expression"],
    $5: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["collectionIterationForStatement"] {
    let $$: TysonTypeDict["collectionIterationForStatement"];
    $$ = yy.createNode(
      yy.NodeType.CollectionIterationForStatement,
      yylstack["@$"],
      { bindings: [$2], iteratee: $4, body: $5 },
    );
    return $$;
  },

  "collectionIterationForStatement -> for forIndexBinding in expression blockStatement"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["forIndexBinding"],
    $4: TysonTypeDict["expression"],
    $5: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["collectionIterationForStatement"] {
    let $$: TysonTypeDict["collectionIterationForStatement"];
    $$ = yy.createNode(
      yy.NodeType.CollectionIterationForStatement,
      yylstack["@$"],
      { bindings: [$2], iteratee: $4, body: $5 },
    );
    return $$;
  },

  "collectionIterationForStatement -> for twoOrMoreForBindings in expression blockStatement"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["twoOrMoreForBindings"],
    $4: TysonTypeDict["expression"],
    $5: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["collectionIterationForStatement"] {
    let $$: TysonTypeDict["collectionIterationForStatement"];
    $$ = yy.createNode(
      yy.NodeType.CollectionIterationForStatement,
      yylstack["@$"],
      { bindings: $2, iteratee: $4, body: $5 },
    );
    return $$;
  },

  "twoOrMoreForBindings -> forBinding , forBinding"(
    $1: TysonTypeDict["forBinding"],
    $3: TysonTypeDict["forBinding"],
  ): TysonTypeDict["twoOrMoreForBindings"] {
    let $$: TysonTypeDict["twoOrMoreForBindings"];
    $$ = [$1, $3];
    return $$;
  },

  "twoOrMoreForBindings -> twoOrMoreForBindings , forBinding"(
    $1: TysonTypeDict["twoOrMoreForBindings"],
    $3: TysonTypeDict["forBinding"],
  ): TysonTypeDict["twoOrMoreForBindings"] {
    let $$: TysonTypeDict["twoOrMoreForBindings"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "rangeForStatement -> for forValueBinding in expression forRangeKeyword expression blockStatement"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["forValueBinding"],
    $4: TysonTypeDict["expression"],
    $5: TysonTypeDict["forRangeKeyword"],
    $6: TysonTypeDict["expression"],
    $7: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["rangeForStatement"] {
    let $$: TysonTypeDict["rangeForStatement"];
    $$ = yy.createNode(yy.NodeType.RangeForStatement, yylstack["@$"], {
      binding: $2,
      start: $4,
      rangeType: $5,
      end: $6,
      body: $7,
    });
    return $$;
  },

  "forRangeKeyword -> upuntil"(): TysonTypeDict["forRangeKeyword"] {
    let $$: TysonTypeDict["forRangeKeyword"];
    $$ = yy.ForStatementRangeType.UpUntil;
    return $$;
  },

  "forRangeKeyword -> upto"(): TysonTypeDict["forRangeKeyword"] {
    let $$: TysonTypeDict["forRangeKeyword"];
    $$ = yy.ForStatementRangeType.UpTo;
    return $$;
  },

  "forRangeKeyword -> downuntil"(): TysonTypeDict["forRangeKeyword"] {
    let $$: TysonTypeDict["forRangeKeyword"];
    $$ = yy.ForStatementRangeType.DownUntil;
    return $$;
  },

  "forRangeKeyword -> downto"(): TysonTypeDict["forRangeKeyword"] {
    let $$: TysonTypeDict["forRangeKeyword"];
    $$ = yy.ForStatementRangeType.DownTo;
    return $$;
  },

  "tryStatement -> try blockStatement oneOrMoreStatementCatchClauses"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["blockStatement"],
    $3: TysonTypeDict["oneOrMoreStatementCatchClauses"],
  ): TysonTypeDict["tryStatement"] {
    let $$: TysonTypeDict["tryStatement"];
    $$ = yy.createNode(yy.NodeType.TryStatement, yylstack["@$"], {
      body: $2,
      catchClauses: $3,
    });
    return $$;
  },

  "oneOrMoreStatementCatchClauses -> statementCatchClause"(
    $1: TysonTypeDict["statementCatchClause"],
  ): TysonTypeDict["oneOrMoreStatementCatchClauses"] {
    let $$: TysonTypeDict["oneOrMoreStatementCatchClauses"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreStatementCatchClauses -> oneOrMoreStatementCatchClauses statementCatchClause"(
    $1: TysonTypeDict["oneOrMoreStatementCatchClauses"],
    $2: TysonTypeDict["statementCatchClause"],
  ): TysonTypeDict["oneOrMoreStatementCatchClauses"] {
    let $$: TysonTypeDict["oneOrMoreStatementCatchClauses"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "statementCatchClause -> catch identifier : oneOrMorePipeSeparatedTypes blockStatement"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["identifier"],
    $4: TysonTypeDict["oneOrMorePipeSeparatedTypes"],
    $5: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["statementCatchClause"] {
    let $$: TysonTypeDict["statementCatchClause"];
    $$ = yy.createNode(yy.NodeType.StatementCatchClause, yylstack["@$"], {
      exceptionName: $2,
      exceptionTypes: $4,
      body: $5,
    });
    return $$;
  },

  "oneOrMorePipeSeparatedTypes -> type"(
    $1: TysonTypeDict["type"],
  ): TysonTypeDict["oneOrMorePipeSeparatedTypes"] {
    let $$: TysonTypeDict["oneOrMorePipeSeparatedTypes"];
    $$ = [$1];
    return $$;
  },

  "oneOrMorePipeSeparatedTypes -> oneOrMorePipeSeparatedTypes | type"(
    $1: TysonTypeDict["oneOrMorePipeSeparatedTypes"],
    $3: TysonTypeDict["type"],
  ): TysonTypeDict["oneOrMorePipeSeparatedTypes"] {
    let $$: TysonTypeDict["oneOrMorePipeSeparatedTypes"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "ifTypeGuardStatement -> if let oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockStatement optStatementElseIfClauses"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"],
    $5: TysonTypeDict["blockStatement"],
    $6: TysonTypeDict["optStatementElseIfClauses"],
  ): TysonTypeDict["ifTypeGuardStatement"] {
    let $$: TysonTypeDict["ifTypeGuardStatement"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardStatement, yylstack["@$"], {
      declarations: $3,
      body: $5,
      elseIfClauses: $6,
      elseBody: yy.option.none(),
    });
    return $$;
  },

  "ifTypeGuardStatement -> if let oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockStatement optStatementElseIfClauses statementElseClause"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"],
    $5: TysonTypeDict["blockStatement"],
    $6: TysonTypeDict["optStatementElseIfClauses"],
    $7: TysonTypeDict["statementElseClause"],
  ): TysonTypeDict["ifTypeGuardStatement"] {
    let $$: TysonTypeDict["ifTypeGuardStatement"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardStatement, yylstack["@$"], {
      declarations: $3,
      body: $5,
      elseIfClauses: $6,
      elseBody: yy.option.some($7),
    });
    return $$;
  },

  "ifTypeGuardStatement -> if let oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockStatement optStatementElseIfClauses"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"],
    $5: TysonTypeDict["blockStatement"],
    $6: TysonTypeDict["optStatementElseIfClauses"],
  ): TysonTypeDict["ifTypeGuardStatement"] {
    let $$: TysonTypeDict["ifTypeGuardStatement"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardStatement, yylstack["@$"], {
      declarations: $3,
      body: $5,
      elseIfClauses: $6,
      elseBody: yy.option.none(),
    });
    return $$;
  },

  "ifTypeGuardStatement -> if let oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockStatement optStatementElseIfClauses statementElseClause"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"],
    $5: TysonTypeDict["blockStatement"],
    $6: TysonTypeDict["optStatementElseIfClauses"],
    $7: TysonTypeDict["statementElseClause"],
  ): TysonTypeDict["ifTypeGuardStatement"] {
    let $$: TysonTypeDict["ifTypeGuardStatement"];
    $$ = yy.createNode(yy.NodeType.IfTypeGuardStatement, yylstack["@$"], {
      declarations: $3,
      body: $5,
      elseIfClauses: $6,
      elseBody: yy.option.some($7),
    });
    return $$;
  },

  "oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration -> nonInlineTypeGuardVariableDeclaration"(
    $1: TysonTypeDict["nonInlineTypeGuardVariableDeclaration"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration -> oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations , nonInlineTypeGuardVariableDeclaration"(
    $1: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"],
    $3: TysonTypeDict["nonInlineTypeGuardVariableDeclaration"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"];
    $$ = yy.concat($1, [$3]);
    return $$;
  },

  "oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration -> oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration , inlineTypeGuardVariableDeclaration"(
    $1: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"],
    $3: TysonTypeDict["inlineTypeGuardVariableDeclaration"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration -> oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration , nonInlineTypeGuardVariableDeclaration"(
    $1: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"],
    $3: TysonTypeDict["nonInlineTypeGuardVariableDeclaration"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "nonInlineTypeGuardVariableDeclaration -> nonInlineNullGuardVariableDeclaration"(
    $1: TysonTypeDict["nonInlineNullGuardVariableDeclaration"],
  ): TysonTypeDict["nonInlineTypeGuardVariableDeclaration"] {
    let $$: TysonTypeDict["nonInlineTypeGuardVariableDeclaration"];
    $$ = $1;
    return $$;
  },

  "nonInlineTypeGuardVariableDeclaration -> nonInlineInstanceofGuardVariableDeclaration"(
    $1: TysonTypeDict["nonInlineInstanceofGuardVariableDeclaration"],
  ): TysonTypeDict["nonInlineTypeGuardVariableDeclaration"] {
    let $$: TysonTypeDict["nonInlineTypeGuardVariableDeclaration"];
    $$ = $1;
    return $$;
  },

  "nonInlineNullGuardVariableDeclaration -> identifier = expressionOrAssignmentPseudex"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["identifier"],
    $3: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["nonInlineNullGuardVariableDeclaration"] {
    let $$: TysonTypeDict["nonInlineNullGuardVariableDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.NullGuardVariableDeclaration,
      yylstack["@$"],
      { isInline: false, name: $1, assignment: $3 },
    );
    return $$;
  },

  "nonInlineInstanceofGuardVariableDeclaration -> identifier : angleBracketlessType = expressionOrAssignmentPseudex"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["identifier"],
    $3: TysonTypeDict["angleBracketlessType"],
    $5: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["nonInlineInstanceofGuardVariableDeclaration"] {
    let $$: TysonTypeDict["nonInlineInstanceofGuardVariableDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.InstanceofGuardVariableDeclaration,
      yylstack["@$"],
      { name: $1, annotatedType: $3, assignment: $5 },
    );
    return $$;
  },

  "oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations -> inlineNullGuardVariableDeclaration"(
    $1: TysonTypeDict["inlineNullGuardVariableDeclaration"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations -> oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations , inlineNullGuardVariableDeclaration"(
    $1: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"],
    $3: TysonTypeDict["inlineNullGuardVariableDeclaration"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"];
    $$ = $1.concat($3);
    return $$;
  },

  "inlineTypeGuardVariableDeclaration -> inlineNullGuardVariableDeclaration"(
    $1: TysonTypeDict["inlineNullGuardVariableDeclaration"],
  ): TysonTypeDict["inlineTypeGuardVariableDeclaration"] {
    let $$: TysonTypeDict["inlineTypeGuardVariableDeclaration"];
    $$ = $1;
    return $$;
  },

  "inlineNullGuardVariableDeclaration -> inline identifier = expressionOrAssignmentPseudex"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["identifier"],
    $4: TysonTypeDict["expressionOrAssignmentPseudex"],
  ): TysonTypeDict["inlineNullGuardVariableDeclaration"] {
    let $$: TysonTypeDict["inlineNullGuardVariableDeclaration"];
    $$ = yy.createNode(
      yy.NodeType.NullGuardVariableDeclaration,
      yylstack["@$"],
      { isInline: true, name: $2, assignment: $4 },
    );
    return $$;
  },

  "whileTypeGuardStatement -> while let oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockStatement"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"],
    $5: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["whileTypeGuardStatement"] {
    let $$: TysonTypeDict["whileTypeGuardStatement"];
    $$ = yy.createNode(yy.NodeType.WhileTypeGuardStatement, yylstack["@$"], {
      declarations: $3,
      body: $5,
    });
    return $$;
  },

  "whileTypeGuardStatement -> while let oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration optTrailingComma blockStatement"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardVariableDeclarationsWithAtLeastOneNonInlineDeclaration"],
    $5: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["whileTypeGuardStatement"] {
    let $$: TysonTypeDict["whileTypeGuardStatement"];
    $$ = yy.createNode(yy.NodeType.WhileTypeGuardStatement, yylstack["@$"], {
      declarations: $3,
      body: $5,
    });
    return $$;
  },

  "expression -> assignableExpression"(
    $1: TysonTypeDict["assignableExpression"],
  ): TysonTypeDict["expression"] {
    let $$: TysonTypeDict["expression"];
    $$ = $1;
    return $$;
  },

  "expression -> nonassignableExpression"(
    $1: TysonTypeDict["nonassignableExpression"],
  ): TysonTypeDict["expression"] {
    let $$: TysonTypeDict["expression"];
    $$ = $1;
    return $$;
  },

  "assignableExpression -> identifier"(
    $1: TysonTypeDict["identifier"],
  ): TysonTypeDict["assignableExpression"] {
    let $$: TysonTypeDict["assignableExpression"];
    $$ = $1;
    return $$;
  },

  "assignableExpression -> # identifier"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["identifier"],
  ): TysonTypeDict["assignableExpression"] {
    let $$: TysonTypeDict["assignableExpression"];
    $$ = yy.createNode(yy.NodeType.ThisHashExpression, yylstack["@$"], {
      right: $2,
    });
    return $$;
  },

  "assignableExpression -> expression . identifier"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $3: TysonTypeDict["identifier"],
  ): TysonTypeDict["assignableExpression"] {
    let $$: TysonTypeDict["assignableExpression"];
    $$ = yy.createNode(yy.NodeType.DotExpression, yylstack["@$"], {
      left: $1,
      right: $3,
    });
    return $$;
  },

  "assignableExpression -> expression # identifier"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $3: TysonTypeDict["identifier"],
  ): TysonTypeDict["assignableExpression"] {
    let $$: TysonTypeDict["assignableExpression"];
    $$ = yy.createNode(yy.NodeType.HashExpression, yylstack["@$"], {
      left: $1,
      right: $3,
    });
    return $$;
  },

  "assignableExpression -> expression [ expression ]"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["assignableExpression"] {
    let $$: TysonTypeDict["assignableExpression"];
    $$ = yy.createNode(yy.NodeType.IndexExpression, yylstack["@$"], {
      collection: $1,
      index: $3,
    });
    return $$;
  },

  "nonassignableExpression -> literalExpression"(
    $1: TysonTypeDict["literalExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> methodInvocationExpression"(
    $1: TysonTypeDict["methodInvocationExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> castExpression"(
    $1: TysonTypeDict["castExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> anonymousInnerClassInstantiationExpression"(
    $1: TysonTypeDict["anonymousInnerClassInstantiationExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> lambdaExpression"(
    $1: TysonTypeDict["lambdaExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> rangeCheckExpression"(
    $1: TysonTypeDict["rangeCheckExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> instanceofExpression"(
    $1: TysonTypeDict["instanceofExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> notinstanceofExpression"(
    $1: TysonTypeDict["notinstanceofExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> postfixExpression"(
    $1: TysonTypeDict["postfixExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> prefixExpression"(
    $1: TysonTypeDict["prefixExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> infixExpression"(
    $1: TysonTypeDict["infixExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> ifExpression"(
    $1: TysonTypeDict["ifExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> switchExpression"(
    $1: TysonTypeDict["switchExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> ifInlineTypeGuardExpression"(
    $1: TysonTypeDict["ifInlineTypeGuardExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "nonassignableExpression -> parenthesizedExpression"(
    $1: TysonTypeDict["parenthesizedExpression"],
  ): TysonTypeDict["nonassignableExpression"] {
    let $$: TysonTypeDict["nonassignableExpression"];
    $$ = $1;
    return $$;
  },

  "literalExpression -> nullLiteral"(
    $1: TysonTypeDict["nullLiteral"],
  ): TysonTypeDict["literalExpression"] {
    let $$: TysonTypeDict["literalExpression"];
    $$ = $1;
    return $$;
  },

  "literalExpression -> trueLiteral"(
    $1: TysonTypeDict["trueLiteral"],
  ): TysonTypeDict["literalExpression"] {
    let $$: TysonTypeDict["literalExpression"];
    $$ = $1;
    return $$;
  },

  "literalExpression -> falseLiteral"(
    $1: TysonTypeDict["falseLiteral"],
  ): TysonTypeDict["literalExpression"] {
    let $$: TysonTypeDict["literalExpression"];
    $$ = $1;
    return $$;
  },

  "literalExpression -> numberLiteral"(
    $1: TysonTypeDict["numberLiteral"],
  ): TysonTypeDict["literalExpression"] {
    let $$: TysonTypeDict["literalExpression"];
    $$ = $1;
    return $$;
  },

  "literalExpression -> charLiteral"(
    $1: TysonTypeDict["charLiteral"],
  ): TysonTypeDict["literalExpression"] {
    let $$: TysonTypeDict["literalExpression"];
    $$ = $1;
    return $$;
  },

  "literalExpression -> stringLiteral"(
    $1: TysonTypeDict["stringLiteral"],
  ): TysonTypeDict["literalExpression"] {
    let $$: TysonTypeDict["literalExpression"];
    $$ = $1;
    return $$;
  },

  "literalExpression -> arrayLiteral"(
    $1: TysonTypeDict["arrayLiteral"],
  ): TysonTypeDict["literalExpression"] {
    let $$: TysonTypeDict["literalExpression"];
    $$ = $1;
    return $$;
  },

  "nullLiteral -> null"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["nullLiteral"] {
    let $$: TysonTypeDict["nullLiteral"];
    $$ = yy.createNode(yy.NodeType.LiteralExpression, yylstack["@$"], {
      literalType: yy.LiteralType.Null,
    });
    return $$;
  },

  "trueLiteral -> true"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["trueLiteral"] {
    let $$: TysonTypeDict["trueLiteral"];
    $$ = yy.createNode(yy.NodeType.LiteralExpression, yylstack["@$"], {
      literalType: yy.LiteralType.Boolean,
      value: true,
    });
    return $$;
  },

  "falseLiteral -> false"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["falseLiteral"] {
    let $$: TysonTypeDict["falseLiteral"];
    $$ = yy.createNode(yy.NodeType.LiteralExpression, yylstack["@$"], {
      literalType: yy.LiteralType.Boolean,
      value: false,
    });
    return $$;
  },

  "numberLiteral -> NUMBER_LITERAL"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["NUMBER_LITERAL"],
  ): TysonTypeDict["numberLiteral"] {
    let $$: TysonTypeDict["numberLiteral"];
    $$ = yy.createNode(yy.NodeType.LiteralExpression, yylstack["@$"], {
      literalType: yy.LiteralType.Number,
      source: $1,
    });
    return $$;
  },

  "charLiteral -> CHAR_LITERAL"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["CHAR_LITERAL"],
  ): TysonTypeDict["charLiteral"] {
    let $$: TysonTypeDict["charLiteral"];
    $$ = yy.createNode(yy.NodeType.LiteralExpression, yylstack["@$"], {
      literalType: yy.LiteralType.Character,
      source: $1,
    });
    return $$;
  },

  "stringLiteral -> STRING_LITERAL"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["STRING_LITERAL"],
  ): TysonTypeDict["stringLiteral"] {
    let $$: TysonTypeDict["stringLiteral"];
    $$ = yy.createNode(yy.NodeType.LiteralExpression, yylstack["@$"], {
      literalType: yy.LiteralType.String,
      source: $1,
    });
    return $$;
  },

  "arrayLiteral -> sequentialArrayLiteral"(
    $1: TysonTypeDict["sequentialArrayLiteral"],
  ): TysonTypeDict["arrayLiteral"] {
    let $$: TysonTypeDict["arrayLiteral"];
    $$ = $1;
    return $$;
  },

  "arrayLiteral -> defaultValueArrayLiteral"(
    $1: TysonTypeDict["defaultValueArrayLiteral"],
  ): TysonTypeDict["arrayLiteral"] {
    let $$: TysonTypeDict["arrayLiteral"];
    $$ = $1;
    return $$;
  },

  "arrayLiteral -> repeatingArrayLiteral"(
    $1: TysonTypeDict["repeatingArrayLiteral"],
  ): TysonTypeDict["arrayLiteral"] {
    let $$: TysonTypeDict["arrayLiteral"];
    $$ = $1;
    return $$;
  },

  "sequentialArrayLiteral -> [ ]"(yylstack: {
    "@$": TokenLocation;
  }): TysonTypeDict["sequentialArrayLiteral"] {
    let $$: TysonTypeDict["sequentialArrayLiteral"];
    $$ = yy.createNode(yy.NodeType.LiteralExpression, yylstack["@$"], {
      literalType: yy.LiteralType.Array,
      arrayType: yy.ArrayLiteralType.Sequential,
      elements: [],
    });
    return $$;
  },

  "sequentialArrayLiteral -> [ oneOrMoreCommaSeparatedExpressions optTrailingComma ]"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["oneOrMoreCommaSeparatedExpressions"],
  ): TysonTypeDict["sequentialArrayLiteral"] {
    let $$: TysonTypeDict["sequentialArrayLiteral"];
    $$ = yy.createNode(yy.NodeType.LiteralExpression, yylstack["@$"], {
      literalType: yy.LiteralType.Array,
      arrayType: yy.ArrayLiteralType.Sequential,
      elements: $2,
    });
    return $$;
  },

  "defaultValueArrayLiteral -> [ static defaultArrayValue ; oneOrMoreCommaSeparatedExpressions ]"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["defaultArrayValue"],
    $5: TysonTypeDict["oneOrMoreCommaSeparatedExpressions"],
  ): TysonTypeDict["defaultValueArrayLiteral"] {
    let $$: TysonTypeDict["defaultValueArrayLiteral"];
    $$ = yy.createNode(yy.NodeType.LiteralExpression, yylstack["@$"], {
      literalType: yy.LiteralType.Array,
      arrayType: yy.ArrayLiteralType.Default,
      fill: $3,
      dimensions: $5,
    });
    return $$;
  },

  "defaultArrayValue -> numberLiteral"(
    $1: TysonTypeDict["numberLiteral"],
  ): TysonTypeDict["defaultArrayValue"] {
    let $$: TysonTypeDict["defaultArrayValue"];
    $$ = $1;
    return $$;
  },

  "defaultArrayValue -> falseLiteral"(
    $1: TysonTypeDict["falseLiteral"],
  ): TysonTypeDict["defaultArrayValue"] {
    let $$: TysonTypeDict["defaultArrayValue"];
    $$ = $1;
    return $$;
  },

  "defaultArrayValue -> nullLiteral"(
    $1: TysonTypeDict["nullLiteral"],
  ): TysonTypeDict["defaultArrayValue"] {
    let $$: TysonTypeDict["defaultArrayValue"];
    $$ = $1;
    return $$;
  },

  "repeatingArrayLiteral -> [ expression ; static oneOrMoreCommaSeparatedNumberLiterals ]"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $5: TysonTypeDict["oneOrMoreCommaSeparatedNumberLiterals"],
  ): TysonTypeDict["repeatingArrayLiteral"] {
    let $$: TysonTypeDict["repeatingArrayLiteral"];
    $$ = yy.createNode(yy.NodeType.LiteralExpression, yylstack["@$"], {
      literalType: yy.LiteralType.Array,
      arrayType: yy.ArrayLiteralType.Repeating,
      fill: $2,
      dimensions: $5,
    });
    return $$;
  },

  "oneOrMoreCommaSeparatedNumberLiterals -> numberLiteral"(
    $1: TysonTypeDict["numberLiteral"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedNumberLiterals"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedNumberLiterals"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreCommaSeparatedNumberLiterals -> oneOrMoreCommaSeparatedNumberLiterals , numberLiteral"(
    $1: TysonTypeDict["oneOrMoreCommaSeparatedNumberLiterals"],
    $3: TysonTypeDict["numberLiteral"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedNumberLiterals"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedNumberLiterals"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "methodInvocationExpression -> methodInvocationExpressionWithUnlabeledActualParams"(
    $1: TysonTypeDict["methodInvocationExpressionWithUnlabeledActualParams"],
  ): TysonTypeDict["methodInvocationExpression"] {
    let $$: TysonTypeDict["methodInvocationExpression"];
    $$ = $1;
    return $$;
  },

  "methodInvocationExpression -> methodInvocationExpressionWithLabeledActualParams"(
    $1: TysonTypeDict["methodInvocationExpressionWithLabeledActualParams"],
  ): TysonTypeDict["methodInvocationExpression"] {
    let $$: TysonTypeDict["methodInvocationExpression"];
    $$ = $1;
    return $$;
  },

  "methodInvocationExpressionWithUnlabeledActualParams -> expression ( )"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
  ): TysonTypeDict["methodInvocationExpressionWithUnlabeledActualParams"] {
    let $$: TysonTypeDict["methodInvocationExpressionWithUnlabeledActualParams"];
    $$ = yy.createNode(yy.NodeType.MethodInvocationExpression, yylstack["@$"], {
      isLabeled: false,
      callee: $1,
      typeParams: [],
      params: [],
    });
    return $$;
  },

  "methodInvocationExpressionWithUnlabeledActualParams -> expression ( oneOrMoreCommaSeparatedExpressions optTrailingComma )"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $3: TysonTypeDict["oneOrMoreCommaSeparatedExpressions"],
  ): TysonTypeDict["methodInvocationExpressionWithUnlabeledActualParams"] {
    let $$: TysonTypeDict["methodInvocationExpressionWithUnlabeledActualParams"];
    $$ = yy.createNode(yy.NodeType.MethodInvocationExpression, yylstack["@$"], {
      isLabeled: false,
      callee: $1,
      typeParams: [],
      params: $3,
    });
    return $$;
  },

  "methodInvocationExpressionWithUnlabeledActualParams -> expression angleBracketEnclosedGenericMethodActualTypeParams ( )"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["angleBracketEnclosedGenericMethodActualTypeParams"],
  ): TysonTypeDict["methodInvocationExpressionWithUnlabeledActualParams"] {
    let $$: TysonTypeDict["methodInvocationExpressionWithUnlabeledActualParams"];
    $$ = yy.createNode(yy.NodeType.MethodInvocationExpression, yylstack["@$"], {
      isLabeled: false,
      callee: $1,
      typeParams: $2,
      params: [],
    });
    return $$;
  },

  "methodInvocationExpressionWithUnlabeledActualParams -> expression angleBracketEnclosedGenericMethodActualTypeParams ( oneOrMoreCommaSeparatedExpressions optTrailingComma )"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["angleBracketEnclosedGenericMethodActualTypeParams"],
    $4: TysonTypeDict["oneOrMoreCommaSeparatedExpressions"],
  ): TysonTypeDict["methodInvocationExpressionWithUnlabeledActualParams"] {
    let $$: TysonTypeDict["methodInvocationExpressionWithUnlabeledActualParams"];
    $$ = yy.createNode(yy.NodeType.MethodInvocationExpression, yylstack["@$"], {
      isLabeled: false,
      callee: $1,
      typeParams: $2,
      params: $4,
    });
    return $$;
  },

  "methodInvocationExpressionWithLabeledActualParams -> expression ( oneOrMoreLabeledActualMethodParams optTrailingComma )"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $3: TysonTypeDict["oneOrMoreLabeledActualMethodParams"],
  ): TysonTypeDict["methodInvocationExpressionWithLabeledActualParams"] {
    let $$: TysonTypeDict["methodInvocationExpressionWithLabeledActualParams"];
    $$ = yy.createNode(yy.NodeType.MethodInvocationExpression, yylstack["@$"], {
      isLabeled: true,
      callee: $1,
      typeParams: [],
      params: $3,
    });
    return $$;
  },

  "methodInvocationExpressionWithLabeledActualParams -> expression angleBracketEnclosedGenericMethodActualTypeParams ( oneOrMoreLabeledActualMethodParams optTrailingComma )"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["angleBracketEnclosedGenericMethodActualTypeParams"],
    $4: TysonTypeDict["oneOrMoreLabeledActualMethodParams"],
  ): TysonTypeDict["methodInvocationExpressionWithLabeledActualParams"] {
    let $$: TysonTypeDict["methodInvocationExpressionWithLabeledActualParams"];
    $$ = yy.createNode(yy.NodeType.MethodInvocationExpression, yylstack["@$"], {
      isLabeled: true,
      callee: $1,
      typeParams: $2,
      params: $4,
    });
    return $$;
  },

  "angleBracketEnclosedGenericMethodActualTypeParams -> GENERIC_METHOD_TYPE_PARAM_LIST_LEFT_ANGLE_BRACKET oneOrMoreCommaSeparatedTypes >"(
    $2: TysonTypeDict["oneOrMoreCommaSeparatedTypes"],
  ): TysonTypeDict["angleBracketEnclosedGenericMethodActualTypeParams"] {
    let $$: TysonTypeDict["angleBracketEnclosedGenericMethodActualTypeParams"];
    $$ = $2;
    return $$;
  },

  "oneOrMoreLabeledActualMethodParams -> labeledActualMethodParam"(
    $1: TysonTypeDict["labeledActualMethodParam"],
  ): TysonTypeDict["oneOrMoreLabeledActualMethodParams"] {
    let $$: TysonTypeDict["oneOrMoreLabeledActualMethodParams"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreLabeledActualMethodParams -> oneOrMoreLabeledActualMethodParams , labeledActualMethodParam"(
    $1: TysonTypeDict["oneOrMoreLabeledActualMethodParams"],
    $3: TysonTypeDict["labeledActualMethodParam"],
  ): TysonTypeDict["oneOrMoreLabeledActualMethodParams"] {
    let $$: TysonTypeDict["oneOrMoreLabeledActualMethodParams"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "labeledActualMethodParam -> identifier : expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["identifier"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["labeledActualMethodParam"] {
    let $$: TysonTypeDict["labeledActualMethodParam"];
    $$ = yy.createNode(yy.NodeType.LabeledActualParam, yylstack["@$"], {
      label: $1,
      value: $3,
    });
    return $$;
  },

  "castExpression -> expression as angleBracketlessType"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $3: TysonTypeDict["angleBracketlessType"],
  ): TysonTypeDict["castExpression"] {
    let $$: TysonTypeDict["castExpression"];
    $$ = yy.createNode(yy.NodeType.CastExpression, yylstack["@$"], {
      castee: $1,
      targetType: $3,
    });
    return $$;
  },

  "angleBracketlessType -> primitiveTypeLiteral"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["primitiveTypeLiteral"],
  ): TysonTypeDict["angleBracketlessType"] {
    let $$: TysonTypeDict["angleBracketlessType"];
    var identifier = yy.createNode(yy.NodeType.Identifier, yylstack["@$"], {
      source: $1,
    });
    $$ = yy.createNode(yy.NodeType.NiladicType, yylstack["@$"], {
      identifiers: [identifier],
    });

    return $$;
  },

  "angleBracketlessType -> oneOrMoreDotSeparatedIdentifiers"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
  ): TysonTypeDict["angleBracketlessType"] {
    let $$: TysonTypeDict["angleBracketlessType"];
    $$ = yy.createNode(yy.NodeType.NiladicType, yylstack["@$"], {
      identifiers: $1,
    });
    return $$;
  },

  "angleBracketlessType -> angleBracketlessType ?"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["angleBracketlessType"],
  ): TysonTypeDict["angleBracketlessType"] {
    let $$: TysonTypeDict["angleBracketlessType"];
    $$ = yy.createNode(yy.NodeType.NullableType, yylstack["@$"], {
      baseType: $1,
    });
    return $$;
  },

  "angleBracketlessType -> angleBracketlessType [ ]"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["angleBracketlessType"],
  ): TysonTypeDict["angleBracketlessType"] {
    let $$: TysonTypeDict["angleBracketlessType"];
    $$ = yy.createNode(yy.NodeType.ArrayType, yylstack["@$"], { baseType: $1 });
    return $$;
  },

  "anonymousInnerClassInstantiationExpression -> new anonymousInnerClassInstantiationType anonymousInnerClassBody"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["anonymousInnerClassInstantiationType"],
    $3: TysonTypeDict["anonymousInnerClassBody"],
  ): TysonTypeDict["anonymousInnerClassInstantiationExpression"] {
    let $$: TysonTypeDict["anonymousInnerClassInstantiationExpression"];
    $$ = yy.createNode(
      yy.NodeType.AnonymousInnerClassInstantiationExpression,
      yylstack["@$"],
      {
        instantiationType: $2,
        useStatements: $3.useStatements,
        items: $3.items,
      },
    );
    return $$;
  },

  "anonymousInnerClassInstantiationType -> oneOrMoreDotSeparatedIdentifiers optBracketedActualTypeParams"(
    yylstack: { "@$": TokenLocation; "@1": TokenLocation },

    $1: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
    $2: TysonTypeDict["optBracketedActualTypeParams"],
  ): TysonTypeDict["anonymousInnerClassInstantiationType"] {
    let $$: TysonTypeDict["anonymousInnerClassInstantiationType"];
    var niladic = yy.createNode(yy.NodeType.NiladicType, yylstack["@1"], {
      identifiers: $1,
    });
    if ($2.length === 0) {
      $$ = niladic;
    } else {
      $$ = yy.createNode(yy.NodeType.InstantiatedGenericType, yylstack["@$"], {
        baseType: niladic,
        actualParams: $2,
      });
    }

    return $$;
  },

  "anonymousInnerClassInstantiationType -> oneOrMoreDotSeparatedIdentifiers optBracketedActualTypeParams ?"(
    yylstack: { "@$": TokenLocation; "@1": TokenLocation; "@2": TokenLocation },

    $1: TysonTypeDict["oneOrMoreDotSeparatedIdentifiers"],
    $2: TysonTypeDict["optBracketedActualTypeParams"],
  ): TysonTypeDict["anonymousInnerClassInstantiationType"] {
    let $$: TysonTypeDict["anonymousInnerClassInstantiationType"];
    var niladic = yy.createNode(yy.NodeType.NiladicType, yylstack["@1"], {
      identifiers: $1,
    });
    var nullBase =
      $2.length === 0
        ? niladic
        : yy.createNode(
            yy.NodeType.InstantiatedGenericType,
            yy.mergeLocations(yylstack["@1"], yylstack["@2"]),
            { baseType: niladic, actualParams: $2 },
          );
    $$ = yy.createNode(yy.NodeType.NullableType, yylstack["@$"], {
      baseType: nullBase,
    });

    return $$;
  },

  "anonymousInnerClassBody -> { optUseStatements optAnonymousInnerClassItems }"(
    $2: TysonTypeDict["optUseStatements"],
    $3: TysonTypeDict["optAnonymousInnerClassItems"],
  ): TysonTypeDict["anonymousInnerClassBody"] {
    let $$: TysonTypeDict["anonymousInnerClassBody"];
    $$ = { useStatements: $2, items: $3 };
    return $$;
  },

  "optAnonymousInnerClassItems -> "(): TysonTypeDict["optAnonymousInnerClassItems"] {
    let $$: TysonTypeDict["optAnonymousInnerClassItems"];
    $$ = [];
    return $$;
  },

  "optAnonymousInnerClassItems -> optAnonymousInnerClassItems anonymousInnerClassItem"(
    $1: TysonTypeDict["optAnonymousInnerClassItems"],
    $2: TysonTypeDict["anonymousInnerClassItem"],
  ): TysonTypeDict["optAnonymousInnerClassItems"] {
    let $$: TysonTypeDict["optAnonymousInnerClassItems"];
    $$ = $1.concat([$2]);
    return $$;
  },

  "anonymousInnerClassItem -> identifier optVariableTypeAnnotation = expression ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["identifier"],
    $2: TysonTypeDict["optVariableTypeAnnotation"],
    $4: TysonTypeDict["expression"],
  ): TysonTypeDict["anonymousInnerClassItem"] {
    let $$: TysonTypeDict["anonymousInnerClassItem"];
    $$ = yy.createNode(
      yy.NodeType.AnonymousInnerClassPropertyDeclaration,
      yylstack["@$"],
      { name: $1, annotatedType: $2, initialValue: $4 },
    );
    return $$;
  },

  "anonymousInnerClassItem -> identifier optVariableTypeAnnotation = assignmentPseudex ;"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["identifier"],
    $2: TysonTypeDict["optVariableTypeAnnotation"],
    $4: TysonTypeDict["assignmentPseudex"],
  ): TysonTypeDict["anonymousInnerClassItem"] {
    let $$: TysonTypeDict["anonymousInnerClassItem"];
    $$ = yy.createNode(
      yy.NodeType.AnonymousInnerClassPropertyDeclaration,
      yylstack["@$"],
      { name: $1, annotatedType: $2, initialValue: $4 },
    );
    return $$;
  },

  "anonymousInnerClassItem -> blockStatement"(
    $1: TysonTypeDict["blockStatement"],
  ): TysonTypeDict["anonymousInnerClassItem"] {
    let $$: TysonTypeDict["anonymousInnerClassItem"];
    $$ = $1;
    return $$;
  },

  "anonymousInnerClassItem -> identifier parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["identifier"],
    $2: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $3: TysonTypeDict["optReturnTypeAnnotation"],
    $4: TysonTypeDict["optThrowsClause"],
    $5: TysonTypeDict["methodBody"],
  ): TysonTypeDict["anonymousInnerClassItem"] {
    let $$: TysonTypeDict["anonymousInnerClassItem"];
    $$ = yy.createNode(
      yy.NodeType.AnonymousInnerClassMethodDeclaration,
      yylstack["@$"],
      {
        doesOverride: false,
        name: $1,
        typeParams: [],
        params: $2,
        returnAnnotation: $3,
        thrownExceptions: $4,
        body: $5,
      },
    );

    return $$;
  },

  "anonymousInnerClassItem -> identifier angleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["identifier"],
    $2: TysonTypeDict["angleBracketEnclosedGenericMethodFormalTypeParams"],
    $3: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $4: TysonTypeDict["optReturnTypeAnnotation"],
    $5: TysonTypeDict["optThrowsClause"],
    $6: TysonTypeDict["methodBody"],
  ): TysonTypeDict["anonymousInnerClassItem"] {
    let $$: TysonTypeDict["anonymousInnerClassItem"];
    $$ = yy.createNode(
      yy.NodeType.AnonymousInnerClassMethodDeclaration,
      yylstack["@$"],
      {
        doesOverride: false,
        name: $1,
        typeParams: $2,
        params: $3,
        returnAnnotation: $4,
        thrownExceptions: $5,
        body: $6,
      },
    );

    return $$;
  },

  "anonymousInnerClassItem -> override identifier parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["identifier"],
    $3: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $4: TysonTypeDict["optReturnTypeAnnotation"],
    $5: TysonTypeDict["optThrowsClause"],
    $6: TysonTypeDict["methodBody"],
  ): TysonTypeDict["anonymousInnerClassItem"] {
    let $$: TysonTypeDict["anonymousInnerClassItem"];
    $$ = yy.createNode(
      yy.NodeType.AnonymousInnerClassMethodDeclaration,
      yylstack["@$"],
      {
        doesOverride: true,
        name: $2,
        typeParams: [],
        params: $3,
        returnAnnotation: $4,
        thrownExceptions: $5,
        body: $6,
      },
    );

    return $$;
  },

  "anonymousInnerClassItem -> override identifier angleBracketEnclosedGenericMethodFormalTypeParams parenthesizedFormalMethodParamDeclarations optReturnTypeAnnotation optThrowsClause methodBody"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["identifier"],
    $3: TysonTypeDict["angleBracketEnclosedGenericMethodFormalTypeParams"],
    $4: TysonTypeDict["parenthesizedFormalMethodParamDeclarations"],
    $5: TysonTypeDict["optReturnTypeAnnotation"],
    $6: TysonTypeDict["optThrowsClause"],
    $7: TysonTypeDict["methodBody"],
  ): TysonTypeDict["anonymousInnerClassItem"] {
    let $$: TysonTypeDict["anonymousInnerClassItem"];
    $$ = yy.createNode(
      yy.NodeType.AnonymousInnerClassMethodDeclaration,
      yylstack["@$"],
      {
        doesOverride: true,
        name: $2,
        typeParams: $3,
        params: $4,
        returnAnnotation: $5,
        thrownExceptions: $6,
        body: $7,
      },
    );

    return $$;
  },

  "lambdaExpression -> \\ oneOrMoreCommaSeparatedIdentifiers -> expression"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["oneOrMoreCommaSeparatedIdentifiers"],
    $4: TysonTypeDict["expression"],
  ): TysonTypeDict["lambdaExpression"] {
    let $$: TysonTypeDict["lambdaExpression"];
    $$ = yy.createNode(yy.NodeType.LambdaExpression, yylstack["@$"], {
      params: $2,
      body: $4,
    });
    return $$;
  },

  "lambdaExpression -> \\ oneOrMoreCommaSeparatedIdentifiers -> methodBody"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["oneOrMoreCommaSeparatedIdentifiers"],
    $4: TysonTypeDict["methodBody"],
  ): TysonTypeDict["lambdaExpression"] {
    let $$: TysonTypeDict["lambdaExpression"];
    $$ = yy.createNode(yy.NodeType.LambdaExpression, yylstack["@$"], {
      params: $2,
      body: $4,
    });
    return $$;
  },

  "oneOrMoreCommaSeparatedIdentifiers -> identifier"(
    $1: TysonTypeDict["identifier"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedIdentifiers"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedIdentifiers"];
    $$ = [$1];
    return $$;
  },

  "oneOrMoreCommaSeparatedIdentifiers -> oneOrMoreCommaSeparatedIdentifiers , identifier"(
    $1: TysonTypeDict["oneOrMoreCommaSeparatedIdentifiers"],
    $3: TysonTypeDict["identifier"],
  ): TysonTypeDict["oneOrMoreCommaSeparatedIdentifiers"] {
    let $$: TysonTypeDict["oneOrMoreCommaSeparatedIdentifiers"];
    $$ = $1.concat([$3]);
    return $$;
  },

  "rangeCheckExpression -> expression in expression ... expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $3: TysonTypeDict["expression"],
    $4: TysonTypeDict["..."],
    $5: TysonTypeDict["expression"],
  ): TysonTypeDict["rangeCheckExpression"] {
    let $$: TysonTypeDict["rangeCheckExpression"];
    $$ = yy.createNode(yy.NodeType.RangeCheckExpression, yylstack["@$"], {
      left: $1,
      lowerBound: $3,
      rangeType: yy.RangeCheckRangeType[$4],
      upperBound: $5,
    });
    return $$;
  },

  "rangeCheckExpression -> expression in expression ..= expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $3: TysonTypeDict["expression"],
    $4: TysonTypeDict["..="],
    $5: TysonTypeDict["expression"],
  ): TysonTypeDict["rangeCheckExpression"] {
    let $$: TysonTypeDict["rangeCheckExpression"];
    $$ = yy.createNode(yy.NodeType.RangeCheckExpression, yylstack["@$"], {
      left: $1,
      lowerBound: $3,
      rangeType: yy.RangeCheckRangeType[$4],
      upperBound: $5,
    });
    return $$;
  },

  "rangeCheckExpression -> expression in expression =.. expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $3: TysonTypeDict["expression"],
    $4: TysonTypeDict["=.."],
    $5: TysonTypeDict["expression"],
  ): TysonTypeDict["rangeCheckExpression"] {
    let $$: TysonTypeDict["rangeCheckExpression"];
    $$ = yy.createNode(yy.NodeType.RangeCheckExpression, yylstack["@$"], {
      left: $1,
      lowerBound: $3,
      rangeType: yy.RangeCheckRangeType[$4],
      upperBound: $5,
    });
    return $$;
  },

  "rangeCheckExpression -> expression in expression =.= expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $3: TysonTypeDict["expression"],
    $4: TysonTypeDict["=.="],
    $5: TysonTypeDict["expression"],
  ): TysonTypeDict["rangeCheckExpression"] {
    let $$: TysonTypeDict["rangeCheckExpression"];
    $$ = yy.createNode(yy.NodeType.RangeCheckExpression, yylstack["@$"], {
      left: $1,
      lowerBound: $3,
      rangeType: yy.RangeCheckRangeType[$4],
      upperBound: $5,
    });
    return $$;
  },

  "instanceofExpression -> expression instanceof angleBracketlessType"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $3: TysonTypeDict["angleBracketlessType"],
  ): TysonTypeDict["instanceofExpression"] {
    let $$: TysonTypeDict["instanceofExpression"];
    $$ = yy.createNode(yy.NodeType.InstanceofExpression, yylstack["@$"], {
      value: $1,
      comparedType: $3,
    });
    return $$;
  },

  "oneOrMoreSquareBracketPairs -> [ ]"(): TysonTypeDict["oneOrMoreSquareBracketPairs"] {
    let $$: TysonTypeDict["oneOrMoreSquareBracketPairs"];
    $$ = { pairCount: 1 };
    return $$;
  },

  "oneOrMoreSquareBracketPairs -> oneOrMoreSquareBracketPairs [ ]"(
    $1: TysonTypeDict["oneOrMoreSquareBracketPairs"],
  ): TysonTypeDict["oneOrMoreSquareBracketPairs"] {
    let $$: TysonTypeDict["oneOrMoreSquareBracketPairs"];
    $$ = { pairCount: $1.pairCount + 1 };
    return $$;
  },

  "notinstanceofExpression -> expression notinstanceof angleBracketlessType"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $3: TysonTypeDict["angleBracketlessType"],
  ): TysonTypeDict["notinstanceofExpression"] {
    let $$: TysonTypeDict["notinstanceofExpression"];
    $$ = yy.createNode(yy.NodeType.NotinstanceofExpression, yylstack["@$"], {
      value: $1,
      comparedType: $3,
    });
    return $$;
  },

  "postfixExpression -> expression !"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["!"],
  ): TysonTypeDict["postfixExpression"] {
    let $$: TysonTypeDict["postfixExpression"];
    $$ = yy.createNode(yy.NodeType.PostfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.PostfixOperatorType[$2],
    });
    return $$;
  },

  "postfixExpression -> expression ?"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["?"],
  ): TysonTypeDict["postfixExpression"] {
    let $$: TysonTypeDict["postfixExpression"];
    $$ = yy.createNode(yy.NodeType.PostfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.PostfixOperatorType[$2],
    });
    return $$;
  },

  "prefixExpression -> ! expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["!"],
    $2: TysonTypeDict["expression"],
  ): TysonTypeDict["prefixExpression"] {
    let $$: TysonTypeDict["prefixExpression"];
    $$ = yy.createNode(yy.NodeType.PrefixExpression, yylstack["@$"], {
      operator: yy.PrefixOperatorType[$1],
      right: $2,
    });
    return $$;
  },

  "prefixExpression -> - expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["-"],
    $2: TysonTypeDict["expression"],
  ): TysonTypeDict["prefixExpression"] {
    let $$: TysonTypeDict["prefixExpression"];
    $$ = yy.createNode(yy.NodeType.PrefixExpression, yylstack["@$"], {
      operator: yy.PrefixOperatorType[$1],
      right: $2,
    });
    return $$;
  },

  "infixExpression -> expression ** expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["**"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression * expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["*"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression / expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["/"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression % expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["%"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression + expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["+"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression - expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["-"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression < expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["<"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression <= expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["<="],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression > expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict[">"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression >= expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict[">="],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression ~< expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["~<"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression ~<= expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["~<="],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression ~> expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["~>"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression ~>= expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["~>="],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression == expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["=="],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression != expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["!="],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression ~= expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["~="],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression !~= expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["!~="],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression && expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["&&"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "infixExpression -> expression || expression"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDict["expression"],
    $2: TysonTypeDict["||"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["infixExpression"] {
    let $$: TysonTypeDict["infixExpression"];
    $$ = yy.createNode(yy.NodeType.InfixExpression, yylstack["@$"], {
      left: $1,
      operator: yy.InfixOperatorType[$2],
      right: $3,
    });
    return $$;
  },

  "blockExpression -> { optUseStatements expression }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["optUseStatements"],
    $3: TysonTypeDict["expression"],
  ): TysonTypeDict["blockExpression"] {
    let $$: TysonTypeDict["blockExpression"];
    $$ = yy.createNode(yy.NodeType.BlockExpression, yylstack["@$"], {
      useStatements: $2,
      conclusion: $3,
    });
    return $$;
  },

  "ifExpression -> if expression blockExpression else blockExpression"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $3: TysonTypeDict["blockExpression"],
    $5: TysonTypeDict["blockExpression"],
  ): TysonTypeDict["ifExpression"] {
    let $$: TysonTypeDict["ifExpression"];
    $$ = yy.createNode(yy.NodeType.IfExpression, yylstack["@$"], {
      condition: $2,
      body: $3,
      elseIfClauses: [],
      elseBody: $5,
    });
    return $$;
  },

  "ifExpression -> if expression blockExpression oneOrMoreExpressionElseIfClauses else blockExpression"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $3: TysonTypeDict["blockExpression"],
    $4: TysonTypeDict["oneOrMoreExpressionElseIfClauses"],
    $6: TysonTypeDict["blockExpression"],
  ): TysonTypeDict["ifExpression"] {
    let $$: TysonTypeDict["ifExpression"];
    $$ = yy.createNode(yy.NodeType.IfExpression, yylstack["@$"], {
      condition: $2,
      body: $3,
      elseIfClauses: $4,
      elseBody: $6,
    });
    return $$;
  },

  "switchExpression -> switch expression { else blockExpression }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $5: TysonTypeDict["blockExpression"],
  ): TysonTypeDict["switchExpression"] {
    let $$: TysonTypeDict["switchExpression"];
    $$ = yy.createNode(yy.NodeType.SwitchExpression, yylstack["@$"], {
      comparedExpression: $2,
      caseClauses: [],
      elseBody: $5,
    });
    return $$;
  },

  "switchExpression -> switch expression { oneOrMoreExpressionCaseClauses else blockExpression }"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
    $4: TysonTypeDict["oneOrMoreExpressionCaseClauses"],
    $6: TysonTypeDict["blockExpression"],
  ): TysonTypeDict["switchExpression"] {
    let $$: TysonTypeDict["switchExpression"];
    $$ = yy.createNode(yy.NodeType.SwitchExpression, yylstack["@$"], {
      comparedExpression: $2,
      caseClauses: $4,
      elseBody: $6,
    });
    return $$;
  },

  "ifInlineTypeGuardExpression -> if let oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockExpression else blockExpression"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"],
    $5: TysonTypeDict["blockExpression"],
    $7: TysonTypeDict["blockExpression"],
  ): TysonTypeDict["ifInlineTypeGuardExpression"] {
    let $$: TysonTypeDict["ifInlineTypeGuardExpression"];
    $$ = yy.createNode(
      yy.NodeType.IfInlineTypeGuardExpression,
      yylstack["@$"],
      { variableDeclarations: $3, body: $5, elseIfClauses: [], elseBody: $7 },
    );
    return $$;
  },

  "ifInlineTypeGuardExpression -> if let oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations optTrailingComma blockExpression oneOrMoreExpressionElseIfClauses else blockExpression"(
    yylstack: { "@$": TokenLocation },

    $3: TysonTypeDict["oneOrMoreCommaSeparatedTypeGuardInlineVariableDeclarations"],
    $5: TysonTypeDict["blockExpression"],
    $6: TysonTypeDict["oneOrMoreExpressionElseIfClauses"],
    $8: TysonTypeDict["blockExpression"],
  ): TysonTypeDict["ifInlineTypeGuardExpression"] {
    let $$: TysonTypeDict["ifInlineTypeGuardExpression"];
    $$ = yy.createNode(
      yy.NodeType.IfInlineTypeGuardExpression,
      yylstack["@$"],
      { variableDeclarations: $3, body: $5, elseIfClauses: $6, elseBody: $8 },
    );
    return $$;
  },

  "parenthesizedExpression -> ( expression )"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDict["expression"],
  ): TysonTypeDict["parenthesizedExpression"] {
    let $$: TysonTypeDict["parenthesizedExpression"];
    $$ = yy.createNode(yy.NodeType.ParenthesizedExpression, yylstack["@$"], {
      innerValue: $2,
    });
    return $$;
  },
};
