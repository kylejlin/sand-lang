import { Option } from "rusty-ts";
import { TextRange } from ".";

export enum NodeType {
  FileNode,
  PackageStatement,
  Identifier,
  SingleItemImportStatement,
  ImportAllStatement,
  UseSingleItemStatement,
  UseAllStatement,
  ClassDeclaration,
  FormalTypeParamDeclaration,
  TypeParamExtendsConstraint,
  NiladicType,
  InstantiatedGenericType,
  NullableType,
  ArrayType,
  ListType,
  TypeParamSuperConstraint,
  MethodCopyStatement,
  ClassConstructorDeclaration,
  FormalMethodParamDeclaration,
  ClassDefaultConstructorDeclaration,
  ClassStaticPropertyDeclaration,
  PropertyAccessorDeclarations,
  PropertyGetterDeclaration,
  PropertySetterDeclaration,
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
  StatementElseIfClause,
  SwitchStatement,
  StatementCaseClause,
  ReturnStatement,
  BreakStatement,
  ContinueStatement,
  VariableDeclaration,
  VariableAssignment,
  ThrowStatement,
  WhileStatement,
  DoWhileStatement,
  LoopStatement,
  RepeatStatement,
  CStyleForStatement,
  CollectionIterationForStatement,
  ForBinding,
  RangeForStatement,
  TryStatement,
  StatementCatchClause,
  IfTypeGuardStatement,
  NullGuardVariableDeclaration,
  InstanceofGuardVariableDeclaration,
  WhileTypeGuardStatement,
  IfPseudex,
  BlockPseudex,
  ExpressionElseIfClause,
  BlockExpression,
  PseudexElseIfClause,
  SwitchPseudex,
  ExpressionCaseClause,
  PseudexCaseClause,
  TryPseudex,
  ExpressionCatchClause,
  PseudexCatchClause,
  TryOrThrowPseudex,
  ThrowPseudex,
  IfTypeGuardPseudex,
  RepeatingArrayFillPseudex,
  RepeatingListFillPseudex,
  SequentialListFillPseudex,
  ArrayMapPseudex,
  ListMapPseudex,
  ListFilterMapPseudex,
  ThisHashExpression,
  DotExpression,
  HashExpression,
  IndexExpression,
  LiteralExpression,
  MethodInvocationExpression,
  LabeledActualParam,
  CastExpression,
  AnonymousInnerClassInstantiationExpression,
  AnonymousInnerClassPropertyDeclaration,
  AnonymousInnerClassMethodDeclaration,
  LambdaExpression,
  RangeCheckExpression,
  InstanceofExpression,
  NotinstanceofExpression,
  PostfixExpression,
  PrefixExpression,
  InfixExpression,
  IfExpression,
  SwitchExpression,
  IfInlineTypeGuardExpression,
  ParenthesizedExpression,
}

export type Node<T extends NodeType = NodeType> = NodeMap[T];

