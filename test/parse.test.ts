import prebuiltParser from "../src/parser/prebuilt";
import fs from "fs";
import path from "path";
import getLatestParser from "../src/parser/getLatestParser";

const SUCCESS_CASES_DIR = path.join(
  __dirname,
  "/fixtures/astRegression/shouldSucceed/",
);
const FAILURE_CASES_DIR = path.join(
  __dirname,
  "/fixtures/astRegression/shouldFail/",
);

testSuccessCases(SUCCESS_CASES_DIR);
testFailureCases(FAILURE_CASES_DIR);

function testSuccessCases(successDirPath: string) {
  const sandFileContents = getSandFileContents(successDirPath);

  describe("the prebuilt parser", () => {
    sandFileContents.forEach((content, fileName) => {
      test("prebuilt parser parses " + fileName + " consistently", () => {
        expect(prebuiltParser.parse(content)).toMatchSnapshot();
      });
    });
  });

  describe("the latest parser", () => {
    const latestParser = getLatestParser();

    sandFileContents.forEach((content, fileName) => {
      test("latest parser parses " + fileName + " consistently", () => {
        expect(latestParser.parse(content)).toMatchSnapshot();
      });
    });
  });
}

function testFailureCases(failureDirPath: string) {
  const sandFileContents = getSandFileContents(failureDirPath);

  describe("the prebuilt parser", () => {
    sandFileContents.forEach((content, fileName) => {
      test(
        "prebuilt parser throws an error complaining about the same line (as snapshot) when parsing " +
          fileName,
        () => {
          try {
            prebuiltParser.parse(content);
            fail("Parser did not throw error.");
          } catch (err) {
            const lineNum = getParseErrorLineNumber(err);
            expect(lineNum).toMatchSnapshot();
          }
        },
      );
    });
  });

  describe("the latest parser", () => {
    const latestParser = getLatestParser();

    sandFileContents.forEach((content, fileName) => {
      test(
        "latest parser throws an error complaining about the same line (as snapshot) when parsing " +
          fileName,
        () => {
          try {
            latestParser.parse(content);
            fail("Parser did not throw error.");
          } catch (err) {
            const lineNum = getParseErrorLineNumber(err);
            expect(lineNum).toMatchSnapshot();
          }
        },
      );
    });
  });
}

/** Returns a Map of file names to file content. */
function getSandFileContents(dirPath: string): Map<string, string> {
  const sandFileNames = getSandFileNames(dirPath);
  return new Map(
    sandFileNames.map(fileName => {
      const filePath = path.join(dirPath, fileName);
      const content = fs.readFileSync(filePath, "utf8");
      return [fileName, content];
    }),
  );
}

function getSandFileNames(dirPath: string): string[] {
  return fs
    .readdirSync(dirPath, "utf8")
    .filter(fileName => fileName.endsWith(".sand"));
}

function getParseErrorLineNumber(err: Error): number {
  const match = err.message.match(/Parse error on line (\d+):/);

  if (match === null) {
    throw new Error("Error does not have a line number.");
  }

  return parseInt(match[1], 10);
}
