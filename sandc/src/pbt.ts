import { NodeLocation } from "./ast";
import * as ast from "./ast";

export interface Ref {
  refId: RefId;
  /**
   * A Ref normally has exactly one source,
   * but in the case of method overloading,
   * it will have multiple, because each
   * method node is considered a source.
   */
  sourceNodeIds: NodeId<boolean, true>[];
  dependentNodeIds: NodeId<true, boolean>[];
  name: string;
}

export interface RefId {
  isRefId: true;
  value: number;
}

export interface NodeId<
  DependsOnRef extends boolean,
  EmitsRef extends boolean
> {
  isNodeId: true;
  isRefDependencyNodeId: DependsOnRef;
  isRefSourceNodeId: EmitsRef;
  value: number;
}

export type RefSource =
  | GlobalRefSource
  | (Node & { nodeId: NodeId<boolean, true>; outRefId: RefId });

export type RefDependency = Node & { nodeId: NodeId<true, boolean> };

export interface GlobalRefSource {
  type: NodeType.GlobalRefSource;
  name: string;
  outRefId: RefId;
}

export enum NodeType {
  GlobalRefSource = "GlobalRefSource",

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
  ArgDef = "ArgDef",
  UntypedArgDef = "UntypedArgDef",

  CompoundNode = "CompoundNode",
}

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
  | ArgDef
  | CompoundNode
  | Expr
  | Statement
  | IfAlternative
  | Catch
  | ObjectCopy
  | ObjectEntry
  | UntypedArgDef
  | Binding;

export interface FileNode {
  type: NodeType.File;
  nodeId: NodeId<false, false>;

  packageName: string | null;
  imports: Import[];
  useStatements: Use[];
  pubClass: PubClass;
  privClasses: PrivClass[];
  location: NodeLocation;
}

export interface Import {
  type: NodeType.Import;
  nodeId: NodeId<true, true>;

  name: string;
  /** May become `string | null` in the future. */
  alias: null;

  leftmostInRefId: RefId;
  outRefId: RefId;

  location: NodeLocation;
}

export interface Use {
  type: NodeType.Use;
  nodeId: NodeId<true, true>;

  name: string;
  alias: string | null;
  doesShadow: boolean;

  leftmostInRefId: RefId;
  outRefId: RefId;

  location: NodeLocation;
}

export interface StaticMethodCopy {
  type: NodeType.StaticMethodCopy;
  nodeId: NodeId<true, true>;

  accessModifier: OptAccessModifier;
  name: string;
  signature: StaticMethodCopySignature | null;
  alias: string | null;

  leftmostInRefId: RefId;
  outRefId: RefId;

  location: NodeLocation;
}

export interface StaticMethodCopySignature {
  type: NodeType.StaticMethodCopySignature;
  nodeId: NodeId<false, false>;

  typeArgs: TypeArgDef[];
  argTypes: Type[];
  location: NodeLocation;
}

export interface Class {
  type: NodeType.Class;
  nodeId: NodeId<false, true>;

  isPub: boolean;
  overridability: Overridability;
  name: string;
  typeArgDefs: TypeArgDef[];
  superClass: Type | null;
  copies: StaticMethodCopy[];
  useStatements: Use[];
  items: ClassItem[];

  outRefId: RefId;

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
  nodeId: NodeId<false, true>;

  name: string;
  constraint: TypeConstraint;

  outRefId: RefId;

  location: NodeLocation;
}

export interface Type {
  type: NodeType.Type;
  nodeId: NodeId<true, false>;

  name: string;
  args: Type[];

  inRefId: RefId;

  location: NodeLocation;
}

export type TypeConstraint = NoConstraint | ExtendsConstraint;

export interface NoConstraint {
  constraintType: ConstraintType.None;
}

export interface ExtendsConstraint {
  constraintType: ConstraintType.Extends;
  superType: Type;
}

export enum ConstraintType {
  None = "None",
  Extends = "Extends",
  // Super = "Super",
}

export type OptAccessModifier = null | "pub" | "prot";

export interface InstancePropertyDeclaration {
  type: NodeType.InstancePropertyDeclaration;
  nodeId: NodeId<false, true>;

  accessModifier: OptAccessModifier;
  isReassignable: boolean;
  name: string;
  valueType: Type;

