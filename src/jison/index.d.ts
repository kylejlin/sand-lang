export class Parser {
  constructor(grammar: any);

  yy: any;

  generate(): string;
  parse(program: string): any;
}

export function print(line: string): void;
