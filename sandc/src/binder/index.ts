import * as lst from "../lst";
import { NodeType } from "../lst";
import * as pbt from "../pbt";
import { Ref } from "../pbt";
import { TextPosition } from "../textPosition";
import nullishMap from "../utils/nullishMap";
import { all as globallyAvailableReferenceNames } from "./globallyAvailableReferences";

export interface BoundFileNodesAndRefs {
  fileNodes: pbt.FileNode[];
  refs: Ref[];
}

export function bindFileNodes(nodes: lst.FileNode[]): BoundFileNodesAndRefs {
  return getBinder().bindFileNodes(nodes);
}

interface Binder {
  bindFileNodes(nodes: lst.FileNode[]): BoundFileNodesAndRefs;
}

type FileNodeWithOutBoundPubClass = Omit<lst.FileNode, "pubClass"> & {
  pubClass: OutBoundPubClass;
};

type OutBoundPubClass = lst.PubClass & { outRef: Ref };

type OutBoundClassItem =
  | lst.InstantiationRestriction
  | (lst.ClassItem & { outRef: Ref });

function getBinder(): Binder {
  const allRefs: Ref[] = [];
  const refStack: Ref[] = [];
  const refsDefinedInEachPackage = new PackageRefCollector();

  function bindFileNodes(nodes: lst.FileNode[]): BoundFileNodesAndRefs {
    const withPubClassOutBound = nodes.map(outBindFileNodePubClass);

    pushLanguageDefinedGlobalRefs();
    pushPackageNames();
    pushRefsDefinedInUnnamedPackage();

    const inBound = withPubClassOutBound.map(bindFileNode);
    return { fileNodes: inBound, refs: allRefs };
  }

  function outBindFileNodePubClass(
    node: lst.FileNode,
  ): FileNodeWithOutBoundPubClass {
    const outRef = createAndPushRefToPackageCollector(
      node.pubClass.name,
      node.packageName,
    );
    const pubClass = { ...node.pubClass, outRef };
    return { ...node, pubClass };
  }

  function pushLanguageDefinedGlobalRefs(): void {
    globallyAvailableReferenceNames.forEach(createAndPushRef);
  }

  function pushPackageNames(): void {
    const packageNames = refsDefinedInEachPackage.getPackageNames();
    packageNames.forEach(name => {
      if (!canFindRef(name)) {
        createAndPushRef(name);
      }
    });
  }

  function pushRefsDefinedInUnnamedPackage(): void {
    const refs = refsDefinedInEachPackage.getRefsDefinedIn(null);
    refs.forEach(ref => {
      if (canFindRef(ref.name)) {
        throw new ReferenceError(
          "ReferenceError: `" +
            ref.name +
            "` (defined in the unnamed package) conflicts with another reference of the same name.",
        );
      } else {
        refStack.push(ref);
      }
    });
  }

  function bindFileNode(node: FileNodeWithOutBoundPubClass): pbt.FileNode {
    return execInNewRefScope<pbt.FileNode>(() => {
      if (node.packageName !== null) {
        pushRefsDefinedInNamedPackage(node.packageName);
      }

      const imports = node.imports.map(bindImportStatement);
      const useStatements = node.useStatements.map(bindUseStatement);

      const outBoundPrivClasses = node.privClasses.map(outBindClass);
      const pubClass = inBindClass(node.pubClass);
      const privClasses = outBoundPrivClasses.map(inBindClass);

      return {
        ...node,
        imports,
        useStatements,
        pubClass,
        privClasses,
      };
    });
  }

  function pushRefsDefinedInNamedPackage(packageName: string): void {
    const refs = refsDefinedInEachPackage.getRefsDefinedIn(packageName);
    refs.forEach(ref => {
      if (canFindRef(ref.name)) {
        throw new ReferenceError(
          "ReferenceError: `" +
            ref.name +
            '` (defined in package "' +
            packageName +
            '") conflicts with another reference of the same name.',
        );
      } else {
        refStack.push(ref);
      }
    });
  }

  function bindImportStatement(node: lst.Import): pbt.Import {
    validateImportName(node.name);
    const leftmostIdentifier = getLeftmostIdentifierName(node.name);
    const leftmostInRef = expectRef(leftmostIdentifier, node.location.start);
    const rightmostIdentifier = getRightmostIdentifierName(node.name);
    const outRef = createAndPushNonShadowingRef(
      rightmostIdentifier,
      node.location.start,
    );

    return {
      ...node,
      leftmostInRef,
      outRef,
    };
  }

  function bindUseStatement(node: lst.Use): pbt.Use {
    const leftmostIdentifier = getLeftmostIdentifierName(node.name);
    const leftmostInRef = expectRef(leftmostIdentifier, node.location.start);
    const refName = getUseStatementRefName(node);

    const outRef: Ref = (() => {
      if (node.doesShadow) {
        assertNameShadows(refName, node.location.start);
        return createAndPushRef(refName);
      } else {
        return createAndPushNonShadowingRef(refName, node.location.start);
      }
    })();

    return {
      ...node,
      leftmostInRef,
      outRef,
    };
  }

  function outBindClass(node: lst.PubClass): lst.PubClass & { outRef: Ref };
  function outBindClass(node: lst.PrivClass): lst.PrivClass & { outRef: Ref };

  function outBindClass(node: lst.Class): lst.Class & { outRef: Ref } {
    const outRef = createAndPushNonShadowingRef(node.name, node.location.start);
    return { ...node, outRef };
  }

  function inBindClass(node: lst.PubClass & { outRef: Ref }): pbt.PubClass;
  function inBindClass(node: lst.PrivClass & { outRef: Ref }): pbt.PrivClass;

  function inBindClass(node: lst.Class & { outRef: Ref }): pbt.Class {
    return execInNewRefScope<pbt.Class>(() => {
      const typeArgDefs = node.typeArgDefs.map(bindTypeArgDef);
      const superClass = nullishMap(node.superClass, bindTypeNode);
      const copies = node.copies.map(bindStaticMethodCopyStatement);
      const useStatements = node.useStatements.map(bindUseStatement);
      const outBoundItems = node.items.map(outBindClassItem);
      const items = outBoundItems.map(inBindClassItem);
      return { ...node, copies, typeArgDefs, superClass, useStatements, items };
    });
  }

  function bindTypeArgDef(node: lst.TypeArgDef): pbt.TypeArgDef {
    const outRef = createAndPushNonShadowingRef(node.name, node.location.start);
    const constraint = bindTypeConstraint(node.constraint);
    return { ...node, constraint, outRef };
  }

  function bindTypeConstraint(node: lst.TypeConstraint): pbt.TypeConstraint {
    switch (node.constraintType) {
      case lst.ConstraintType.None:
        return node;
      case lst.ConstraintType.Extends: {
        const superType = bindTypeNode(node.superType);
        return { ...node, superType };
      }
    }
  }

  function bindTypeNode(node: lst.Type): pbt.Type {
    const leftmostIdentName = getLeftmostIdentifierName(node.name);
    const leftmostInRef = expectRef(leftmostIdentName, node.location.start);
    const args = node.args.map(bindTypeNode);
    return { ...node, args, leftmostInRef };
  }

  function bindStaticMethodCopyStatement(
    node: lst.StaticMethodCopy,
  ): pbt.StaticMethodCopy {
    const signature = nullishMap(node.signature, bindStaticMethodCopySignature);
    const leftmostInRef = expectRef(
      getLeftmostIdentifierName(node.name),
      node.location.start,
    );
    const outRef = createAndPushNonShadowingRef(
      getStaticMethodCopyStatementRefName(node),
      node.location.start,
    );
    return { ...node, signature, leftmostInRef, outRef };
  }

  function bindStaticMethodCopySignature(
    node: lst.StaticMethodCopySignature,
  ): pbt.StaticMethodCopySignature {
    return execInNewRefScope<pbt.StaticMethodCopySignature>(() => {
      const typeArgs = node.typeArgs.map(bindTypeArgDef);
      const argTypes = node.argTypes.map(bindTypeNode);
      return { ...node, typeArgs, argTypes };
    });
  }

  function outBindClassItem(node: lst.ClassItem): OutBoundClassItem {
    if (node.type === NodeType.InstantiationRestriction) {
      return node;
    }

    const shadowedRef = findRef(node.name);
    if (
      (node.type === NodeType.AbstractMethodDeclaration ||
        node.type === NodeType.ConcreteMethodDeclaration) &&
      shadowedRef !== null
    ) {
      return { ...node, outRef: shadowedRef };
    } else {
      const outRef = createAndPushNonShadowingRef(
        node.name,
        node.location.start,
      );
      return { ...node, outRef };
    }
  }

  function inBindClassItem(node: OutBoundClassItem): pbt.ClassItem {
    switch (node.type) {
      case NodeType.InstantiationRestriction:
        return node;
      case NodeType.StaticPropertyDeclaration:
        return bindStaticPropertyDeclaration(node);
      case NodeType.InstancePropertyDeclaration:
        return bindInstancePropertyDeclaration(node);
      case NodeType.ConcreteMethodDeclaration:
        return bindConcreteMethodDeclaration(node);
      case NodeType.AbstractMethodDeclaration:
        return bindAbstractMethodDeclaration(node);
    }
  }

  function bindStaticPropertyDeclaration(
    node: lst.StaticPropertyDeclaration & { outRef: Ref },
  ): pbt.StaticPropertyDeclaration {
    const valueType = nullishMap(node.valueType, bindTypeNode);
    const initialValue = bindExpr(node.initialValue);
    return { ...node, valueType, initialValue };
  }

  function bindInstancePropertyDeclaration(
    node: lst.InstancePropertyDeclaration & { outRef: Ref },
  ): pbt.InstancePropertyDeclaration {
    const valueType = bindTypeNode(node.valueType);
    return { ...node, valueType };
  }

  function bindConcreteMethodDeclaration(
    node: lst.ConcreteMethodDeclaration & { outRef: Ref },
  ): pbt.ConcreteMethodDeclaration {
    return execInNewRefScope<pbt.ConcreteMethodDeclaration>(() => {
      const typeArgs = node.typeArgs.map(bindTypeArgDef);
      const args = node.args.map(bindTypedArgDef);
      const returnType = nullishMap(node.returnType, bindTypeNode);
      const body = bindCompoundNode(node.body);
      return { ...node, typeArgs, args, returnType, body };
    });
  }

  function bindAbstractMethodDeclaration(
    node: lst.AbstractMethodDeclaration & { outRef: Ref },
  ): pbt.AbstractMethodDeclaration {
    return execInNewRefScope<pbt.AbstractMethodDeclaration>(() => {
      const typeArgs = node.typeArgs.map(bindTypeArgDef);
      const args = node.args.map(bindTypedArgDef);
      const returnType = nullishMap(node.returnType, bindTypeNode);
      return { ...node, typeArgs, args, returnType };
    });
  }

  function bindTypedArgDef(def: lst.TypedArgDef): pbt.TypedArgDef {
    const outRef = createAndPushRef(def.name);
    const valueType = bindTypeNode(def.valueType);
    return { ...def, valueType, outRef };
  }

  function bindCompoundNode(node: lst.CompoundNode): pbt.CompoundNode {
    return execInNewRefScope<pbt.CompoundNode>(() => {
      const useStatements = node.useStatements.map(bindUseStatement);
      const nodes = node.nodes.map(bindCompoundNodeSubnode);
      return { ...node, useStatements, nodes };
    });
  }

  function bindCompoundNodeSubnode(
    item: lst.Statement | lst.Expr,
  ): pbt.Statement | pbt.Expr {
    if (lst.isStatement(item)) {
      return bindStatement(item);
    } else {
      return bindExpr(item);
    }
  }

  function bindStatement(node: lst.Statement): pbt.Statement {
    switch (node.type) {
      case NodeType.LocalVariableDeclaration:
        return bindLocalVariableDeclaration(node);
      case NodeType.Assignment:
        return bindAssignment(node);
      case NodeType.Return:
        return bindReturnStatement(node);
      case NodeType.Break:
        return node;
      case NodeType.Continue:
        return node;
      case NodeType.Throw:
        return bindThrowStatement(node);
      case NodeType.If:
        return bindIfNode(node);
      case NodeType.Do:
        return bindDoNode(node);
      case NodeType.Try:
        return bindTryStatement(node);
      case NodeType.While:
        return bindWhileStatement(node);
      case NodeType.Loop:
        return bindLoopStatement(node);
      case NodeType.Repeat:
        return bindRepeatStatement(node);
      case NodeType.For:
        return bindForStatement(node);
    }
  }

  function bindLocalVariableDeclaration(
    node: lst.LocalVariableDeclaration,
  ): pbt.LocalVariableDeclaration {
    const outRef = node.doesShadow
      ? createAndPushRef(node.name)
      : createAndPushNonShadowingRef(node.name, node.location.start);
    const valueType = nullishMap(node.valueType, bindTypeNode);
    const initialValue = bindExpr(node.initialValue);
    return { ...node, outRef, valueType, initialValue };
  }

  function bindAssignment(node: lst.Assignment): pbt.Assignment {
    const assignee = bindExpr(node.assignee);
    const value = bindExpr(node.value);
    return { ...node, assignee, value };
  }

  function bindReturnStatement(node: lst.Return): pbt.Return {
    const value = nullishMap(node.value, bindExpr);
    return { ...node, value };
  }

  function bindThrowStatement(node: lst.Throw): pbt.Throw {
    const value = bindExpr(node.value);
    return { ...node, value };
  }

  function bindIfNode(node: lst.If): pbt.If {
    const condition = bindExpr(node.condition);
    const body = bindCompoundNode(node.body);
    const alternatives = node.alternatives.map(bindIfAlternative);
    return { ...node, condition, body, alternatives };
  }

  function bindIfAlternative(node: lst.IfAlternative): pbt.IfAlternative {
    switch (node.alternativeType) {
      case lst.IfAlternativeType.ElseIf:
        return bindElseIfNode(node);
      case lst.IfAlternativeType.Else:
        return bindElseNode(node);
    }
  }

  function bindElseIfNode(node: lst.ElseIf): pbt.ElseIf {
    const condition = bindExpr(node.condition);
    const body = bindCompoundNode(node.body);
    return { ...node, condition, body };
  }

  function bindElseNode(node: lst.Else): pbt.Else {
    const body = bindCompoundNode(node.body);
    return { ...node, body };
  }

  function bindDoNode(node: lst.Do): pbt.Do {
    const body = bindCompoundNode(node.body);
    return { ...node, body };
  }

  function bindTryStatement(node: lst.Try): pbt.Try {
    const body = bindCompoundNode(node.body);
    const catches = node.catches.map(bindCatchNode);
    return { ...node, body, catches };
  }

  function bindCatchNode(node: lst.Catch): pbt.Catch {
    switch (node.catchType) {
      case lst.CatchType.BoundCatch:
        return bindCatchNodeWithErrorBinding(node);
      case lst.CatchType.RestrictedBindinglessCatch:
        return bindCatchNodeWithBindinglessErrorRestriction(node);
      case lst.CatchType.CatchAll:
        return bindCatchAllNode(node);
    }
  }

  function bindCatchNodeWithErrorBinding(node: lst.BoundCatch): pbt.BoundCatch {
    return execInNewRefScope<pbt.BoundCatch>(() => {
      const arg = bindTypedArgDef(node.arg);
      const body = bindCompoundNode(node.body);
      return { ...node, arg, body };
    });
  }

  function bindCatchNodeWithBindinglessErrorRestriction(
    node: lst.RestrictedBindinglessCatch,
  ): pbt.RestrictedBindinglessCatch {
    const caughtTypes = node.caughtTypes.map(bindTypeNode);
    const body = bindCompoundNode(node.body);
    return { ...node, caughtTypes, body };
  }

  function bindCatchAllNode(node: lst.CatchAll): pbt.CatchAll {
    const body = bindCompoundNode(node.body);
    return { ...node, body };
  }

  function bindWhileStatement(node: lst.While): pbt.While {
    const condition = bindExpr(node.condition);
    const body = bindCompoundNode(node.body);
    return { ...node, condition, body };
  }

  function bindLoopStatement(node: lst.Loop): pbt.Loop {
    const body = bindCompoundNode(node.body);
    return { ...node, body };
  }

  function bindRepeatStatement(node: lst.Repeat): pbt.Repeat {
    const repetitions = bindExpr(node.repetitions);
    const body = bindCompoundNode(node.body);
    return { ...node, repetitions, body };
  }

  function bindForStatement(node: lst.For): pbt.For {
    return execInNewRefScope<pbt.For>(() => {
      const binding = bindForNodeBinding(node.binding);
      const iteratee = bindExpr(node.iteratee);
      const body = bindCompoundNode(node.body);
      return { ...node, binding, iteratee, body };
    });
  }

  function bindForNodeBinding(node: lst.Binding): pbt.Binding {
    switch (node.type) {
      case NodeType.SingleBinding:
        return bindSingleBinding(node);
      case NodeType.FlatTupleBinding:
        return bindFlatTupleBinding(node);
    }
  }

  function bindSingleBinding(node: lst.SingleBinding): pbt.SingleBinding {
    const outRef = createAndPushNonShadowingRef(node.name, node.location.start);
    return { ...node, outRef };
  }

  function bindFlatTupleBinding(
    node: lst.FlatTupleBinding,
  ): pbt.FlatTupleBinding {
    const bindings = node.bindings.map(bindSingleBinding);
    return { ...node, bindings };
  }

  function bindExpr(node: lst.Expr): pbt.Expr {
    switch (node.type) {
      case NodeType.NumberLiteral:
        return node;
      case NodeType.StringLiteral:
        return node;
      case NodeType.CharacterLiteral:
        return node;
      case NodeType.Identifier:
        return bindIdentifier(node);
      case NodeType.InfixExpr:
        return bindInfixExpr(node);
      case NodeType.PrefixExpr:
        return bindPrefixExpr(node);
      case NodeType.DotExpr:
        return bindDotExpr(node);
      case NodeType.IndexExpr:
        return bindIndexExpr(node);
      case NodeType.CastExpr:
        return bindCastExpr(node);
      case NodeType.FunctionCall:
        return bindFunctionCall(node);
      case NodeType.TypedObjectLiteral:
        return bindTypedObjectLiteral(node);
      case NodeType.ArrayLiteral:
        return bindArrayLiteral(node);
      case NodeType.RangeLiteral:
        return bindRangeLiteral(node);
      case NodeType.MagicFunctionLiteral:
        return bindMagicFunctionLiteral(node);
      case NodeType.If:
        return bindIfNode(node);
      case NodeType.Do:
        return bindDoNode(node);
    }
  }

  function bindIdentifier(node: lst.Identifier): pbt.Identifier {
    const inRef = expectRef(node.name, node.location.start);
    return { ...node, inRef };
  }

  function bindInfixExpr(node: lst.InfixExpr): pbt.InfixExpr {
    const left = bindExpr(node.left);
    const right = bindExpr(node.right);
    return { ...node, left, right };
  }

  function bindPrefixExpr(node: lst.PrefixExpr): pbt.PrefixExpr {
    const right = bindExpr(node.right);
    return { ...node, right };
  }

  function bindDotExpr(node: lst.DotExpr): pbt.DotExpr {
    const left = bindExpr(node.left);
    return { ...node, left };
  }

  function bindIndexExpr(node: lst.IndexExpr): pbt.IndexExpr {
    const left = bindExpr(node.left);
    const right = bindExpr(node.right);
    return { ...node, left, right };
  }

  function bindCastExpr(node: lst.CastExpr): pbt.CastExpr {
    const value = bindExpr(node.value);
    const targetType = bindTypeNode(node.targetType);
    return { ...node, value, targetType };
  }

  function bindFunctionCall(node: lst.FunctionCall): pbt.FunctionCall {
    const callee = bindExpr(node.callee);
    const typeArgs = node.typeArgs.map(bindTypeNode);
    const args = node.args.map(bindExpr);
    return { ...node, callee, typeArgs, args };
  }

  function bindTypedObjectLiteral(
    node: lst.TypedObjectLiteral,
  ): pbt.TypedObjectLiteral {
    const valueType = bindTypeNode(node.valueType);
    const copies = node.copies.map(bindObjectCopyNode);
    const entries = node.entries.map(bindObjectEntryNode);
    return { ...node, valueType, copies, entries };
  }

  function bindObjectCopyNode(node: lst.ObjectCopy): pbt.ObjectCopy {
    const source = bindExpr(node.source);
    return { ...node, source };
  }

  function bindObjectEntryNode(node: lst.ObjectEntry): pbt.ObjectEntry {
    const value = nullishMap(node.value, bindExpr);
    return { ...node, value };
  }

  function bindArrayLiteral(node: lst.ArrayLiteral): pbt.ArrayLiteral {
    const elements = node.elements.map(bindExpr);
    return { ...node, elements };
  }

  function bindRangeLiteral(node: lst.RangeLiteral): pbt.RangeLiteral {
    const start = bindExpr(node.start);
    const end = bindExpr(node.end);
    return { ...node, start, end };
  }

  function bindMagicFunctionLiteral(
    node: lst.MagicFunctionLiteral,
  ): pbt.MagicFunctionLiteral {
    return execInNewRefScope<pbt.MagicFunctionLiteral>(() => {
      const args = node.args.map(bindUntypedArgDef);
      const body = bindMagicFunctionBody(node.body);
      return { ...node, args, body };
    });
  }

  function bindUntypedArgDef(node: lst.UntypedArgDef): pbt.UntypedArgDef {
    const outRef = createAndPushRef(node.name);
    return { ...node, outRef };
  }

  function bindMagicFunctionBody(
    node: lst.MagicFunctionLiteral["body"],
  ): pbt.MagicFunctionLiteral["body"] {
    if (node.type === NodeType.CompoundNode) {
      return bindCompoundNode(node);
    } else {
      return bindExpr(node);
    }
  }

  function createAndPushRef(name: string): Ref {
    const ref = createRef(name);
    refStack.push(ref);
    return ref;
  }

  function createAndPushRefToPackageCollector(
    refName: string,
    packageName: string | null,
  ): Ref {
    const ref = createRef(refName);
    refsDefinedInEachPackage.addRef(packageName, ref);
    return ref;
  }

  function createRef(name: string): Ref {
    const refId = allRefs.length;

    const ref = {
      refId,
      name,
    };

    allRefs.push(ref);

    return ref;
  }

  function createAndPushNonShadowingRef(
    name: string,
    locationToBlame: TextPosition,
  ): Ref {
    if (canFindRef(name)) {
      throw new ReferenceError(
        "Reference error at (" +
          locationToBlame.line +
          ":" +
          locationToBlame.column +
          "): Cannot shadow reference " +
          name,
      );
    } else {
      return createAndPushRef(name);
    }
  }

  function assertNameShadows(name: string, location: TextPosition): void {
    if (findRef(name) === null) {
      throw new ReferenceError(
        "ReferenceError at (" +
          location.line +
          ":" +
          location.column +
          "): Expected reference to shadow, but reference does not shadow.",
      );
    }
  }

  function findRef(name: string): Ref | null {
    for (let i = refStack.length - 1; i >= 0; i--) {
      const ref = refStack[i];
      if (ref.name === name) {
        return ref;
      }
    }

    return null;
  }

  function canFindRef(name: string): boolean {
    return findRef(name) !== null;
  }

  function expectRef(name: string, location: TextPosition): Ref {
    const ref = findRef(name);
    if (ref === null) {
      throw new ReferenceError(
        "Reference error at (" +
          location.line +
          ":" +
          location.column +
          '): Cannot resolve reference "' +
          name +
          '".',
      );
    } else {
      return ref;
    }
  }

  function execInNewRefScope<T>(callback: () => T): T {
    const originalRefStackLen = refStack.length;
    const val = callback();
    truncate(refStack, originalRefStackLen);
    return val;
  }

  return { bindFileNodes };
}

