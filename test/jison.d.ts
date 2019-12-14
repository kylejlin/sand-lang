export class Parser {
  constructor(grammar: any);
  generate(): string;
  parse(program: string): any;
}

export function print(line: string): void;
