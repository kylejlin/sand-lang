import parser from "../src/parser";
import fs from "fs";
import path from "path";

const FIXTURES_PATH = path.join(__dirname, "/fixtures/");

const SAND_FILE_PATHS = [
  "HelloWorld.sand",
  "Factorial.sand",
  "CompoundExpressions.sand",
  "Args.sand",
  "IfMinus.sand",
  "InfixPrefix.sand",
];

SAND_FILE_PATHS.forEach(sandFilePath => {
  test("it parses " + sandFilePath + " consistently", () => {
    const src = fs.readFileSync(path.join(FIXTURES_PATH, sandFilePath), "utf8");
    expect(parser.parse(src)).toMatchSnapshot();
  });
});
