import * as lst from "./lst";
import { NodeId } from "./lst";
import { TextRange } from "./textPosition";

export interface Ref {
  refId: number;
  name: string;
}

export type Bound<T extends lst.Node> = T extends lst.FileNode
  ? FileNode
  : T extends lst.Import
  ? Import
  : T extends lst.Use
  ? Use
  : T extends lst.StaticMethodCopy
  ? StaticMethodCopy
  : T extends lst.StaticMethodCopySignature
  ? StaticMethodCopySignature
  : T extends lst.PubClass
  ? PubClass
  : T extends lst.PrivClass
  ? PrivClass
  : T extends lst.TypeArgDef
  ? TypeArgDef
  : T extends lst.Type
  ? Type
  : T extends lst.InstancePropertyDeclaration
  ? InstancePropertyDeclaration
  : T extends lst.StaticPropertyDeclaration
  ? StaticPropertyDeclaration
  : T extends lst.InstantiationRestriction
  ? InstantiationRestriction
  : T extends lst.ConcreteMethodDeclaration
  ? ConcreteMethodDeclaration
  : T extends lst.AbstractMethodDeclaration
  ? AbstractMethodDeclaration
  : T extends lst.TypedArgDef
  ? TypedArgDef
  : T extends lst.CompoundNode
  ? CompoundNode
  : T extends lst.NumberLiteral
  ? NumberLiteral
  : T extends lst.StringLiteral
  ? StringLiteral
  : T extends lst.CharacterLiteral
  ? CharacterLiteral
  : T extends lst.Identifier
  ? Identifier
  : T extends lst.InfixExpr
  ? InfixExpr
  : T extends lst.PrefixExpr
  ? PrefixExpr
  : T extends lst.DotExpr
  ? DotExpr
  : T extends lst.IndexExpr
  ? IndexExpr
  : T extends lst.CastExpr
  ? CastExpr
  : T extends lst.If
  ? If
  : T extends lst.ElseIf
  ? ElseIf
  : T extends lst.Else
  ? Else
  : T extends lst.Do
  ? Do
  : T extends lst.Try
  ? Try
  : T extends lst.BoundCatch
  ? BoundCatch
  : T extends lst.RestrictedBindinglessCatch
  ? RestrictedBindinglessCatch
  : T extends lst.CatchAll
  ? CatchAll
  : T extends lst.FunctionCall
  ? FunctionCall
  : T extends lst.TypedObjectLiteral
  ? TypedObjectLiteral
  : T extends lst.ObjectCopy
  ? ObjectCopy
  : T extends lst.ObjectEntry
  ? ObjectEntry
  : T extends lst.ArrayLiteral
  ? ArrayLiteral
  : T extends lst.RangeLiteral
  ? RangeLiteral
  : T extends lst.MagicFunctionLiteral
  ? MagicFunctionLiteral
  : T extends lst.UntypedArgDef
  ? UntypedArgDef
  : T extends lst.Return
  ? Return
  : T extends lst.Break
  ? Break
  : T extends lst.Continue
  ? Continue
  : T extends lst.LocalVariableDeclaration
  ? LocalVariableDeclaration
  : T extends lst.Assignment
  ? Assignment
  : T extends lst.Throw
  ? Throw
  : T extends lst.While
  ? While
  : T extends lst.Loop
  ? Loop
  : T extends lst.Repeat
  ? Repeat
  : T extends lst.For
  ? For
  : "If you see this as a type, then something went horribly wrong.";

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
  nodeId: NodeId<NodeType.File>;

  packageName: string | null;
  imports: Import[];
  useStatements: Use[];
  pubClass: PubClass;
  privClasses: PrivClass[];
  location: TextRange;
}

export interface Import {
  type: NodeType.Import;
  nodeId: NodeId<NodeType.Import>;

  name: string;
  /** May become `string | null` in the future. */
  alias: null;

  leftmostInRef: Ref;
  outRef: Ref;

  location: TextRange;
}

export interface Use {
  type: NodeType.Use;
  nodeId: NodeId<NodeType.Use>;

  name: string;
  alias: string | null;
  doesShadow: boolean;

  leftmostInRef: Ref;
  outRef: Ref;

  location: TextRange;
}

export interface Class {
  type: NodeType.Class;
  nodeId: NodeId<NodeType.Class>;

  isPub: boolean;
  overridability: Overridability;
  name: string;
  typeArgDefs: TypeArgDef[];
  superClass: Type | null;
  copies: StaticMethodCopy[];
  useStatements: Use[];
  items: ClassItem[];

  outRef: Ref;

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
  nodeId: NodeId<NodeType.TypeArgDef>;

  name: string;
  constraint: TypeConstraint;

  outRef: Ref;

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
  nodeId: NodeId<NodeType.Type>;

  name: string;
  args: Type[];

  leftmostInRef: Ref;

  location: TextRange;
}

