import { Option } from "rusty-ts";

export enum NodeType {
  Program,
  SourceFile,
  ImportStatement,
  ClassDeclaration,
  FormalTypeParamDeclaration,
  TypeParamExtendsConstraint,
  NiladicType,
  InstantiatedGenericType,
  RawType,
  ArrayType,
  TypeParamSuperConstraint,
  ClassConstructorDeclaration,
  FormalMethodParamDeclaration,
  ClassStaticPropertyDeclaration,
  ClassStaticMethodDeclaration,
  ClassInstancePropertyDeclaration,
  ClassInstanceMethodDeclaration,
  ClassInnerClassDeclaration,
  ClassInnerInterfaceDeclaration,
  InterfaceDeclaration,
  InterfaceAbstractMethodDeclaration,
  InterfaceDefaultMethodDeclaration,
  MethodBody,
  StatementExpression,
  BlockStatement,
  IfStatement,
  ElseIfClause,
  SwitchStatement,
  CaseClause,
  ReturnStatement,
  BreakStatement,
  ContinueStatement,
  VariableDeclaration,
  InfixVariableAssignment,
  PostfixVariableAssignment,
  ThrowStatement,
  WhileStatement,
  DoWhileStatement,
  CStyleForStatement,
  EnhancedForStatement,
  TryStatement,
  CatchClause,
  Identifier,
  DotExpression,
  IndexExpression,
  LiteralExpression,
  MethodInvocationExpression,
  ConstructorInvocationExpression,
  CastExpression,
  AnonymousInnerClassInstantiationExpression,
  AnonymousInnerClassPropertyDeclaration,
  AnonymousInnerClassMethodDeclaration,
  LambdaExpression,
  InstanceofExpression,
  PrefixExpression,
  InfixExpression,
  ConditionalExpression,
  ParenthesizedExpression,
}

export interface Program {
  nodeType: NodeType.Program;

  files: Map<string, SourceFile>;
}

export interface SourceFile {
  nodeType: NodeType.SourceFile;

  packageName: Option<string>;
  importStatements: ImportStatement[];
  pubClassOrInterfaceDeclaration:
    | PublicClassDeclaration
    | PublicInterfaceDeclaration;
  privClassOrInterfaceDeclarations: (ClassDeclaration | InterfaceDeclaration)[];
}

export interface ImportStatement {
  nodeType: NodeType.ImportStatement;

  /** This will end with "*" if the statement is an on-demand import. */
  importName: string;
}

export interface PublicClassDeclaration extends ClassDeclaration {
  isPublic: true;
}

export interface ClassDeclaration {
  nodeType: NodeType.ClassDeclaration;

  isPublic: boolean;
  extensibility: ExtensibilityLevel;

  name: string;
  typeParams: FormalTypeParamDeclaration;
  superClass: Option<Type>;
  implementedInterfaces: Type[];

  items: ClassItem[];
}

export enum ExtensibilityLevel {
  Final,
  Open,
  Abstract,
}

export interface FormalTypeParamDeclaration {
  nodeType: NodeType.FormalTypeParamDeclaration;

  name: string;
  constraint: Option<TypeParamConstraint>;
}

export type TypeParamConstraint =
  | TypeParamExtendsConstraint
  | TypeParamSuperConstraint;

export interface TypeParamExtendsConstraint {
  nodeType: NodeType.TypeParamExtendsConstraint;

  superTypes: Type[];
}

export type Type = NiladicType | InstantiatedGenericType | RawType | ArrayType;

export interface NiladicType {
  nodeType: NodeType.NiladicType;

  name: string;
}

export interface InstantiatedGenericType {
  nodeType: NodeType.InstantiatedGenericType;

  baseType: NiladicType;
  actualParams: Type[];
}

export interface RawType {
  nodeType: NodeType.RawType;

  baseType: NiladicType;
}

export interface ArrayType<B extends Type = Type> {
  nodeType: NodeType.ArrayType;

  baseType: B;
}

export interface TypeParamSuperConstraint {
  nodeType: NodeType.TypeParamSuperConstraint;

  subType: Type;
}

export enum VisibilityLevel {
  Private,
  Protected,
  Public,
}

