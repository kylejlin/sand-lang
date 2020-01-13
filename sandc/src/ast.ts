import { TextRange } from "./textPosition";

export type Node =
  | FileNode
  | Import
  | Use
  | StaticMethodCopy
  | StaticMethodCopySignature
  | Class
  | ClassItem
  | TypeArgDef
  | Type
  | InstantiationRestriction
  | TypedArgDef
  | CompoundNode
  | Expr
  | Statement
  | IfAlternative
  | Catch
  | ObjectCopy
  | ObjectEntry
  | UntypedArgDef
  | Binding;

export enum NodeType {
  Import = "Import",
  Use = "Use",
  StaticMethodCopy = "StaticMethodCopy",
  StaticMethodCopySignature = "StaticMethodCopySignature",

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
  Do = "Do",
  Try = "Try",
  FunctionCall = "FunctionCall",
  TypedObjectLiteral = "TypedObjectLiteral",
  ObjectCopy = "ObjectCopy",
  ObjectEntry = "ObjectEntry",
  ArrayLiteral = "ArrayLiteral",
  RangeLiteral = "RangeLiteral",
  MagicFunctionLiteral = "MagicFunctionLiteral",

  LocalVariableDeclaration = "LocalVariableDeclaration",
  Assignment = "Assignment",
  Return = "Return",
  Break = "Break",
  Continue = "Continue",
  Throw = "Throw",

  While = "While",
  Loop = "Loop",
  Repeat = "Repeat",
  For = "For",

  SingleBinding = "SingleBinding",
  FlatTupleBinding = "FlatTupleBinding",

  File = "File",
  Class = "Class",

  IfAlternative = "IfAlternative",
  Catch = "Catch",

  Type = "Type",
  TypeArgDef = "TypeArgDef",
  TypedArgDef = "TypedArgDef",
  UntypedArgDef = "UntypedArgDef",

  CompoundNode = "CompoundNode",
}

export interface FileNode {
  type: NodeType.File;
  packageName: string | null;
  imports: Import[];
  useStatements: Use[];
  pubClass: PubClass;
  privClasses: PrivClass[];
  location: TextRange;
}

export interface Import {
  type: NodeType.Import;
  name: string;
  /** May become `string | null` in the future. */
  alias: null;
  location: TextRange;
}

export interface Use {
  type: NodeType.Use;
  name: string;
  alias: string | null;
  doesShadow: boolean;
  location: TextRange;
}

export interface Class {
  type: NodeType.Class;
  isPub: boolean;
  overridability: Overridability;
  name: string;
  typeArgDefs: TypeArgDef[];
  superClass: Type | null;
  copies: StaticMethodCopy[];
  useStatements: Use[];
  items: ClassItem[];
  location: TextRange;
}

export interface PubClass extends Class {
  isPub: true;
}

export interface PrivClass extends Class {
  isPub: false;
}

export enum Overridability {
  Final = "Final",
  Open = "Open",
  Abstract = "Abstract",
}

export interface TypeArgDef {
  type: NodeType.TypeArgDef;
  name: string;
  constraint: TypeConstraint;
  location: TextRange;
}

export type TypeConstraint = NoConstraint | ExtendsConstraint;

export enum ConstraintType {
  None = "None",
  Extends = "Extends",
  // Super = "Super",
}

export interface NoConstraint {
  constraintType: ConstraintType.None;
}

export interface ExtendsConstraint {
  constraintType: ConstraintType.Extends;
  superType: Type;
}

export interface Type {
  type: NodeType.Type;
  name: string;
  args: Type[];
  location: TextRange;
}

export interface StaticMethodCopy {
  type: NodeType.StaticMethodCopy;
  accessModifier: OptAccessModifier;
  name: string;
  signature: StaticMethodCopySignature | null;
  alias: string | null;
  location: TextRange;
}

export interface StaticMethodCopySignature {
  type: NodeType.StaticMethodCopySignature;
  typeArgs: TypeArgDef[];
  argTypes: Type[];
  location: TextRange;
}

export type OptAccessModifier = null | "pub" | "prot";

export type ClassItem =
  | InstantiationRestriction
  | InstancePropertyDeclaration
  | StaticPropertyDeclaration
  | ConcreteMethodDeclaration
  | AbstractMethodDeclaration;

export interface InstantiationRestriction {
  type: NodeType.InstantiationRestriction;
  level: "pub" | "prot";
  location: TextRange;
}

