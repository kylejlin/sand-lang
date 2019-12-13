import { File } from "../ast";

export default parser;

declare const parser: Parser;

export interface Parser {
  parser: { yy: any };
  parse(src: string): File;
}
