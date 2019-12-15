import parser from "../src/parser/prebuilt";
import fs from "fs";
import path from "path";
import getLatestParser from "../src/parser/getLatestParser";

const PATH_TO_REGRESSION_TEST_SAND_FILE_DIR = path.join(
  __dirname,
  "/fixtures/astRegression/",
);

const sandFileContents = getSandFileContents();

describe("the prebuilt parser", () => {
  sandFileContents.forEach((content, path) => {
    test("prebuilt parser parses " + path + " consistently", () => {
      expect(parser.parse(content)).toMatchSnapshot();
    });
  });
});

describe("the latest parser", () => {
  const latestParser = getLatestParser();

  sandFileContents.forEach((content, path) => {
    test("latest parser parses " + path + " consistently", () => {
      expect(latestParser.parse(content)).toMatchSnapshot();
    });
  });
});

/** Returns a Map of file names to file content. */
function getSandFileContents(): Map<string, string> {
  const sandFileNames = getSandFileNames();
  return new Map(
    sandFileNames.map(fileName => {
      const filePath = path.join(
        PATH_TO_REGRESSION_TEST_SAND_FILE_DIR,
        fileName,
      );
      const content = fs.readFileSync(filePath, "utf8");
      return [fileName, content];
    }),
  );
}

function getSandFileNames(): string[] {
  return fs
    .readdirSync(PATH_TO_REGRESSION_TEST_SAND_FILE_DIR, "utf8")
    .filter(fileName => fileName.endsWith(".sand"));
}