interface NodeMap {
  [NodeType.FileNode]: FileNode;
  [NodeType.PackageStatement]: PackageStatement;
  [NodeType.Identifier]: Identifier;
  [NodeType.SingleItemImportStatement]: SingleItemImportStatement;
  [NodeType.ImportAllStatement]: ImportAllStatement;
  [NodeType.UseSingleItemStatement]: UseSingleItemStatement;
  [NodeType.UseAllStatement]: UseAllStatement;
  [NodeType.ClassDeclaration]: ClassDeclaration;
  [NodeType.FormalTypeParamDeclaration]: FormalTypeParamDeclaration;
  [NodeType.TypeParamExtendsConstraint]: TypeParamExtendsConstraint;
  [NodeType.NiladicType]: NiladicType;
  [NodeType.InstantiatedGenericType]: InstantiatedGenericType;
  [NodeType.NullableType]: NullableType;
  [NodeType.ArrayType]: ArrayType;
  [NodeType.ListType]: ListType;
  [NodeType.TypeParamSuperConstraint]: TypeParamSuperConstraint;
  [NodeType.MethodCopyStatement]: MethodCopyStatement;
  [NodeType.ClassConstructorDeclaration]: ClassConstructorDeclaration;
  [NodeType.FormalMethodParamDeclaration]: FormalMethodParamDeclaration;
  [NodeType.ClassDefaultConstructorDeclaration]: ClassDefaultConstructorDeclaration;
  [NodeType.ClassStaticPropertyDeclaration]: ClassStaticPropertyDeclaration;
  [NodeType.PropertyAccessorDeclarations]: PropertyAccessorDeclarations;
  [NodeType.PropertyGetterDeclaration]: PropertyGetterDeclaration;
  [NodeType.PropertySetterDeclaration]: PropertySetterDeclaration;
  [NodeType.ClassStaticMethodDeclaration]: ClassStaticMethodDeclaration;
  [NodeType.ClassInstancePropertyDeclaration]: ClassInstancePropertyDeclaration;
  [NodeType.ClassInstanceMethodDeclaration]: ClassInstanceMethodDeclaration;
  [NodeType.ClassInnerClassDeclaration]: ClassInnerClassDeclaration;
  [NodeType.ClassInnerInterfaceDeclaration]: ClassInnerInterfaceDeclaration;
  [NodeType.InterfaceDeclaration]: InterfaceDeclaration;
  [NodeType.InterfaceAbstractMethodDeclaration]: InterfaceAbstractMethodDeclaration;
  [NodeType.InterfaceDefaultMethodDeclaration]: InterfaceDefaultMethodDeclaration;
  [NodeType.MethodBody]: MethodBody;
  [NodeType.StatementExpression]: StatementExpression;
  [NodeType.BlockStatement]: BlockStatement;
  [NodeType.IfStatement]: IfStatement;
  [NodeType.StatementElseIfClause]: StatementElseIfClause;
  [NodeType.SwitchStatement]: SwitchStatement;
  [NodeType.StatementCaseClause]: StatementCaseClause;
  [NodeType.ReturnStatement]: ReturnStatement;
  [NodeType.BreakStatement]: BreakStatement;
  [NodeType.ContinueStatement]: ContinueStatement;
  [NodeType.VariableDeclaration]: VariableDeclaration;
  [NodeType.VariableAssignment]: VariableAssignment;
  [NodeType.ThrowStatement]: ThrowStatement;
  [NodeType.WhileStatement]: WhileStatement;
  [NodeType.DoWhileStatement]: DoWhileStatement;
  [NodeType.LoopStatement]: LoopStatement;
  [NodeType.RepeatStatement]: RepeatStatement;
  [NodeType.CStyleForStatement]: CStyleForStatement;
  [NodeType.CollectionIterationForStatement]: CollectionIterationForStatement;
  [NodeType.ForBinding]: ForBinding;
  [NodeType.RangeForStatement]: RangeForStatement;
  [NodeType.TryStatement]: TryStatement;
  [NodeType.StatementCatchClause]: StatementCatchClause;
  [NodeType.IfTypeGuardStatement]: IfTypeGuardStatement;
  [NodeType.NullGuardVariableDeclaration]: NullGuardVariableDeclaration;
  [NodeType.InstanceofGuardVariableDeclaration]: InstanceofGuardVariableDeclaration;
  [NodeType.WhileTypeGuardStatement]: WhileTypeGuardStatement;
  [NodeType.IfPseudex]: IfPseudex;
  [NodeType.BlockPseudex]: BlockPseudex;
  [NodeType.ExpressionElseIfClause]: ExpressionElseIfClause;
  [NodeType.BlockExpression]: BlockExpression;
  [NodeType.PseudexElseIfClause]: PseudexElseIfClause;
  [NodeType.SwitchPseudex]: SwitchPseudex;
  [NodeType.ExpressionCaseClause]: ExpressionCaseClause;
  [NodeType.PseudexCaseClause]: PseudexCaseClause;
  [NodeType.TryPseudex]: TryPseudex;
  [NodeType.ExpressionCatchClause]: ExpressionCatchClause;
  [NodeType.PseudexCatchClause]: PseudexCatchClause;
  [NodeType.TryOrThrowPseudex]: TryOrThrowPseudex;
  [NodeType.ThrowPseudex]: ThrowPseudex;
  [NodeType.IfTypeGuardPseudex]: IfTypeGuardPseudex;
  [NodeType.RepeatingArrayFillPseudex]: RepeatingArrayFillPseudex;
  [NodeType.RepeatingListFillPseudex]: RepeatingListFillPseudex;
  [NodeType.SequentialListFillPseudex]: SequentialListFillPseudex;
  [NodeType.ArrayMapPseudex]: ArrayMapPseudex;
  [NodeType.ListMapPseudex]: ListMapPseudex;
  [NodeType.ListFilterMapPseudex]: ListFilterMapPseudex;
  [NodeType.ThisHashExpression]: ThisHashExpression;
  [NodeType.DotExpression]: DotExpression;
  [NodeType.HashExpression]: HashExpression;
  [NodeType.IndexExpression]: IndexExpression;
  [NodeType.LiteralExpression]: LiteralExpression;
  [NodeType.MethodInvocationExpression]: MethodInvocationExpression;
  [NodeType.LabeledActualParam]: LabeledActualParam;
  [NodeType.CastExpression]: CastExpression;
  [NodeType.AnonymousInnerClassInstantiationExpression]: AnonymousInnerClassInstantiationExpression;
  [NodeType.AnonymousInnerClassPropertyDeclaration]: AnonymousInnerClassPropertyDeclaration;
  [NodeType.AnonymousInnerClassMethodDeclaration]: AnonymousInnerClassMethodDeclaration;
  [NodeType.LambdaExpression]: LambdaExpression;
  [NodeType.RangeCheckExpression]: RangeCheckExpression;
  [NodeType.InstanceofExpression]: InstanceofExpression;
  [NodeType.NotinstanceofExpression]: NotinstanceofExpression;
  [NodeType.PostfixExpression]: PostfixExpression;
  [NodeType.PrefixExpression]: PrefixExpression;
  [NodeType.InfixExpression]: InfixExpression;
  [NodeType.IfExpression]: IfExpression;
  [NodeType.SwitchExpression]: SwitchExpression;
  [NodeType.IfInlineTypeGuardExpression]: IfInlineTypeGuardExpression;
  [NodeType.ParenthesizedExpression]: ParenthesizedExpression;
}

export interface FileNode {
  nodeType: NodeType.FileNode;

  packageStatement: Option<PackageStatement>;
  importStatements: ImportStatement[];
  useStatements: UseStatement[];
  pubClassOrInterfaceDeclaration: PubClassDeclaration | PubInterfaceDeclaration;
  privClassOrInterfaceDeclarations: (ClassDeclaration | InterfaceDeclaration)[];

  nodeId: number;
  location: TextRange;
}

export interface PackageStatement {
  nodeType: NodeType.PackageStatement;

  identifiers: Identifier[];

  nodeId: number;
  location: TextRange;
}

export interface Identifier {
  nodeType: NodeType.Identifier;

  source: string;

  nodeId: number;
  location: TextRange;
}

