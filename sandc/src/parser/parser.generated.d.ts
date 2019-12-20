import { File } from "../ast";
import { Parser } from "../jison";

export declare const parser: SandParser;

export interface SandParser extends Parser {
  parse(src: string): File;
}
