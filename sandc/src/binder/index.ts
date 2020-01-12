import * as ast from "../ast";
import * as pbt from "../pbt";
import { NodeLocation } from "../ast";
import { Ref, RefId, NodeId } from "../pbt";
import { all as globallyAvailableReferences } from "./globallyAvailableReferences";

export function bindFileNode(fileNode: ast.FileNode): pbt.FileNode {
  return Binder.bindFileNode(fileNode);
}

class Binder {
  private refIdCounter: number;
  private refMap: Map<number, Ref>;
  private refStack: Ref[];
  private nodeIdCounter: number;

  static bindFileNode(fileNode: ast.FileNode): pbt.FileNode {
    return new Binder().bindFileNode(fileNode);
  }

  private constructor() {
    this.bindMethods();

    this.refIdCounter = 0;
    this.refMap = new Map();
    this.refStack = this.getGlobalRefs();

    this.nodeIdCounter = 0;
  }

  private bindMethods(): void {
    this.createGlobalRef = this.createGlobalRef.bind(this);
    this.emitClassRef = this.emitClassRef.bind(this);
    this.bindClass = this.bindClass.bind(this);
    this.bindTypeArgDef = this.bindTypeArgDef.bind(this);
    this.bindType = this.bindType.bind(this);
    this.bindStaticMethodCopyStatement = this.bindStaticMethodCopyStatement.bind(
      this,
    );
    this.bindStaticMethodCopySignature = this.bindStaticMethodCopySignature.bind(
      this,
    );
    this.bindUseStatement = this.bindUseStatement.bind(this);
    this.bindInstantiationRestriction = this.bindInstantiationRestriction.bind(
      this,
    );
    this.emitClassItemRef = this.emitClassItemRef.bind(this);
    this.bindClassItem = this.bindClassItem.bind(this);
    this.bindObjectCopyNode = this.bindObjectCopyNode.bind(this);
    this.bindObjectEntryNode = this.bindObjectEntryNode.bind(this);
    this.bindUntypedArgDef = this.bindUntypedArgDef.bind(this);
    this.bindMagicFunctionBody = this.bindMagicFunctionBody.bind(this);
    this.bindArgDef = this.bindArgDef.bind(this);
    this.bindCompoundNodeItem = this.bindCompoundNodeItem.bind(this);
    this.bindIfAlternative = this.bindIfAlternative.bind(this);
    this.bindSingleBinding = this.bindSingleBinding.bind(this);
    this.bindCatchNode = this.bindCatchNode.bind(this);
    this.bindExpr = this.bindExpr.bind(this);
  }

  private getGlobalRefs(): Ref[] {
    return globallyAvailableReferences.map(this.createGlobalRef);
  }

  private createRefId(): RefId {
    this.refIdCounter++;
    return { isRefId: true, value: this.refIdCounter };
  }

  private createNodeId<DependsOnRef extends boolean, EmitsRef extends boolean>(
    isRefDependencyNodeId: DependsOnRef,
    isRefSourceNodeId: EmitsRef,
  ): NodeId<DependsOnRef, EmitsRef> {
    this.nodeIdCounter++;
    return {
      isNodeId: true,
      isRefDependencyNodeId,
      isRefSourceNodeId,
      value: this.nodeIdCounter,
    };
  }

  private createGlobalRef(name: string): Ref {
    const refId = this.createRefId();
    const nodeId = this.createNodeId(false, true);

    const ref = {
      refId,
      sourceNodeIds: [nodeId],
      dependentNodeIds: [],
      name,
    };

    this.refMap.set(ref.refId.value, ref);

    return ref;
  }

  private findRef(name: string): Ref | null {
    for (let i = this.refStack.length - 1; i >= 0; i--) {
      const ref = this.refStack[i];
      if (ref.name === name) {
        return ref;
      }
    }

    return null;
  }