export type ImportStatement = SingleItemImportStatement | ImportAllStatement;

export interface SingleItemImportStatement {
  nodeType: NodeType.SingleItemImportStatement;

  doesShadow: boolean;
  isStatic: boolean;

  identifiers: Identifier[];

  nodeId: number;
  location: TextRange;
}

export interface ImportAllStatement {
  nodeType: NodeType.ImportAllStatement;

  isStatic: boolean;
  identifiers: Identifier[];

  nodeId: number;
  location: TextRange;
}

export type UseStatement = UseSingleItemStatement | UseAllStatement;

export interface UseSingleItemStatement {
  nodeType: NodeType.UseSingleItemStatement;

  doesShadow: boolean;
  referentIdentifiers: Identifier[];
  alias: Option<Identifier>;

  nodeId: number;
  location: TextRange;
}

export interface UseAllStatement {
  nodeType: NodeType.UseAllStatement;

  identifiers: Identifier[];

  nodeId: number;
  location: TextRange;
}

export interface PubClassDeclaration extends ClassDeclaration {
  isPub: true;
}

export interface ClassDeclaration {
  nodeType: NodeType.ClassDeclaration;

  isPub: boolean;
  extensibility: ExtensibilityLevel;
  doesShadow: boolean;

  name: Identifier;
  typeParams: FormalTypeParamDeclaration[];
  superClass: Option<Type>;
  implementedInterfaces: Type[];

  methodCopyStatements: MethodCopyStatement[];
  useStatements: UseStatement[];
  items: ClassItem[];

  nodeId: number;
  location: TextRange;
}

export enum ExtensibilityLevel {
  Final,
  Open,
  Abstract,
}

export interface FormalTypeParamDeclaration {
  nodeType: NodeType.FormalTypeParamDeclaration;

  name: Identifier;
  constraint: Option<TypeParamConstraint>;

  nodeId: number;
  location: TextRange;
}

export type TypeParamConstraint =
  | TypeParamExtendsConstraint
  | TypeParamSuperConstraint;

export interface TypeParamExtendsConstraint {
  nodeType: NodeType.TypeParamExtendsConstraint;

  superTypes: Type[];

  nodeId: number;
  location: TextRange;
}

export type Type =
  | NiladicType
  | InstantiatedGenericType
  | NullableType
  | ArrayType
  | ListType;

export interface NiladicType {
  nodeType: NodeType.NiladicType;

  identifiers: Identifier[];

  nodeId: number;
  location: TextRange;
}

export interface InstantiatedGenericType {
  nodeType: NodeType.InstantiatedGenericType;

  baseType: NiladicType;
  actualParams: Type[];

  nodeId: number;
  location: TextRange;
}

export interface NullableType<B extends Type = Type> {
  nodeType: NodeType.NullableType;

  baseType: B;

  nodeId: number;
  location: TextRange;
}

export interface ArrayType<B extends Type = Type> {
  nodeType: NodeType.ArrayType;

  baseType: B;

  nodeId: number;
  location: TextRange;
}

export interface ListType {
  nodeType: NodeType.ListType;

  baseType: Type;

  nodeId: number;
  location: TextRange;
}

export interface TypeParamSuperConstraint {
  nodeType: NodeType.TypeParamSuperConstraint;

  subType: Type;

  nodeId: number;
  location: TextRange;
}

export interface MethodCopyStatement {
  nodeType: NodeType.MethodCopyStatement;

  visibility: VisibilityLevel;
  doesShadow: boolean;

  identifiers: Identifier[];

  nodeId: number;
  location: TextRange;
}

export enum VisibilityLevel {
  Private,
  Protected,
  Public,
}

export type ClassItem =
  | ClassConstructorDeclaration
  | ClassDefaultConstructorDeclaration
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

  nodeId: number;
  location: TextRange;
}

export interface FormalMethodParamDeclaration {
  nodeType: NodeType.FormalMethodParamDeclaration;

  isReassignable: boolean;
  doesShadow: boolean;
  name: Identifier;
  annotatedType: Type;

  nodeId: number;
  location: TextRange;
}

export interface ClassDefaultConstructorDeclaration {
  nodeType: NodeType.ClassDefaultConstructorDeclaration;

  visibility: VisibilityLevel;

  nodeId: number;
  location: TextRange;
}

export interface ClassStaticPropertyDeclaration {
  nodeType: NodeType.ClassStaticPropertyDeclaration;

  visibility: PropertyVisibilityLevel;
  accessors: Option<PropertyAccessorDeclarations>;
  isReassignable: boolean;
  doesShadow: boolean;

  name: Identifier;
  annotatedType: Option<Type>;
  initialValue: Expression | AssignmentPseudex;

  nodeId: number;
  location: TextRange;
}

export enum PropertyVisibilityLevel {
  InternallyEncapsulated,
  Private,
  Protected,
  Public,
}

export interface PropertyAccessorDeclarations {
  nodeType: NodeType.PropertyAccessorDeclarations;

  getter: Option<PropertyGetterDeclaration>;
  setter: Option<PropertySetterDeclaration>;

  nodeId: number;
  location: TextRange;
}

export interface PropertyGetterDeclaration {
  nodeType: NodeType.PropertyGetterDeclaration;

  visibility: VisibilityLevel;

  nodeId: number;
  location: TextRange;
}

export interface PropertySetterDeclaration {
  nodeType: NodeType.PropertySetterDeclaration;

  visibility: VisibilityLevel;

  nodeId: number;
  location: TextRange;
}

export interface ClassStaticMethodDeclaration {
  nodeType: NodeType.ClassStaticMethodDeclaration;

