import React from "react";
import "./App.css";
import { FileNode } from "./astCopy";
import { renderFileNode } from "./printer";
import { NonNullReactNode } from "./types";

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
    this.onTreeViewerBackClick = this.onTreeViewerBackClick.bind(this);
    this.onTreePickerBackClick = this.onTreePickerBackClick.bind(this);
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
            <div>{this.state.treeSourceError?.message}</div>
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
        <button onClick={this.onTreePickerBackClick}>Back</button>
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
        <button onClick={this.onTreeViewerBackClick}>Back</button>

        <h3>{tree.pubClass.name}.sand</h3>

        {renderFileNode(tree)}
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
    if (result instanceof Error) {
      this.setState({ treeSourceError: result });
    } else if (result.length > 1) {
      this.setState({ status: "PickingTree", treeChoices: result });
    } else {
      this.setState({
        status: "ViewingTree",
        tree: result[0],
        treeChoices: result,
      });
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

  private onTreeViewerBackClick(): void {
    if (this.state.treeChoices.length > 1) {
      this.setState({ status: "PickingTree" });
    } else {
      this.setState({ status: "EditingTreeSource" });
    }
  }

  private onTreePickerBackClick(): void {
    this.setState({ status: "EditingTreeSource" });
  }
}

interface State {
  status: AppStatus;
  treeSource: string;
  treeChoices: FileNode[];
  treeSourceError: Error | undefined;
  tree: FileNode | undefined;
}

type AppStatus = "EditingTreeSource" | "PickingTree" | "ViewingTree";

type TreeSourceParseResult = FileNode[] | Error;

function parseTreeSource(src: string): TreeSourceParseResult {
  let jsonParseErr: Error;

  try {
    const obj = JSON.parse(src);
    if (isFileNode(obj)) {
      return [obj];
    } else {
      return new TypeError("Object is not a valid FileNode.");
    }
  } catch (e) {
    jsonParseErr = e;
  }

  try {
    const fileNodes = parseSnapFile(src);
    if (fileNodes.length === 0) {
      return new TypeError("Zero snapshots were valid FileNodes.");
    } else {
      return fileNodes;
    }
  } catch {
    return jsonParseErr;
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