export type ClassItem =
  | ClassConstructorDeclaration
  | ClassStaticPropertyDeclaration
  | ClassStaticMethodDeclaration
  | ClassInstancePropertyDeclaration
  | ClassInstanceMethodDeclaration
  | ClassInnerClassDeclaration
  | ClassInnerInterfaceDeclaration;

export interface ClassConstructorDeclaration {
  nodeType: NodeType.ClassConstructorDeclaration;

  visibility: VisibilityLevel;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  thrownExceptions: Type[];
  body: MethodBody;
}

export interface FormalMethodParamDeclaration {
  nodeType: NodeType.FormalMethodParamDeclaration;

  isReassignable: boolean;
  name: string;
  annotatedType: Type;
}

export interface ClassStaticPropertyDeclaration {
  nodeType: NodeType.ClassStaticPropertyDeclaration;

  visibility: VisibilityLevel;
  isReassignable: boolean;

  name: string;
  annotatedType: Type;
  initialValue: Expression;
}

export interface ClassStaticMethodDeclaration {
  nodeType: NodeType.ClassStaticMethodDeclaration;

  visibility: VisibilityLevel;

  name: string;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Type;
  thrownExceptions: Type[];
  body: MethodBody;
}

export interface ClassInstancePropertyDeclaration {
  nodeType: NodeType.ClassInstancePropertyDeclaration;

  visibility: VisibilityLevel;
  isReassignable: boolean;

  name: string;
  annotatedType: Type;
}

export type ClassInstanceMethodDeclaration =
  | ClassFinalInstanceMethodDeclaration
  | ClassOpenInstanceMethodDeclaration
  | ClassAbstractInstanceMethodDeclaration;

export type ClassFinalInstanceMethodDeclaration =
  | ClassFinalNonOverrideInstanceMethodDeclaration
  | ClassFinalOverrideInstanceMethodDeclaration;

export interface ClassFinalNonOverrideInstanceMethodDeclaration {
  nodeType: NodeType.ClassInstanceMethodDeclaration;
  extensibility: ExtensibilityLevel.Final;
  doesOverride: false;

  visibility: VisibilityLevel;

  name: string;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Type;
  thrownExceptions: Type[];
  body: MethodBody;
}

export interface ClassFinalOverrideInstanceMethodDeclaration {
  nodeType: NodeType.ClassInstanceMethodDeclaration;
  extensibility: ExtensibilityLevel.Final;
  doesOverride: true;

  visibility: VisibilityLevel.Protected | VisibilityLevel.Public;

  name: string;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Type;
  thrownExceptions: Type[];
  body: MethodBody;
}

export interface ClassOpenInstanceMethodDeclaration {
  nodeType: NodeType.ClassInstanceMethodDeclaration;
  extensibility: ExtensibilityLevel.Open;

  visibility: VisibilityLevel.Protected | VisibilityLevel.Public;
  doesOverride: boolean;

  name: string;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Type;
  thrownExceptions: Type[];
  body: MethodBody;
}

export interface ClassAbstractInstanceMethodDeclaration {
  nodeType: NodeType.ClassInstanceMethodDeclaration;
  extensibility: ExtensibilityLevel.Abstract;

  visibility: VisibilityLevel.Protected | VisibilityLevel.Public;

  name: string;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Type;
  thrownExceptions: Type[];
}

export interface ClassInnerClassDeclaration {
  nodeType: NodeType.ClassInnerClassDeclaration;

  visibility: VisibilityLevel;
  classDeclaration: ClassDeclaration;
}

export interface ClassInnerInterfaceDeclaration {
  nodeType: NodeType.ClassInnerInterfaceDeclaration;

  visibility: VisibilityLevel;
  interfaceDeclaration: InterfaceDeclaration;
}

export interface InterfaceDeclaration {
  nodeType: NodeType.InterfaceDeclaration;

  isPublic: boolean;

  name: string;
  typeParams: FormalTypeParamDeclaration[];

  superInterfaces: Type[];
  methods: InterfaceMethodDeclaration[];
}

export type InterfaceMethodDeclaration =
  | InterfaceAbstractMethodDeclaration
  | InterfaceDefaultMethodDeclaration;

export interface InterfaceAbstractMethodDeclaration {
  nodeType: NodeType.InterfaceAbstractMethodDeclaration;

  name: string;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Type;
  thrownExceptions: Type[];
}

export interface InterfaceDefaultMethodDeclaration {
  nodeType: NodeType.InterfaceDefaultMethodDeclaration;

