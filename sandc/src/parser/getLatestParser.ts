import fs from "fs";
import jison from "../jison";
import addApi from "./addApi";
import { GRAMMAR_PATH } from "./consts";
import { SandParser } from "./parser.generated";

export default function getLatestParser(): SandParser {
  jison.print = function noop() {};

  const src = fs.readFileSync(GRAMMAR_PATH, "utf8");
  const parser = new jison.Parser(src);
  addApi(parser);
  return parser;
}
