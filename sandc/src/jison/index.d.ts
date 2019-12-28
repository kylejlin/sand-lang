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
  yyleng: number;
  yylloc: JisonNodeLocation;
  yylineno: number;

  lex(): TokenType;
  setInput(input: string): void;

  pastInput(): string;
  upcomingInput(): string;
  input(): void;
  showPosition(): string;
}

export interface JisonNodeLocation {
  first_line: number;
  last_line: number;
  first_column: number;
  last_column: number;
}
