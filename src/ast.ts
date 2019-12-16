export enum NodeType {
  NumberLiteral = "NumberLiteral",
  StringLiteral = "StringLiteral",
  Identifier = "Identifier",

  BinaryExpr = "BinaryExpr",
  UnaryExpr = "UnaryExpr",

  PropertyDeclaration = "PropertyDeclaration",
  MethodDeclaration = "MethodDeclaration",

  If = "If",

  LocalVariableDeclaration = "LocalVariableDeclaration",
  Assignment = "Assignment",
  Return = "Return",

  File = "File",
  Class = "Class",

  ImpliedNullExpr = "ImpliedNullExpr",
}

export interface NodeLocation {
  firstLine: number;
  lastLine: number;
  firstColumn: number;
  lastColumn: number;
}

export interface JisonNodeLocation {
  first_line: number;
  last_line: number;
  first_column: number;
  last_column: number;
}

export function merge(
  start: JisonNodeLocation,
  end: JisonNodeLocation,
): JisonNodeLocation {
  return {
    first_line: start.first_line,
    first_column: start.first_column,
    last_line: end.last_line,
    last_column: end.last_column,
  };
}

export function camelCase(location: JisonNodeLocation): NodeLocation {
  return {
    firstLine: location.first_line,
    lastLine: location.last_line,
    firstColumn: location.first_column,
    lastColumn: location.last_column,
  };
}

export type Expr =
  | NumberLiteral
  | StringLiteral
  | Identifier
  | BinaryExpr
  | UnaryExpr;

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
  value: string;
  location: NodeLocation;
}

export interface BinaryExpr {
  type: NodeType.BinaryExpr;
  operation: BinaryOperation;
  left: Expr;
  right: Expr;
  location: NodeLocation;
}

export type BinaryOperation =
  | "."
  | "["
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
  | "&&"
  | "||";

export interface UnaryExpr {
  type: NodeType.UnaryExpr;
  operation: UnaryOperation;
  right: Expr;
  location: NodeLocation;
}

export type UnaryOperation = "-" | "!";

export enum IfAlternativeType {
  ElseIf = "ElseIf",
  Else = "Else",
}

export interface Type {
  name: string;
  args: Type[];
  location: NodeLocation;
}

export interface TypeArgDef {
  name: string;
  constraint: TypeConstraint;
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

export interface File {
  type: NodeType.File;
  pubClass: Class;
  location: NodeLocation;
}

export interface Class {
  type: NodeType.Class;
  isPub: boolean;
  name: string;
  typeArgDefs: TypeArgDef[];
  superClass: Type | null;
  items: ClassItem[];
  location: NodeLocation;
}

export interface PubClass extends Class {
  isPub: true;
}

export enum ConstraintType {
  None = "None",
  Extends = "Extends",
  // Super = "Super",
}

export type ClassItem = PropertyDeclaration | MethodDeclaration;

export interface PropertyDeclaration {
  type: NodeType.PropertyDeclaration;
  accessModifier: OptAccessModifier;
  name: string;
  valueType: Type;
  location: NodeLocation;
}

export interface MethodDeclaration {
  type: NodeType.MethodDeclaration;
  accessModifier: OptAccessModifier;
  name: string;
  args: ArgDef[];
  returnType: Type;
  body: CompoundExpression;
  location: NodeLocation;
}

export type CompoundExpression = (Expr | Statement)[];

export type Statement = LocalVariableDeclaration | Assignment | Return;

export interface ArgDef {
  name: string;
  valueType: Type;
  location: NodeLocation;
}

export type OptAccessModifier = null | "pub" | "prot";

export interface ImpliedNullExpr {
  type: NodeType.ImpliedNullExpr;
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
  assignee: Expr;
  value: Expr;
  location: NodeLocation;
}

export interface Return {
  type: NodeType.Return;
  value: null | Expr;
  location: NodeLocation;
}
