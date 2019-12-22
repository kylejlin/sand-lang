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
import flat from "array.prototype.flat";

flat.shim();

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
          {separate(
            item.args.map(d => renderArgDef(d)),
            ", ",
          )}
          )
          {item.returnType === null ? null : (
            <>: {renderType(item.returnType)}</>
          )}{" "}
          {renderCompoundExpr(item.body, 1)}
        </div>
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

function renderType(type: Type): NonNullReactNode {
  if (type.args.length === 0) {
    return type.name;
  } else {
    return (
      <>
        {type.name}
        {"<"}
        {separate(
          type.args.map(a => renderType(a)),
          ", ",
        )}
        {">"}
      </>
    );
  }
}

function renderTypeArgDefs(args: TypeArgDef[]): NonNullReactNode {
  if (args.length === 0) {
    return "";
  } else {
    return (
      <>
        {"<"}
        {separate(
          args.map(d => renderTypeArgDef(d)),
          ", ",
        )}
        {">"}
      </>
    );
  }
}

function renderTypeArgDef(arg: TypeArgDef): NonNullReactNode {
  switch (arg.constraint.constraintType) {
    case ConstraintType.None:
      return arg.name;
    case ConstraintType.Extends:
      return (
        <>
          {arg.name}: {renderType(arg.constraint.superClass)}
        </>
      );
  }
}

function renderArgDef(def: ArgDef): NonNullReactNode {
  return (
    <>
      {def.name}: {renderType(def.valueType)}
    </>
  );
}

function renderCompoundExpr(
  comp: CompoundExpression,
  depth: number,
): NonNullReactNode {
  if (comp.length === 0) {
    return "{}";
  } else {
    return (
      <>
        {"{\n"}
        {separate(
          comp
            .map(c => renderBlockChild(c, depth + 1))
            .map(rendered => [<span>{TAB.repeat(depth)}</span>, rendered]),
          "\n",
        )
          .flat()
          .concat(["\n" + TAB.repeat(Math.max(0, depth - 1)) + "}"])}
      </>
    );
  }
}

function renderBlockChild(
  item: CompoundExpression[number],
  depth: number,
): NonNullReactNode {
  switch (item.type) {
    case NodeType.LocalVariableDeclaration:
      return (
        <>
          {getDeclareKeyword(item)} {item.name} ={" "}
          {renderExpr(item.initialValue, depth)};
        </>
      );

    case NodeType.Assignment:
      return (
        <>
          {renderExpr(item.assignee, depth)} = {renderExpr(item.value, depth)};
        </>
      );

    case NodeType.Return:
      if (item.value === null) {
        return "return;";
      } else {
        return <>return {renderExpr(item.value, depth)};</>;
      }
    case NodeType.If:
      return renderIf(item, depth);
    default:
      return <>{renderExpr(item, depth)};</>;
  }
}

function getDeclareKeyword(decl: LocalVariableDeclaration): string {
  const word = decl.isReassignable ? "re" : "let";
  const bang = decl.doesShadow ? "!" : "";
  return word + bang;
}

function renderAlternatives(item: If, depth: number): NonNullReactNode {
  if (item.alternatives.length === 0) {
    return "";
  } else {
    return (
      <>
        {" "}
        {separate(
          item.alternatives.map(a => renderAlternative(a, depth)),
          " ",
        )}
      </>
    );
  }
}

function renderAlternative(
  alt: IfAlternative,
  depth: number,
): NonNullReactNode {
  switch (alt.type) {
    case IfAlternativeType.ElseIf:
      return (
        <>
          else if {renderExpr(alt.condition, depth)}
          {renderCompoundExpr(alt.body, depth)}
        </>
      );

    case IfAlternativeType.Else:
      return <>else {renderCompoundExpr(alt.body, depth)}</>;
  }
}

function renderExpr(expr: Expr, depth: number): NonNullReactNode {
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
          <>
            {renderExpr(expr.left, depth)}[{renderExpr(expr.right, depth)}]
          </>
        );
      } else {
        return (
          <span className="AstNode">
            ({renderExpr(expr.left, depth)} {expr.operation}{" "}
            {renderExpr(expr.right, depth)})
          </span>
        );
      }
    case NodeType.UnaryExpr:
      return (
        <span className="AstNode">
          ({expr.operation}
          {renderExpr(expr.right, depth)})
        </span>
      );
    case NodeType.DotExpr:
      return (
        <>
          {renderExpr(expr.left, depth)}.{expr.right}
        </>
      );
    case NodeType.If:
      return <span className="AstNode">{renderIf(expr, depth)}</span>;
    case NodeType.FunctionCall:
      return (
        <>
          {renderExpr(expr.callee, depth)}(
          {separate(
            expr.args.map(e => renderExpr(e, depth)),
            ", ",
          )}
          )
        </>
      );
  }
}

function renderIf(ifExpr: If, depth: number): NonNullReactNode {
  return (
    <>
      if {renderExpr(ifExpr.condition, depth)}{" "}
      {renderCompoundExpr(ifExpr.body, depth)}
      {renderAlternatives(ifExpr, depth)}
    </>
  );
}

