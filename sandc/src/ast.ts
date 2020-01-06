import { JisonNodeLocation } from "./jison";

export enum NodeType {
  Import = "Import",
  Use = "Use",
  Copy = "Copy",

  NumberLiteral = "NumberLiteral",
  StringLiteral = "StringLiteral",
  CharacterLiteral = "CharacterLiteral",
  Identifier = "Identifier",

  InfixExpr = "InfixExpr",
  PrefixExpr = "PrefixExpr",
  DotExpr = "DotExpr",
  IndexExpr = "IndexExpr",
  CastExpr = "CastExpr",

  InstancePropertyDeclaration = "InstancePropertyDeclaration",
  StaticPropertyDeclaration = "StaticPropertyDeclaration",
  InstantiationRestriction = "InstantiationRestriction",
  ConcreteMethodDeclaration = "ConcreteMethodDeclaration",
  AbstractMethodDeclaration = "AbstractMethodDeclaration",

  If = "If",
  FunctionCall = "FunctionCall",
  TypedObjectLiteral = "TypedObjectLiteral",
  ObjectCopy = "ObjectCopy",
  ObjectEntry = "ObjectEntry",
  ArrayLiteral = "ArrayLiteral",
  RangeLiteral = "RangeLiteral",

  LocalVariableDeclaration = "LocalVariableDeclaration",
  Assignment = "Assignment",
  Return = "Return",
  Break = "Break",
  Continue = "Continue",

  File = "File",
  Class = "Class",

  ImpliedNullExpr = "ImpliedNullExpr",

  IfAlternative = "IfAlternative",
  Type = "Type",
  TypeArgDef = "TypeArgDef",
  ArgDef = "ArgDef",

  CompoundNode = "CompoundNode",
}

export interface NodeLocation {
  firstLine: number;
  lastLine: number;
  firstColumn: number;
  lastColumn: number;
}

export function merge(
  start: NodeLocation | JisonNodeLocation,
  end: NodeLocation | JisonNodeLocation,
): NodeLocation {
  const camelStart = camelCaseIfNeeded(start);
  const camelEnd = camelCaseIfNeeded(end);

  return {
    firstLine: camelStart.firstLine,
    firstColumn: camelStart.firstColumn,
    lastLine: camelEnd.lastLine,
    lastColumn: camelEnd.lastColumn,
  };
}

function camelCaseIfNeeded(
  location: NodeLocation | JisonNodeLocation,
): NodeLocation {
  return "first_line" in location ? camelCase(location) : location;
}

export function camelCase(location: JisonNodeLocation): NodeLocation {
  return {
    firstLine: location.first_line,
    lastLine: location.last_line,
    firstColumn: location.first_column,
    lastColumn: location.last_column,
  };
}

export interface FileNode {
  type: NodeType.File;
  packageName: string | null;
  imports: Import[];
  useStatements: Use[];
  pubClass: PubClass;
  privClasses: PrivClass[];
  location: NodeLocation;
}

export interface Import {
  type: NodeType.Import;
  name: string;
  /** May become `string | null` in the future. */
  alias: null;
  location: NodeLocation;
}

export interface Use {
  type: NodeType.Use;
  name: string;
  alias: string | null;
  doesShadow: boolean;
  location: NodeLocation;
}

export interface Copy {
  type: NodeType.Copy;
  name: string;
  alias: string | null;
  location: NodeLocation;
}

export interface Class {
  type: NodeType.Class;
  isPub: boolean;
  overridability: Overridability;
  name: string;
  typeArgDefs: TypeArgDef[];
  superClass: Type | null;
  copies: Copy[];
  useStatements: Use[];
  items: ClassItem[];
  location: NodeLocation;
}

export enum Overridability {
  Final = "Final",
  Open = "Open",
  Abstract = "Abstract",
}

export interface PubClass extends Class {
  isPub: true;
}

export interface PrivClass extends Class {
  isPub: false;
}

export type ClassItem =
  | InstancePropertyDeclaration
  | StaticPropertyDeclaration
  | InstantiationRestriction
  | ConcreteMethodDeclaration
  | AbstractMethodDeclaration;

export interface TypeArgDef {
  type: NodeType.TypeArgDef;
  name: string;
  constraint: TypeConstraint;
  location: NodeLocation;
}

export interface Type {
  type: NodeType.Type;
  name: string;
  args: Type[];
  location: NodeLocation;
}

export type TypeConstraint = NoConstraint | ExtendsConstraint;

export interface NoConstraint {
  constraintType: ConstraintType.None;
}

export interface ExtendsConstraint {
  constraintType: ConstraintType.Extends;
  superClass: Type;
}

export enum ConstraintType {
  None = "None",
  Extends = "Extends",
  // Super = "Super",
}

export type OptAccessModifier = null | "pub" | "prot";

export interface InstancePropertyDeclaration {
  type: NodeType.InstancePropertyDeclaration;
  accessModifier: OptAccessModifier;
  isReassignable: boolean;
  name: string;
  valueType: Type;
  location: NodeLocation;
}

export interface StaticPropertyDeclaration {
  type: NodeType.StaticPropertyDeclaration;
  accessModifier: OptAccessModifier;
  isReassignable: boolean;
  name: string;
  valueType: Type | null;
  initialValue: Expr;
  location: NodeLocation;
}

export interface InstantiationRestriction {
  type: NodeType.InstantiationRestriction;
  level: "pub" | "prot";
  location: NodeLocation;
}