export interface InstancePropertyDeclaration {
  type: NodeType.InstancePropertyDeclaration;
  accessModifier: OptAccessModifier;
  isReassignable: boolean;
  name: string;
  valueType: Type;
  location: TextRange;
}

export interface StaticPropertyDeclaration {
  type: NodeType.StaticPropertyDeclaration;
  accessModifier: OptAccessModifier;
  isReassignable: boolean;
  name: string;
  valueType: Type | null;
  initialValue: Expr;
  location: TextRange;
}

export interface ConcreteMethodDeclaration {
  type: NodeType.ConcreteMethodDeclaration;
  accessModifier: OptAccessModifier;
  isStatic: boolean;
  isOpen: boolean;
  isOverride: boolean;
  name: string;
  typeArgs: TypeArgDef[];
  args: TypedArgDef[];
  returnType: Type | null;
  body: CompoundNode;
  location: TextRange;
}

export interface StaticMethodDeclaration extends ConcreteMethodDeclaration {
  isStatic: true;
}

export interface ConcreteInstanceMethodDeclaration
  extends ConcreteMethodDeclaration {
  isStatic: false;
}

export interface AbstractMethodDeclaration {
  type: NodeType.AbstractMethodDeclaration;
  accessModifier: OptAccessModifier;
  isStatic: boolean;
  name: string;
  typeArgs: TypeArgDef[];
  args: TypedArgDef[];
  returnType: Type | null;
  location: TextRange;
}

export interface TypedArgDef {
  type: NodeType.TypedArgDef;
  name: string;
  valueType: Type;
  location: TextRange;
}

export interface CompoundNode {
  type: NodeType.CompoundNode;
  useStatements: Use[];
  nodes: (Expr | Statement)[];
  definitelyDoesNotEndWithSemicolon: boolean;
  location: TextRange;
}

export type Expr =
  | NumberLiteral
  | StringLiteral
  | CharacterLiteral
  | Identifier
  | InfixExpr
  | PrefixExpr
  | DotExpr
  | IndexExpr
  | CastExpr
  | If
  | Do
  | FunctionCall
  | TypedObjectLiteral
  | ArrayLiteral
  | RangeLiteral
  | MagicFunctionLiteral;

export type Statement =
  | LocalVariableDeclaration
  | Assignment
  | Return
  | Break
  | Continue
  | Throw
  | If
  | Do
  | Try
  | While
  | Loop
  | Repeat
  | For;

export interface NumberLiteral {
  type: NodeType.NumberLiteral;
  value: string;
  location: TextRange;
}

export interface StringLiteral {
  type: NodeType.StringLiteral;
  value: string;
  location: TextRange;
}

export interface CharacterLiteral {
  type: NodeType.CharacterLiteral;
  value: string;
  location: TextRange;
}

export interface Identifier {
  type: NodeType.Identifier;
  name: string;
  location: TextRange;
}

export interface InfixExpr {
  type: NodeType.InfixExpr;
  operation: InfixOperation;
  left: Expr;
  right: Expr;
  location: TextRange;
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
  location: TextRange;
}

export type PrefixOperation = "-" | "!" | "~";

export interface DotExpr {
  type: NodeType.DotExpr;
  left: Expr;
  right: string;
  location: TextRange;
}

export interface IndexExpr {
  type: NodeType.IndexExpr;
  left: Expr;
  right: Expr;
  location: TextRange;
}

export interface CastExpr {
  type: NodeType.CastExpr;
  value: Expr;
  targetType: Type;
  location: TextRange;
}

export interface If {
  type: NodeType.If;
  condition: Expr;
  body: CompoundNode;
  alternatives: IfAlternative[];
  location: TextRange;
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
  location: TextRange;
}

export interface Else {
  type: NodeType.IfAlternative;
  alternativeType: IfAlternativeType.Else;
  body: CompoundNode;
  location: TextRange;
}

export interface Do {
  type: NodeType.Do;
  body: CompoundNode;
  location: TextRange;
}

export interface FunctionCall {
  type: NodeType.FunctionCall;
  callee: Expr;
  typeArgs: Type[];
  args: Expr[];
  location: TextRange;
}

export interface TypedObjectLiteral {
  type: NodeType.TypedObjectLiteral;
  valueType: Type;
  copies: ObjectCopy[];
  entries: ObjectEntry[];
  location: TextRange;
}