  visibility: VisibilityLevel;
  doesShadow: boolean;

  name: Identifier;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Option<Type>;
  thrownExceptions: Type[];
  body: MethodBody;

  nodeId: number;
  location: TextRange;
}

export interface ClassInstancePropertyDeclaration {
  nodeType: NodeType.ClassInstancePropertyDeclaration;

  visibility: PropertyVisibilityLevel;
  accessors: Option<PropertyAccessorDeclarations>;
  isReassignable: boolean;
  doesShadow: boolean;

  name: Identifier;
  annotatedType: Type;

  nodeId: number;
  location: TextRange;
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

  name: Identifier;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Option<Type>;
  thrownExceptions: Type[];
  body: MethodBody;

  nodeId: number;
  location: TextRange;
}

export interface ClassFinalOverrideInstanceMethodDeclaration {
  nodeType: NodeType.ClassInstanceMethodDeclaration;
  extensibility: ExtensibilityLevel.Final;
  doesOverride: true;

  visibility: VisibilityLevel.Protected | VisibilityLevel.Public;

  name: Identifier;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Option<Type>;
  thrownExceptions: Type[];
  body: MethodBody;

  nodeId: number;
  location: TextRange;
}

export interface ClassOpenInstanceMethodDeclaration {
  nodeType: NodeType.ClassInstanceMethodDeclaration;
  extensibility: ExtensibilityLevel.Open;

  visibility: VisibilityLevel.Protected | VisibilityLevel.Public;
  doesOverride: boolean;

  name: Identifier;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Option<Type>;
  thrownExceptions: Type[];
  body: MethodBody;

  nodeId: number;
  location: TextRange;
}

export interface ClassAbstractInstanceMethodDeclaration {
  nodeType: NodeType.ClassInstanceMethodDeclaration;
  extensibility: ExtensibilityLevel.Abstract;

  visibility: VisibilityLevel.Protected | VisibilityLevel.Public;

  name: Identifier;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Option<Type>;
  thrownExceptions: Type[];

  nodeId: number;
  location: TextRange;
}

export interface ClassInnerClassDeclaration {
  nodeType: NodeType.ClassInnerClassDeclaration;

  visibility: VisibilityLevel;
  classDeclaration: ClassDeclaration;

  nodeId: number;
  location: TextRange;
}

export interface ClassInnerInterfaceDeclaration {
  nodeType: NodeType.ClassInnerInterfaceDeclaration;

  visibility: VisibilityLevel;
  interfaceDeclaration: InterfaceDeclaration;

  nodeId: number;
  location: TextRange;
}

export interface InterfaceDeclaration {
  nodeType: NodeType.InterfaceDeclaration;

  isPub: boolean;
  doesShadow: boolean;

  name: Identifier;
  typeParams: FormalTypeParamDeclaration[];

  superInterfaces: Type[];
  useStatements: UseStatement[];
  methods: InterfaceMethodDeclaration[];

  nodeId: number;
  location: TextRange;
}

export type InterfaceMethodDeclaration =
  | InterfaceAbstractMethodDeclaration
  | InterfaceDefaultMethodDeclaration;

export interface InterfaceAbstractMethodDeclaration {
  nodeType: NodeType.InterfaceAbstractMethodDeclaration;

  name: Identifier;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Option<Type>;
  thrownExceptions: Type[];

  nodeId: number;
  location: TextRange;
}

export interface InterfaceDefaultMethodDeclaration {
  nodeType: NodeType.InterfaceDefaultMethodDeclaration;

  name: Identifier;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Option<Type>;
  thrownExceptions: Type[];
  body: MethodBody;

  nodeId: number;
  location: TextRange;
}

export interface PubInterfaceDeclaration extends InterfaceDeclaration {
  isPub: true;
}

export interface MethodBody {
  nodeType: NodeType.MethodBody;

  useStatements: UseStatement[];
  statements: Statement[];
  conclusion: Option<Expression | ReturnablePseudex>;

  nodeId: number;
  location: TextRange;
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
  | LoopStatement
  | RepeatStatement
  | ForStatement
  | TryStatement
  | IfTypeGuardStatement
  | WhileTypeGuardStatement;

export interface StatementExpression {
  nodeType: NodeType.StatementExpression;

  expression: Expression;

  nodeId: number;
  location: TextRange;
}

export interface BlockStatement {
  nodeType: NodeType.BlockStatement;

  useStatements: UseStatement[];
  statements: Statement[];

  nodeId: number;
  location: TextRange;
}

export interface IfStatement {
  nodeType: NodeType.IfStatement;

  condition: Expression;
  body: BlockStatement;
  elseIfClauses: StatementElseIfClause[];
  elseBody: Option<BlockStatement>;

  nodeId: number;
  location: TextRange;
}

export interface StatementElseIfClause {
  nodeType: NodeType.StatementElseIfClause;

  condition: Expression;
  body: BlockStatement;

  nodeId: number;
  location: TextRange;
}

export interface SwitchStatement {
  nodeType: NodeType.SwitchStatement;

  comparedExpression: Expression;
  caseClauses: StatementCaseClause[];
  elseBody: Option<BlockStatement>;

  nodeId: number;
  location: TextRange;
}

export interface StatementCaseClause {
  nodeType: NodeType.StatementCaseClause;

  matches: Expression[];
  body: BlockStatement;

  nodeId: number;
  location: TextRange;
}

export interface ReturnStatement {
  nodeType: NodeType.ReturnStatement;

  returnedValue: Option<Expression | ReturnablePseudex>;

