export default parser;

declare const parser: Parser;

export interface Parser {
  parse(src: string): any;
}