export interface ObjectCopy {
  type: NodeType.ObjectCopy;
  source: Expr;
  location: TextRange;
}

export interface ObjectEntry {
  type: NodeType.ObjectEntry;
  key: string;
  value: Expr | null;
  location: TextRange;
}

export interface ArrayLiteral {
  type: NodeType.ArrayLiteral;
  elements: Expr[];
  location: TextRange;
}

export interface RangeLiteral {
  type: NodeType.RangeLiteral;
  start: Expr;
  end: Expr;
  includesEnd: boolean;
  location: TextRange;
}

export interface MagicFunctionLiteral {
  type: NodeType.MagicFunctionLiteral;
  args: UntypedArgDef[];
  body: Expr | CompoundNode;
  location: TextRange;
}

export interface UntypedArgDef {
  type: NodeType.UntypedArgDef;
  name: string;
  location: TextRange;
}

export interface LocalVariableDeclaration {
  type: NodeType.LocalVariableDeclaration;
  isReassignable: boolean;
  doesShadow: boolean;
  name: string;
  initialValue: Expr;
  valueType: null | Type;
  location: TextRange;
}

export interface Assignment {
  type: NodeType.Assignment;
  assignmentType: AssignmentType;
  assignee: Expr;
  value: Expr;
  location: TextRange;
}

export type AssignmentType = "=" | "**=" | "*=" | "/=" | "%=" | "+=" | "-=";

export interface Return {
  type: NodeType.Return;
  value: null | Expr;
  location: TextRange;
}

export interface Break {
  type: NodeType.Break;
  /** May one day become `Expr | null`. */
  value: null;
  location: TextRange;
}

export interface Continue {
  type: NodeType.Continue;
  location: TextRange;
}

export interface Throw {
  type: NodeType.Throw;
  value: Expr;
  location: TextRange;
}

export interface Try {
  type: NodeType.Try;
  body: CompoundNode;
  catches: Catch[];
  location: TextRange;
}

export type Catch = BoundCatch | RestrictedBindinglessCatch | CatchAll;

export enum CatchType {
  BoundCatch = "BoundCatch",
  RestrictedBindinglessCatch = "RestrictedBindinglessCatch",
  CatchAll = "CatchAll",
}

export interface BoundCatch {
  type: NodeType.Catch;
  catchType: CatchType.BoundCatch;
  arg: TypedArgDef;
  body: CompoundNode;
  location: TextRange;
}

export interface RestrictedBindinglessCatch {
  type: NodeType.Catch;
  catchType: CatchType.RestrictedBindinglessCatch;
  caughtTypes: Type[];
  body: CompoundNode;
  location: TextRange;
}

export interface CatchAll {
  type: NodeType.Catch;
  catchType: CatchType.CatchAll;
  body: CompoundNode;
  location: TextRange;
}

export interface While {
  type: NodeType.While;
  condition: Expr;
  body: CompoundNode;
  location: TextRange;
}

export interface Loop {
  type: NodeType.Loop;
  body: CompoundNode;
  location: TextRange;
}

export interface Repeat {
  type: NodeType.Repeat;
  repetitions: Expr;
  body: CompoundNode;
  location: TextRange;
}

export interface For {
  type: NodeType.For;
  binding: Binding;
  iteratee: Expr;
  body: CompoundNode;
  location: TextRange;
}

export type Binding = SingleBinding | FlatTupleBinding;

export interface SingleBinding {
  type: NodeType.SingleBinding;
  name: string;
  location: TextRange;
}

export interface FlatTupleBinding {
  type: NodeType.FlatTupleBinding;
  bindings: SingleBinding[];
  location: TextRange;
}

export function isStatement(node: Node): node is Statement {
  switch (node.type) {
    case NodeType.Return:
    case NodeType.Break:
    case NodeType.Continue:
    case NodeType.LocalVariableDeclaration:
    case NodeType.Assignment:
    case NodeType.Throw:
    case NodeType.If:
    case NodeType.Do:
    case NodeType.While:
    case NodeType.Loop:
    case NodeType.Repeat:
    case NodeType.For:
    case NodeType.Try: {
      // Hack to get type checker to verify exhaustiveness
      const _: Statement = node;

      return true;
    }

    default: {
      // Hack to get type checker to verify exhaustiveness
      const _: Exclude<Node, Statement> = node;

      return false;
    }
  }
}