  nodeId: number;
  location: TextRange;
}

export interface BreakStatement {
  nodeType: NodeType.BreakStatement;

  nodeId: number;
  location: TextRange;
}

export interface ContinueStatement {
  nodeType: NodeType.ContinueStatement;

  nodeId: number;
  location: TextRange;
}

export interface VariableDeclaration {
  nodeType: NodeType.VariableDeclaration;

  isReassignable: boolean;
  doesShadow: boolean;

  name: Identifier;
  annotatedType: Option<Type>;
  initialValue: Expression | AssignmentPseudex;

  nodeId: number;
  location: TextRange;
}

export interface VariableAssignment {
  nodeType: NodeType.VariableAssignment;

  assignee: AssignableExpression;
  assignmentType: AssignmentOperator;
  assignment: Expression | AssignmentPseudex;

  nodeId: number;
  location: TextRange;
}

export type AssignmentOperator = "=" | "**=" | "*=" | "/=" | "%=" | "+=" | "-=";

export interface ThrowStatement {
  nodeType: NodeType.ThrowStatement;

  thrownValue: Expression | ReturnablePseudex;

  nodeId: number;
  location: TextRange;
}

export interface WhileStatement {
  nodeType: NodeType.WhileStatement;

  condition: Expression;
  body: BlockStatement;

  nodeId: number;
  location: TextRange;
}

export interface DoWhileStatement {
  nodeType: NodeType.DoWhileStatement;

  body: BlockStatement;
  condition: Expression;

  nodeId: number;
  location: TextRange;
}

export interface LoopStatement {
  nodeType: NodeType.LoopStatement;

  body: BlockStatement;

  nodeId: number;
  location: TextRange;
}

export interface RepeatStatement {
  nodeType: NodeType.RepeatStatement;

  repetitionQuantity: Expression;
  body: BlockStatement;

  nodeId: number;
  location: TextRange;
}

export type ForStatement =
  | CStyleForStatement
  | CollectionIterationForStatement
  | RangeForStatement;

export interface CStyleForStatement {
  nodeType: NodeType.CStyleForStatement;

  initialStatement: Statement;
  condition: Expression;
  afterthought: Statement;
  body: BlockStatement;

  nodeId: number;
  location: TextRange;
}

export interface CollectionIterationForStatement {
  nodeType: NodeType.CollectionIterationForStatement;

  bindings: ForBinding[];
  iteratee: Expression;
  body: BlockStatement;

  nodeId: number;
  location: TextRange;
}

export interface ForBinding {
  nodeType: NodeType.ForBinding;

  bindingType: ForBindingType;
  doesShadow: boolean;
  name: Identifier;

  nodeId: number;
  location: TextRange;
}

export enum ForBindingType {
  ValueBinding,
  IndexBinding,
}

export interface RangeForStatement {
  nodeType: NodeType.RangeForStatement;

  binding: ForValueBinding;
  start: Expression;
  rangeType: ForStatementRangeType;
  end: Expression;
  body: BlockStatement;

  nodeId: number;
  location: TextRange;
}

export interface ForValueBinding extends ForBinding {
  bindingType: ForBindingType.ValueBinding;
}

export enum ForStatementRangeType {
  UpUntil,
  UpTo,
  DownUntil,
  DownTo,
}

export interface TryStatement {
  nodeType: NodeType.TryStatement;

  body: BlockStatement;
  catchClauses: StatementCatchClause[];

  nodeId: number;
  location: TextRange;
}

export interface StatementCatchClause {
  nodeType: NodeType.StatementCatchClause;

  exceptionName: Identifier;
  exceptionTypes: Type[];
  body: BlockStatement;

  nodeId: number;
  location: TextRange;
}

export interface IfTypeGuardStatement {
  nodeType: NodeType.IfTypeGuardStatement;

  declarations: TypeGuardVariableDeclaration[];
  body: BlockStatement;
  elseIfClauses: StatementElseIfClause[];
  elseBody: Option<BlockStatement>;

  nodeId: number;
  location: TextRange;
}

export type TypeGuardVariableDeclaration =
  | NullGuardVariableDeclaration
  | InstanceofGuardVariableDeclaration;

export interface NullGuardVariableDeclaration {
  nodeType: NodeType.NullGuardVariableDeclaration;

  isInline: boolean;
  name: Identifier;
  assignment: Expression | AssignmentPseudex;

  nodeId: number;
  location: TextRange;
}

export interface InstanceofGuardVariableDeclaration {
  nodeType: NodeType.InstanceofGuardVariableDeclaration;

  name: Identifier;
  annotatedType: AngleBracketlessType;
  assignment: Expression | AssignmentPseudex;

  nodeId: number;
  location: TextRange;
}

export interface WhileTypeGuardStatement {
  nodeType: NodeType.WhileTypeGuardStatement;

  declarations: TypeGuardVariableDeclaration[];
  body: BlockStatement;

  nodeId: number;
  location: TextRange;
}

export type AssignmentPseudex =
  | ReturnablePseudex
  | NonReturnablePseudex
  | BlockPseudex;

export type ReturnablePseudex =
  | IfPseudex
  | SwitchPseudex
  | TryPseudex
  | TryOrThrowPseudex
  | ThrowPseudex
  | IfTypeGuardPseudex;

export type IfPseudex =
  | IfPseudexWithIfBodyPseudex
  | IfPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause
  | IfPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses;

export interface IfPseudexWithIfBodyPseudex {
  nodeType: NodeType.IfPseudex;
  pseudexType: IfPseudexType.WithIfBodyPseudex;