  name: string;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Type;
  thrownExceptions: Type[];
  body: MethodBody;
}

export interface PublicInterfaceDeclaration extends InterfaceDeclaration {
  isPublic: true;
}

export interface MethodBody {
  nodeType: NodeType.MethodBody;

  statements: Statement[];
}

export type Statement =
  | StatementExpression
  | BlockStatement
  | IfStatement
  | SwitchStatement
  | ReturnStatement
  | BreakStatement
  | ContinueStatement
  | VariableDeclaration
  | VariableAssignment
  | ThrowStatement
  | WhileStatement
  | DoWhileStatement
  | ForStatement
  | TryStatement;

export interface StatementExpression {
  nodeType: NodeType.StatementExpression;

  expression: Expression;
}

export interface BlockStatement {
  nodeType: NodeType.BlockStatement;

  statements: Statement[];
}

export interface IfStatement {
  nodeType: NodeType.IfStatement;

  condition: Expression;
  body: BlockStatement;
  elseIfClauses: ElseIfClause[];
  elseBody: Option<BlockStatement>;
}

export interface ElseIfClause {
  nodeType: NodeType.ElseIfClause;

  condition: Expression;
  body: BlockStatement;
}

export interface SwitchStatement {
  nodeType: NodeType.SwitchStatement;

  comparedExpression: Expression;
  caseClauses: CaseClause[];
  elseBody: Option<BlockStatement>;
}

export interface CaseClause {
  nodeType: NodeType.CaseClause;

  match: Expression;
  body: BlockStatement;
}

export interface ReturnStatement {
  nodeType: NodeType.ReturnStatement;

  returnedValue: Option<Expression>;
}

export interface BreakStatement {
  nodeType: NodeType.BreakStatement;
}

export interface ContinueStatement {
  nodeType: NodeType.ContinueStatement;
}

export interface VariableDeclaration {
  nodeType: NodeType.VariableDeclaration;

  isReassignable: boolean;

  name: string;
  annotatedType: Type;
  initialValue: Expression;
}

export type VariableAssignment =
  | InfixVariableAssignment
  | PostfixVariableAssignment;

export interface InfixVariableAssignment {
  nodeType: NodeType.InfixVariableAssignment;

  assignee: AssignableExpression;
  assignmentType: InfixAssignmentOperator;
  assignment: Expression;
}

export enum InfixAssignmentOperator {
  "=",
  "*=",
  "/=",
  "%=",
  "+=",
  "-=",
}

export interface PostfixVariableAssignment {
  nodeType: NodeType.PostfixVariableAssignment;

  assignee: AssignableExpression;
  assignmentType: PostfixAssignmentOperator;
}

export enum PostfixAssignmentOperator {
  "++",
  "--",
}

export interface ThrowStatement {
  nodeType: NodeType.ThrowStatement;

  thrownValue: Expression;
}

export interface WhileStatement {
  nodeType: NodeType.WhileStatement;

  condition: Expression;
  body: BlockStatement;
}

export interface DoWhileStatement {
  nodeType: NodeType.DoWhileStatement;

  body: BlockStatement;
  condition: Expression;
}

export type ForStatement = CStyleForStatement | EnhancedForStatement;

export interface CStyleForStatement {
  nodeType: NodeType.CStyleForStatement;

  declaration: VariableDeclaration;
  condition: Expression;
  afterthought: Statement;
  body: BlockStatement;
}

export interface EnhancedForStatement {
  nodeType: NodeType.EnhancedForStatement;

  iteratingVarName: string;
  iteratingVarType: Type;
  iteratee: Expression;
  body: BlockStatement;
}

export interface TryStatement {
  nodeType: NodeType.TryStatement;

  body: BlockStatement;
  catchClauses: CatchClause[];
}

export interface CatchClause {
  nodeType: NodeType.CatchClause;

  exceptionName: string;
  exceptionTypes: Type[];
  body: BlockStatement;
}

export type Expression = AssignableExpression | NonAssignableExpression;

export type AssignableExpression = Identifier | DotExpression | IndexExpression;

export interface Identifier {
  nodeType: NodeType.Identifier;

  source: string;
}

export interface DotExpression {
  nodeType: NodeType.DotExpression;

  left: Expression;
  right: string;
}

