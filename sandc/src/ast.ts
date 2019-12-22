export enum NodeType {
  NumberLiteral = "NumberLiteral",
  StringLiteral = "StringLiteral",
  Identifier = "Identifier",

  BinaryExpr = "BinaryExpr",
  UnaryExpr = "UnaryExpr",
  DotExpr = "DotExpr",

  PropertyDeclaration = "PropertyDeclaration",
  MethodDeclaration = "MethodDeclaration",

  If = "If",
  FunctionCall = "FunctionCall",
  TypedObjectLiteral = "TypedObjectLiteral",
  ObjectEntry = "ObjectEntry",

  LocalVariableDeclaration = "LocalVariableDeclaration",
  Assignment = "Assignment",
  Return = "Return",

  File = "File",
  Class = "Class",

  ImpliedNullExpr = "ImpliedNullExpr",

  IfAlternative = "IfAlternative",
  Type = "Type",
  TypeArgDef = "TypeArgDef",
  ArgDef = "ArgDef",
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

export type Expr =
  | NumberLiteral
  | StringLiteral
  | Identifier
  | BinaryExpr
  | UnaryExpr
  | DotExpr
  | If
  | FunctionCall
  | TypedObjectLiteral;

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

export interface DotExpr {
  type: NodeType.DotExpr;
  left: Expr;
  right: string;
  location: NodeLocation;
}

export interface If {
  type: NodeType.If;
  condition: Expr;
  body: CompoundExpression;
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
  body: CompoundExpression;
  location: NodeLocation;
}

export interface Else {
  type: NodeType.IfAlternative;
  alternativeType: IfAlternativeType.Else;
  body: CompoundExpression;
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
  entries: ObjectEntry[];
  location: NodeLocation;
}

export interface ObjectEntry {
  type: NodeType.ObjectEntry;
  key: string;
  value: Expr;
  location: NodeLocation;
}

export interface Type {
  type: NodeType.Type;
  name: string;
  args: Type[];
  location: NodeLocation;
}

export interface TypeArgDef {
  type: NodeType.TypeArgDef;
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

export interface FileNode {
  type: NodeType.File;
  pubClass: PubClass;
  privClasses: PrivClass[];
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

export interface PrivClass extends Class {
  isPub: false;
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
  typeArgs: TypeArgDef[];
  args: ArgDef[];
  returnType: Type | null;
  body: CompoundExpression;
  location: NodeLocation;
}

export type CompoundExpression = (Expr | Statement)[];

export type Statement = LocalVariableDeclaration | Assignment | Return;

export interface ArgDef {
  type: NodeType.ArgDef;
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
