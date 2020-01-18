import fs from "fs";
import path from "path";
import recursiveReadDir from "recursive-readdir";
import parser from "../src/parser/prebuilt";
import allSettledShim from "promise.allsettled";
import * as ast from "../src/ast";
import { LabelingResult } from "../src/labeler";

const allSettled: typeof allSettledShim =
  (Promise as any).allSettled || allSettledShim;

export type Labeler = (nodes: ast.FileNode[]) => LabelingResult;

export interface Config {
  directory: string;
  fileCombinations: string[][];
}

export class Tester {
  private fileContent: Promise<Map<string, Promise<string>>>;

  public static fromConfig(config: Config): Tester {
    return new Tester(config.directory, config.fileCombinations);
  }

  private constructor(directory: string, private fileCombinations: string[][]) {
    this.fileContent = Tester.getSandFileContentMap(directory);
  }

  private static getSandFileContentMap(
    dirPath: string,
  ): Promise<Map<string, Promise<string>>> {
    return recursiveReadDir(dirPath)
      .then(paths => paths.filter(path => path.endsWith(".sand")))
      .then(absoluteFilePaths => {
        return new Map(
          absoluteFilePaths.map(absolutePath => {
            const relativePath = path.relative(dirPath, absolutePath);
            const content = readFile(absolutePath);
            return [relativePath, content];
          }),
        );
      });
  }

  public test(labeler: Labeler, labelerDescription: string): void {
    this.testSingleFileLabeling(labeler, labelerDescription);
    this.testMultiFileLabeling(labeler, labelerDescription);
  }

  private testSingleFileLabeling(
    labeler: Labeler,
    labelerDescription: string,
  ): void {
    test(
      labelerDescription + " labels individual files consistently",
      async () => {
        const contentMap = await this.fileContent;
        await allSettledAndAllSucceeded(
          Array.from(contentMap.entries()).map(
            async ([relativePath, contentProm]) => {
              let labelingResults: LabelingResult;

              try {
                const content = await contentProm;
                const ast = parser.parse(content);
                labelingResults = labeler([ast]);
              } catch (e) {
                e.message +=
                  ' (this unexpected error was thrown when attempting to label "' +
                  relativePath +
                  '")';
                throw e;
              }

              expect(labelingResults).toMatchSnapshot(relativePath);
            },
          ),
        );
      },
    );
  }

  private testMultiFileLabeling(
    labeler: Labeler,
    labelerDescription: string,
  ): void {
    test(
      labelerDescription + " labels individual files consistently",
      async () => {
        const contentPromMap = await this.fileContent;
        const contentMap = await promiseDotAllForMap(contentPromMap);
        this.fileCombinations.forEach(filePaths => {
          const snapshotName = "[" + filePaths.join(", ") + "]";

          let labelingResults: LabelingResult;

          try {
            const fileNodes = filePaths
              .map(path => contentMap.get(path)!)
              .map(content => parser.parse(content));
            labelingResults = labeler(fileNodes);
          } catch (e) {
            e.message +=
              " (this unexpected error was thrown when attempting to label " +
              snapshotName +
              ")";
            throw e;
          }

          expect(labelingResults).toMatchSnapshot(snapshotName);
        });
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
