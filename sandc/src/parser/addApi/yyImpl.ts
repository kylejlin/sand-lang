import { option, Option } from "rusty-ts";
import { JisonSymbolLocation } from "../../jison";
import {
  convertToTextRange,
  convertToTextRangeIfNeeded,
  mergeRanges,
} from "../../textRange";
import { Merge, TextRange } from "../../types";
import * as ast from "../../types/ast";
import {
  DuplicatePropertyAccessorDeclarationsError,
  ParseErrorType,
} from "../../types/parser";
import { Yy } from "../../types/yy";
import wrapError from "../../wrapError";

interface YyImplPrivateFields {
  nodeIdCounter: number;

  getNodeId(): number;
}

const rawYyImpl: Yy & YyImplPrivateFields = {
  nodeIdCounter: 0,

  getNodeId,

  NodeType: ast.NodeType,
  ExtensibilityLevel: ast.ExtensibilityLevel,
  VisibilityLevel: ast.VisibilityLevel,
  PropertyVisibilityLevel: ast.PropertyVisibilityLevel,
  ForBindingType: ast.ForBindingType,
  IfPseudexType: ast.IfPseudexType,
  SwitchPseudexType: ast.SwitchPseudexType,
  ForStatementRangeType: ast.ForStatementRangeType,
  LiteralType: ast.LiteralType,
  ArrayLiteralType: ast.ArrayLiteralType,
  RangeCheckRangeType: ast.RangeCheckRangeType,
  PostfixOperatorType: ast.PostfixOperatorType,
  PrefixOperatorType: ast.PrefixOperatorType,
  InfixOperatorType: ast.InfixOperatorType,

  option,

  resetNodeIdCounter,
  createNode,
  merge,
  convertToPropertyVisibilityLevel,
  mergePropertyAccessorDeclarations,
  concat,
  mergeLocations: mergeRanges,
};

const yyImpl: Yy = rawYyImpl;

export default yyImpl;

function getNodeId(): number {
  const id = rawYyImpl.nodeIdCounter;
  rawYyImpl.nodeIdCounter++;
  return id;
}

function resetNodeIdCounter(): void {
  rawYyImpl.nodeIdCounter = 0;
}

function createNode(
  nodeType: ast.NodeType.NullableType | ast.NodeType.ArrayType,
  location: JisonSymbolLocation | TextRange,
  fields: {
    baseType: ast.AngleBracketlessType;
  },
): ast.AngleBracketlessType;

function createNode(
  nodeType: ast.NodeType.NullableType,
  location: JisonSymbolLocation | TextRange,
  fields: {
    baseType: ast.NiladicType | ast.InstantiatedGenericType;
  },
):
  | ast.NullableType<ast.NiladicType>
  | ast.NullableType<ast.InstantiatedGenericType>;

function createNode<T extends ast.NodeType, U extends ast.Node<T>>(
  nodeType: T,
  location: JisonSymbolLocation | TextRange,
  fields: Omit<U, "nodeType" | "location">,
): U;

function createNode<T extends ast.NodeType, U extends ast.Node<T>>(
  nodeType: T,
  location: JisonSymbolLocation | TextRange,
  fields: Omit<U, "nodeType" | "nodeId" | "location">,
): U {
  return ({
    ...fields,
    nodeType,
    nodeId: getNodeId(),
    location: convertToTextRangeIfNeeded(location),
  } as unknown) as U;
}

function merge<A, B>(a: A, b: B): Merge<A, B> {
  return { ...a, ...b } as Merge<A, B>;
}

function convertToPropertyVisibilityLevel(
  level: Option<ast.VisibilityLevel>,
): ast.PropertyVisibilityLevel {
  return level.match({
    none: () => ast.PropertyVisibilityLevel.Private,
    some: level => {
      switch (level) {
        case ast.VisibilityLevel.Private:
          return ast.PropertyVisibilityLevel.Private;
        case ast.VisibilityLevel.Protected:
          return ast.PropertyVisibilityLevel.Protected;
        case ast.VisibilityLevel.Public:
          return ast.PropertyVisibilityLevel.Public;
      }
    },
  });
}

function mergePropertyAccessorDeclarations(
  location: JisonSymbolLocation,
  pubAccessors: (
    | ast.PropertyGetterDeclaration
    | ast.PropertySetterDeclaration
  )[],
  protAccessors: (
    | ast.PropertyGetterDeclaration
    | ast.PropertySetterDeclaration
  )[],
  privAccessors: (
    | ast.PropertyGetterDeclaration
    | ast.PropertySetterDeclaration
  )[],
): ast.PropertyAccessorDeclarations {
  const accessors = pubAccessors.concat(protAccessors).concat(privAccessors);
  const getters = accessors.filter(isGetter);
  const setters = accessors.filter(isSetter);

  if (getters.length > 1) {
    throw wrapError(
      DuplicatePropertyAccessorDeclarationErrorImpl.fromDeclarations([
        getters[0],
        getters[1],
      ]),
    );
  }

  if (setters.length > 1) {
    throw wrapError(
      DuplicatePropertyAccessorDeclarationErrorImpl.fromDeclarations([
        setters[0],
        setters[1],
      ]),
    );
  }

  const getter = getters.length === 0 ? option.none() : option.some(getters[0]);
  const setter = setters.length === 0 ? option.none() : option.some(setters[0]);
  return {
    nodeType: ast.NodeType.PropertyAccessorDeclarations,
    location: convertToTextRange(location),
    nodeId: getNodeId(),
    getter,
    setter,
  };
}

function isGetter(
  getterOrSetter: ast.PropertyGetterDeclaration | ast.PropertySetterDeclaration,
): getterOrSetter is ast.PropertyGetterDeclaration {
  return getterOrSetter.nodeType === ast.NodeType.PropertyGetterDeclaration;
}

function isSetter(
  getterOrSetter: ast.PropertyGetterDeclaration | ast.PropertySetterDeclaration,
): getterOrSetter is ast.PropertySetterDeclaration {
  return getterOrSetter.nodeType === ast.NodeType.PropertySetterDeclaration;
}

class DuplicatePropertyAccessorDeclarationErrorImpl
  implements DuplicatePropertyAccessorDeclarationsError {
  public errorType: ParseErrorType.DuplicatePropertyAccessorDeclarations;
  public readonly declarations:
    | [ast.PropertyGetterDeclaration, ast.PropertyGetterDeclaration]
    | [ast.PropertySetterDeclaration, ast.PropertySetterDeclaration];

  public static fromDeclarations(
    declarations:
      | [ast.PropertyGetterDeclaration, ast.PropertyGetterDeclaration]
      | [ast.PropertySetterDeclaration, ast.PropertySetterDeclaration],
  ): DuplicatePropertyAccessorDeclarationsError {
    return new DuplicatePropertyAccessorDeclarationErrorImpl(declarations);
  }

  private constructor(
    declarations:
      | [ast.PropertyGetterDeclaration, ast.PropertyGetterDeclaration]
      | [ast.PropertySetterDeclaration, ast.PropertySetterDeclaration],
  ) {
    this.errorType = ParseErrorType.DuplicatePropertyAccessorDeclarations;
    this.declarations = declarations;
  }
}

function concat<A, B>(a: A[], b: B[]): (A | B)[] {
  return (a as (A | B)[]).concat(b);
}