export interface ConcreteMethodDeclaration {
  type: NodeType.ConcreteMethodDeclaration;
  accessModifier: OptAccessModifier;
  isStatic: boolean;
  isOpen: boolean;
  isOverride: boolean;
  name: string;
  typeArgs: TypeArgDef[];
  args: ArgDef[];
  returnType: Type | null;
  body: CompoundNode;
  location: NodeLocation;
}

export interface AbstractMethodDeclaration {
  type: NodeType.AbstractMethodDeclaration;
  accessModifier: OptAccessModifier;
  isStatic: boolean;
  name: string;
  typeArgs: TypeArgDef[];
  args: ArgDef[];
  returnType: Type | null;
  location: NodeLocation;
}

export interface ArgDef {
  type: NodeType.ArgDef;
  name: string;
  valueType: Type;
  location: NodeLocation;
}

export interface CompoundNode {
  type: NodeType.CompoundNode;
  useStatements: Use[];
  nodes: (Expr | Statement)[];
  location: NodeLocation;
}

export type Expr =
  | NumberLiteral
  | StringLiteral
  | Identifier
  | InfixExpr
  | PrefixExpr
  | DotExpr
  | IndexExpr
  | CastExpr
  | If
  | FunctionCall
  | TypedObjectLiteral
  | ArrayLiteral
  | RangeLiteral;

export type Statement =
  | Return
  | Break
  | Continue
  | LocalVariableDeclaration
  | Assignment;

export interface NumberLiteral {
  type: NodeType.NumberLiteral;
  value: string;
  location: NodeLocation;
}

export interface StringLiteral {
  type: NodeType.StringLiteral;
  value: string;
  location: NodeLocation;
}

export interface Identifier {
  type: NodeType.Identifier;
  name: string;
  location: NodeLocation;
}

export interface InfixExpr {
  type: NodeType.InfixExpr;
  operation: InfixOperation;
  left: Expr;
  right: Expr;
  location: NodeLocation;
}

export type InfixOperation =
  | "**"
  | "*"
  | "/"
  | "%"
  | "-"
  | "+"
  | "<"
  | "<="
  | ">"
  | ">="
  | "=="
  | "!="
  | "~="
  | "&&"
  | "||";

export interface PrefixExpr {
  type: NodeType.PrefixExpr;
  operation: PrefixOperation;
  right: Expr;
  location: NodeLocation;
}

export type PrefixOperation = "-" | "!" | "~";

export interface DotExpr {
  type: NodeType.DotExpr;
  left: Expr;
  right: string;
  location: NodeLocation;
}

export interface IndexExpr {
  type: NodeType.IndexExpr;
  left: Expr;
  right: Expr;
  location: NodeLocation;
}

export interface CastExpr {
  type: NodeType.CastExpr;
  value: Expr;
  targetType: Type;
  location: NodeLocation;
}

export interface If {
  type: NodeType.If;
  condition: Expr;
  body: CompoundNode;
  alternatives: IfAlternative[];
  location: NodeLocation;
}

export type IfAlternative = ElseIf | Else;

export enum IfAlternativeType {
  ElseIf = "ElseIf",
  Else = "Else",
}

export interface ElseIf {
  type: NodeType.IfAlternative;
  alternativeType: IfAlternativeType.ElseIf;
  condition: Expr;
  body: CompoundNode;
  location: NodeLocation;
}

export interface Else {
  type: NodeType.IfAlternative;
  alternativeType: IfAlternativeType.Else;
  body: CompoundNode;
  location: NodeLocation;
}

export interface FunctionCall {
  type: NodeType.FunctionCall;
  callee: Expr;
  typeArgs: Type[];
  args: Expr[];
  location: NodeLocation;
}

export interface TypedObjectLiteral {
  type: NodeType.TypedObjectLiteral;
  valueType: Type;
  copies: ObjectCopy[];
  entries: ObjectEntry[];
  location: NodeLocation;
}

export interface ObjectCopy {
  type: NodeType.ObjectCopy;
  source: Expr;
  location: NodeLocation;
}

export interface ObjectEntry {
  type: NodeType.ObjectEntry;
  key: string;
  value: Expr | null;
  location: NodeLocation;
}

export interface ArrayLiteral {
  type: NodeType.ArrayLiteral;
  elements: Expr[];
  location: NodeLocation;
}

export interface RangeLiteral {
  type: NodeType.RangeLiteral;
  start: Expr;
  end: Expr;
  includesEnd: boolean;
  location: NodeLocation;
}

export interface Return {
  type: NodeType.Return;
  value: null | Expr;
  location: NodeLocation;
}

export interface Break {
  type: NodeType.Break;
  /** May one day become `Expr | null`. */
  value: null;
  location: NodeLocation;
}

export interface Continue {
  type: NodeType.Continue;
  location: NodeLocation;
}

export interface LocalVariableDeclaration {
  type: NodeType.LocalVariableDeclaration;
  isReassignable: boolean;
  doesShadow: boolean;
  name: string;
  initialValue: Expr;
  valueType: null | Type;
  location: NodeLocation;
}

export interface Assignment {
  type: NodeType.Assignment;
  assignmentType: AssignmentType;
  assignee: Expr;
  value: Expr;
  location: NodeLocation;
}

export type AssignmentType = "=" | "**=" | "*=" | "/=" | "%=" | "+=" | "-=";

export interface ImpliedNullExpr {
  type: NodeType.ImpliedNullExpr;
}
