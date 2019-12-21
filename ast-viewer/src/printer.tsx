import React from "react";
import {
  ArgDef,
  ClassItem,
  CompoundExpression,
  ConstraintType,
  Expr,
  FileNode,
  If,
  IfAlternative,
  IfAlternativeType,
  LocalVariableDeclaration,
  NodeType,
  OptAccessModifier,
  Type,
  TypeArgDef,
} from "./astCopy";
import { NonNullReactNode } from "./types";

// Note:
// Throughout this file, you will frequently see `someExpr.map(a => fn(a))`.
// You might wonder why this isn't simplified to `someExpr.map(fn)`.
// This is because many render functions take a depth argument as their second parameter.
// Since map passes in the index as the second parameter, TypeScript won't
// catch the error if you forget to pass in a `depth` because `(x: T, depth: number)` is
// a valid callback to pass into `T[].map()` (`depth` and `index` have the same type
// of `number`).

const TAB = "    ";

export function renderFileNode(node: FileNode): NonNullReactNode {
  return (
    <div className="ClassItemsContainer">
      {node.pubClass.items.map(item => renderClassItem(item))}
    </div>
  );
}

function renderClassItem(item: ClassItem): NonNullReactNode {
  switch (item.type) {
    case NodeType.PropertyDeclaration:
      return (
        <div>
          {renderAccessModifier(item.accessModifier)}
          {item.name}: {renderType(item.valueType)}
        </div>
      );
    case NodeType.MethodDeclaration:
      return (
        <div>
          {renderAccessModifier(item.accessModifier)}
          {item.name}
          {renderTypeArgDefs(item.typeArgs)}(
          {item.args.map(d => renderArgDef(d)).join(", ")}):{" "}
          {item.returnType === "void" ? "void" : renderType(item.returnType)}{" "}
          {renderCompoundExpr(item.body, 1)}
        </div>
      );
  }
}

export function stringifyFileNode(node: FileNode): string {
  return node.pubClass.items.map(stringifyClassItem).join("\n\n");
}

function stringifyClassItem(item: ClassItem): string {
  switch (item.type) {
    case NodeType.PropertyDeclaration:
      return (
        renderAccessModifier(item.accessModifier) +
        item.name +
        ": " +
        renderType(item.valueType)
      );

    case NodeType.MethodDeclaration:
      return (
        renderAccessModifier(item.accessModifier) +
        item.name +
        renderTypeArgDefs(item.typeArgs) +
        "(" +
        item.args.map(d => renderArgDef(d)).join(", ") +
        ")" +
        (item.returnType === "void" ? "" : ": " + renderType(item.returnType)) +
        " " +
        renderCompoundExpr(item.body, 1)
      );
  }
}

function renderAccessModifier(mod: OptAccessModifier): string {
  if (mod === null) {
    return "";
  } else {
    return mod + " ";
  }
}

function renderType(type: Type): string {
  if (type.args.length === 0) {
    return type.name;
  } else {
    return type.name + "<" + type.args.map(a => renderType(a)).join(", ") + ">";
  }
}

function renderTypeArgDefs(args: TypeArgDef[]): string {
  if (args.length === 0) {
    return "";
  } else {
    return "<" + args.map(d => renderTypeArgDef(d)).join(", ") + ">";
  }
}

function renderTypeArgDef(arg: TypeArgDef): string {
  switch (arg.constraint.constraintType) {
    case ConstraintType.None:
      return arg.name;
    case ConstraintType.Extends:
      return arg.name + ": " + renderType(arg.constraint.superClass);
  }
}

function renderArgDef(def: ArgDef): string {
  return def.name + ": " + renderType(def.valueType);
}

function renderCompoundExpr(comp: CompoundExpression, depth: number): string {
  if (comp.length === 0) {
    return "{}";
  } else {
    return (
      "{\n" +
      comp
        .map(c => renderBlockChild(c, depth + 1))
        .map(rendered => TAB.repeat(depth) + rendered)
        .join("\n") +
      "\n" +
      TAB.repeat(Math.max(0, depth - 1)) +
      "}"
    );
  }
}

function renderBlockChild(
  item: CompoundExpression[number],
  depth: number,
): string {
  switch (item.type) {
    case NodeType.LocalVariableDeclaration:
      return (
        getDeclareKeyword(item) +
        " " +
        item.name +
        " = " +
        renderExpr(item.initialValue, depth) +
        ";"
      );
    case NodeType.Assignment:
      return (
        renderExpr(item.assignee, depth) +
        " = " +
        renderExpr(item.value, depth) +
        ";"
      );
    case NodeType.Return:
      if (item.value === null) {
        return "return;";
      } else {
        return "return " + renderExpr(item.value, depth) + ";";
      }
    case NodeType.If:
      return renderIf(item, depth);
    default:
      return renderExpr(item, depth) + ";";
  }
}

function getDeclareKeyword(decl: LocalVariableDeclaration): string {
  const word = decl.isReassignable ? "re" : "let";
  const bang = decl.doesShadow ? "!" : "";
  return word + bang;
}

function renderAlternatives(item: If, depth: number): string {
  if (item.alternatives.length === 0) {
    return "";
  } else {
    return (
      " " + item.alternatives.map(a => renderAlternative(a, depth)).join(" ")
    );
  }
}

function renderAlternative(alt: IfAlternative, depth: number): string {
  switch (alt.type) {
    case IfAlternativeType.ElseIf:
      return (
        "else if " +
        renderExpr(alt.condition, depth) +
        renderCompoundExpr(alt.body, depth)
      );
    case IfAlternativeType.Else:
      return "else " + renderCompoundExpr(alt.body, depth);
  }
}

function renderExpr(expr: Expr, depth: number): string {
  switch (expr.type) {
    case NodeType.NumberLiteral:
      return expr.value;
    case NodeType.StringLiteral:
      return expr.value;
    case NodeType.Identifier:
      return expr.value;
    case NodeType.BinaryExpr:
      if (expr.operation === "[") {
        return (
          renderExpr(expr.left, depth) +
          "[" +
          renderExpr(expr.right, depth) +
          "]"
        );
      } else {
        return (
          "(" +
          renderExpr(expr.left, depth) +
          " " +
          expr.operation +
          " " +
          renderExpr(expr.right, depth) +
          ")"
        );
      }
    case NodeType.UnaryExpr:
      return "(" + expr.operation + renderExpr(expr.right, depth) + ")";
    case NodeType.DotExpr:
      return renderExpr(expr.left, depth) + "." + expr.right;
    case NodeType.If:
      return renderIf(expr, depth);
    case NodeType.FunctionCall:
      return (
        renderExpr(expr.callee, depth) +
        "(" +
        expr.args.map(e => renderExpr(e, depth)).join(", ") +
        ")"
      );
  }
}

function renderIf(ifExpr: If, depth: number): string {
  return (
    "if " +
    renderExpr(ifExpr.condition, depth) +
    " " +
    renderCompoundExpr(ifExpr.body, depth) +
    renderAlternatives(ifExpr, depth)
  );
}
