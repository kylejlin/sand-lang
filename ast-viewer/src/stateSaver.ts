import { State, StateSaver } from "./App";
import { FileNode } from "./astCopy";
import parseTreeSource from "./parseTreeSource";
import { stringifyFileNode } from "./printer";

type SerializedState =
  | SerializedSourceEditState
  | SerializedTreePickState
  | SerializedTreeViewState;

interface SerializedSourceEditState {
  status: "EditingTreeSource";
  treeSource: string;
}

interface SerializedTreePickState {
  status: "PickingTree";
  treeSource: string;
}

interface SerializedTreeViewState {
  status: "ViewingTree";
  treeSource: string;
  selectedTreeIndex: number;
}

const stateSaver: StateSaver = {
  load: loadStateFromLocalStorage,
  save: saveStateToLocalStorage,
};

const LOCAL_STORAGE_KEY = "sandAstViewerState";

const DEFAULT_STATE: State = {
  status: "EditingTreeSource",
  treeSource: "",
  treeChoices: [],
  treeSourceError: undefined,
  tree: undefined,
};

function loadStateFromLocalStorage(): State {
  const stateStr = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (stateStr === null) {
    return DEFAULT_STATE;
  }

  try {
    const serialization = JSON.parse(stateStr);

    if ("object" === typeof serialization && serialization !== null) {
      return generateState(serialization);
    } else {
      return DEFAULT_STATE;
    }
  } catch {
    return DEFAULT_STATE;
  }
}

function generateState(partialState: Partial<SerializedState>): State {
  const { treeSource } = partialState;

  console.log("generating", partialState);

  if ("string" !== typeof treeSource) {
    return DEFAULT_STATE;
  }

  const treeChoices = parseTreeSource(treeSource);

  if (treeChoices instanceof Error) {
    return DEFAULT_STATE;
  }

  if (partialState.status === "EditingTreeSource") {
    return { ...DEFAULT_STATE, treeSource };
  } else if (partialState.status === "PickingTree" && treeChoices.length > 1) {
    return { ...DEFAULT_STATE, status: "PickingTree", treeSource, treeChoices };
  } else if (
    partialState.status === "ViewingTree" &&
    "number" === typeof partialState.selectedTreeIndex &&
    partialState.selectedTreeIndex in treeChoices
  ) {
    return {
      ...DEFAULT_STATE,
      status: "ViewingTree",
      treeSource,
      treeChoices,
      tree: treeChoices[partialState.selectedTreeIndex],
    };
  } else {
    return DEFAULT_STATE;
  }
}

function saveStateToLocalStorage(state: State): void {
  const serialized = serializeState(state);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serialized));
}

function serializeState(state: State): SerializedState {
  console.log("serializing", state);

  const { status, treeSource } = state;

  switch (status) {
    case "EditingTreeSource":
    case "PickingTree":
      return { status, treeSource };
    case "ViewingTree": {
      if (state.tree === undefined) {
        throw new Error(
          "Cannot serialize ViewingTree state when tree is undefined.",
        );
      }

      const selectedTreeIndex = indexOfTree(state.tree, state.treeChoices);
      return { status, treeSource, selectedTreeIndex };
    }
  }
}

function indexOfTree(selected: FileNode, choices: FileNode[]): number {
  const indexByReferentialEquality = choices.indexOf(selected);

  if (indexByReferentialEquality > -1) {
    return indexByReferentialEquality;
  }

  const entriesWithSamePubClassName = choices
    .map<[number, FileNode]>((node, index) => [index, node])
    .filter(([_index, node]) => node.pubClass.name === selected.pubClass.name);

  const selectedHash = hashTree(selected);

  const index = entriesWithSamePubClassName.find(
    ([_index, node]) => hashTree(node) === selectedHash,
  )?.[0];

  if (index === undefined) {
    throw new Error(
      "Cannot find tree with matching selectedTree by reference or hash in treeChoices.",
    );
  }

  return index;
}

function hashTree(tree: FileNode): string {
  return stringifyFileNode(tree);
}

export default stateSaver;
