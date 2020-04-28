import fs from "fs";
import path from "path";
import recursiveReadDir from "recursive-readdir";
import { parseFiles } from "../../src/parser";
import stringifyNode from "../../src/stringifyNode";

interface ParsesCorrectlyTesterOptions {
  pathToSuccessCaseDirectory: string;
  pathToFailureCaseDirectory: string;
}

export function testParserParsesCorrectly({
  pathToSuccessCaseDirectory,
  pathToFailureCaseDirectory,
}: ParsesCorrectlyTesterOptions) {
  test("it parses valid Sand files correctly", testSuccessCases);
  test(
    "it throws an error when attempting to parse invalid Sand files",
    testFailureCases,
  );

  async function testSuccessCases() {
    const fileContentMap = await getSandFileContentMap(
      pathToSuccessCaseDirectory,
    );

    for (const [fileName, fileContent] of fileContentMap) {
      const fakePathToFile = path.posix.join("src", fileName);
      const contentMap = new Map([[fakePathToFile, fileContent]]);
      const parseResult = parseFiles(contentMap);
      parseResult.match({
        ok(program) {
          expect(program.files.get(fakePathToFile)).toMatchSnapshot(
            fileName + " AST",
          );
        },

        err(err) {
          fail(
            "Expected to be able to successfully parse " +
              fileName +
              ", but the following error was thrown: " +
              JSON.stringify(err),
          );
        },
      });
    }
  }

  async function testFailureCases() {
    const fileContentMap = await getSandFileContentMap(
      pathToFailureCaseDirectory,
    );

    for (const [fileName, fileContent] of fileContentMap) {
      const fakePathToFile = path.posix.join("src", fileName);
      const contentMap = new Map([[fakePathToFile, fileContent]]);
      const parseResult = parseFiles(contentMap);
      parseResult.match({
        err(err) {
          expect(err).toMatchSnapshot(fileName + " parse error");
        },

        ok(program) {
          fail(
            "Expected a parse error when parsing " +
              fileName +
              " but successfully parsed.\nHere's the AST:\n\n" +
              stringifyNode(program),
          );
        },
      });
    }
  }
}

function getSandFileContentMap(dirPath: string): Promise<Map<string, string>> {
  return recursiveReadDir(dirPath)
    .then(paths => paths.filter(path => path.endsWith(".sand")))
    .then(absoluteFilePaths => {
      return Promise.all(
        absoluteFilePaths.map(absolutePath => {
          const relativePath = path.relative(dirPath, absolutePath);
          const content = readFile(absolutePath);
          return Promise.all([relativePath, content]);
        }),
      ).then(entries => new Map(entries));
    });
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
