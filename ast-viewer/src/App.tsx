import React from "react";
import "./App.css";
import { FileNode } from "./astCopy";
import { renderFileNode } from "./printer";
import { NonNullReactNode } from "./types";

export default class App extends React.Component<Props, State> {
  private parseTreeSource: TreeSourceParser;
  private stateSaver: StateSaver;

  constructor(props: Props) {
    super(props);

    this.parseTreeSource = props.treeSourceParser;
    this.stateSaver = props.stateSaver;

    this.state = this.stateSaver.load();

    this.bindMethods();

    // @ts-ignore
    window.astViewer = this;
  }

  private bindMethods(): void {
    this.onTreeSourceChange = this.onTreeSourceChange.bind(this);
    this.onViewTreeClick = this.onViewTreeClick.bind(this);
    this.onDismissTreeSourceErrorClick = this.onDismissTreeSourceErrorClick.bind(
      this,
    );
    this.onTreeViewerBackClick = this.onTreeViewerBackClick.bind(this);
    this.onTreePickerBackClick = this.onTreePickerBackClick.bind(this);

    this.saveState = this.saveState.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  private saveState(): void {
    this.stateSaver.save(this.state);
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
        <button onClick={this.clearState}>Clear saved state</button>

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
    this.setState({ treeSource: event.target.value }, this.saveState);
  }

  private onViewTreeClick(): void {
    const result = this.parseTreeSource(this.state.treeSource);
    if (result instanceof Error) {
      this.setState({ treeSourceError: result });
    } else if (result.length > 1) {
      this.setState(
        { status: "PickingTree", treeChoices: result },
        this.saveState,
      );
    } else {
      this.setState(
        {
          status: "ViewingTree",
          tree: result[0],
          treeChoices: result,
        },
        this.saveState,
      );
    }
  }

  private onDismissTreeSourceErrorClick(): void {
    this.setState({ treeSourceError: undefined });
  }

  private onPickFileClick(index: number): void {
    this.setState(
      {
        status: "ViewingTree",
        tree: this.state.treeChoices[index],
      },
      this.saveState,
    );
  }

  private onTreeViewerBackClick(): void {
    if (this.state.treeChoices.length > 1) {
      this.setState({ status: "PickingTree" }, this.saveState);
    } else {
      this.setState({ status: "EditingTreeSource" }, this.saveState);
    }
  }

  private onTreePickerBackClick(): void {
    this.setState({ status: "EditingTreeSource" }, this.saveState);
  }

  private clearState(): void {
    this.stateSaver.clear();
  }
}

export interface Props {
  treeSourceParser: TreeSourceParser;
  stateSaver: StateSaver;
}

export type TreeSourceParser = (src: string) => TreeSourceParseResult;

export interface StateSaver {
  load(): State;
  save(state: State): void;
  clear(): void;
}

export type TreeSourceParseResult = FileNode[] | Error;

export interface State {
  status: AppStatus;
  treeSource: string;
  treeChoices: FileNode[];
  treeSourceError: Error | undefined;
  tree: FileNode | undefined;
}

export type AppStatus = "EditingTreeSource" | "PickingTree" | "ViewingTree";
