import { TreeSourceParseResult } from "./App";
import { FileNode } from "./astCopy";

export default function parseTreeSource(src: string): TreeSourceParseResult {
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
        .replace(/,\s*\]/g, "]")
        .replace(/([^\\])\\\\"/g, '$1\\"'),
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