class PackageRefCollector {
  private refMap: Map<string | null, Ref[]>;

  constructor() {
    this.refMap = new Map();
  }

  addRef(packageName: string | null, ref: Ref): void {
    if (!this.refMap.has(packageName)) {
      this.refMap.set(packageName, []);
    }

    this.refMap.get(packageName)!.push(ref);
  }

  getRefsDefinedIn(packageName: string | null): Ref[] {
    return this.refMap.get(packageName) || [];
  }

  getPackageNames(): string[] {
    return Array.from(this.refMap.keys()).filter(
      (x: string | null): x is string => x !== null,
    );
  }
}

function truncate(arr: any[], len: number): void {
  arr.splice(len, arr.length - len);
}

function validateImportName(name: string): void {
  if (!name.includes(".")) {
    throw new SyntaxError('Import statements must include at least one "."');
  }
}

function getUseStatementRefName(use: lst.Use): string {
  if (use.alias === null) {
    return getRightmostIdentifierName(use.name);
  } else {
    return use.alias;
  }
}

function getStaticMethodCopyStatementRefName(
  copy: lst.StaticMethodCopy,
): string {
  if (copy.alias === null) {
    return getRightmostIdentifierName(copy.name);
  } else {
    return copy.alias;
  }
}

function getLeftmostIdentifierName(dotSeparatedIdentifiers: string): string {
  const idents = dotSeparatedIdentifiers.split(".");
  return idents[0];
}

function getRightmostIdentifierName(dotSeparatedIdentifiers: string): string {
  const idents = dotSeparatedIdentifiers.split(".");
  return idents[idents.length - 1];
}