  condition: Expression;
  body: BlockPseudex;
  elseIfClauses: (ExpressionElseIfClause | PseudexElseIfClause)[];
  elseBody: BlockExpression | BlockPseudex;

  nodeId: number;
  location: TextRange;
}

export enum IfPseudexType {
  WithIfBodyPseudex,
  WithIfBodyExpressionAndAtLeastOnePseudexElseIfClause,
  WithIfBodyExpressionAndOnlyExpressionElseIfClauses,
}

export interface BlockPseudex {
  nodeType: NodeType.BlockPseudex;

  useStatements: UseStatement[];
  statements: Statement[];
  conclusion: Expression | ReturnablePseudex;

  nodeId: number;
  location: TextRange;
}

export interface ExpressionElseIfClause {
  nodeType: NodeType.ExpressionElseIfClause;

  condition: Expression;
  body: BlockExpression;

  nodeId: number;
  location: TextRange;
}

export interface BlockExpression {
  nodeType: NodeType.BlockExpression;

  useStatements: UseStatement[];
  conclusion: Expression;

  nodeId: number;
  location: TextRange;
}

export interface PseudexElseIfClause {
  nodeType: NodeType.PseudexElseIfClause;

  condition: Expression;
  body: BlockPseudex;

  nodeId: number;
  location: TextRange;
}

export interface IfPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause {
  nodeType: NodeType.IfPseudex;
  pseudexType: IfPseudexType.WithIfBodyExpressionAndAtLeastOnePseudexElseIfClause;

  condition: Expression;
  body: BlockExpression;
  elseIfClauses: (ExpressionElseIfClause | PseudexElseIfClause)[];
  elseBody: BlockExpression | BlockPseudex;

  nodeId: number;
  location: TextRange;
}

export interface IfPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses {
  nodeType: NodeType.IfPseudex;
  pseudexType: IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses;

  condition: Expression;
  body: BlockExpression;
  elseIfClauses: ExpressionElseIfClause[];
  elseBody: BlockExpression | BlockPseudex;

  nodeId: number;
  location: TextRange;
}

export type SwitchPseudex =
  | SwitchPseudexWithAtLeastOnePseudexCaseClause
  | SwitchPseudexWithOneOrMoreExpressionCaseClauses
  | SwitchPseudexWithNoCaseClauses;

export interface SwitchPseudexWithAtLeastOnePseudexCaseClause {
  nodeType: NodeType.SwitchPseudex;
  pseudexType: SwitchPseudexType.WithAtLeastOnePseudexCaseClause;

  comparedExpression: Expression;
  caseClauses: (ExpressionCaseClause | PseudexCaseClause)[];
  elseBody: BlockExpression | BlockPseudex;

  nodeId: number;
  location: TextRange;
}

export enum SwitchPseudexType {
  WithAtLeastOnePseudexCaseClause,
  WithOneOrMoreExpressionCaseClauses,
  WithNoCaseClauses,
}

export interface ExpressionCaseClause {
  nodeType: NodeType.ExpressionCaseClause;

  matches: Expression[];
  body: BlockExpression;

  nodeId: number;
  location: TextRange;
}

export interface PseudexCaseClause {
  nodeType: NodeType.PseudexCaseClause;

  matches: Expression[];
  body: BlockPseudex;

  nodeId: number;
  location: TextRange;
}

export interface SwitchPseudexWithOneOrMoreExpressionCaseClauses {
  nodeType: NodeType.SwitchPseudex;
  pseudexType: SwitchPseudexType.WithOneOrMoreExpressionCaseClauses;

  comparedExpression: Expression;
  caseClauses: ExpressionCaseClause[];
  elseBody: BlockPseudex;

  nodeId: number;
  location: TextRange;
}

export interface SwitchPseudexWithNoCaseClauses {
  nodeType: NodeType.SwitchPseudex;
  pseudexType: SwitchPseudexType.WithNoCaseClauses;

  comparedExpression: Expression;
  caseClauses: [];
  elseBody: BlockPseudex;

  nodeId: number;
  location: TextRange;
}

export interface TryPseudex {
  nodeType: NodeType.TryPseudex;

  body: BlockExpression | BlockPseudex;
  catchClauses: (ExpressionCatchClause | PseudexCatchClause)[];

  nodeId: number;
  location: TextRange;
}

export interface ExpressionCatchClause {
  nodeType: NodeType.ExpressionCatchClause;

  exceptionName: Identifier;
  exceptionTypes: Type[];
  body: BlockExpression;

  nodeId: number;
  location: TextRange;
}

export interface PseudexCatchClause {
  nodeType: NodeType.PseudexCatchClause;

  exceptionName: Identifier;
  exceptionTypes: Type[];
  body: BlockPseudex;

  nodeId: number;
  location: TextRange;
}

export interface TryOrThrowPseudex {
  nodeType: NodeType.TryOrThrowPseudex;

  expression: Expression;

  nodeId: number;
  location: TextRange;
}

export interface ThrowPseudex {
  nodeType: NodeType.ThrowPseudex;

  thrownValue: Expression | ReturnablePseudex;

  nodeId: number;
  location: TextRange;
}

export type IfTypeGuardPseudex =
  | IfTypeGuardPseudexWithIfBodyPseudex
  | IfTypeGuardPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause
  | IfTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses;

export interface IfTypeGuardPseudexWithIfBodyPseudex {
  nodeType: NodeType.IfTypeGuardPseudex;
  pseudexType: IfPseudexType.WithIfBodyPseudex;

