import { BindingResult } from "./binder";
import { NodeId } from "./lst";
import * as pbt from "./pbt";
import {
  Ref,
  NodeType,
  ConstraintType,
  IfAlternativeType,
  CatchType,
} from "./pbt";
import nullableToTuple from "./utils/nullableToTuple";

export class BindingResultAnalyzer {
  static fromResult(result: BindingResult): BindingResultAnalyzer {
    return new BindingResultAnalyzer(result);
  }

  private constructor(private result: BindingResult) {}

  getNodeById<T extends NodeType>(id: NodeId<T>): pbt.Node & { type: T } {
    const node = this.result.nodeIdReferents[id.rawValue];

    if (node === undefined) {
      throw new Error("Cannot find node with id " + id.rawValue);
    }

    if (node.type !== id.nodeType) {
      throw new Error(
        "Node id promised a referent of type " +
          NodeType[id.nodeType] +
          " but actual referent was of type " +
          NodeType[node.type],
      );
    }

    return node as pbt.Node & { type: T };
  }

  getParent(node: pbt.Node): pbt.Node {
    const parent = this.result.nodeIdReferents.find(possibleParent =>
      getChildren(possibleParent).some(matchesIdOf(node)),
    );

    if (parent === undefined) {
      throw new Error(
        "Cannot find parent of node with id of " + node.nodeId.rawValue,
      );
    }

    return parent;
  }

  getRefSources(ref: Ref): pbt.RefSource[] {
    return this.result.nodeIdReferents.filter(
      (node: pbt.Node): node is pbt.Node & { outRef: Ref } => {
        return "outRef" in node && node.outRef.refId === ref.refId;
      },
    );
  }

  getRefDependents(ref: Ref): pbt.RefDependent[] {
    return this.result.nodeIdReferents.filter(
      (
        node: pbt.Node,
      ): node is pbt.Node & ({ inRef: Ref } | { leftmostInRef: Ref }) => {
        return (
          ("inRef" in node && node.inRef.refId === ref.refId) ||
          ("leftmostInRef" in node && node.leftmostInRef.refId === ref.refId)
        );
      },
    );
  }
}

export function getDescendants(node: pbt.Node): pbt.Node[] {
  return getChildren(node).flatMap(child =>
    [child].concat(getDescendants(child)),
  );
}

export function getChildren(node: pbt.Node): pbt.Node[] {
  switch (node.type) {
    case NodeType.File:
      return [
        ...node.imports,
        ...node.useStatements,
        node.pubClass,
        ...node.privClasses,
      ];
    case NodeType.Import:
      return [];
    case NodeType.Use:
      return [];
    case NodeType.Class:
      return [
        ...node.typeArgDefs,
        ...nullableToTuple(node.superClass),
        ...node.copies,
        ...node.useStatements,
        ...node.items,
      ];
    case NodeType.TypeArgDef:
      return getTypeConstraintChildren(node.constraint);
    case NodeType.Type:
      return node.args;
    case NodeType.StaticMethodCopy:
      return nullableToTuple(node.signature);
    case NodeType.StaticMethodCopySignature:
      return [...node.typeArgs, ...node.argTypes];
    case NodeType.InstantiationRestriction:
      return [];
    case NodeType.InstancePropertyDeclaration:
      return [node.valueType];
    case NodeType.StaticPropertyDeclaration:
      return [...nullableToTuple(node.valueType), node.initialValue];
    case NodeType.ConcreteMethodDeclaration:
      return [
        ...node.typeArgs,
        ...node.args,
        ...nullableToTuple(node.returnType),
        node.body,
      ];
    case NodeType.AbstractMethodDeclaration:
      return [
        ...node.typeArgs,
        ...node.args,
        ...nullableToTuple(node.returnType),
      ];
    case NodeType.TypedArgDef:
      return [node.valueType];
    case NodeType.CompoundNode:
      return [...node.useStatements, ...node.nodes];
    case NodeType.NumberLiteral:
      return [];
    case NodeType.StringLiteral:
      return [];
    case NodeType.CharacterLiteral:
      return [];
    case NodeType.Identifier:
      return [];
    case NodeType.TypedObjectLiteral:
      return [node.valueType, ...node.copies, ...node.entries];
    case NodeType.ObjectCopy:
      return [node.source];
    case NodeType.ObjectEntry:
      return nullableToTuple(node.value);
    case NodeType.ArrayLiteral:
      return node.elements;
    case NodeType.RangeLiteral:
      return [node.start, node.end];
    case NodeType.MagicFunctionLiteral:
      return [...node.args, node.body];
    case NodeType.UntypedArgDef:
      return [];
    case NodeType.InfixExpr:
      return [node.left, node.right];
    case NodeType.PrefixExpr:
      return [node.right];
    case NodeType.DotExpr:
      return [node.left];
    case NodeType.IndexExpr:
      return [node.left, node.right];
    case NodeType.FunctionCall:
      return [node.callee, ...node.typeArgs, ...node.args];
    case NodeType.CastExpr:
      return [node.value, node.targetType];
    case NodeType.If:
      return [node.condition, node.body, ...node.alternatives];
    case NodeType.IfAlternative:
      switch (node.alternativeType) {
        case IfAlternativeType.ElseIf:
          return [node.condition, node.body];
        case IfAlternativeType.Else:
          return [node.body];
      }
    case NodeType.Do:
      return [node.body];
    case NodeType.LocalVariableDeclaration:
      return [node.initialValue];
    case NodeType.Assignment:
      return [node.assignee, node.value];
    case NodeType.Return:
      return nullableToTuple(node.value);
    case NodeType.Break:
      return [];
    case NodeType.Continue:
      return [];
    case NodeType.Throw:
      return [node.value];
    case NodeType.Try:
      return [node.body, ...node.catches];
    case NodeType.Catch:
      switch (node.catchType) {
        case CatchType.BoundCatch:
          return [node.arg, node.body];
        case CatchType.RestrictedBindinglessCatch:
          return [...node.caughtTypes, node.body];
        case CatchType.CatchAll:
          return [node.body];
      }
    case NodeType.While:
      return [node.condition, node.body];
    case NodeType.Loop:
      return [node.body];
    case NodeType.Repeat:
      return [node.repetitions, node.body];
    case NodeType.For:
      return [node.binding, node.iteratee, node.body];
    case NodeType.SingleBinding:
      return [];
    case NodeType.FlatTupleBinding:
      return node.bindings;
  }
}

function getTypeConstraintChildren(node: pbt.TypeConstraint): [] | [pbt.Type] {
  switch (node.constraintType) {
    case ConstraintType.None:
      return [];
    case ConstraintType.Extends:
      return [node.superType];
  }
}

function matchesIdOf(node: pbt.Node): (other: pbt.Node) => boolean {
  return function doesNodeMatchOtherNode(other: pbt.Node): boolean {
    return node.nodeId.rawValue === other.nodeId.rawValue;
  };
}
