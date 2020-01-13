import * as ast from "./ast";
import * as lst from "./lst";
import nullishMap from "./utils/nullishMap";

export interface LabeledFileNodeAndIds {
  nodeIds: lst.NodeId<lst.NodeType>[];
  fileNodes: lst.FileNode[];
}

export function labelFileNodes(nodes: ast.FileNode[]): LabeledFileNodeAndIds {
  return getLabeler().labelFileNodes(nodes);
}

interface Labeler {
  labelFileNodes(nodes: ast.FileNode[]): LabeledFileNodeAndIds;
}

function getLabeler(): Labeler {
  const nodeIds: lst.NodeId<lst.NodeType>[] = [];

  function createNodeId<T extends ast.NodeType>(nodeType: T): lst.NodeId<T> {
    const rawValue = nodeIds.length;
    const id = { nodeType, rawValue };
    nodeIds.push(id);
    return id;
  }

  function labelFileNodes(nodes: ast.FileNode[]): LabeledFileNodeAndIds {
    const labeled = nodes.map(labelFileNode);
    return { nodeIds, fileNodes: labeled };
  }

  function labelFileNode(node: ast.FileNode): lst.FileNode {
    const nodeId = createNodeId(node.type);
    const imports = node.imports.map(labelImportStatement);
    const useStatements = node.useStatements.map(labelUseStatement);
    const pubClass = labelClassNode(node.pubClass);
    const privClasses = node.privClasses.map(labelClassNode);
    return { ...node, nodeId, imports, useStatements, pubClass, privClasses };
  }

  function labelImportStatement(node: ast.Import): lst.Import {
    const nodeId = createNodeId(node.type);
    return { ...node, nodeId };
  }

  function labelUseStatement(node: ast.Use): lst.Use {
    const nodeId = createNodeId(node.type);
    return { ...node, nodeId };
  }

  function labelClassNode(node: ast.PubClass): lst.PubClass;
  function labelClassNode(node: ast.PrivClass): lst.PrivClass;

  function labelClassNode(node: ast.Class): lst.Class {
    const nodeId = createNodeId(node.type);
    const typeArgDefs = node.typeArgDefs.map(labelTypeArgDef);
    const superClass = nullishMap(node.superClass, labelTypeNode);
    const copies = node.copies.map(labelStaticMethodCopy);
    const useStatements = node.useStatements.map(labelUseStatement);
    const items = node.items.map(labelClassItem);

    return {
      ...node,
      nodeId,
      typeArgDefs,
      superClass,
      copies,
      useStatements,
      items,
    };
  }

  function labelTypeArgDef(node: ast.TypeArgDef): lst.TypeArgDef {
    const nodeId = createNodeId(node.type);
    const constraint = labelTypeConstraint(node.constraint);
    return { ...node, nodeId, constraint };
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
    const nodeId = createNodeId(node.type);
    const args = node.args.map(labelTypeNode);
    return { ...node, nodeId, args };
  }

  function labelStaticMethodCopy(
    node: ast.StaticMethodCopy,
  ): lst.StaticMethodCopy {
    const nodeId = createNodeId(node.type);
    const signature = nullishMap(
      node.signature,
      labelStaticMethodCopySignature,
    );
    return { ...node, nodeId, signature };
  }

  function labelStaticMethodCopySignature(
    node: ast.StaticMethodCopySignature,
  ): lst.StaticMethodCopySignature {
    const nodeId = createNodeId(node.type);
    const typeArgs = node.typeArgs.map(labelTypeArgDef);
    const argTypes = node.argTypes.map(labelTypeNode);
    return { ...node, nodeId, typeArgs, argTypes };
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
    const nodeId = createNodeId(node.type);
    return { ...node, nodeId };
  }

  function labelStaticPropertyDeclaration(
    node: ast.StaticPropertyDeclaration,
  ): lst.StaticPropertyDeclaration {
    const nodeId = createNodeId(node.type);
    const valueType = nullishMap(node.valueType, labelTypeNode);
    const initialValue = labelExpr(node.initialValue);
    return { ...node, nodeId, valueType, initialValue };
  }

  function labelInstancePropertyDeclaration(
    node: ast.InstancePropertyDeclaration,
  ): lst.InstancePropertyDeclaration {
    const nodeId = createNodeId(node.type);
    const valueType = labelTypeNode(node.valueType);
    return { ...node, nodeId, valueType };
  }

  function labelConcreteMethodDeclaration(
    node: ast.ConcreteMethodDeclaration,
  ): lst.ConcreteMethodDeclaration {
    const nodeId = createNodeId(node.type);
    const typeArgs = node.typeArgs.map(labelTypeArgDef);
    const args = node.args.map(labelArgDef);
    const returnType = nullishMap(node.returnType, labelTypeNode);
    const body = labelCompoundNode(node.body);
    return { ...node, nodeId, typeArgs, args, returnType, body };
  }

  function labelAbstractMethodDeclaration(
    node: ast.AbstractMethodDeclaration,
  ): lst.AbstractMethodDeclaration {
    const nodeId = createNodeId(node.type);
    const typeArgs = node.typeArgs.map(labelTypeArgDef);
    const args = node.args.map(labelArgDef);
    const returnType = nullishMap(node.returnType, labelTypeNode);
    return { ...node, nodeId, typeArgs, args, returnType };
  }

  function labelArgDef(node: ast.ArgDef): lst.ArgDef {
    const nodeId = createNodeId(node.type);
    const valueType = labelTypeNode(node.valueType);
    return { ...node, nodeId, valueType };
  }

  function labelCompoundNode(node: ast.CompoundNode): lst.CompoundNode {
    const nodeId = createNodeId(node.type);
    const useStatements = node.useStatements.map(labelUseStatement);
    const nodes = node.nodes.map(labelCompoundNodeSubnode);
    return { ...node, nodeId, useStatements, nodes };
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
    const nodeId = createNodeId(node.type);
    const valueType = nullishMap(node.valueType, labelTypeNode);
    const initialValue = labelExpr(node.initialValue);
    return { ...node, nodeId, valueType, initialValue };
  }

  function labelAssignment(node: ast.Assignment): lst.Assignment {
    const nodeId = createNodeId(node.type);
    const assignee = labelExpr(node.assignee);
    const value = labelExpr(node.value);
    return { ...node, nodeId, assignee, value };
  }

  function labelReturnStatement(node: ast.Return): lst.Return {
    const nodeId = createNodeId(node.type);
    const value = nullishMap(node.value, labelExpr);
    return { ...node, nodeId, value };
  }

  function labelBreakStatement(node: ast.Break): lst.Break {
    const nodeId = createNodeId(node.type);
    return { ...node, nodeId };
  }

  function labelContinueStatement(node: ast.Continue): lst.Continue {
    const nodeId = createNodeId(node.type);
    return { ...node, nodeId };
  }

  function labelThrowStatement(node: ast.Throw): lst.Throw {
    const nodeId = createNodeId(node.type);
    const value = labelExpr(node.value);
    return { ...node, nodeId, value };
  }

  function labelIfNode(node: ast.If): lst.If {
    const nodeId = createNodeId(node.type);
    const condition = labelExpr(node.condition);
    const body = labelCompoundNode(node.body);
    const alternatives = node.alternatives.map(labelIfAlternative);
    return { ...node, nodeId, condition, body, alternatives };
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
    const nodeId = createNodeId(node.type);
    const condition = labelExpr(node.condition);
    const body = labelCompoundNode(node.body);
    return { ...node, nodeId, condition, body };
  }

  function labelElseNode(node: ast.Else): lst.Else {
    const nodeId = createNodeId(node.type);
    const body = labelCompoundNode(node.body);
    return { ...node, nodeId, body };
  }

  function labelDoNode(node: ast.Do): lst.Do {
    const nodeId = createNodeId(node.type);
    const body = labelCompoundNode(node.body);
    return { ...node, nodeId, body };
  }

  function labelTryStatement(node: ast.Try): lst.Try {
    const nodeId = createNodeId(node.type);
    const body = labelCompoundNode(node.body);
    const catches = node.catches.map(labelCatchNode);
    return { ...node, nodeId, body, catches };
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
    const nodeId = createNodeId(node.type);
    const arg = labelArgDef(node.arg);
    const body = labelCompoundNode(node.body);
    return { ...node, nodeId, arg, body };
  }

  function labelCatchNodeWithBindinglessErrorRestriction(
    node: ast.RestrictedBindinglessCatch,
  ): lst.RestrictedBindinglessCatch {
    const nodeId = createNodeId(node.type);
    const caughtTypes = node.caughtTypes.map(labelTypeNode);
    const body = labelCompoundNode(node.body);
    return { ...node, nodeId, caughtTypes, body };
  }

  function labelCatchAllNode(node: ast.CatchAll): lst.CatchAll {
    const nodeId = createNodeId(node.type);
    const body = labelCompoundNode(node.body);
    return { ...node, nodeId, body };
  }

  function labelWhileStatement(node: ast.While): lst.While {
    const nodeId = createNodeId(node.type);
    const condition = labelExpr(node.condition);
    const body = labelCompoundNode(node.body);
    return { ...node, nodeId, condition, body };
  }

  function labelLoopStatement(node: ast.Loop): lst.Loop {
    const nodeId = createNodeId(node.type);
    const body = labelCompoundNode(node.body);
    return { ...node, nodeId, body };
  }

  function labelRepeatStatement(node: ast.Repeat): lst.Repeat {
    const nodeId = createNodeId(node.type);
    const repetitions = labelExpr(node.repetitions);
    const body = labelCompoundNode(node.body);
    return { ...node, nodeId, repetitions, body };
  }

  function labelForStatement(node: ast.For): lst.For {
    const nodeId = createNodeId(node.type);
    const binding = labelForNodeBinding(node.binding);
    const iteratee = labelExpr(node.iteratee);
    const body = labelCompoundNode(node.body);
    return { ...node, nodeId, binding, iteratee, body };
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
    const nodeId = createNodeId(node.type);
    return { ...node, nodeId };
  }

  function labelFlatTupleBinding(
    node: ast.FlatTupleBinding,
  ): lst.FlatTupleBinding {
    const nodeId = createNodeId(node.type);
    const bindings = node.bindings.map(labelSingleBinding);
    return { ...node, nodeId, bindings };
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
    const nodeId = createNodeId(node.type);
    return { ...node, nodeId };
  }

  function labelStringLiteral(node: ast.StringLiteral): lst.StringLiteral {
    const nodeId = createNodeId(node.type);
    return { ...node, nodeId };
  }

  function labelCharacterLiteral(
    node: ast.CharacterLiteral,
  ): lst.CharacterLiteral {
    const nodeId = createNodeId(node.type);
    return { ...node, nodeId };
  }

  function labelIdentifier(node: ast.Identifier): lst.Identifier {
    const nodeId = createNodeId(node.type);
    return { ...node, nodeId };
  }

  function labelInfixExpr(node: ast.InfixExpr): lst.InfixExpr {
    const nodeId = createNodeId(node.type);
    const left = labelExpr(node.left);
    const right = labelExpr(node.right);
    return { ...node, nodeId, left, right };
  }

  function labelPrefixExpr(node: ast.PrefixExpr): lst.PrefixExpr {
    const nodeId = createNodeId(node.type);
    const right = labelExpr(node.right);
    return { ...node, nodeId, right };
  }

  function labelDotExpr(node: ast.DotExpr): lst.DotExpr {
    const nodeId = createNodeId(node.type);
    const left = labelExpr(node.left);
    return { ...node, nodeId, left };
  }

  function labelIndexExpr(node: ast.IndexExpr): lst.IndexExpr {
    const nodeId = createNodeId(node.type);
    const left = labelExpr(node.left);
    const right = labelExpr(node.right);
    return { ...node, nodeId, left, right };
  }

  function labelCastExpr(node: ast.CastExpr): lst.CastExpr {
    const nodeId = createNodeId(node.type);
    const value = labelExpr(node.value);
    const targetType = labelTypeNode(node.targetType);
    return { ...node, nodeId, value, targetType };
  }

  function labelFunctionCall(node: ast.FunctionCall): lst.FunctionCall {
    const nodeId = createNodeId(node.type);
    const callee = labelExpr(node.callee);
    const typeArgs = node.typeArgs.map(labelTypeNode);
    const args = node.args.map(labelExpr);
    return { ...node, nodeId, callee, typeArgs, args };
  }

  function labelTypedObjectLiteral(
    node: ast.TypedObjectLiteral,
  ): lst.TypedObjectLiteral {
    const nodeId = createNodeId(node.type);
    const valueType = labelTypeNode(node.valueType);
    const copies = node.copies.map(labelObjectCopyNode);
    const entries = node.entries.map(labelObjectEntryNode);
    return { ...node, nodeId, valueType, copies, entries };
  }

  function labelObjectCopyNode(node: ast.ObjectCopy): lst.ObjectCopy {
    const nodeId = createNodeId(node.type);
    const source = labelExpr(node.source);
    return { ...node, nodeId, source };
  }

  function labelObjectEntryNode(node: ast.ObjectEntry): lst.ObjectEntry {
    const nodeId = createNodeId(node.type);
    const value = nullishMap(node.value, labelExpr);
    return { ...node, nodeId, value };
  }

  function labelArrayLiteral(node: ast.ArrayLiteral): lst.ArrayLiteral {
    const nodeId = createNodeId(node.type);
    const elements = node.elements.map(labelExpr);
    return { ...node, nodeId, elements };
  }

  function labelRangeLiteral(node: ast.RangeLiteral): lst.RangeLiteral {
    const nodeId = createNodeId(node.type);
    const start = labelExpr(node.start);
    const end = labelExpr(node.end);
    return { ...node, nodeId, start, end };
  }

  function labelMagicFunctionLiteral(
    node: ast.MagicFunctionLiteral,
  ): lst.MagicFunctionLiteral {
    const nodeId = createNodeId(node.type);
    const args = node.args.map(labelUntypedArgDef);
    const body = labelMagicFunctionBody(node.body);
    return { ...node, nodeId, args, body };
  }

  function labelUntypedArgDef(node: ast.UntypedArgDef): lst.UntypedArgDef {
    const nodeId = createNodeId(node.type);
    return { ...node, nodeId };
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
