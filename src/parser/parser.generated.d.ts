export default parser;

declare const parser: Parser;

export interface Parser {
  parser: { yy: any };
  parse(src: string): any;
}
