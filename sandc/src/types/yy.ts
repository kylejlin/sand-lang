import { Option } from "rusty-ts";
import { Merge, TextRange } from ".";
import { JisonSymbolLocation } from "../jison";
import {
  AngleBracketlessType,
  ArrayLiteralType,
  ExtensibilityLevel,
  ForBindingType,
  ForStatementRangeType,
  IfPseudexType,
  InfixOperatorType,
  InstantiatedGenericType,
  LiteralType,
  NiladicType,
  Node,
  NodeType,
  NullableType,
  PostfixOperatorType,
  PrefixOperatorType,
  PropertyAccessorDeclarations,
  PropertyVisibilityLevel,
  RangeCheckRangeType,
  SwitchPseudexType,
  VisibilityLevel,
} from "./ast";
import { PropertyAccessorDeclarationTuple } from "./tysonTypeDict";

export interface Yy {
  NodeType: typeof NodeType;
  ExtensibilityLevel: typeof ExtensibilityLevel;
  VisibilityLevel: typeof VisibilityLevel;
  PropertyVisibilityLevel: typeof PropertyVisibilityLevel;
  ForBindingType: typeof ForBindingType;
  IfPseudexType: typeof IfPseudexType;
  SwitchPseudexType: typeof SwitchPseudexType;
  ForStatementRangeType: typeof ForStatementRangeType;
  LiteralType: typeof LiteralType;
  ArrayLiteralType: typeof ArrayLiteralType;
  RangeCheckRangeType: typeof RangeCheckRangeType;
  PostfixOperatorType: typeof PostfixOperatorType;
  PrefixOperatorType: typeof PrefixOperatorType;
  InfixOperatorType: typeof InfixOperatorType;

  option: OptionFactory;

  resetNodeIdCounter(): void;

  createNode(
    nodeType: NodeType.NullableType | NodeType.ArrayType,
    location: JisonSymbolLocation | TextRange,
    fields: {
      baseType: AngleBracketlessType;
    },
  ): AngleBracketlessType;

  createNode(
    nodeType: NodeType.NullableType,
    location: JisonSymbolLocation | TextRange,
    fields: {
      baseType: NiladicType | InstantiatedGenericType;
    },
  ): NullableType<NiladicType> | NullableType<InstantiatedGenericType>;

  createNode<T extends NodeType, U extends Node<T>>(
    nodeType: T,
    location: JisonSymbolLocation | TextRange,
    fields: Omit<U, "nodeType" | "nodeId" | "location">,
  ): U;

  /**
   * Equivalent at runtime to `{ ...a, ...b }`.
   */
  merge<A, B>(a: A, b: B): Merge<A, B>;

  convertToPropertyVisibilityLevel(
    level: Option<VisibilityLevel>,
  ): PropertyVisibilityLevel;

  mergePropertyAccessorDeclarations(
    location: JisonSymbolLocation,
    pubAccessors: [] | PropertyAccessorDeclarationTuple,
    protAccessors: [] | PropertyAccessorDeclarationTuple,
    privAccessors: [] | PropertyAccessorDeclarationTuple,
  ): PropertyAccessorDeclarations;

  /**
   * Equivalent at runtime to `a.concat(b)`, but
   * this function can be called with arrays of different
   * types without causing a compile-time type error.
   */
  concat<A, B>(a: A[], b: B[]): (A | B)[];

  mergeLocations(
    start: JisonSymbolLocation,
    end: JisonSymbolLocation,
  ): TextRange;
}

interface OptionFactory {
  none<T = never>(): Option<T>;
  some<T>(unwrapped: T): Option<T>;
}