export interface StaticMethodCopy {
  type: NodeType.StaticMethodCopy;
  nodeId: NodeId<NodeType.StaticMethodCopy>;

  accessModifier: OptAccessModifier;
  name: string;
  signature: StaticMethodCopySignature | null;
  alias: string | null;

  leftmostInRef: Ref;
  outRef: Ref;

  location: TextRange;
}

export interface StaticMethodCopySignature {
  type: NodeType.StaticMethodCopySignature;
  nodeId: NodeId<NodeType.StaticMethodCopySignature>;

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
  nodeId: NodeId<NodeType.InstantiationRestriction>;

  level: "pub" | "prot";
  location: TextRange;
}

export interface InstancePropertyDeclaration {
  type: NodeType.InstancePropertyDeclaration;
  nodeId: NodeId<NodeType.InstancePropertyDeclaration>;

  accessModifier: OptAccessModifier;
  isReassignable: boolean;
  name: string;
  valueType: Type;

  outRef: Ref;

  location: TextRange;
}

export interface StaticPropertyDeclaration {
  type: NodeType.StaticPropertyDeclaration;
  nodeId: NodeId<NodeType.StaticPropertyDeclaration>;

  accessModifier: OptAccessModifier;
  isReassignable: boolean;
  name: string;
  valueType: Type | null;
  initialValue: Expr;

  outRef: Ref;

  location: TextRange;
}

export interface ConcreteMethodDeclaration {
  type: NodeType.ConcreteMethodDeclaration;
  nodeId: NodeId<NodeType.ConcreteMethodDeclaration>;

  accessModifier: OptAccessModifier;
  isStatic: boolean;
  isOpen: boolean;
  isOverride: boolean;
  name: string;
  typeArgs: TypeArgDef[];
  args: TypedArgDef[];
  returnType: Type | null;
  body: CompoundNode;

  outRef: Ref;

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
  nodeId: NodeId<NodeType.AbstractMethodDeclaration>;

  accessModifier: OptAccessModifier;
  isStatic: boolean;
  name: string;
  typeArgs: TypeArgDef[];
  args: TypedArgDef[];
  returnType: Type | null;

  outRef: Ref;

  location: TextRange;
}

export interface TypedArgDef {
  type: NodeType.TypedArgDef;
  nodeId: NodeId<NodeType.TypedArgDef>;

  name: string;
  valueType: Type;

  outRef: Ref;

  location: TextRange;
}

export interface CompoundNode {
  type: NodeType.CompoundNode;
  nodeId: NodeId<NodeType.CompoundNode>;

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
  nodeId: NodeId<NodeType.NumberLiteral>;

  value: string;
  location: TextRange;
}

export interface StringLiteral {
  type: NodeType.StringLiteral;
  nodeId: NodeId<NodeType.StringLiteral>;

  value: string;
  location: TextRange;
}

export interface CharacterLiteral {
  type: NodeType.CharacterLiteral;
  nodeId: NodeId<NodeType.CharacterLiteral>;

  value: string;
  location: TextRange;
}

export interface Identifier {
  type: NodeType.Identifier;
  nodeId: NodeId<NodeType.Identifier>;

  name: string;

  inRef: Ref;

  location: TextRange;
}

export interface InfixExpr {
  type: NodeType.InfixExpr;
  nodeId: NodeId<NodeType.InfixExpr>;

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
  nodeId: NodeId<NodeType.PrefixExpr>;

  operation: PrefixOperation;
  right: Expr;
  location: TextRange;
}

export type PrefixOperation = "-" | "!" | "~";

export interface DotExpr {
  type: NodeType.DotExpr;
  nodeId: NodeId<NodeType.DotExpr>;

  left: Expr;
  right: string;
  location: TextRange;
}

export interface IndexExpr {
  type: NodeType.IndexExpr;
  nodeId: NodeId<NodeType.IndexExpr>;

  left: Expr;
  right: Expr;
  location: TextRange;
}

export interface CastExpr {
  type: NodeType.CastExpr;
  nodeId: NodeId<NodeType.CastExpr>;

  value: Expr;
  targetType: Type;
  location: TextRange;
}

export interface If {
  type: NodeType.If;
  nodeId: NodeId<NodeType.If>;

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
  nodeId: NodeId<NodeType.IfAlternative>;

  alternativeType: IfAlternativeType.ElseIf;
  condition: Expr;
  body: CompoundNode;
  location: TextRange;
}

export interface Else {
  type: NodeType.IfAlternative;
  nodeId: NodeId<NodeType.IfAlternative>;

  alternativeType: IfAlternativeType.Else;
  body: CompoundNode;
  location: TextRange;
}

export interface Do {
  type: NodeType.Do;
  nodeId: NodeId<NodeType.Do>;

  body: CompoundNode;
  location: TextRange;
}

export interface FunctionCall {
  type: NodeType.FunctionCall;
  nodeId: NodeId<NodeType.FunctionCall>;

  callee: Expr;
  typeArgs: Type[];
  args: Expr[];
  location: TextRange;
}