  declarations: TypeGuardVariableDeclaration[];
  body: BlockPseudex;
  elseIfClauses: (ExpressionElseIfClause | PseudexElseIfClause)[];
  elseBody: BlockExpression | BlockPseudex;

  nodeId: number;
  location: TextRange;
}

export interface IfTypeGuardPseudexWithIfBodyExpressionAndAtLeastOnePseudexElseIfClause {
  nodeType: NodeType.IfTypeGuardPseudex;
  pseudexType: IfPseudexType.WithIfBodyExpressionAndAtLeastOnePseudexElseIfClause;

  declarations: TypeGuardVariableDeclaration[];
  body: BlockExpression;
  elseIfClauses: (ExpressionElseIfClause | PseudexElseIfClause)[];
  elseBody: BlockExpression | BlockPseudex;

  nodeId: number;
  location: TextRange;
}

export interface IfTypeGuardPseudexWithIfBodyExpressionAndOnlyExpressionElseIfClauses {
  nodeType: NodeType.IfTypeGuardPseudex;
  pseudexType: IfPseudexType.WithIfBodyExpressionAndOnlyExpressionElseIfClauses;

  declarations: TypeGuardVariableDeclaration[];
  body: BlockExpression;
  elseIfClauses: ExpressionElseIfClause[];
  elseBody: BlockPseudex;

  nodeId: number;
  location: TextRange;
}

export type NonReturnablePseudex =
  | RepeatingArrayFillPseudex
  | RepeatingListFillPseudex
  | SequentialListFillPseudex
  | ArrayMapPseudex
  | ListMapPseudex
  | ListFilterMapPseudex;

export interface RepeatingArrayFillPseudex {
  nodeType: NodeType.RepeatingArrayFillPseudex;

  fillExpression: Expression;
  dimensions: Expression[];

  nodeId: number;
  location: TextRange;
}

export interface RepeatingListFillPseudex {
  nodeType: NodeType.RepeatingListFillPseudex;

  fillExpression: Expression;
  dimensions: Expression[];

  nodeId: number;
  location: TextRange;
}

export interface SequentialListFillPseudex {
  nodeType: NodeType.SequentialListFillPseudex;

  elements: Expression[];

  nodeId: number;
  location: TextRange;
}

export interface ArrayMapPseudex {
  nodeType: NodeType.ArrayMapPseudex;

  output: Expression | AssignmentPseudex;
  bindings: ForBinding[];
  iteratee: Expression;

  nodeId: number;
  location: TextRange;
}

export interface ListMapPseudex {
  nodeType: NodeType.ListMapPseudex;

  output: Expression | AssignmentPseudex;
  bindings: ForBinding[];
  iteratee: Expression;

  nodeId: number;
  location: TextRange;
}

export interface ListFilterMapPseudex {
  nodeType: NodeType.ListFilterMapPseudex;

  output: Expression | AssignmentPseudex;
  bindings: ForBinding[];
  iteratee: Expression;
  predicate: Expression;

  nodeId: number;
  location: TextRange;
}

export type Expression = AssignableExpression | NonAssignableExpression;

export type AssignableExpression =
  | Identifier
  | ThisHashExpression
  | DotExpression
  | HashExpression
  | IndexExpression;

export interface ThisHashExpression {
  nodeType: NodeType.ThisHashExpression;

  right: Identifier;

  nodeId: number;
  location: TextRange;
}

export interface DotExpression {
  nodeType: NodeType.DotExpression;

  left: Expression;
  right: Identifier;

  nodeId: number;
  location: TextRange;
}

export interface HashExpression {
  nodeType: NodeType.HashExpression;

  left: Expression;
  right: Identifier;

  nodeId: number;
  location: TextRange;
}

export interface IndexExpression {
  nodeType: NodeType.IndexExpression;

  collection: Expression;
  index: Expression;

  nodeId: number;
  location: TextRange;
}

export type NonAssignableExpression =
  | LiteralExpression
  | MethodInvocationExpression
  | CastExpression
  | AnonymousInnerClassInstantiationExpression
  | LambdaExpression
  | RangeCheckExpression
  | InstanceofExpression
  | NotinstanceofExpression
  | PostfixExpression
  | PrefixExpression
  | InfixExpression
  | IfExpression
  | SwitchExpression
  | IfInlineTypeGuardExpression
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

  nodeId: number;
  location: TextRange;
}

export interface BooleanLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.Boolean;

  value: boolean;

  nodeId: number;
  location: TextRange;
}

export interface NumberLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.Number;

  source: string;

  nodeId: number;
  location: TextRange;
}

export interface CharacterLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.Character;

  source: string;

  nodeId: number;
  location: TextRange;
}

export interface StringLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.String;

  source: string;

  nodeId: number;
  location: TextRange;
}

export type ArrayLiteral =
  | SequentialArrayLiteral
  | DefaultValueArrayLiteral
  | RepeatingArrayLiteral;

export enum ArrayLiteralType {
  Sequential,
  Default,
  Repeating,
}

export interface SequentialArrayLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.Array;
  arrayType: ArrayLiteralType.Sequential;

  elements: Expression[];

  nodeId: number;
  location: TextRange;
}

export interface DefaultValueArrayLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.Array;
  arrayType: ArrayLiteralType.Default;

  fill: NumberLiteral | FalseLiteral | NullLiteral;
  dimensions: Expression[];

  nodeId: number;
  location: TextRange;
}

export interface FalseLiteral extends BooleanLiteral {
  value: false;
}

export interface RepeatingArrayLiteral {
  nodeType: NodeType.LiteralExpression;
  literalType: LiteralType.Array;
  arrayType: ArrayLiteralType.Repeating;