  outRefId: RefId;

  location: NodeLocation;
}

export interface StaticPropertyDeclaration {
  type: NodeType.StaticPropertyDeclaration;
  nodeId: NodeId<false, true>;

  accessModifier: OptAccessModifier;
  isReassignable: boolean;
  name: string;
  valueType: Type | null;
  initialValue: Expr;

  outRefId: RefId;

  location: NodeLocation;
}

export interface InstantiationRestriction {
  type: NodeType.InstantiationRestriction;
  nodeId: NodeId<false, false>;

  level: "pub" | "prot";
  location: NodeLocation;
}

export interface ConcreteMethodDeclaration {
  type: NodeType.ConcreteMethodDeclaration;
  nodeId: NodeId<false, true>;

  accessModifier: OptAccessModifier;
  isStatic: boolean;
  isOpen: boolean;
  isOverride: boolean;
  name: string;
  typeArgs: TypeArgDef[];
  args: ArgDef[];
  returnType: Type | null;
  body: CompoundNode;

  outRefId: RefId;

  location: NodeLocation;
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
  nodeId: NodeId<false, true>;

  accessModifier: OptAccessModifier;
  isStatic: boolean;
  name: string;
  typeArgs: TypeArgDef[];
  args: ArgDef[];
  returnType: Type | null;

  outRefId: RefId;

  location: NodeLocation;
}

export interface ArgDef {
  type: NodeType.ArgDef;
  nodeId: NodeId<false, true>;

  name: string;
  valueType: Type;

  outRefId: RefId;

  location: NodeLocation;
}

export interface CompoundNode {
  type: NodeType.CompoundNode;
  nodeId: NodeId<false, false>;

  useStatements: Use[];
  nodes: (Expr | Statement)[];
  definitelyDoesNotEndWithSemicolon: boolean;
  location: NodeLocation;
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
  | Return
  | Break
  | Continue
  | LocalVariableDeclaration
  | Assignment
  | Throw
  | If
  | Do
  | While
  | Loop
  | Repeat
  | For
  | Try;

export interface NumberLiteral {
  type: NodeType.NumberLiteral;
  nodeId: NodeId<false, false>;

  value: string;
  location: NodeLocation;
}

export interface StringLiteral {
  type: NodeType.StringLiteral;
  nodeId: NodeId<false, false>;

  value: string;
  location: NodeLocation;
}

export interface CharacterLiteral {
  type: NodeType.CharacterLiteral;
  nodeId: NodeId<false, false>;

  value: string;
  location: NodeLocation;
}

export interface Identifier {
  type: NodeType.Identifier;
  nodeId: NodeId<true, false>;

  name: string;

  inRefId: RefId;

  location: NodeLocation;
}

export interface InfixExpr {
  type: NodeType.InfixExpr;
  nodeId: NodeId<false, false>;

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
  nodeId: NodeId<false, false>;

  operation: PrefixOperation;
  right: Expr;
  location: NodeLocation;
}

export type PrefixOperation = "-" | "!" | "~";

export interface DotExpr {
  type: NodeType.DotExpr;
  nodeId: NodeId<false, false>;

  left: Expr;
  right: string;
  location: NodeLocation;
}

export interface IndexExpr {
  type: NodeType.IndexExpr;
  nodeId: NodeId<false, false>;

  left: Expr;
  right: Expr;
  location: NodeLocation;
}

export interface CastExpr {
  type: NodeType.CastExpr;
  nodeId: NodeId<false, false>;

  value: Expr;
  targetType: Type;
  location: NodeLocation;
}

export interface If {
  type: NodeType.If;
  nodeId: NodeId<false, false>;

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
  nodeId: NodeId<false, false>;

  alternativeType: IfAlternativeType.ElseIf;
  condition: Expr;
  body: CompoundNode;
  location: NodeLocation;
}

export interface Else {
  type: NodeType.IfAlternative;
  nodeId: NodeId<false, false>;

  alternativeType: IfAlternativeType.Else;
  body: CompoundNode;
  location: NodeLocation;
}

export interface Do {
  type: NodeType.Do;
  nodeId: NodeId<false, false>;