export interface TypedObjectLiteral {
  type: NodeType.TypedObjectLiteral;
  nodeId: NodeId<NodeType.TypedObjectLiteral>;

  valueType: Type;
  copies: ObjectCopy[];
  entries: ObjectEntry[];
  location: TextRange;
}

export interface ObjectCopy {
  type: NodeType.ObjectCopy;
  nodeId: NodeId<NodeType.ObjectCopy>;

  source: Expr;
  location: TextRange;
}

export interface ObjectEntry {
  type: NodeType.ObjectEntry;
  nodeId: NodeId<NodeType.ObjectEntry>;

  key: string;
  value: Expr | null;
  location: TextRange;
}

export interface ArrayLiteral {
  type: NodeType.ArrayLiteral;
  nodeId: NodeId<NodeType.ArrayLiteral>;

  elements: Expr[];
  location: TextRange;
}

export interface RangeLiteral {
  type: NodeType.RangeLiteral;
  nodeId: NodeId<NodeType.RangeLiteral>;

  start: Expr;
  end: Expr;
  includesEnd: boolean;
  location: TextRange;
}

export interface MagicFunctionLiteral {
  type: NodeType.MagicFunctionLiteral;
  nodeId: NodeId<NodeType.MagicFunctionLiteral>;

  args: UntypedArgDef[];
  body: Expr | CompoundNode;
  location: TextRange;
}

export interface UntypedArgDef {
  type: NodeType.UntypedArgDef;
  nodeId: NodeId<NodeType.UntypedArgDef>;

  name: string;

  outRef: Ref;

  location: TextRange;
}

export interface LocalVariableDeclaration {
  type: NodeType.LocalVariableDeclaration;
  nodeId: NodeId<NodeType.LocalVariableDeclaration>;

  isReassignable: boolean;
  doesShadow: boolean;
  name: string;
  initialValue: Expr;
  valueType: null | Type;

  outRef: Ref;

  location: TextRange;
}

export interface Assignment {
  type: NodeType.Assignment;
  nodeId: NodeId<NodeType.Assignment>;

  assignmentType: AssignmentType;
  assignee: Expr;
  value: Expr;

  location: TextRange;
}

export type AssignmentType = "=" | "**=" | "*=" | "/=" | "%=" | "+=" | "-=";

export interface Return {
  type: NodeType.Return;
  nodeId: NodeId<NodeType.Return>;

  value: null | Expr;
  location: TextRange;
}

export interface Break {
  type: NodeType.Break;
  nodeId: NodeId<NodeType.Break>;

  /** May one day become `Expr | null`. */
  value: null;
  location: TextRange;
}

export interface Continue {
  type: NodeType.Continue;
  nodeId: NodeId<NodeType.Continue>;

  location: TextRange;
}

export interface Throw {
  type: NodeType.Throw;
  nodeId: NodeId<NodeType.Throw>;

  value: Expr;
  location: TextRange;
}

export interface Try {
  type: NodeType.Try;
  nodeId: NodeId<NodeType.Try>;

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
  nodeId: NodeId<NodeType.Catch>;

  catchType: CatchType.BoundCatch;
  arg: TypedArgDef;
  body: CompoundNode;
  location: TextRange;
}

export interface RestrictedBindinglessCatch {
  type: NodeType.Catch;
  nodeId: NodeId<NodeType.Catch>;

  catchType: CatchType.RestrictedBindinglessCatch;
  caughtTypes: Type[];
  body: CompoundNode;
  location: TextRange;
}

export interface CatchAll {
  type: NodeType.Catch;
  nodeId: NodeId<NodeType.Catch>;

  catchType: CatchType.CatchAll;
  body: CompoundNode;
  location: TextRange;
}

export interface While {
  type: NodeType.While;
  nodeId: NodeId<NodeType.While>;

  condition: Expr;
  body: CompoundNode;
  location: TextRange;
}

export interface Loop {
  type: NodeType.Loop;
  nodeId: NodeId<NodeType.Loop>;

  body: CompoundNode;
  location: TextRange;
}

export interface Repeat {
  type: NodeType.Repeat;
  nodeId: NodeId<NodeType.Repeat>;

  repetitions: Expr;
  body: CompoundNode;
  location: TextRange;
}

export interface For {
  type: NodeType.For;
  nodeId: NodeId<NodeType.For>;

  binding: Binding;
  iteratee: Expr;
  body: CompoundNode;
  location: TextRange;
}

export type Binding = SingleBinding | FlatTupleBinding;

export interface SingleBinding {
  type: NodeType.SingleBinding;
  nodeId: NodeId<NodeType.SingleBinding>;

  name: string;

  outRef: Ref;

  location: TextRange;
}

export interface FlatTupleBinding {
  type: NodeType.FlatTupleBinding;
  nodeId: NodeId<NodeType.FlatTupleBinding>;

  bindings: SingleBinding[];

  location: TextRange;
}