  fill: Expression;
  dimensions: NumberLiteral[];

  nodeId: number;
  location: TextRange;
}

export type MethodInvocationExpression =
  | MethodInvocationExpressionWithUnlabeledActualParams
  | MethodInvocationExpressionWithLabeledActualParams;

export interface MethodInvocationExpressionWithUnlabeledActualParams {
  nodeType: NodeType.MethodInvocationExpression;
  isLabeled: false;

  callee: Expression;
  typeParams: Type[];
  params: Expression[];

  nodeId: number;
  location: TextRange;
}
export interface MethodInvocationExpressionWithLabeledActualParams {
  nodeType: NodeType.MethodInvocationExpression;
  isLabeled: true;

  callee: Expression;
  typeParams: Type[];
  params: LabeledActualParam[];

  nodeId: number;
  location: TextRange;
}

export interface LabeledActualParam {
  nodeType: NodeType.LabeledActualParam;

  label: Identifier;
  value: Expression;

  nodeId: number;
  location: TextRange;
}

export interface CastExpression {
  nodeType: NodeType.CastExpression;

  castee: Expression;
  targetType: AngleBracketlessType;

  nodeId: number;
  location: TextRange;
}

export type AngleBracketlessType =
  | NiladicType
  | NullableType<AngleBracketlessType>
  | ArrayType<AngleBracketlessType>;

export interface AnonymousInnerClassInstantiationExpression {
  nodeType: NodeType.AnonymousInnerClassInstantiationExpression;

  instantiationType: AnonymousInnerClassInstantiationType;
  useStatements: UseStatement[];
  items: AnonymousInnerClassItem[];

  nodeId: number;
  location: TextRange;
}

export type AnonymousInnerClassInstantiationType =
  | NiladicType
  | InstantiatedGenericType
  | NullableType<NiladicType>
  | NullableType<InstantiatedGenericType>;

export type AnonymousInnerClassItem =
  | AnonymousInnerClassPropertyDeclaration
  | BlockStatement
  | AnonymousInnerClassMethodDeclaration;

export interface AnonymousInnerClassPropertyDeclaration {
  nodeType: NodeType.AnonymousInnerClassPropertyDeclaration;

  name: Identifier;
  annotatedType: Option<Type>;
  initialValue: Expression | AssignmentPseudex;

  nodeId: number;
  location: TextRange;
}

export interface AnonymousInnerClassMethodDeclaration {
  nodeType: NodeType.AnonymousInnerClassMethodDeclaration;

  doesOverride: boolean;

  name: Identifier;
  typeParams: FormalTypeParamDeclaration[];
  params: FormalMethodParamDeclaration[];
  returnAnnotation: Option<Type>;
  thrownExceptions: Type[];
  body: MethodBody;

  nodeId: number;
  location: TextRange;
}

export interface LambdaExpression {
  nodeType: NodeType.LambdaExpression;

  params: Identifier[];
  body: Expression | MethodBody;

  nodeId: number;
  location: TextRange;
}

export interface RangeCheckExpression {
  nodeType: NodeType.RangeCheckExpression;

  left: Expression;
  lowerBound: Expression;
  rangeType: RangeCheckRangeType;
  upperBound: Expression;

  nodeId: number;
  location: TextRange;
}

export enum RangeCheckRangeType {
  "...",
  "..=",
  "=..",
  "=.=",
}

export interface InstanceofExpression {
  nodeType: NodeType.InstanceofExpression;

  value: Expression;
  comparedType: AngleBracketlessType;

  nodeId: number;
  location: TextRange;
}

export interface NotinstanceofExpression {
  nodeType: NodeType.NotinstanceofExpression;

  value: Expression;
  comparedType: AngleBracketlessType;

  nodeId: number;
  location: TextRange;
}

export interface PostfixExpression {
  nodeType: NodeType.PostfixExpression;

  left: Expression;
  operator: PostfixOperatorType;

  nodeId: number;
  location: TextRange;
}

export enum PostfixOperatorType {
  "!",
  "?",
}

export interface PrefixExpression {
  nodeType: NodeType.PrefixExpression;

  operator: PrefixOperatorType;
  right: Expression;

  nodeId: number;
  location: TextRange;
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

  nodeId: number;
  location: TextRange;
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
  "~<",
  "~<=",
  "~>",
  "~>=",
  "==",
  "!=",
  "~=",
  "!~=",
  "&&",
  "||",
}

export interface IfExpression {
  nodeType: NodeType.IfExpression;

  condition: Expression;
  body: BlockExpression;
  elseIfClauses: ExpressionElseIfClause[];
  elseBody: BlockExpression;

  nodeId: number;
  location: TextRange;
}

export interface SwitchExpression {
  nodeType: NodeType.SwitchExpression;

  comparedExpression: Expression;
  caseClauses: ExpressionCaseClause[];
  elseBody: BlockExpression;

  nodeId: number;
  location: TextRange;
}

export interface IfInlineTypeGuardExpression {
  nodeType: NodeType.IfInlineTypeGuardExpression;

  variableDeclarations: InlineTypeGuardVariableDeclaration[];
  body: BlockExpression;
  elseIfClauses: ExpressionElseIfClause[];
  elseBody: BlockExpression;

  nodeId: number;
  location: TextRange;
}

export interface InlineTypeGuardVariableDeclaration
  extends NullGuardVariableDeclaration {
  isInline: true;
}

export interface ParenthesizedExpression {
  nodeType: NodeType.ParenthesizedExpression;

  innerValue: Expression;

  nodeId: number;
  location: TextRange;
}