  body: CompoundNode;
  location: NodeLocation;
}

export interface Try {
  type: NodeType.Try;
  nodeId: NodeId<false, false>;

  body: CompoundNode;
  catches: Catch[];
  location: NodeLocation;
}

export type Catch = BoundCatch | RestrictedBindinglessCatch | CatchAll;

export enum CatchType {
  BoundCatch = "BoundCatch",
  RestrictedBindinglessCatch = "RestrictedBindinglessCatch",
  CatchAll = "CatchAll",
}

export interface BoundCatch {
  type: NodeType.Catch;
  nodeId: NodeId<false, false>;

  catchType: CatchType.BoundCatch;
  arg: ArgDef;
  body: CompoundNode;
  location: NodeLocation;
}

export interface RestrictedBindinglessCatch {
  type: NodeType.Catch;
  nodeId: NodeId<false, false>;

  catchType: CatchType.RestrictedBindinglessCatch;
  caughtTypes: Type[];
  body: CompoundNode;
  location: NodeLocation;
}

export interface CatchAll {
  type: NodeType.Catch;
  nodeId: NodeId<false, false>;

  catchType: CatchType.CatchAll;
  body: CompoundNode;
  location: NodeLocation;
}

export interface FunctionCall {
  type: NodeType.FunctionCall;
  nodeId: NodeId<false, false>;

  callee: Expr;
  typeArgs: Type[];
  args: Expr[];
  location: NodeLocation;
}

export interface TypedObjectLiteral {
  type: NodeType.TypedObjectLiteral;
  nodeId: NodeId<false, false>;

  valueType: Type;
  copies: ObjectCopy[];
  entries: ObjectEntry[];
  location: NodeLocation;
}

export interface ObjectCopy {
  type: NodeType.ObjectCopy;
  nodeId: NodeId<false, false>;

  source: Expr;
  location: NodeLocation;
}

export interface ObjectEntry {
  type: NodeType.ObjectEntry;
  nodeId: NodeId<false, false>;

  key: string;
  value: Expr | null;
  location: NodeLocation;
}

export interface ArrayLiteral {
  type: NodeType.ArrayLiteral;
  nodeId: NodeId<false, false>;

  elements: Expr[];
  location: NodeLocation;
}

export interface RangeLiteral {
  type: NodeType.RangeLiteral;
  nodeId: NodeId<false, false>;

  start: Expr;
  end: Expr;
  includesEnd: boolean;
  location: NodeLocation;
}

export interface MagicFunctionLiteral {
  type: NodeType.MagicFunctionLiteral;
  nodeId: NodeId<false, false>;

  args: UntypedArgDef[];
  body: Expr | CompoundNode;
  location: NodeLocation;
}

export interface UntypedArgDef {
  type: NodeType.UntypedArgDef;
  nodeId: NodeId<false, true>;

  name: string;

  outRefId: RefId;

  location: NodeLocation;
}

export interface Return {
  type: NodeType.Return;
  nodeId: NodeId<false, false>;

  value: null | Expr;
  location: NodeLocation;
}

export interface Break {
  type: NodeType.Break;
  nodeId: NodeId<false, false>;

  /** May one day become `Expr | null`. */
  value: null;
  location: NodeLocation;
}

export interface Continue {
  type: NodeType.Continue;
  nodeId: NodeId<false, false>;

  location: NodeLocation;
}

export interface LocalVariableDeclaration {
  type: NodeType.LocalVariableDeclaration;
  nodeId: NodeId<false, true>;

  isReassignable: boolean;
  doesShadow: boolean;
  name: string;
  initialValue: Expr;
  valueType: null | Type;

  outRefId: RefId;

  location: NodeLocation;
}

export interface Assignment {
  type: NodeType.Assignment;
  nodeId: NodeId<false, false>;

  assignmentType: AssignmentType;
  assignee: Expr;
  value: Expr;
  location: NodeLocation;
}

export type AssignmentType = "=" | "**=" | "*=" | "/=" | "%=" | "+=" | "-=";

export interface Throw {
  type: NodeType.Throw;
  nodeId: NodeId<false, false>;

  value: Expr;
  location: NodeLocation;
}

export interface While {
  type: NodeType.While;
  nodeId: NodeId<false, false>;

