import React from "react";
import "./App.css";
import { FileNode } from "./astCopy";
import { renderFileNode } from "./printer";
import { NonNullReactNode } from "./types";

export default class App extends React.Component<Props, State> {
  private parseTreeSource: TreeSourceParser;

  constructor(props: Props) {
    super(props);

    this.parseTreeSource = props.treeSourceParser;

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
    const result = this.parseTreeSource(this.state.treeSource);
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

interface Props {
  treeSourceParser: TreeSourceParser;
}

type TreeSourceParser = (src: string) => TreeSourceParseResult;

export type TreeSourceParseResult = FileNode[] | Error;

interface State {
  status: AppStatus;
  treeSource: string;
  treeChoices: FileNode[];
  treeSourceError: Error | undefined;
  tree: FileNode | undefined;
}

type AppStatus = "EditingTreeSource" | "PickingTree" | "ViewingTree";
