import path from "path";
import { testParserParsesCorrectly } from "./parser/parsesCorrectly";
import testPrebuiltParserIsUpToDate from "./parser/upToDate";

const SUCCESS_CASES_DIR = path.join(
  __dirname,
  "/fixtures/astRegression/shouldSucceed/",
);
const FAILURE_CASES_DIR = path.join(
  __dirname,
  "/fixtures/astRegression/shouldFail/",
);

const PATH_TO_PREBUILT_PARSER = path.join(
  __dirname,
  "../src/parser/parser.generated.js",
);
const PATH_TO_TEMP_DIR = path.join(__dirname, "./temp/latestParser/");
const PATH_TO_GRAMMAR = path.join(__dirname, "../grammar/sand.jison");

runTests();

function runTests() {
  testPrebuiltParserIsUpToDate({
    pathToPrebuiltParser: PATH_TO_PREBUILT_PARSER,
    pathToTempDir: PATH_TO_TEMP_DIR,
    pathToGrammar: PATH_TO_GRAMMAR,
  });

  testParserParsesCorrectly({
    pathToSuccessCaseDirectory: SUCCESS_CASES_DIR,
    pathToFailureCaseDirectory: FAILURE_CASES_DIR,
  });
}
