import { Type } from "../../../ast";
import { Parser } from "../../../jison";

export declare const parser: TypeParser;

export interface TypeParser extends Parser {
  parse(src: string): Type;
}
