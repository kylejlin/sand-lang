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

const TAB = "    ";

export function renderFileNode(node: FileNode): NonNullReactNode {
  return (
    <div className="ClassItemsContainer">
      {node.pubClass.items.map(renderClassItem)}
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
          {item.args.map(renderArgDef).join(", ")}):{" "}
          {item.returnType === "void" ? "void" : renderType(item.returnType)}{" "}
          {renderCompoundExpr(item.body)}
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
        item.args.map(renderArgDef).join(", ") +
        ")" +
        (item.returnType === "void" ? "" : ": " + renderType(item.returnType)) +
        " " +
        renderCompoundExpr(item.body)
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
    return type.name + "<" + type.args.map(renderType).join(", ") + ">";
  }
}

function renderTypeArgDefs(args: TypeArgDef[]): string {
  if (args.length === 0) {
    return "";
  } else {
    return "<" + args.map(renderTypeArgDef).join(", ") + ">";
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

function renderCompoundExpr(comp: CompoundExpression): string {
  if (comp.length === 0) {
    return "{}";
  } else {
    return (
      "{\n" +
      comp
        .map(renderBlockChild)
        .map(rendered => TAB + rendered)
        .join("\n") +
      "\n}"
    );
  }
}

function renderBlockChild(item: CompoundExpression[number]): string {
  switch (item.type) {
    case NodeType.LocalVariableDeclaration:
      return (
        getDeclareKeyword(item) +
        " " +
        item.name +
        " = " +
        renderExpr(item.initialValue) +
        ";"
      );
    case NodeType.Assignment:
      return renderExpr(item.assignee) + " = " + renderExpr(item.value) + ";";
    case NodeType.Return:
      if (item.value === null) {
        return "return;";
      } else {
        return "return " + renderExpr(item.value) + ";";
      }
    case NodeType.If:
      return renderIf(item);
    default:
      return renderExpr(item) + ";";
  }
}

function getDeclareKeyword(decl: LocalVariableDeclaration): string {
  const word = decl.isReassignable ? "re" : "let";
  const bang = decl.doesShadow ? "!" : "";
  return word + bang;
}

function renderAlternatives(item: If): string {
  if (item.alternatives.length === 0) {
    return "";
  } else {
    return " " + item.alternatives.map(renderAlternative).join(" ");
  }
}

function renderAlternative(alt: IfAlternative): string {
  switch (alt.type) {
    case IfAlternativeType.ElseIf:
      return (
        "else if " + renderExpr(alt.condition) + renderCompoundExpr(alt.body)
      );
    case IfAlternativeType.Else:
      return "else " + renderCompoundExpr(alt.body);
  }
}

function renderExpr(expr: Expr): string {
  switch (expr.type) {
    case NodeType.NumberLiteral:
      return expr.value;
    case NodeType.StringLiteral:
      return expr.value;
    case NodeType.Identifier:
      return expr.value;
    case NodeType.BinaryExpr:
      if (expr.operation === "[") {
        return renderExpr(expr.left) + "[" + renderExpr(expr.right) + "]";
      } else {
        return (
          "(" +
          renderExpr(expr.left) +
          " " +
          expr.operation +
          " " +
          renderExpr(expr.right) +
          ")"
        );
      }
    case NodeType.UnaryExpr:
      return "(" + expr.operation + renderExpr(expr.right) + ")";
    case NodeType.DotExpr:
      return renderExpr(expr.left) + "." + expr.right;
    case NodeType.If:
      return renderIf(expr);
    case NodeType.FunctionCall:
      return (
        renderExpr(expr.callee) +
        "(" +
        expr.args.map(renderExpr).join(", ") +
        ")"
      );
  }
}

function renderIf(ifExpr: If): string {
  return (
    "if " +
    renderExpr(ifExpr.condition) +
    " " +
    renderCompoundExpr(ifExpr.body) +
    renderAlternatives(ifExpr)
  );
}