export interface IndexExpression {
  nodeType: NodeType.IndexExpression;

  collection: Expression;
  index: Expression;
}

export type NonAssignableExpression =
  | LiteralExpression
  | MethodInvocationExpression
  | CastExpression
  | AnonymousInnerClassInstantiationExpression
  | LambdaExpression
  | InstanceofExpression
  | PrefixExpression
  | InfixExpression
  | ConditionalExpression
  | ParenthesizedExpression;

export type LiteralExpression =
  | NullLiteral
  | BooleanLiteral
  | NumberLiteral
  | CharacterLiteral
  | StringLiteral
  | ArrayLiteral;

export enum LiteralType {
  Null,
  Boolean,
  Number,
  Character,
  String,
  Array,
}

export interface NullLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.Null;
}

export interface BooleanLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.Boolean;

  value: boolean;
}

export interface NumberLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.Number;

  source: string;
}

export interface CharacterLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.Character;

  source: string;
}

export interface StringLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.String;

  source: string;
}

export type ArrayLiteral = SequentialArrayLiteral | DefaultValueArrayLiteral;

export enum ArrayLiteralType {
  Sequential,
  Default,
}

export interface SequentialArrayLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.Array;
  arrayType: ArrayLiteralType.Sequential;

  elements: Expression[];
}

export interface DefaultValueArrayLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.Array;
  arrayType: ArrayLiteralType.Default;

  valueType: Type;
  dimensions: Expression[];
}

export interface MethodInvocationExpression {
  nodeType: NodeType.MethodInvocationExpression;

  callee: Expression;
  params: Expression[];
}

export interface ConstructorInvocationExpression {
  nodeType: NodeType.ConstructorInvocationExpression;

  callee: Expression;
  isRaw: boolean;
  /** This will be an empty array if this uses the diamond syntax ("<>"). */
  listedTypeParams: Type[];
  params: Expression[];
}

export interface CastExpression {
  nodeType: NodeType.CastExpression;

  castee: Expression;
  targetType: AngleBracketlessType;
}

export type AngleBracketlessType =
  | NiladicType
  | ArrayType<AngleBracketlessType>;

export interface AnonymousInnerClassInstantiationExpression {
  nodeType: NodeType.AnonymousInnerClassInstantiationExpression;

  instantiationType: AnonymousInnerClassInstantiationType;
  items: AnonymousInnerClassItem[];
}

export type AnonymousInnerClassInstantiationType =
  | NiladicType
  | InstantiatedGenericType;

export type AnonymousInnerClassItem =
  | AnonymousInnerClassPropertyDeclaration
  | BlockStatement
  | AnonymousInnerClassMethodDeclaration;

export interface AnonymousInnerClassPropertyDeclaration {
  nodeType: NodeType.AnonymousInnerClassPropertyDeclaration;

  name: string;
  annotatedType: Type;
  initialValue: Option<Expression>;
}

export interface AnonymousInnerClassMethodDeclaration {
  nodeType: NodeType.AnonymousInnerClassMethodDeclaration;

  doesOverride: boolean;

  name: string;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Type;
  thrownExceptions: Type[];
  body: MethodBody;
}

export interface LambdaExpression {
  nodeType: NodeType.LambdaExpression;

  paramNames: string[];
  body: Expression | MethodBody;
}

export interface InstanceofExpression {
  nodeType: NodeType.InstanceofExpression;

  value: Expression;
  comparedType: AngleBracketlessType;
}

export interface PrefixExpression {
  nodeType: NodeType.PrefixExpression;

  operator: PrefixOperatorType;
  right: Expression;
}

export enum PrefixOperatorType {
  "!",
  "-",
}

export interface InfixExpression {
  nodeType: NodeType.InfixExpression;

  left: Expression;
  operator: InfixOperatorType;
  right: Expression;
}

export enum InfixOperatorType {
  "**",
  "*",
  "/",
  "%",
  "+",
  "-",
  "<",
  "<=",
  ">",
  ">=",
  "==",
  "!=",
  "&&",
  "||",
}

export interface ConditionalExpression {
  nodeType: NodeType.ConditionalExpression;

  condition: Expression;
  trueValue: Expression;
  falseValue: Expression;
}

export interface ParenthesizedExpression {
  nodeType: NodeType.ParenthesizedExpression;

  innerValue: Expression;
}
