import fs from "fs";
import path from "path";
import recursiveReadDir from "recursive-readdir";
import { SandParser } from "../src/parser/parser.generated";

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
    this.successFileContent = Tester.getFileContentMap(successCaseDir);
    this.failureFileContent = Tester.getFileContentMap(failureCaseDir);
  }

  private static getFileContentMap(
    dirPath: string,
  ): Promise<Map<string, Promise<string>>> {
    return recursiveReadDir(dirPath).then(absoluteFilePaths => {
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
      await Promise.all(
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
    test(
      parserDescription +
        " throws an error complaining about the same line number",
      async () => {
        const contentMap = await this.failureFileContent;
        await Promise.all(
          Array.from(contentMap.entries()).map(
            async ([relativePath, contentProm]) => {
              const content = await contentProm;
              try {
                parser.parse(content);
                fail("Parser did not throw error.");
              } catch (err) {
                const lineNum = getParseErrorLineNumber(err);
                expect(lineNum).toMatchSnapshot(relativePath);
              }
            },
          ),
        );
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

function getParseErrorLineNumber(err: Error): number {
  const match = err.message.match(/Parse error on line (\d+):/);

  if (match === null) {
    throw new Error("Error does not have a line number.");
  }

  return parseInt(match[1], 10);
}