  condition: Expr;
  body: CompoundNode;
  location: NodeLocation;
}

export interface Loop {
  type: NodeType.Loop;
  nodeId: NodeId<false, false>;

  body: CompoundNode;
  location: NodeLocation;
}

export interface Repeat {
  type: NodeType.Repeat;
  nodeId: NodeId<false, false>;

  repetitions: Expr;
  body: CompoundNode;
  location: NodeLocation;
}

export interface For {
  type: NodeType.For;
  nodeId: NodeId<false, false>;

  binding: Binding;
  iteratee: Expr;
  body: CompoundNode;
  location: NodeLocation;
}

export type Binding = SingleBinding | FlatTupleBinding;

export interface SingleBinding {
  type: NodeType.SingleBinding;
  nodeId: NodeId<false, true>;

  name: string;

  outRefId: RefId;

  location: NodeLocation;
}

export interface FlatTupleBinding {
  type: NodeType.FlatTupleBinding;
  nodeId: NodeId<false, false>;

  bindings: SingleBinding[];
  location: NodeLocation;
}

export type Bound<T extends ast.Node> = T extends ast.FileNode
  ? FileNode
  : T extends ast.Import
  ? Import
  : T extends ast.Use
  ? Use
  : T extends ast.StaticMethodCopy
  ? StaticMethodCopy
  : T extends ast.StaticMethodCopySignature
  ? StaticMethodCopySignature
  : T extends ast.Class
  ? Class
  : T extends ast.TypeArgDef
  ? TypeArgDef
  : T extends ast.Type
  ? Type
  : T extends ast.InstancePropertyDeclaration
  ? InstancePropertyDeclaration
  : T extends ast.StaticPropertyDeclaration
  ? StaticPropertyDeclaration
  : T extends ast.InstantiationRestriction
  ? InstantiationRestriction
  : T extends ast.ConcreteMethodDeclaration
  ? ConcreteMethodDeclaration
  : T extends ast.AbstractMethodDeclaration
  ? AbstractMethodDeclaration
  : T extends ast.ArgDef
  ? ArgDef
  : T extends ast.CompoundNode
  ? CompoundNode
  : T extends ast.NumberLiteral
  ? NumberLiteral
  : T extends ast.StringLiteral
  ? StringLiteral
  : T extends ast.CharacterLiteral
  ? CharacterLiteral
  : T extends ast.Identifier
  ? Identifier
  : T extends ast.InfixExpr
  ? InfixExpr
  : T extends ast.PrefixExpr
  ? PrefixExpr
  : T extends ast.DotExpr
  ? DotExpr
  : T extends ast.IndexExpr
  ? IndexExpr
  : T extends ast.CastExpr
  ? CastExpr
  : T extends ast.If
  ? If
  : T extends ast.ElseIf
  ? ElseIf
  : T extends ast.Else
  ? Else
  : T extends ast.Do
  ? Do
  : T extends ast.Try
  ? Try
  : T extends ast.BoundCatch
  ? BoundCatch
  : T extends ast.RestrictedBindinglessCatch
  ? RestrictedBindinglessCatch
  : T extends ast.CatchAll
  ? CatchAll
  : T extends ast.FunctionCall
  ? FunctionCall
  : T extends ast.TypedObjectLiteral
  ? TypedObjectLiteral
  : T extends ast.ObjectCopy
  ? ObjectCopy
  : T extends ast.ObjectEntry
  ? ObjectEntry
  : T extends ast.ArrayLiteral
  ? ArrayLiteral
  : T extends ast.RangeLiteral
  ? RangeLiteral
  : T extends ast.MagicFunctionLiteral
  ? MagicFunctionLiteral
  : T extends ast.UntypedArgDef
  ? UntypedArgDef
  : T extends ast.Return
  ? Return
  : T extends ast.Break
  ? Break
  : T extends ast.Continue
  ? Continue
  : T extends ast.LocalVariableDeclaration
  ? LocalVariableDeclaration
  : T extends ast.Assignment
  ? Assignment
  : T extends ast.Throw
  ? Throw
  : T extends ast.While
  ? While
  : T extends ast.Loop
  ? Loop
  : T extends ast.Repeat
  ? Repeat
  : T extends ast.For
  ? For
  : "If you see this as a type, then something went horribly wrong.";
