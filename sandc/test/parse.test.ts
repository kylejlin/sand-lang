import fs from "fs";
import path from "path";
import jisonCli from "../src/jison/cli";
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

tester.test(prebuiltParser, "the prebuilt parser");

const PREBUILT_PATH = path.join(__dirname, "../src/parser/parser.generated.js");
const GRAMMAR_PATH = path.join(__dirname, "../grammar/sand.jison");
const TEMP_DIR_PATH = path.join(__dirname, "./temp/latestParser/");
const LATEST_PATH = path.join(TEMP_DIR_PATH, "./parser.generated.js");

test("the prebuilt parser is up to date", () => {
  if (!fs.existsSync(TEMP_DIR_PATH)) {
    fs.mkdirSync(TEMP_DIR_PATH, { recursive: true });
  }

  if (fs.existsSync(LATEST_PATH)) {
    deleteSync(LATEST_PATH);
  }

  jisonCli.main({
    file: GRAMMAR_PATH,
    outfile: LATEST_PATH,
  });

  const prebuilt = removeTrailingNewline(
    fs.readFileSync(PREBUILT_PATH, "utf8"),
  );
  const latest = removeTrailingNewline(
    applyYylinenoReplacements(fs.readFileSync(LATEST_PATH, "utf8")),
  );
  expect(prebuilt).toBe(latest);
});

function deleteSync(path: string): void {
  fs.unlinkSync(path);
}

function removeTrailingNewline(generated: string): string {
  if (generated.slice(-1) === "\n") {
    return generated.slice(0, -1);
  } else {
    return generated;
  }
}

function applyYylinenoReplacements(generated: string): string {
  return generated.replace(/\(yylineno \+ 1\)/g, "lexer.yylineno");
}
