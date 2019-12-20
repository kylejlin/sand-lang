import React from "react";
import "./App.css";

import {
  FileNode,
  ClassItem,
  NodeType,
  Type,
  OptAccessModifier,
  TypeArgDef,
  ArgDef,
  ConstraintType,
  CompoundExpression,
  LocalVariableDeclaration,
  Expr,
  If,
  IfAlternative,
  IfAlternativeType,
} from "./astCopy";

type NonNullReactNode = Exclude<React.ReactNode, undefined | null>;

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      status: "EditingTreeSource",
      treeSource: "",
      treeChoices: [],
      treeSourceError: undefined,
      tree: undefined,
    };

    this.bindMethods();
  }

  private bindMethods(): void {
    this.onTreeSourceChange = this.onTreeSourceChange.bind(this);
    this.onViewTreeClick = this.onViewTreeClick.bind(this);
    this.onDismissTreeSourceErrorClick = this.onDismissTreeSourceErrorClick.bind(
      this,
    );
  }

  render(): NonNullReactNode {
    switch (this.state.status) {
      case "EditingTreeSource":
        return this.renderTreeSourceEditor();
      case "PickingTree":
        return this.renderTreePicker();
      case "ViewingTree":
        return this.renderTreeViewer();
    }
  }

  private renderTreeSourceEditor(): NonNullReactNode {
    return (
      <div className="App">
        <h2>Paste your JSON or Snap file:</h2>
        <textarea
          value={this.state.treeSource}
          onChange={this.onTreeSourceChange}
        ></textarea>
        <button onClick={this.onViewTreeClick}>View</button>

        {this.state.treeSourceError !== undefined && (
          <div className="ErrorBox">
            <h3>Error: </h3>
            <div>{getParseErrorMessage(this.state.treeSourceError)}</div>
            <button onClick={this.onDismissTreeSourceErrorClick}>
              Dismiss
            </button>
          </div>
        )}
      </div>
    );
  }

  private renderTreePicker(): NonNullReactNode {
    return (
      <div className="App">
        <h3>Pick a file</h3>
        <ul>
          {this.state.treeChoices.map((file, i) => (
            <li key={i} onClick={() => this.onPickFileClick(i)}>
              {file.pubClass.name}.sand
            </li>
          ))}
        </ul>
      </div>
    );
  }

  private renderTreeViewer(): NonNullReactNode {
    const { tree } = this.state;

    if (tree === undefined) {
      throw new Error("Cannot renderTreeViewer when tree is undefined.");
    }

    return (
      <div className="App">
        <h3>{tree.pubClass.name}.sand</h3>
        <div className="ClassItemsContainer">
          {tree.pubClass.items.map(renderClassItem)}
        </div>
      </div>
    );
  }

  private onTreeSourceChange(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ): void {
    this.setState({ treeSource: event.target.value });
  }

  private onViewTreeClick(): void {
    const result = parseTreeSource(this.state.treeSource);
    if (result.type === "SingleFileNode") {
      this.setState({ status: "ViewingTree", tree: result.node });
    } else if (result.type === "MultipleFileNodes") {
      this.setState({ status: "PickingTree", treeChoices: result.nodes });
    } else {
      this.setState({ treeSourceError: result });
    }
  }

  private onDismissTreeSourceErrorClick(): void {
    this.setState({ treeSourceError: undefined });
  }

  private onPickFileClick(index: number): void {
    this.setState({
      status: "ViewingTree",
      tree: this.state.treeChoices[index],
    });
  }
}

interface State {
  status: AppStatus;
  treeSource: string;
  treeChoices: FileNode[];
  treeSourceError: ParseError | undefined;
  tree: FileNode | undefined;
}

type AppStatus = "EditingTreeSource" | "PickingTree" | "ViewingTree";

type TreeSourceParseResult = SingleFileNode | MultipleFileNodes | ParseError;
type ParseError = JsonError | ZeroValidSnapshotsError;

interface SingleFileNode {
  type: "SingleFileNode";
  node: FileNode;
}

interface MultipleFileNodes {
  type: "MultipleFileNodes";
  nodes: FileNode[];
}

interface JsonError {
  type: "JsonError";
  rawError: Error;
}

interface ZeroValidSnapshotsError {
  type: "ZeroValidSnapshotsError";
}

function parseTreeSource(src: string): TreeSourceParseResult {
  let jsonParseErr: Error;

  try {
    const obj = JSON.parse(src);
    if (isFileNode(obj)) {
      return { type: "SingleFileNode", node: obj };
    } else {
      return {
        type: "JsonError",
        rawError: new TypeError("Object is not a valid FileNode."),
      };
    }
  } catch (e) {
    jsonParseErr = e;
  }

  try {
    const fileNodes = parseSnapFile(src);
    if (fileNodes.length === 0) {
      return { type: "ZeroValidSnapshotsError" };
    } else if (fileNodes.length === 1) {
      return { type: "SingleFileNode", node: fileNodes[0] };
    } else {
      return { type: "MultipleFileNodes", nodes: fileNodes };
    }
  } catch {
    return { type: "JsonError", rawError: jsonParseErr };
  }
}

function parseSnapFile(src: string): FileNode[] {
  const exportAssignments = src.match(
    /exports\[`(?:\\`|[^`])*`\]\s*=\s*[\s\S]*?(?=(?:exports\[`(?:\\`|[^`])*`\]\s*=)|$)/g,
  );
  if (exportAssignments === null) {
    return [];
  } else {
    return exportAssignments
      .map(parseSnapshot)
      .filter((x: FileNode | null): x is FileNode => x !== null);
  }
}

function parseSnapshot(assignment: string): FileNode | null {
  const assignmentLefthand = assignment.match(/exports\[`(?:\\`|[^`])*`\]\s*=/);

  if (assignmentLefthand === null) {
    return null;
  }

  const assignmentRighthand = assignment.slice(assignmentLefthand[0].length);
  const firstBacktickIndex = assignmentRighthand.indexOf("`");
  const lastBacktickIndex = assignmentRighthand.lastIndexOf("`");
  const assignmentWithoutBackticks = assignmentRighthand.slice(
    firstBacktickIndex + 1,
    lastBacktickIndex,
  );

  if (!assignmentWithoutBackticks.trim().startsWith("Object")) {
    return null;
  }

  try {
    const obj = JSON.parse(
      assignmentWithoutBackticks
        .replace(/Object \{/g, "{")
        .replace(/Array \[/g, "[")
        .replace(/,\s*\}/g, "}")
        .replace(/,\s*\]/g, "]"),
    );

    if (isFileNode(obj)) {
      return obj;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

function isFileNode(obj: any): obj is FileNode {
  return (
    "object" === typeof obj &&
    obj !== null &&
    "object" === typeof obj.pubClass &&
    obj.pubClass !== null &&
    "string" === typeof obj.pubClass.name &&
    "boolean" === typeof obj.pubClass.isPub
  );
}

function getParseErrorMessage(error: ParseError): string {
  if (error.type === "JsonError") {
    return error.rawError.message;
  } else {
    return "Zero snapshots were valid FileNodes.";
  }
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
    renderCompoundExpr(ifExpr.body) +
    renderAlternatives(ifExpr)
  );
}

const TAB = "    ";