  private expectRef(name: string, location: PointLocation): Ref {
    const ref = this.findRef(name);
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

  private dependOnRef(
    name: string,
    nodeId: NodeId<true, boolean>,
    location: PointLocation,
  ): Ref {
    const ref = this.expectRef(name, location);
    ref.dependentNodeIds.push(nodeId);
    return ref;
  }

  private assertNameShadows(name: string, location: PointLocation): void {
    if (this.findRef(name) === null) {
      throw new ReferenceError(
        "ReferenceError at (" +
          location.line +
          ":" +
          location.column +
          "): Expected reference to shadow, but reference does not shadow.",
      );
    }
  }

  private createAndAppendNonShadowingRefFromSourceId(
    sourceId: NodeId<boolean, true>,
    name: string,
    location: PointLocation,
  ): Ref {
    if (this.findRef(name) !== null) {
      throw new ReferenceError(
        "Reference error at (" +
          location.line +
          ":" +
          location.column +
          "): Cannot shadow reference " +
          name,
      );
    }

    return this.createAndAppendRefFromSourceId(sourceId, name);
  }

  private createAndAppendRefFromSourceId(
    sourceId: NodeId<boolean, true>,
    name: string,
  ): Ref {
    const ref = this.createRefFromSource(sourceId, name);
    this.refStack.push(ref);
    return ref;
  }

  private createRefFromSource(
    sourceId: NodeId<boolean, true>,
    name: string,
  ): Ref {
    const refId = this.createRefId();
    const ref = {
      refId,
      sourceNodeIds: [sourceId],
      dependentNodeIds: [],
      name,
    };

    this.refMap.set(ref.refId.value, ref);

    return ref;
  }

  private execInNewRefScope<T>(callback: () => T): T {
    const originalRefStackLen = this.refStack.length;
    const val = callback();
    truncate(this.refStack, originalRefStackLen);
    return val;
  }

  bindFileNode(file: ast.FileNode): pbt.FileNode {
    const nodeId = this.createNodeId(false, false);

    const imports = this.bindImports(file);
    const useStatements = file.useStatements.map(this.bindUseStatement);

    const classesWithEmittedRefs = this.emitClassRefs(file);
    const { pubClass, privClasses } = this.bindClasses(classesWithEmittedRefs);

    return {
      type: pbt.NodeType.File,
      nodeId,
      packageName: file.packageName,
      imports,
      useStatements,
      pubClass,
      privClasses,
      location: file.location,
    };
  }

  private bindImports(file: ast.FileNode): pbt.Import[] {
    return file.imports.map(statement => {
      const nodeId = this.createNodeId(true, true);
      validateImportName(statement.name);
      const leftmostIdentifier = getLeftmostIdentifierName(statement.name);
      const leftmostInRef = this.dependOnRef(
        leftmostIdentifier,
        nodeId,
        start(statement.location),
      );
      const rightmostIdentifier = getRightmostIdentifierName(statement.name);
      const outRef = this.createAndAppendNonShadowingRefFromSourceId(
        nodeId,
        rightmostIdentifier,
        start(statement.location),
      );

      return {
        ...statement,
        nodeId,
        leftmostInRefId: leftmostInRef.refId,
        outRefId: outRef.refId,
      };
    });
  }

  private emitClassRefs(file: ast.FileNode): ClassesWithEmittedRefs {
    return {
      pubClass: this.emitClassRef(file.pubClass),
      privClasses: file.privClasses.map(this.emitClassRef),
    };
  }

  private emitClassRef<T extends ast.Class>(
    classNode: T,
  ): ClassWithEmittedRef<T> {
    const nodeId = this.createNodeId(false, true);
    const outRef = this.createAndAppendNonShadowingRefFromSourceId(
      nodeId,
      classNode.name,
      start(classNode.location),
    );
    return { ...classNode, nodeId, outRefId: outRef.refId };
  }

  private bindClasses(classes: ClassesWithEmittedRefs): BoundClasses {
    return {
      pubClass: this.bindClass(classes.pubClass),
      privClasses: classes.privClasses.map(this.bindClass),
    };
  }

  private bindClass(node: ClassWithEmittedRef<ast.PubClass>): pbt.PubClass;
  private bindClass(node: ClassWithEmittedRef<ast.PrivClass>): pbt.PrivClass;

  private bindClass(node: ClassWithEmittedRef<ast.Class>): pbt.Class {
    return this.execInNewRefScope<pbt.Class>(() => {
      const typeArgDefs = node.typeArgDefs.map(this.bindTypeArgDef);
      const superClass = nullishMap(node.superClass, this.bindType);
      const copies = node.copies.map(this.bindStaticMethodCopyStatement);
      const useStatements = node.useStatements.map(this.bindUseStatement);
      const items = this.bindClassItems(node);

      return {
        ...node,
        typeArgDefs,
        superClass,
        copies,
        useStatements,
        items,
      };
    });
  }

  private bindTypeArgDef(def: ast.TypeArgDef): pbt.TypeArgDef {
    const nodeId = this.createNodeId(false, true);
    const outRef = this.createAndAppendNonShadowingRefFromSourceId(
      nodeId,
      def.name,
      start(def.location),
    );
    const constraint = this.bindTypeConstraint(def.constraint);
    return { ...def, nodeId, outRefId: outRef.refId, constraint };
  }

  private bindTypeConstraint(
    constraint: ast.TypeConstraint,
  ): pbt.TypeConstraint {
    switch (constraint.constraintType) {
      case ast.ConstraintType.None:
        return constraint;
      case ast.ConstraintType.Extends: {
        const superType = this.bindType(constraint.superType);
        return { ...constraint, superType };
      }
    }
  }

  private bindType(type: ast.Type): pbt.Type {
    const nodeId = this.createNodeId(true, false);
    const inRef = this.dependOnRef(type.name, nodeId, start(type.location));
    const args = type.args.map(this.bindType);
    return { ...type, nodeId, inRefId: inRef.refId, args };
  }

  private bindStaticMethodCopyStatement(
    copy: ast.StaticMethodCopy,
  ): pbt.StaticMethodCopy {
    const nodeId = this.createNodeId(true, true);
    const leftmostIdent = getLeftmostIdentifierName(copy.name);
    const leftmostInRef = this.dependOnRef(
      leftmostIdent,
      nodeId,
      start(copy.location),
    );
    const outRef = this.createAndAppendNonShadowingRefFromSourceId(
      nodeId,
      getStaticMethodCopyStatementRefName(copy),
      start(copy.location),
    );
    const signature = nullishMap(
      copy.signature,
      this.bindStaticMethodCopySignature,
    );
    return {
      ...copy,
      nodeId,
      leftmostInRefId: leftmostInRef.refId,
      outRefId: outRef.refId,
      signature,
    };
  }

  private bindStaticMethodCopySignature(
    sig: ast.StaticMethodCopySignature,
  ): pbt.StaticMethodCopySignature {
    const nodeId = this.createNodeId(false, false);
    const typeArgs = sig.typeArgs.map(this.bindTypeArgDef);
    const argTypes = sig.argTypes.map(this.bindType);
    return { ...sig, nodeId, typeArgs, argTypes };
  }

  private bindUseStatement(use: ast.Use): pbt.Use {
    const nodeId = this.createNodeId(true, true);
    const leftmostIdentifier = getLeftmostIdentifierName(use.name);
    const leftmostInRef = this.dependOnRef(
      leftmostIdentifier,
      nodeId,
      start(use.location),
    );
    const refName = getUseStatementRefName(use);

    const outRef: Ref = (() => {
      if (use.doesShadow) {
        this.assertNameShadows(refName, start(use.location));
        return this.createAndAppendRefFromSourceId(nodeId, refName);
      } else {
        return this.createAndAppendNonShadowingRefFromSourceId(
          nodeId,
          refName,
          start(use.location),
        );
      }
    })();

    return {
      ...use,
      nodeId,
      leftmostInRefId: leftmostInRef.refId,
      outRefId: outRef.refId,
    };
  }

  private bindClassItems(
    node: ClassWithEmittedRef<ast.Class>,
  ): pbt.ClassItem[] {
    const staticItems = node.items.filter(isClassItemStatic);
    const instanceItems = node.items.filter(doesClassItemBelongToInstance);
    const instantiationRestrictions = node.items.filter(
      isClassItemInstantiationRestriction,
    );

    const staticItemIndices = staticItems.map(item => node.items.indexOf(item));
    const instanceItemIndices = instanceItems.map(item =>
      node.items.indexOf(item),
    );
    const instantiationRestrictionIndices = instantiationRestrictions.map(
      item => node.items.indexOf(item),
    );

    const staticItemsWithEmittedRefs = staticItems.map(this.emitClassItemRef);
    const boundStaticItems = staticItemsWithEmittedRefs.map(this.bindClassItem);
    const instanceItemsWithEmittedRefs = instanceItems.map(
      this.emitClassItemRef,
    );
    const boundInstanceItems = instanceItemsWithEmittedRefs.map(
      this.bindClassItem,
    );

    const instantiationRestrictionsWithNodeIds = instantiationRestrictions.map(
      this.bindInstantiationRestriction,
    );

    const arr: pbt.ClassItem[] = new Array(node.items.length);

    staticItemIndices.forEach((indexInOriginalArr, indexInFilteredArr) => {
      arr[indexInOriginalArr] = boundStaticItems[indexInFilteredArr];
    });
    instanceItemIndices.forEach((indexInOriginalArr, indexInFilteredArr) => {
      arr[indexInOriginalArr] = boundInstanceItems[indexInFilteredArr];
    });
    instantiationRestrictionIndices.forEach(
      (indexInOriginalArr, indexInFilteredArr) => {
        arr[indexInOriginalArr] =
          instantiationRestrictionsWithNodeIds[indexInFilteredArr];
      },
    );

    return arr;
  }

  private bindInstantiationRestriction(
    node: ast.InstantiationRestriction,
  ): pbt.InstantiationRestriction {
    const nodeId = this.createNodeId(false, false);
    return { ...node, nodeId };
  }

  private emitClassItemRef(
    item: Exclude<ast.ClassItem, ast.InstantiationRestriction>,
  ): ClassItemWithEmittedRef {
    const nodeId = this.createNodeId(false, true);
    const outRef = (() => {
      const overloadedRef = this.getOverloadedRef(item, nodeId);
      if (overloadedRef !== null) {
        return overloadedRef;
      } else {
        return this.createAndAppendNonShadowingRefFromSourceId(
          nodeId,
          item.name,
          start(item.location),
        );
      }
    })();

    return { ...item, nodeId, outRefId: outRef.refId };
  }

  private getOverloadedRef(
    item: ast.ClassItem,
    nodeId: NodeId<false, true>,
  ): Ref | null {
    if (
      item.type === ast.NodeType.ConcreteMethodDeclaration ||
      item.type === ast.NodeType.AbstractMethodDeclaration
    ) {
      const overloadedRef = this.findRef(item.name);
      if (overloadedRef === null) {
        return null;
      } else {
        overloadedRef.sourceNodeIds.push(nodeId);
        return overloadedRef;
      }
    } else {
      return null;
    }
  }

  private bindClassItem(item: ClassItemWithEmittedRef): pbt.ClassItem {
    switch (item.type) {
      case ast.NodeType.StaticPropertyDeclaration: {
        const valueType = nullishMap(item.valueType, this.bindType);
        const initialValue = this.bindExpr(item.initialValue);
        return { ...item, valueType, initialValue };
      }

      case ast.NodeType.InstancePropertyDeclaration: {
        const valueType = this.bindType(item.valueType);
        return { ...item, valueType };
      }

      case ast.NodeType.ConcreteMethodDeclaration:
        return this.execInNewRefScope<pbt.ConcreteMethodDeclaration>(() => {
          const typeArgs = item.typeArgs.map(this.bindTypeArgDef);
          const args = item.args.map(this.bindArgDef);
          const returnType = nullishMap(item.returnType, this.bindType);
          const body = this.bindCompoundNode(item.body);
          return { ...item, typeArgs, args, returnType, body };
        });

      case ast.NodeType.AbstractMethodDeclaration:
        return this.execInNewRefScope<pbt.AbstractMethodDeclaration>(() => {
          const typeArgs = item.typeArgs.map(this.bindTypeArgDef);
          const args = item.args.map(this.bindArgDef);
          const returnType = nullishMap(item.returnType, this.bindType);
          return { ...item, typeArgs, args, returnType };
        });
    }
  }

  private bindExpr(expr: ast.Expr): pbt.Expr {
    switch (expr.type) {
      case ast.NodeType.NumberLiteral:
        return this.bindNumberLiteral(expr);
      case ast.NodeType.StringLiteral:
        return this.bindStringLiteral(expr);
      case ast.NodeType.CharacterLiteral:
        return this.bindCharacterLiteral(expr);
      case ast.NodeType.Identifier:
        return this.bindIdentifier(expr);
      case ast.NodeType.InfixExpr:
        return this.bindInfixExpr(expr);
      case ast.NodeType.PrefixExpr:
        return this.bindPrefixExpr(expr);
      case ast.NodeType.DotExpr:
        return this.bindDotExpr(expr);
      case ast.NodeType.IndexExpr:
        return this.bindIndexExpr(expr);
      case ast.NodeType.CastExpr:
        return this.bindCastExpr(expr);
      case ast.NodeType.If:
        return this.bindIfNode(expr);
      case ast.NodeType.Do:
        return this.bindDoNode(expr);
      case ast.NodeType.FunctionCall:
        return this.bindFunctionCall(expr);
      case ast.NodeType.TypedObjectLiteral:
        return this.bindTypedObjectLiteral(expr);
      case ast.NodeType.ArrayLiteral:
        return this.bindArrayLiteral(expr);
      case ast.NodeType.RangeLiteral:
        return this.bindRangeLiteral(expr);
      case ast.NodeType.MagicFunctionLiteral:
        return this.bindMagicFunctionLiteral(expr);
    }
  }

  private bindNumberLiteral(node: ast.NumberLiteral): pbt.NumberLiteral {
    const nodeId = this.createNodeId(false, false);
    return { ...node, nodeId };
  }

  private bindStringLiteral(node: ast.StringLiteral): pbt.StringLiteral {
    const nodeId = this.createNodeId(false, false);
    return { ...node, nodeId };
  }

  private bindCharacterLiteral(
    node: ast.CharacterLiteral,
  ): pbt.CharacterLiteral {
    const nodeId = this.createNodeId(false, false);
    return { ...node, nodeId };
  }

  private bindIdentifier(node: ast.Identifier): pbt.Identifier {
    const nodeId = this.createNodeId(true, false);
    const inRef = this.expectRef(node.name, start(node.location));
    return { ...node, nodeId, inRefId: inRef.refId };
  }

  private bindInfixExpr(node: ast.InfixExpr): pbt.InfixExpr {
    const nodeId = this.createNodeId(false, false);
    const left = this.bindExpr(node.left);
    const right = this.bindExpr(node.right);
    return { ...node, nodeId, left, right };
  }

  private bindPrefixExpr(node: ast.PrefixExpr): pbt.PrefixExpr {
    const nodeId = this.createNodeId(false, false);
    const right = this.bindExpr(node.right);
    return { ...node, nodeId, right };
  }

  private bindDotExpr(node: ast.DotExpr): pbt.DotExpr {
    const nodeId = this.createNodeId(false, false);
    const left = this.bindExpr(node.left);
    return { ...node, nodeId, left };
  }

  private bindIndexExpr(node: ast.IndexExpr): pbt.IndexExpr {
    const nodeId = this.createNodeId(false, false);
    const left = this.bindExpr(node.left);
    const right = this.bindExpr(node.right);
    return { ...node, nodeId, left, right };
  }

  private bindCastExpr(node: ast.CastExpr): pbt.CastExpr {
    const nodeId = this.createNodeId(false, false);
    const value = this.bindExpr(node.value);
    const targetType = this.bindType(node.targetType);
    return { ...node, nodeId, value, targetType };
  }

  private bindFunctionCall(node: ast.FunctionCall): pbt.FunctionCall {
    const nodeId = this.createNodeId(false, false);
    const callee = this.bindExpr(node.callee);
    const typeArgs = node.typeArgs.map(this.bindType);
    const args = node.args.map(this.bindExpr);
    return { ...node, nodeId, callee, typeArgs, args };
  }

  private bindTypedObjectLiteral(
    node: ast.TypedObjectLiteral,
  ): pbt.TypedObjectLiteral {
    const nodeId = this.createNodeId(false, false);
    const valueType = this.bindType(node.valueType);
    const copies = node.copies.map(this.bindObjectCopyNode);
    const entries = node.entries.map(this.bindObjectEntryNode);
    return { ...node, nodeId, valueType, copies, entries };
  }

  private bindObjectCopyNode(node: ast.ObjectCopy): pbt.ObjectCopy {
    const nodeId = this.createNodeId(false, false);
    const source = this.bindExpr(node.source);
    return { ...node, nodeId, source };
  }

  private bindObjectEntryNode(node: ast.ObjectEntry): pbt.ObjectEntry {
    const nodeId = this.createNodeId(false, false);
    const value = nullishMap(node.value, this.bindExpr);
    return { ...node, nodeId, value };
  }

  private bindArrayLiteral(node: ast.ArrayLiteral): pbt.ArrayLiteral {
    const nodeId = this.createNodeId(false, false);
    const elements = node.elements.map(this.bindExpr);
    return { ...node, nodeId, elements };
  }

  private bindRangeLiteral(node: ast.RangeLiteral): pbt.RangeLiteral {
    const nodeId = this.createNodeId(false, false);
    const start = this.bindExpr(node.start);
    const end = this.bindExpr(node.end);
    return { ...node, nodeId, start, end };
  }

  private bindMagicFunctionLiteral(
    node: ast.MagicFunctionLiteral,
  ): pbt.MagicFunctionLiteral {
    return this.execInNewRefScope<pbt.MagicFunctionLiteral>(() => {
      const nodeId = this.createNodeId(false, false);
      const args = node.args.map(this.bindUntypedArgDef);
      const body = this.bindMagicFunctionBody(node.body);
      return { ...node, nodeId, args, body };
    });
  }

  private bindUntypedArgDef(node: ast.UntypedArgDef): pbt.UntypedArgDef {
    const nodeId = this.createNodeId(false, true);
    const outRef = this.createAndAppendRefFromSourceId(nodeId, node.name);
    return { ...node, nodeId, outRefId: outRef.refId };
  }

  private bindMagicFunctionBody(
    node: ast.MagicFunctionLiteral["body"],
  ): pbt.MagicFunctionLiteral["body"] {
    if (node.type === ast.NodeType.CompoundNode) {
      return this.bindCompoundNode(node);
    } else {
      return this.bindExpr(node);
    }
  }

  private bindArgDef(def: ast.ArgDef): pbt.ArgDef {
    const nodeId = this.createNodeId(false, true);
    const outRef = this.createAndAppendRefFromSourceId(nodeId, def.name);
    const valueType = this.bindType(def.valueType);
    return { ...def, nodeId, outRefId: outRef.refId, valueType };
  }

  private bindCompoundNode(compoundNode: ast.CompoundNode): pbt.CompoundNode {
    return this.execInNewRefScope<pbt.CompoundNode>(() => {
      const nodeId = this.createNodeId(false, false);
      const useStatements = compoundNode.useStatements.map(
        this.bindUseStatement,
      );
      const nodes = compoundNode.nodes.map(this.bindCompoundNodeItem);
      return { ...compoundNode, nodeId, useStatements, nodes };
    });
  }

  private bindCompoundNodeItem(item: AstCompoundNodeItem): PbtCompoundNodeItem {
    if (isStatement(item)) {
      return this.bindStatement(item);
    } else {
      return this.bindExpr(item);
    }
  }

  private bindStatement(statement: ast.Statement): pbt.Statement {
    switch (statement.type) {
      case ast.NodeType.Return:
        return this.bindReturnStatement(statement);
      case ast.NodeType.Break:
        return this.bindBreakStatement(statement);
      case ast.NodeType.Continue:
        return this.bindContinueStatement(statement);
      case ast.NodeType.LocalVariableDeclaration:
        return this.bindLocalVariableDeclaration(statement);
      case ast.NodeType.Assignment:
        return this.bindAssignment(statement);
      case ast.NodeType.Throw:
        return this.bindThrowStatement(statement);
      case ast.NodeType.If:
        return this.bindIfNode(statement);
      case ast.NodeType.Do:
        return this.bindDoNode(statement);
      case ast.NodeType.While:
        return this.bindWhileStatement(statement);
      case ast.NodeType.Loop:
        return this.bindLoopStatement(statement);
      case ast.NodeType.Repeat:
        return this.bindRepeatStatement(statement);
      case ast.NodeType.For:
        return this.bindForStatement(statement);
      case ast.NodeType.Try:
        return this.bindTryStatement(statement);
    }
  }

  private bindReturnStatement(node: ast.Return): pbt.Return {
    const nodeId = this.createNodeId(false, false);
    const value = nullishMap(node.value, this.bindExpr);
    return { ...node, nodeId, value };
  }

  private bindBreakStatement(node: ast.Break): pbt.Break {
    const nodeId = this.createNodeId(false, false);
    return { ...node, nodeId };
  }

  private bindContinueStatement(node: ast.Continue): pbt.Continue {
    const nodeId = this.createNodeId(false, false);
    return { ...node, nodeId };
  }

  private bindLocalVariableDeclaration(
    node: ast.LocalVariableDeclaration,
  ): pbt.LocalVariableDeclaration {
    const nodeId = this.createNodeId(false, true);
    const outRef = node.doesShadow
      ? this.createAndAppendRefFromSourceId(nodeId, node.name)
      : this.createAndAppendNonShadowingRefFromSourceId(
          nodeId,
          node.name,
          start(node.location),
        );
    const valueType = nullishMap(node.valueType, this.bindType);
    const initialValue = this.bindExpr(node.initialValue);
    return { ...node, nodeId, outRefId: outRef.refId, valueType, initialValue };
  }

  private bindAssignment(node: ast.Assignment): pbt.Assignment {
    const nodeId = this.createNodeId(false, false);
    const assignee = this.bindExpr(node.assignee);
    const value = this.bindExpr(node.value);
    return { ...node, nodeId, assignee, value };
  }

  private bindThrowStatement(node: ast.Throw): pbt.Throw {
    const nodeId = this.createNodeId(false, false);
    const value = this.bindExpr(node.value);
    return { ...node, nodeId, value };
  }

  private bindIfNode(node: ast.If): pbt.If {
    const nodeId = this.createNodeId(false, false);
    const condition = this.bindExpr(node.condition);
    const body = this.bindCompoundNode(node.body);
    const alternatives = node.alternatives.map(this.bindIfAlternative);
    return { ...node, nodeId, condition, body, alternatives };
  }

  private bindIfAlternative(node: ast.IfAlternative): pbt.IfAlternative {
    switch (node.alternativeType) {
      case ast.IfAlternativeType.ElseIf:
        return this.bindElseIfNode(node);
      case ast.IfAlternativeType.Else:
        return this.bindElseNode(node);
    }
  }

  private bindElseIfNode(node: ast.ElseIf): pbt.ElseIf {
    const nodeId = this.createNodeId(false, false);
    const condition = this.bindExpr(node.condition);
    const body = this.bindCompoundNode(node.body);
    return { ...node, nodeId, condition, body };
  }

  private bindElseNode(node: ast.Else): pbt.Else {
    const nodeId = this.createNodeId(false, false);
    const body = this.bindCompoundNode(node.body);
    return { ...node, nodeId, body };
  }

  private bindDoNode(node: ast.Do): pbt.Do {
    const nodeId = this.createNodeId(false, false);
    const body = this.bindCompoundNode(node.body);
    return { ...node, nodeId, body };
  }

  private bindWhileStatement(node: ast.While): pbt.While {
    const nodeId = this.createNodeId(false, false);
    const condition = this.bindExpr(node.condition);
    const body = this.bindCompoundNode(node.body);
    return { ...node, nodeId, condition, body };
  }

  private bindLoopStatement(node: ast.Loop): pbt.Loop {
    const nodeId = this.createNodeId(false, false);
    const body = this.bindCompoundNode(node.body);
    return { ...node, nodeId, body };
  }

  private bindRepeatStatement(node: ast.Repeat): pbt.Repeat {
    const nodeId = this.createNodeId(false, false);
    const repetitions = this.bindExpr(node.repetitions);
    const body = this.bindCompoundNode(node.body);
    return { ...node, nodeId, repetitions, body };
  }

  private bindForStatement(node: ast.For): pbt.For {
    return this.execInNewRefScope<pbt.For>(() => {
      const nodeId = this.createNodeId(false, false);
      const binding = this.bindForNodeBinding(node.binding);
      const iteratee = this.bindExpr(node.iteratee);
      const body = this.bindCompoundNode(node.body);
      return { ...node, nodeId, binding, iteratee, body };
    });
  }

  private bindForNodeBinding(node: ast.Binding): pbt.Binding {
    switch (node.type) {
      case ast.NodeType.SingleBinding:
        return this.bindSingleBinding(node);
      case ast.NodeType.FlatTupleBinding:
        return this.bindFlatTupleBinding(node);
    }
  }

  private bindSingleBinding(node: ast.SingleBinding): pbt.SingleBinding {
    const nodeId = this.createNodeId(false, true);
    const outRef = this.createAndAppendNonShadowingRefFromSourceId(
      nodeId,
      node.name,
      start(node.location),
    );
    return { ...node, nodeId, outRefId: outRef.refId };
  }

  private bindFlatTupleBinding(
    node: ast.FlatTupleBinding,
  ): pbt.FlatTupleBinding {
    const nodeId = this.createNodeId(false, false);
    const bindings = node.bindings.map(this.bindSingleBinding);
    return { ...node, nodeId, bindings };
  }

  private bindTryStatement(node: ast.Try): pbt.Try {
    const nodeId = this.createNodeId(false, false);
    const body = this.bindCompoundNode(node.body);
    const catches = node.catches.map(this.bindCatchNode);
    return { ...node, nodeId, body, catches };
  }

  private bindCatchNode(node: ast.Catch): pbt.Catch {
    switch (node.catchType) {
      case ast.CatchType.BoundCatch:
        return this.bindCatchNodeWithErrorBinding(node);
      case ast.CatchType.RestrictedBindinglessCatch:
        return this.bindCatchNodeWithBindinglessErrorRestriction(node);
      case ast.CatchType.CatchAll:
        return this.bindCatchAllNode(node);
    }
  }

  private bindCatchNodeWithErrorBinding(node: ast.BoundCatch): pbt.BoundCatch {
    return this.execInNewRefScope<pbt.BoundCatch>(() => {
      const nodeId = this.createNodeId(false, false);
      const arg = this.bindArgDef(node.arg);
      const body = this.bindCompoundNode(node.body);
      return { ...node, nodeId, arg, body };
    });
  }

  private bindCatchNodeWithBindinglessErrorRestriction(
    node: ast.RestrictedBindinglessCatch,
  ): pbt.RestrictedBindinglessCatch {
    const nodeId = this.createNodeId(false, false);
    const caughtTypes = node.caughtTypes.map(this.bindType);
    const body = this.bindCompoundNode(node.body);
    return { ...node, nodeId, caughtTypes, body };
  }

  private bindCatchAllNode(node: ast.CatchAll): pbt.CatchAll {
    const nodeId = this.createNodeId(false, false);
    const body = this.bindCompoundNode(node.body);
    return { ...node, nodeId, body };
  }
}

interface BoundClasses {
  pubClass: pbt.PubClass;
  privClasses: pbt.PrivClass[];
}

interface ClassesWithEmittedRefs {
  pubClass: ClassWithEmittedRef<ast.PubClass>;
  privClasses: ClassWithEmittedRef<ast.PrivClass>[];
}

type ClassWithEmittedRef<T extends ast.Class> = T & {
  nodeId: pbt.Class["nodeId"];
  outRefId: pbt.Class["outRefId"];
};

type StaticClassItem =
  | ast.StaticPropertyDeclaration
  | ast.StaticMethodDeclaration;

type InstanceClassItem =
  | ast.InstancePropertyDeclaration
  | ast.ConcreteInstanceMethodDeclaration
  | ast.AbstractMethodDeclaration;

type ClassItemWithEmittedRef = Exclude<
  ast.ClassItem,
  ast.InstantiationRestriction
> & {
  nodeId: pbt.Class["nodeId"];
  outRefId: pbt.Class["outRefId"];
};

type AstCompoundNodeItem = ast.CompoundNode["nodes"][number];

type PbtCompoundNodeItem = pbt.CompoundNode["nodes"][number];

interface PointLocation {
  line: number;
  column: number;
}

function getLeftmostIdentifierName(dotSeparatedIdentifiers: string): string {
  const idents = dotSeparatedIdentifiers.split(".");
  return idents[0];
}

function getRightmostIdentifierName(dotSeparatedIdentifiers: string): string {
  const idents = dotSeparatedIdentifiers.split(".");
  return idents[idents.length - 1];
}

function validateImportName(name: string): void {
  if (!name.includes(".")) {
    throw new SyntaxError('Import statements must include at least one "."');
  }
}

function getUseStatementRefName(use: ast.Use): string {
  if (use.alias === null) {
    return getRightmostIdentifierName(use.name);
  } else {
    return use.alias;
  }
}

function getStaticMethodCopyStatementRefName(
  copy: ast.StaticMethodCopy,
): string {
  if (copy.alias === null) {
    return getRightmostIdentifierName(copy.name);
  } else {
    return copy.alias;
  }
}

function start(location: NodeLocation): PointLocation {
  return { line: location.firstLine, column: location.firstColumn };
}

function nullishMap<T, U>(val: T | null, mapper: (start: T) => U): U | null;
function nullishMap<T, U>(
  val: T | undefined,
  mapper: (start: T) => U,
): U | undefined;
function nullishMap<T, U>(
  val: T | null | undefined,
  mapper: (start: T) => U,
): U | null | undefined;
function nullishMap<T, U>(
  val: T | null | undefined,
  mapper: (start: T) => U,
): U | null | undefined {
  if (val === null || val === undefined) {
    return val as null | undefined;
  } else {
    return mapper(val);
  }
}

function truncate(arr: any[], len: number): void {
  arr.splice(len, arr.length - len);
}

function isClassItemStatic(item: ast.ClassItem): item is StaticClassItem {
  return (
    item.type === ast.NodeType.StaticPropertyDeclaration ||
    (item.type === ast.NodeType.ConcreteMethodDeclaration && item.isStatic)
  );
}

function doesClassItemBelongToInstance(
  item: ast.ClassItem,
): item is InstanceClassItem {
  return (
    item.type === ast.NodeType.InstancePropertyDeclaration ||
    (item.type === ast.NodeType.ConcreteMethodDeclaration && !item.isStatic) ||
    item.type === ast.NodeType.AbstractMethodDeclaration
  );
}

function isClassItemInstantiationRestriction(
  item: ast.ClassItem,
): item is ast.InstantiationRestriction {
  return item.type === ast.NodeType.InstantiationRestriction;
}

function isStatement(item: AstCompoundNodeItem): item is ast.Statement {
  switch (item.type) {
    case ast.NodeType.Return:
    case ast.NodeType.Break:
    case ast.NodeType.Continue:
    case ast.NodeType.LocalVariableDeclaration:
    case ast.NodeType.Assignment:
    case ast.NodeType.Throw:
    case ast.NodeType.If:
    case ast.NodeType.Do:
    case ast.NodeType.While:
    case ast.NodeType.Loop:
    case ast.NodeType.Repeat:
    case ast.NodeType.For:
    case ast.NodeType.Try: {
      // Hack to get type checker to verify exhaustiveness
      const _: ast.Statement = item;

      return true;
    }

    default: {
      // Hack to get type checker to verify exhaustiveness
      const _: ast.Expr = item;

      return false;
    }
  }
}
