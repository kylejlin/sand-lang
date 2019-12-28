import fs from "fs";
import path from "path";
import recursiveReadDir from "recursive-readdir";
import { SandParser } from "../src/parser/parser.generated";
import allSettledShim from "promise.allsettled";

const allSettled: typeof allSettledShim =
  (Promise as any).allSettled || allSettledShim;

export interface TestCaseDirectories {
  successCases: string;
  failureCases: string;
}

export class Tester {
  private successFileContent: Promise<Map<string, Promise<string>>>;
  private failureFileContent: Promise<Map<string, Promise<string>>>;

  public static fromDirectories(dirs: TestCaseDirectories): Tester {
    return new Tester(dirs.successCases, dirs.failureCases);
  }

  private constructor(successCaseDir: string, failureCaseDir: string) {
    this.successFileContent = Tester.getSandFileContentMap(successCaseDir);
    this.failureFileContent = Tester.getSandFileContentMap(failureCaseDir);
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

  public test(parser: SandParser, parserDescription: string): void {
    this.testSuccessCases(parser, parserDescription);
    this.testFailureCases(parser, parserDescription);
  }

  private testSuccessCases(
    parser: SandParser,
    parserDescription: string,
  ): void {
    test(parserDescription + " parses files consistently", async () => {
      const contentMap = await this.successFileContent;
      await allSettledAndAllSucceeded(
        Array.from(contentMap.entries()).map(
          async ([relativePath, contentProm]) => {
            const content = await contentProm;
            expect(parser.parse(content)).toMatchSnapshot(relativePath);
          },
        ),
      );
    });
  }

  private testFailureCases(
    parser: SandParser,
    parserDescription: string,
  ): void {
    test(parserDescription + " throws parse errors consistently", async () => {
      const contentMap = await this.failureFileContent;
      await allSettledAndAllSucceeded(
        Array.from(contentMap.entries()).map(
          async ([relativePath, contentProm]) => {
            const content = await contentProm;
            try {
              parser.parse(content);
              fail("Parser did not throw error when parsing " + relativePath);
            } catch (err) {
              const lineNum = getParseErrorLineNumber(err);
              expect(lineNum).toMatchSnapshot(
                relativePath + " error line number",
              );
              expect(err).toMatchSnapshot(relativePath + " error");
            }
          },
        ),
      );
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

function getParseErrorLineNumber(err: Error): number {
  const match = err.message.match(/Parse error on line (\d+):/);

  if (match === null) {
    throw new Error("Error does not have a line number.");
  }

  return parseInt(match[1], 10);
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
