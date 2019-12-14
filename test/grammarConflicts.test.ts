import jison from "./jison";
import fs from "fs";
import path from "path";

const GRAMMAR_PATH = path.join(__dirname, "../grammar/sand.jison");

test("sand.jison does not have new conflicts", () => {
  let out = "";
  function print(line: string) {
    out += line;
    out += "\n";
  }

  jison.print = print;

  const src = fs.readFileSync(GRAMMAR_PATH, "utf8");
  const _parser = new jison.Parser(src);

  expect(out).toMatchSnapshot();

  const numberOfConflicts = getNumberOfConflicts(out);

  expect(numberOfConflicts).toMatchSnapshot();
});

function getNumberOfConflicts(logs: string): number {
  const matches = logs.match(/Conflict in grammar/g);

  if (matches === null) {
    return 0;
  } else {
    return matches.length;
  }
}
