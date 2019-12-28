export class Parser {
  constructor(grammar: any);

  lexer: Scanner;
  yy: any;

  generate(): string;
  parse(program: string): any;
}

export function print(line: string): void;

export interface Scanner<TokenType = string> {
  yytext: string;
  yylloc: JisonNodeLocation;

  lex(): TokenType;
  setInput(input: string): void;

  pastInput(): string;
  upcomingInput(): string;
  input(): void;
}

export interface JisonNodeLocation {
  first_line: number;
  last_line: number;
  first_column: number;
  last_column: number;
}
