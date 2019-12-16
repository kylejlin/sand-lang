import jison from "../src/jison";
import fs from "fs";
import { GRAMMAR_PATH } from "../src/parser/consts";

describe("sand.jison", () => {
  const jisonLogs = getJisonLogs();
  const conflictCount = getConflictCount(jisonLogs);

  test("sand.jison has the same conflicts", () => {
    expect(jisonLogs).toMatchSnapshot();
  });

  test("sand.jison has the same number of each type of conflict", () => {
    expect(conflictCount).toMatchSnapshot();
  });
});

function getJisonLogs(): string {
  let out = "";
  function print(line: string) {
    out += line;
    out += "\n";
  }

  jison.print = print;

  const src = fs.readFileSync(GRAMMAR_PATH, "utf8");
  const _parser = new jison.Parser(src);

  return out;
}

function getConflictCount(logs: string): ConflictCount {
  const matches = logs.match(
    /Conflict in grammar[\s\S]*?(?=(?:Conflict in grammar|States with conflicts|$))/g,
  );

  if (matches === null) {
    return { total: 0, reduceShift: 0, reduceReduce: 0 };
  } else {
    return {
      total: matches.length,
      reduceShift: matches.filter(isReduceShift).length,
      reduceReduce: matches.filter(isReduceReduce).length,
    };
  }
}

function isReduceShift(match: string): boolean {
  return /- reduce[\s\S]*- shift/.test(match);
}

function isReduceReduce(match: string): boolean {
  return /- reduce[\s\S]*- reduce/.test(match);
}

interface ConflictCount {
  total: number;
  reduceShift: number;
  reduceReduce: number;
}
