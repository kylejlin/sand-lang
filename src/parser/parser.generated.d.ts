import { File } from "../ast";
import { Parser } from "../jison";

export default parser;

declare const parser: SandParser;

export interface SandParser extends Parser {
  parse(src: string): File;
}
