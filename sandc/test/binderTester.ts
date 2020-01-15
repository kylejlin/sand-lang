import fs from "fs";
import path from "path";
import allSettledShim from "promise.allsettled";
import recursiveReadDir from "recursive-readdir";
import { BoundFileNodesAndRefs } from "../src/binder";
import { labelFileNodes } from "../src/labeler";
import * as lst from "../src/lst";
import parser from "../src/parser/prebuilt";

const allSettled: typeof allSettledShim =
  (Promise as any).allSettled || allSettledShim;

export type Binder = (nodes: lst.FileNode[]) => BoundFileNodesAndRefs;

export interface Directories {
  success: string;
  failure: string;
}

export class Tester {
  private successFileContent: Promise<Map<string, string>>;
  private failureFileContent: Promise<Map<string, string>>;

  static fromDirectories(directories: Directories): Tester {
    return new Tester(directories);
  }

  private constructor(directories: Directories) {
    this.successFileContent = Tester.getSandFileContentMap(directories.success);
    this.failureFileContent = Tester.getSandFileContentMap(directories.failure);
  }

  private static getSandFileContentMap(
    dirPath: string,
  ): Promise<Map<string, string>> {
    return recursiveReadDir(dirPath)
      .then(paths => paths.filter(path => path.endsWith(".sand")))
      .then(absoluteFilePaths => {
        return promiseDotAllForMap(
          new Map(
            absoluteFilePaths.map(absolutePath => {
              const relativePath = path.relative(dirPath, absolutePath);
              const content = readFile(absolutePath);
              return [relativePath, content];
            }),
          ),
        );
      });
  }

  test(binder: Binder, binderDescription: string): void {
    this.testSuccessCases(binder, binderDescription);
    this.testFailureCases(binder, binderDescription);
  }

  private testSuccessCases(binder: Binder, binderDescription: string): void {
    test(binderDescription + " binds files consistently", async () => {
      const contentMap = await this.successFileContent;
      const filesInEachDir = partitionByDirectory(contentMap);
      for (const [projectDir, fileContents] of filesInEachDir.entries()) {
        const abstractSyntaxTrees = fileContents.map(({ fileContent }) =>
          parser.parse(fileContent),
        );
        const labeledSyntaxTrees = labelFileNodes(abstractSyntaxTrees)
          .fileNodes;
        const pbt = binder(labeledSyntaxTrees);
        expect(pbt).toMatchSnapshot(projectDir);
      }
    });
  }

  private testFailureCases(binder: Binder, binderDescription: string): void {
    test(binderDescription + "throws errors consistently", async () => {
      const contentMap = await this.failureFileContent;
      const filesInEachDir = partitionByDirectory(contentMap);
      for (const [projectDir, fileContents] of filesInEachDir.entries()) {
        const abstractSyntaxTrees = fileContents.map(({ fileContent }) =>
          parser.parse(fileContent),
        );
        const labeledSyntaxTrees = labelFileNodes(abstractSyntaxTrees)
          .fileNodes;

        let didError = false;

        try {
          const _pbt = binder(labeledSyntaxTrees);
        } catch (e) {
          didError = true;
          expect(e).toMatchSnapshot(projectDir);
        }

        if (!didError) {
          throw new Error(
            'Binding files in directory "' +
              projectDir +
              '" did not result in an error being thrown.',
          );
        }
      }
    });
  }
}

function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
}

function promiseDotAllForMap<K, V>(
  map: Map<K, Promise<V>>,
): Promise<Map<K, V>> {
  const keys = Array.from(map.keys());
  return Promise.all(Array.from(map.values())).then(
    values => new Map(values.map((val, i) => [keys[i], val])),
  );
}

function partitionByDirectory(
  files: Map<string, string>,
): Map<
  string,
  { pathRelativeToDirectoryPartitionedInto: string; fileContent: string }[]
> {
  const partitioned: Map<
    string,
    { pathRelativeToDirectoryPartitionedInto: string; fileContent: string }[]
  > = new Map();
  files.forEach((fileContent, relativePath) => {
    const parts = relativePath.split("/");
    const outerDirectory = parts.slice(0, -1).join("/");
    const pathRelativeToDirectoryPartitionedInto = parts[parts.length - 1];

    if (!partitioned.has(outerDirectory)) {
      partitioned.set(outerDirectory, []);
    }

    partitioned.get(outerDirectory)!.push({
      pathRelativeToDirectoryPartitionedInto,
      fileContent,
    });
  });
  return partitioned;
}
