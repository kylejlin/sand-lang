import path from "path";
import getLatestParser from "../src/parser/getLatestParser";
import prebuiltParser from "../src/parser/prebuilt";
import { Tester } from "./parserTester";

const SUCCESS_CASES_DIR = path.join(
  __dirname,
  "/fixtures/astRegression/shouldSucceed/",
);
const FAILURE_CASES_DIR = path.join(
  __dirname,
  "/fixtures/astRegression/shouldFail/",
);

const tester = Tester.fromDirectories({
  successCases: SUCCESS_CASES_DIR,
  failureCases: FAILURE_CASES_DIR,
});

const latestParser = getLatestParser();

tester.test(latestParser, "the latest parser");
tester.test(prebuiltParser, "the prebuilt parser");