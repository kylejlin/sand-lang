import * as ast from "./ast";
import * as lst from "./lst";
import { LabelingResult } from "./lst";
import nullishMap from "./utils/nullishMap";

export function labelFileNodes(nodes: ast.FileNode[]): LabelingResult {
  return getLabeler().labelFileNodes(nodes);
}

interface Labeler {
  labelFileNodes(nodes: ast.FileNode[]): LabelingResult;
}

function getLabeler(): Labeler {
  const referents: lst.Node[] = [];

  function withNodeId<T extends lst.Node>(node: Omit<T, "nodeId">): T {
    const rawValue = referents.length;
    const nodeId = { nodeType: node.type, rawValue };

    const withNodeId = { ...node, nodeId } as T;
    referents.push(withNodeId);
    return withNodeId;
  }

  function labelFileNodes(nodes: ast.FileNode[]): LabelingResult {
    const labeled = nodes.map(labelFileNode);
    return { fileNodes: labeled, nodeIdReferents: referents };
  }

  function labelFileNode(node: ast.FileNode): lst.FileNode {
    const imports = node.imports.map(labelImportStatement);
    const useStatements = node.useStatements.map(labelUseStatement);
    const pubClass = labelClassNode(node.pubClass);
    const privClasses = node.privClasses.map(labelClassNode);
    return withNodeId({
      ...node,
      imports,
      useStatements,
      pubClass,
      privClasses,
    });
  }

  function labelImportStatement(node: ast.Import): lst.Import {
    return withNodeId(node);
  }

  function labelUseStatement(node: ast.Use): lst.Use {
    return withNodeId(node);
  }

  function labelClassNode(node: ast.PubClass): lst.PubClass;
  function labelClassNode(node: ast.PrivClass): lst.PrivClass;

  function labelClassNode(node: ast.Class): lst.Class {
    const typeArgDefs = node.typeArgDefs.map(labelTypeArgDef);
    const superClass = nullishMap(node.superClass, labelTypeNode);
    const copies = node.copies.map(labelStaticMethodCopy);
    const useStatements = node.useStatements.map(labelUseStatement);
    const items = node.items.map(labelClassItem);

    return withNodeId({
      ...node,
      typeArgDefs,
      superClass,
      copies,
      useStatements,
      items,
    });
  }

  function labelTypeArgDef(node: ast.TypeArgDef): lst.TypeArgDef {
    const constraint = labelTypeConstraint(node.constraint);
    return withNodeId({ ...node, constraint });
  }

  function labelTypeConstraint(node: ast.TypeConstraint): lst.TypeConstraint {
    switch (node.constraintType) {
      case ast.ConstraintType.None:
        return node;
      case ast.ConstraintType.Extends: {
        const superType = labelTypeNode(node.superType);
        return { ...node, superType };
      }
    }
  }

  function labelTypeNode(node: ast.Type): lst.Type {
    const args = node.args.map(labelTypeNode);
    return withNodeId({ ...node, args });
  }

  function labelStaticMethodCopy(
    node: ast.StaticMethodCopy,
  ): lst.StaticMethodCopy {
    const signature = nullishMap(
      node.signature,
      labelStaticMethodCopySignature,
    );
    return withNodeId({ ...node, signature });
  }

  function labelStaticMethodCopySignature(
    node: ast.StaticMethodCopySignature,
  ): lst.StaticMethodCopySignature {
    const typeArgs = node.typeArgs.map(labelTypeArgDef);
    const argTypes = node.argTypes.map(labelTypeNode);
    return withNodeId({ ...node, typeArgs, argTypes });
  }

  function labelClassItem(node: ast.ClassItem): lst.ClassItem {
    switch (node.type) {
      case ast.NodeType.InstantiationRestriction:
        return labelInstantiationRestriction(node);
      case ast.NodeType.StaticPropertyDeclaration:
        return labelStaticPropertyDeclaration(node);
      case ast.NodeType.InstancePropertyDeclaration:
        return labelInstancePropertyDeclaration(node);
      case ast.NodeType.ConcreteMethodDeclaration:
        return labelConcreteMethodDeclaration(node);
      case ast.NodeType.AbstractMethodDeclaration:
        return labelAbstractMethodDeclaration(node);
    }
  }

  function labelInstantiationRestriction(
    node: ast.InstantiationRestriction,
  ): lst.InstantiationRestriction {
    return withNodeId({ ...node });
  }

  function labelStaticPropertyDeclaration(
    node: ast.StaticPropertyDeclaration,
  ): lst.StaticPropertyDeclaration {
    const valueType = nullishMap(node.valueType, labelTypeNode);
    const initialValue = labelExpr(node.initialValue);
    return withNodeId({ ...node, valueType, initialValue });
  }

  function labelInstancePropertyDeclaration(
    node: ast.InstancePropertyDeclaration,
  ): lst.InstancePropertyDeclaration {
    const valueType = labelTypeNode(node.valueType);
    return withNodeId({ ...node, valueType });
  }

  function labelConcreteMethodDeclaration(
    node: ast.ConcreteMethodDeclaration,
  ): lst.ConcreteMethodDeclaration {
    const typeArgs = node.typeArgs.map(labelTypeArgDef);
    const args = node.args.map(labelTypedArgDef);
    const returnType = nullishMap(node.returnType, labelTypeNode);
    const body = labelCompoundNode(node.body);
    return withNodeId({ ...node, typeArgs, args, returnType, body });
  }

  function labelAbstractMethodDeclaration(
    node: ast.AbstractMethodDeclaration,
  ): lst.AbstractMethodDeclaration {
    const typeArgs = node.typeArgs.map(labelTypeArgDef);
    const args = node.args.map(labelTypedArgDef);
    const returnType = nullishMap(node.returnType, labelTypeNode);
    return withNodeId({ ...node, typeArgs, args, returnType });
  }

  function labelTypedArgDef(node: ast.TypedArgDef): lst.TypedArgDef {
    const valueType = labelTypeNode(node.valueType);
    return withNodeId({ ...node, valueType });
  }

  function labelCompoundNode(node: ast.CompoundNode): lst.CompoundNode {
    const useStatements = node.useStatements.map(labelUseStatement);
    const nodes = node.nodes.map(labelCompoundNodeSubnode);
    return withNodeId({ ...node, useStatements, nodes });
  }

  function labelCompoundNodeSubnode(
    node: ast.CompoundNode["nodes"][number],
  ): lst.CompoundNode["nodes"][number] {
    if (ast.isStatement(node)) {
      return labelStatement(node);
    } else {
      return labelExpr(node);
    }
  }

  function labelStatement(node: ast.Statement): lst.Statement {
    switch (node.type) {
      case ast.NodeType.LocalVariableDeclaration:
        return labelLocalVariableDeclaration(node);
      case ast.NodeType.Assignment:
        return labelAssignment(node);
      case ast.NodeType.Return:
        return labelReturnStatement(node);
      case ast.NodeType.Break:
        return labelBreakStatement(node);
      case ast.NodeType.Continue:
        return labelContinueStatement(node);
      case ast.NodeType.Throw:
        return labelThrowStatement(node);
      case ast.NodeType.If:
        return labelIfNode(node);
      case ast.NodeType.Do:
        return labelDoNode(node);
      case ast.NodeType.Try:
        return labelTryStatement(node);
      case ast.NodeType.While:
        return labelWhileStatement(node);
      case ast.NodeType.Loop:
        return labelLoopStatement(node);
      case ast.NodeType.Repeat:
        return labelRepeatStatement(node);
      case ast.NodeType.For:
        return labelForStatement(node);
    }
  }

  function labelLocalVariableDeclaration(
    node: ast.LocalVariableDeclaration,
  ): lst.LocalVariableDeclaration {
    const valueType = nullishMap(node.valueType, labelTypeNode);
    const initialValue = labelExpr(node.initialValue);
    return withNodeId({ ...node, valueType, initialValue });
  }

  function labelAssignment(node: ast.Assignment): lst.Assignment {
    const assignee = labelExpr(node.assignee);
    const value = labelExpr(node.value);
    return withNodeId({ ...node, assignee, value });
  }

  function labelReturnStatement(node: ast.Return): lst.Return {
    const value = nullishMap(node.value, labelExpr);
    return withNodeId({ ...node, value });
  }

  function labelBreakStatement(node: ast.Break): lst.Break {
    return withNodeId({ ...node });
  }

  function labelContinueStatement(node: ast.Continue): lst.Continue {
    return withNodeId({ ...node });
  }

  function labelThrowStatement(node: ast.Throw): lst.Throw {
    const value = labelExpr(node.value);
    return withNodeId({ ...node, value });
  }

  function labelIfNode(node: ast.If): lst.If {
    const condition = labelExpr(node.condition);
    const body = labelCompoundNode(node.body);
    const alternatives = node.alternatives.map(labelIfAlternative);
    return withNodeId({ ...node, condition, body, alternatives });
  }

  function labelIfAlternative(node: ast.IfAlternative): lst.IfAlternative {
    switch (node.alternativeType) {
      case ast.IfAlternativeType.ElseIf:
        return labelElseIfNode(node);
      case ast.IfAlternativeType.Else:
        return labelElseNode(node);
    }
  }

  function labelElseIfNode(node: ast.ElseIf): lst.ElseIf {
    const condition = labelExpr(node.condition);
    const body = labelCompoundNode(node.body);
    return withNodeId({ ...node, condition, body });
  }

  function labelElseNode(node: ast.Else): lst.Else {
    const body = labelCompoundNode(node.body);
    return withNodeId({ ...node, body });
  }

  function labelDoNode(node: ast.Do): lst.Do {
    const body = labelCompoundNode(node.body);
    return withNodeId({ ...node, body });
  }

  function labelTryStatement(node: ast.Try): lst.Try {
    const body = labelCompoundNode(node.body);
    const catches = node.catches.map(labelCatchNode);
    return withNodeId({ ...node, body, catches });
  }

  function labelCatchNode(node: ast.Catch): lst.Catch {
    switch (node.catchType) {
      case ast.CatchType.BoundCatch:
        return labelCatchNodeWithErrorBinding(node);
      case ast.CatchType.RestrictedBindinglessCatch:
        return labelCatchNodeWithBindinglessErrorRestriction(node);
      case ast.CatchType.CatchAll:
        return labelCatchAllNode(node);
    }
  }

  function labelCatchNodeWithErrorBinding(
    node: ast.BoundCatch,
  ): lst.BoundCatch {
    const arg = labelTypedArgDef(node.arg);
    const body = labelCompoundNode(node.body);
    return withNodeId({ ...node, arg, body });
  }

  function labelCatchNodeWithBindinglessErrorRestriction(
    node: ast.RestrictedBindinglessCatch,
  ): lst.RestrictedBindinglessCatch {
    const caughtTypes = node.caughtTypes.map(labelTypeNode);
    const body = labelCompoundNode(node.body);
    return withNodeId({ ...node, caughtTypes, body });
  }

  function labelCatchAllNode(node: ast.CatchAll): lst.CatchAll {
    const body = labelCompoundNode(node.body);
    return withNodeId({ ...node, body });
  }

  function labelWhileStatement(node: ast.While): lst.While {
    const condition = labelExpr(node.condition);
    const body = labelCompoundNode(node.body);
    return withNodeId({ ...node, condition, body });
  }

  function labelLoopStatement(node: ast.Loop): lst.Loop {
    const body = labelCompoundNode(node.body);
    return withNodeId({ ...node, body });
  }

  function labelRepeatStatement(node: ast.Repeat): lst.Repeat {
    const repetitions = labelExpr(node.repetitions);
    const body = labelCompoundNode(node.body);
    return withNodeId({ ...node, repetitions, body });
  }

  function labelForStatement(node: ast.For): lst.For {
    const binding = labelForNodeBinding(node.binding);
    const iteratee = labelExpr(node.iteratee);
    const body = labelCompoundNode(node.body);
    return withNodeId({ ...node, binding, iteratee, body });
  }

  function labelForNodeBinding(node: ast.Binding): lst.Binding {
    switch (node.type) {
      case ast.NodeType.SingleBinding:
        return labelSingleBinding(node);
      case ast.NodeType.FlatTupleBinding:
        return labelFlatTupleBinding(node);
    }
  }

  function labelSingleBinding(node: ast.SingleBinding): lst.SingleBinding {
    return withNodeId({ ...node });
  }

  function labelFlatTupleBinding(
    node: ast.FlatTupleBinding,
  ): lst.FlatTupleBinding {
    const bindings = node.bindings.map(labelSingleBinding);
    return withNodeId({ ...node, bindings });
  }

  function labelExpr(node: ast.Expr): lst.Expr {
    switch (node.type) {
      case ast.NodeType.NumberLiteral:
        return labelNumberLiteral(node);
      case ast.NodeType.StringLiteral:
        return labelStringLiteral(node);
      case ast.NodeType.CharacterLiteral:
        return labelCharacterLiteral(node);
      case ast.NodeType.Identifier:
        return labelIdentifier(node);
      case ast.NodeType.InfixExpr:
        return labelInfixExpr(node);
      case ast.NodeType.PrefixExpr:
        return labelPrefixExpr(node);
      case ast.NodeType.DotExpr:
        return labelDotExpr(node);
      case ast.NodeType.IndexExpr:
        return labelIndexExpr(node);
      case ast.NodeType.CastExpr:
        return labelCastExpr(node);
      case ast.NodeType.If:
        return labelIfNode(node);
      case ast.NodeType.Do:
        return labelDoNode(node);
      case ast.NodeType.FunctionCall:
        return labelFunctionCall(node);
      case ast.NodeType.TypedObjectLiteral:
        return labelTypedObjectLiteral(node);
      case ast.NodeType.ArrayLiteral:
        return labelArrayLiteral(node);
      case ast.NodeType.RangeLiteral:
        return labelRangeLiteral(node);
      case ast.NodeType.MagicFunctionLiteral:
        return labelMagicFunctionLiteral(node);
    }
  }

  function labelNumberLiteral(node: ast.NumberLiteral): lst.NumberLiteral {
    return withNodeId({ ...node });
  }

  function labelStringLiteral(node: ast.StringLiteral): lst.StringLiteral {
    return withNodeId({ ...node });
  }

  function labelCharacterLiteral(
    node: ast.CharacterLiteral,
  ): lst.CharacterLiteral {
    return withNodeId({ ...node });
  }

  function labelIdentifier(node: ast.Identifier): lst.Identifier {
    return withNodeId({ ...node });
  }

  function labelInfixExpr(node: ast.InfixExpr): lst.InfixExpr {
    const left = labelExpr(node.left);
    const right = labelExpr(node.right);
    return withNodeId({ ...node, left, right });
  }

  function labelPrefixExpr(node: ast.PrefixExpr): lst.PrefixExpr {
    const right = labelExpr(node.right);
    return withNodeId({ ...node, right });
  }

  function labelDotExpr(node: ast.DotExpr): lst.DotExpr {
    const left = labelExpr(node.left);
    return withNodeId({ ...node, left });
  }

  function labelIndexExpr(node: ast.IndexExpr): lst.IndexExpr {
    const left = labelExpr(node.left);
    const right = labelExpr(node.right);
    return withNodeId({ ...node, left, right });
  }

  function labelCastExpr(node: ast.CastExpr): lst.CastExpr {
    const value = labelExpr(node.value);
    const targetType = labelTypeNode(node.targetType);
    return withNodeId({ ...node, value, targetType });
  }

  function labelFunctionCall(node: ast.FunctionCall): lst.FunctionCall {
    const callee = labelExpr(node.callee);
    const typeArgs = node.typeArgs.map(labelTypeNode);
    const args = node.args.map(labelExpr);
    return withNodeId({ ...node, callee, typeArgs, args });
  }

  function labelTypedObjectLiteral(
    node: ast.TypedObjectLiteral,
  ): lst.TypedObjectLiteral {
    const valueType = labelTypeNode(node.valueType);
    const copies = node.copies.map(labelObjectCopyNode);
    const entries = node.entries.map(labelObjectEntryNode);
    return withNodeId({ ...node, valueType, copies, entries });
  }

  function labelObjectCopyNode(node: ast.ObjectCopy): lst.ObjectCopy {
    const source = labelExpr(node.source);
    return withNodeId({ ...node, source });
  }

  function labelObjectEntryNode(node: ast.ObjectEntry): lst.ObjectEntry {
    const value = nullishMap(node.value, labelExpr);
    return withNodeId({ ...node, value });
  }

  function labelArrayLiteral(node: ast.ArrayLiteral): lst.ArrayLiteral {
    const elements = node.elements.map(labelExpr);
    return withNodeId({ ...node, elements });
  }

  function labelRangeLiteral(node: ast.RangeLiteral): lst.RangeLiteral {
    const start = labelExpr(node.start);
    const end = labelExpr(node.end);
    return withNodeId({ ...node, start, end });
  }

  function labelMagicFunctionLiteral(
    node: ast.MagicFunctionLiteral,
  ): lst.MagicFunctionLiteral {
    const args = node.args.map(labelUntypedArgDef);
    const body = labelMagicFunctionBody(node.body);
    return withNodeId({ ...node, args, body });
  }

  function labelUntypedArgDef(node: ast.UntypedArgDef): lst.UntypedArgDef {
    return withNodeId({ ...node });
  }

  function labelMagicFunctionBody(
    node: ast.MagicFunctionLiteral["body"],
  ): lst.MagicFunctionLiteral["body"] {
    if (node.type === ast.NodeType.CompoundNode) {
      return labelCompoundNode(node);
    } else {
      return labelExpr(node);
    }
  }

  return { labelFileNodes };
}