export function stringifyFileNode(node: FileNode): string {
  return node.pubClass.items.map(stringifyClassItem).join("\n\n");
}

function stringifyClassItem(item: ClassItem): string {
  switch (item.type) {
    case NodeType.PropertyDeclaration:
      return (
        stringifyAccessModifier(item.accessModifier) +
        item.name +
        ": " +
        stringifyType(item.valueType)
      );

    case NodeType.MethodDeclaration:
      return (
        stringifyAccessModifier(item.accessModifier) +
        item.name +
        stringifyTypeArgDefs(item.typeArgs) +
        "(" +
        item.args.map(d => stringifyArgDef(d)).join(", ") +
        ")" +
        (item.returnType === null
          ? ""
          : ": " + stringifyType(item.returnType)) +
        " " +
        stringifyCompoundExpr(item.body, 1)
      );
  }
}

function stringifyAccessModifier(mod: OptAccessModifier): string {
  if (mod === null) {
    return "";
  } else {
    return mod + " ";
  }
}

function stringifyType(type: Type): string {
  if (type.args.length === 0) {
    return type.name;
  } else {
    return (
      type.name + "<" + type.args.map(a => stringifyType(a)).join(", ") + ">"
    );
  }
}

function stringifyTypeArgDefs(args: TypeArgDef[]): string {
  if (args.length === 0) {
    return "";
  } else {
    return "<" + args.map(d => stringifyTypeArgDef(d)).join(", ") + ">";
  }
}

function stringifyTypeArgDef(arg: TypeArgDef): string {
  switch (arg.constraint.constraintType) {
    case ConstraintType.None:
      return arg.name;
    case ConstraintType.Extends:
      return arg.name + ": " + stringifyType(arg.constraint.superClass);
  }
}

function stringifyArgDef(def: ArgDef): string {
  return def.name + ": " + stringifyType(def.valueType);
}

function stringifyCompoundExpr(
  comp: CompoundExpression,
  depth: number,
): string {
  if (comp.length === 0) {
    return "{}";
  } else {
    return (
      "{\n" +
      comp
        .map(c => stringifyBlockChild(c, depth + 1))
        .map(stringifyed => TAB.repeat(depth) + stringifyed)
        .join("\n") +
      "\n" +
      TAB.repeat(Math.max(0, depth - 1)) +
      "}"
    );
  }
}

function stringifyBlockChild(
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
        stringifyExpr(item.initialValue, depth) +
        ";"
      );
    case NodeType.Assignment:
      return (
        stringifyExpr(item.assignee, depth) +
        " = " +
        stringifyExpr(item.value, depth) +
        ";"
      );
    case NodeType.Return:
      if (item.value === null) {
        return "return;";
      } else {
        return "return " + stringifyExpr(item.value, depth) + ";";
      }
    case NodeType.If:
      return stringifyIf(item, depth);
    default:
      return stringifyExpr(item, depth) + ";";
  }
}

function stringifyAlternatives(item: If, depth: number): string {
  if (item.alternatives.length === 0) {
    return "";
  } else {
    return (
      " " + item.alternatives.map(a => stringifyAlternative(a, depth)).join(" ")
    );
  }
}

function stringifyAlternative(alt: IfAlternative, depth: number): string {
  switch (alt.type) {
    case IfAlternativeType.ElseIf:
      return (
        "else if " +
        stringifyExpr(alt.condition, depth) +
        stringifyCompoundExpr(alt.body, depth)
      );
    case IfAlternativeType.Else:
      return "else " + stringifyCompoundExpr(alt.body, depth);
  }
}

function stringifyExpr(expr: Expr, depth: number): string {
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
          stringifyExpr(expr.left, depth) +
          "[" +
          stringifyExpr(expr.right, depth) +
          "]"
        );
      } else {
        return (
          "(" +
          stringifyExpr(expr.left, depth) +
          " " +
          expr.operation +
          " " +
          stringifyExpr(expr.right, depth) +
          ")"
        );
      }
    case NodeType.UnaryExpr:
      return "(" + expr.operation + stringifyExpr(expr.right, depth) + ")";
    case NodeType.DotExpr:
      return stringifyExpr(expr.left, depth) + "." + expr.right;
    case NodeType.If:
      return stringifyIf(expr, depth);
    case NodeType.FunctionCall:
      return (
        stringifyExpr(expr.callee, depth) +
        "(" +
        expr.args.map(e => stringifyExpr(e, depth)).join(", ") +
        ")"
      );
  }
}

function stringifyIf(ifExpr: If, depth: number): string {
  return (
    "if " +
    stringifyExpr(ifExpr.condition, depth) +
    " " +
    stringifyCompoundExpr(ifExpr.body, depth) +
    stringifyAlternatives(ifExpr, depth)
  );
}

function separate<T, U>(arr: T[], sep: U): (T | U)[] {
  if (arr.length < 2) {
    return arr;
  }

  const newArr: (T | U)[] = [arr[0]];
  arr.slice(1).forEach(elem => {
    newArr.push(sep);
    newArr.push(elem);
  });

  return newArr;
}
