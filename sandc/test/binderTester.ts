import fs from "fs";
import path, { parse } from "path";
import allSettledShim from "promise.allsettled";
import recursiveReadDir from "recursive-readdir";
import { BoundFileNodesAndRefs } from "../src/binder";
import * as lst from "../src/lst";
import parser from "../src/parser/prebuilt";
import { labelFileNodes } from "../src/labeler";

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
  }

  private testSuccessCases(binder: Binder, binderDescription: string): void {
    test(
      binderDescription + " labels individual files consistently",
      async () => {
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
      },
    );
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
    const [
      outerDirectory,
      pathRelativeToDirectoryPartitionedInto,
    ] = relativePath.split("/", 1);

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

/**
 * Like `Promise.all()`, but it won't reject until all the `Promise`s settle.
 *
 * This is in contrast to `Promise.all()`, which will immediately reject if any
 * of the `Promise`s reject.
 */
function allSettledAndAllSucceeded<T>(
  values: readonly (T | Promise<T>)[],
): Promise<T[]> {
  const all = Promise.all(values);
  const settled = allSettled(values);
  return all.catch(err =>
    settled.then(() => {
      throw err;
    }),
  );
}
