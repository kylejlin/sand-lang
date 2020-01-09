import flat from "array.prototype.flat";
import React from "react";
import {
  ArgDef,
  Binding,
  Catch,
  CatchType,
  ClassItem,
  CompoundNode,
  ConstraintType,
  Expr,
  FileNode,
  If,
  IfAlternative,
  IfAlternativeType,
  LocalVariableDeclaration,
  MagicFunctionLiteral,
  NodeType,
  ObjectCopy,
  ObjectEntry,
  OptAccessModifier,
  Type,
  TypeArgDef,
  Class,
  Overridability,
  StaticMethodCopy,
  StaticMethodCopySignature,
  Use,
  Import,
} from "./astCopy";
import { NonNullReactNode } from "./types";

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

export function renderFileNode(node: FileNode): React.ReactElement {
  return (
    <div className="FileNode">
      {node.packageName === null ? "" : "package " + node.packageName + ";\n\n"}
      {node.imports.map(statement => (
        <>
          {renderImportStatement(statement)}
          {"\n"}
        </>
      ))}
      {node.imports.length > 0 ? "\n" : ""}
      {node.useStatements.map(use => (
        <>
          {renderUseStatement(use)}
          {"\n"}
        </>
      ))}
      {node.useStatements.length > 0 ? "\n" : ""}
      {separate(
        ([node.pubClass] as [Class])
          .concat(node.privClasses)
          .map(node => renderClass(node)),
        "\n\n",
      )}
    </div>
  );
}

function renderImportStatement(statement: Import): NonNullReactNode {
  return "import " + statement.name + ";";
}

function renderUseStatement(use: Use): NonNullReactNode {
  const keyword = use.doesShadow ? "use!" : "use";
  if (use.alias === null) {
    return keyword + " " + use.name + ";";
  } else {
    return keyword + " " + use.name + " as " + use.alias + ";";
  }
}

function renderClass(node: Class): NonNullReactNode {
  return (
    <>
      {node.isPub ? "pub " : ""}
      {node.overridability === Overridability.Final
        ? ""
        : node.overridability === Overridability.Abstract
        ? "abstract "
        : "open "}
      class {node.name}
      {renderTypeArgDefs(node.typeArgDefs)}
      {node.superClass === null ? "" : " extends " + node.superClass.name}
      {" {"}
      {node.copies.map(copy => (
        <>
          {"\n" + TAB}
          {renderStaticMethodCopy(copy)}
        </>
      ))}
      {node.copies.length > 0 ? "\n" : ""}
      {node.useStatements.map(use => (
        <>
          {" "}
          {"\n" + TAB}
          {renderUseStatement(use)}
        </>
      ))}
      {node.useStatements.length > 0 ? "\n" : ""}
      {"\n"}
      {separate(
        node.items.map(item => (
          <>
            {TAB}
            {renderClassItem(item)}
          </>
        )),
        "\n\n",
      )}
      {"\n}"}
    </>
  );
}

function renderStaticMethodCopy(copy: StaticMethodCopy): NonNullReactNode {
  if (copy.alias === null) {
    return (
      <>
        {renderAccessModifier(copy.accessModifier)}copy {copy.name}
        {renderOptCopySignature(copy.signature)};
      </>
    );
  } else {
    return (
      <>
        {renderAccessModifier(copy.accessModifier)}copy {copy.name}
        {renderOptCopySignature(copy.signature)} as {copy.alias};
      </>
    );
  }
}

function renderOptCopySignature(
  sig: StaticMethodCopySignature | null,
): NonNullReactNode {
  if (sig === null) {
    return "";
  } else {
    return (
      <>
        {renderTypeArgDefs(sig.typeArgs)}(
        {separate(
          sig.argTypes.map(t => renderType(t)),
          ", ",
        )}
        )
      </>
    );
  }
}

