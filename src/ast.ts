export enum NodeType {
  NumberLiteral = "NumberLiteral",
  StringLiteral = "StringLiteral",
  Identifier = "Identifier",

  BinaryExpr = "BinaryExpr",
  UnaryExpr = "UnaryExpr",

  PropertyDeclaration = "PropertyDeclaration",
  MethodDeclaration = "MethodDeclaration",

  If = "If",

  File = "File",
  Class = "Class",
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
}

export interface StringLiteral {
  type: NodeType.StringLiteral;
  value: string;
}

export interface Identifier {
  type: NodeType.Identifier;
  value: string;
}

export interface BinaryExpr {
  type: NodeType.BinaryExpr;
  operation: BinaryOperation;
  left: Expr;
  right: Expr;
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
}

export type UnaryOperation = "-" | "!";

export enum IfAlternativeType {
  ElseIf = "ElseIf",
  Else = "Else",
}

export interface Type {
  name: string;
  args: Type[];
}

export interface TypeArg {
  name: string;
  constraint: TypeConstraint;
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
}

export interface Class {
  type: NodeType.Class;
  isPub: boolean;
  name: string;
  typeArgs: TypeArg;
  superClass: Type | null;
  items: ClassItem[];
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
}

export interface MethodDeclaration {
  type: NodeType.MethodDeclaration;
  accessModifier: OptAccessModifier;
  name: string;
  args: ArgDef[];
  returnType: Type;
  body: Expr[];
}

export interface ArgDef {
  name: string;
  valueType: Type;
}

export type OptAccessModifier = null | "pub" | "prot";