function renderClassItem(item: ClassItem): NonNullReactNode {
  switch (item.type) {
    case NodeType.InstancePropertyDeclaration:
      return (
        <>
          {renderAccessModifier(item.accessModifier)}
          {item.name}: {renderType(item.valueType)};
        </>
      );
    case NodeType.StaticPropertyDeclaration:
      if (item.valueType === null) {
        return (
          <>
            {renderAccessModifier(item.accessModifier)}static {item.name} ={" "}
            {renderExpr(item.initialValue, 2)};
          </>
        );
      } else {
        return (
          <>
            {renderAccessModifier(item.accessModifier)}static {item.name}:{" "}
            {renderType(item.valueType)} = {renderExpr(item.initialValue, 2)};
          </>
        );
      }
    case NodeType.ConcreteMethodDeclaration:
      return (
        <>
          {renderAccessModifier(item.accessModifier)}
          {item.isOpen ? "open " : ""}
          {item.isOverride ? "override " : ""}
          {item.name}
          {renderTypeArgDefs(item.typeArgs)}(
          {item.isStatic ? "" : item.args.length === 0 ? "this" : "this, "}
          {separate(
            item.args.map(d => renderArgDef(d)),
            ", ",
          )}
          )
          {item.returnType === null ? null : (
            <>: {renderType(item.returnType)}</>
          )}{" "}
          {renderCompoundExpr(item.body, 2)}
        </>
      );
    case NodeType.AbstractMethodDeclaration:
      return (
        <>
          {renderAccessModifier(item.accessModifier)}
          abstract {item.name}
          {renderTypeArgDefs(item.typeArgs)}(
          {item.args.length === 0 ? "this" : "this, "}
          {separate(
            item.args.map(d => renderArgDef(d)),
            ", ",
          )}
          )
          {item.returnType === null ? null : (
            <>: {renderType(item.returnType)}</>
          )}
          ;
        </>
      );
    case NodeType.InstantiationRestriction:
      return item.level + " inst;";
  }
}

function renderAccessModifier(mod: OptAccessModifier): string {
  if (mod === null) {
    return "";
  } else {
    return mod + " ";
  }
}

function renderTypeArgs(args: Type[]): NonNullReactNode {
  if (args.length === 0) {
    return "";
  } else {
    return (
      <>
        {"<"}
        {separate(
          args.map(a => renderType(a)),
          ", ",
        )}
        {">"}
      </>
    );
  }
}

function renderType(type: Type): NonNullReactNode {
  return (
    <>
      {type.name}
      {renderTypeArgs(type.args)}
    </>
  );
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
          {arg.name} extends {renderType(arg.constraint.superClass)}
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
  comp: CompoundNode,
  depth: number,
): NonNullReactNode {
  if (comp.nodes.length === 0) {
    return "{}";
  } else {
    return (
      <>
        {"{\n"}
        {separate(
          comp.nodes
            .map(child => renderBlockChild(child, depth + 1))
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
  item: CompoundNode["nodes"][number],
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
    case NodeType.Break:
      return "break;";
    case NodeType.Continue:
      return "continue;";
    case NodeType.Throw:
      return <>throw {renderExpr(item.value, depth)};</>;
    case NodeType.While:
      return (
        <>
          while {renderExpr(item.condition, depth)}{" "}
          {renderCompoundExpr(item.body, depth)}
        </>
      );
    case NodeType.Loop:
      return <>loop {renderCompoundExpr(item.body, depth)}</>;
    case NodeType.Repeat:
      return (
        <>
          repeat {renderExpr(item.repetitions, depth)}{" "}
          {renderCompoundExpr(item.body, depth)}
        </>
      );
    case NodeType.For:
      return (
        <>
          for {renderBinding(item.binding)} in{" "}
          {renderExpr(item.iteratee, depth)}{" "}
          {renderCompoundExpr(item.body, depth)}
        </>
      );
    case NodeType.Try:
      return (
        <>
          try {renderCompoundExpr(item.body, depth)}
          {item.catches.map(catchNode => (
            <>
              {" "}
              catch{renderOptCatchBinding(catchNode)}{" "}
              {renderCompoundExpr(catchNode.body, depth)}
            </>
          ))}
        </>
      );
    case NodeType.If:
      return renderIf(item, depth);
    default:
      console.log("blockchild", item);
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
  switch (alt.alternativeType) {
    case IfAlternativeType.ElseIf:
      return (
        <>
          else if {renderExpr(alt.condition, depth)}{" "}
          {renderCompoundExpr(alt.body, depth)}
        </>
      );

    case IfAlternativeType.Else:
      return <>else {renderCompoundExpr(alt.body, depth)}</>;
  }
}

function renderOptCatchBinding(catchNode: Catch): NonNullReactNode {
  switch (catchNode.catchType) {
    case CatchType.BoundCatch:
      return (
        <>
          {" "}
          {catchNode.arg.name}: {renderType(catchNode.arg.valueType)}
        </>
      );
    case CatchType.RestrictedBindinglessCatch:
      return (
        <>
          :{" "}
          {separate(
            catchNode.caughtTypes.map(t => renderType(t)),
            " | ",
          )}
        </>
      );
    case CatchType.CatchAll:
      return "";
  }
}

function renderBinding(binding: Binding): NonNullReactNode {
  switch (binding.type) {
    case NodeType.SingleBinding:
      return binding.name;
    case NodeType.FlatTupleBinding:
      return (
        <>
          (
          {binding.bindings.map(singleBinding => singleBinding.name).join(", ")}
          )
        </>
      );
  }
}

function renderExpr(expr: Expr, depth: number): NonNullReactNode {
  switch (expr.type) {
    case NodeType.NumberLiteral:
      return expr.value;
    case NodeType.StringLiteral:
      return expr.value;
    case NodeType.CharacterLiteral:
      return expr.value;
    case NodeType.Identifier:
      return expr.name;
    case NodeType.InfixExpr:
      return (
        <span className="AstNode">
          ({renderExpr(expr.left, depth)} {expr.operation}{" "}
          {renderExpr(expr.right, depth)})
        </span>
      );
    case NodeType.PrefixExpr:
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
    case NodeType.IndexExpr:
      return (
        <>
          {renderExpr(expr.left, depth)}[{renderExpr(expr.right, depth)}]
        </>
      );
    case NodeType.If:
      return <span className="AstNode">{renderIf(expr, depth)}</span>;
    case NodeType.FunctionCall:
      return (
        <>
          {renderExpr(expr.callee, depth)}
          {renderTypeArgs(expr.typeArgs)}(
          {separate(
            expr.args.map(e => renderExpr(e, depth)),
            ", ",
          )}
          )
        </>
      );
    case NodeType.TypedObjectLiteral:
      return (
        <>
          {renderType(expr.valueType)}{" "}
          {renderObjectCopiesAndEntries(expr.copies, expr.entries, depth)}
        </>
      );
    case NodeType.ArrayLiteral:
      if (expr.elements.length === 0) {
        return "[]";
      } else {
        return (
          <>
            [
            {expr.elements.map(expr => (
              <>
                {"\n"}
                {TAB.repeat(depth)}
                {renderExpr(expr, depth + 1)},
              </>
            ))}
            {"\n" + TAB.repeat(depth - 1)}]
          </>
        );
      }
    case NodeType.RangeLiteral:
      return (
        <>
          ({renderExpr(expr.start, depth)}
          {expr.includesEnd ? "..=" : ".."}
          {renderExpr(expr.end, depth)})
        </>
      );
    case NodeType.CastExpr:
      return (
        <>
          ({renderExpr(expr.value, depth)} as! {renderType(expr.targetType)})
        </>
      );
    case NodeType.Do:
      console.log("doexpr", expr);
      return <>do {renderCompoundExpr(expr.body, depth)}</>;
    case NodeType.MagicFunctionLiteral:
      return (
        <>
          \
          {separate(
            expr.args.map(arg => arg.name),
            ", ",
          )}{" "}
          -> {renderMagicFunctionBody(expr.body, depth)}
        </>
      );
  }
}

function renderObjectCopiesAndEntries(
  copies: ObjectCopy[],
  entries: ObjectEntry[],
  depth: number,
): NonNullReactNode {
  if (copies.length + entries.length === 0) {
    return "{}";
  } else {
    return (
      <>
        {"{\n"}
        {copies
          .map(c => <>...{renderExpr(c.source, depth + 1)}</>)
          .map(rendered => (
            <>
              {TAB.repeat(depth)}
              {rendered}
              {",\n"}
            </>
          ))}

        {separate(
          entries
            .map(e => renderObjectEntry(e, depth + 1))
            .map(rendered => [TAB.repeat(depth), rendered, ","]),
          "\n",
        )
          .flat()
          .concat(["\n" + TAB.repeat(Math.max(0, depth - 1)) + "}"])}
      </>
    );
  }
}

function renderObjectEntry(ent: ObjectEntry, depth: number): NonNullReactNode {
  if (ent.value === null) {
    return ent.key;
  } else {
    return (
      <>
        {ent.key}: {renderExpr(ent.value, depth)}
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

function renderMagicFunctionBody(
  body: MagicFunctionLiteral["body"],
  depth: number,
): NonNullReactNode {
  if (body.type === NodeType.CompoundNode) {
    return renderCompoundExpr(body, depth);
  } else {
    return renderExpr(body, depth);
  }
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
