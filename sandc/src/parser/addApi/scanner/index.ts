import { Scanner, JisonNodeLocation } from "../../../jison";
import isThereUpcomingTypeArgListAndLeftParen from "./isThereUpcomingTypeArgListAndLeftParen";
import getUpcomingCastType from "./getUpcomingCastType";
import getUpcomingObjectLiteralType from "./getUpcomingObjectLiteralType";

const EOF = "EOF";
const INVALID = "INVALID";

export default class SandScanner implements Scanner {
  public yytext: string;
  public yylloc: JisonNodeLocation;

  private rules: TokenizationRule[];
  private input_: string;
  private pastInput_: string;
  private location: PointLocation;

  constructor() {
    this.yytext = "";
    this.yylloc = {
      first_line: 1,
      first_column: 0,
      last_line: 1,
      last_column: 0,
    };

    this.rules = getRules();
    this.input_ = "";
    this.pastInput_ = "";
    this.location = { line: 1, column: 0 };
  }

  public setInput(input: string) {
    this.input_ = input;
    this.pastInput_ = "";

    this.yylloc = {
      first_line: 1,
      first_column: 0,
      last_line: 1,
      last_column: 0,
    };
    this.location = { line: 1, column: 0 };
  }

  public lex(): string {
    if (this.input_ === "") {
      this.yytext = "";
      return EOF;
    }

    const leadingWhitespace = this.input_.match(/^\s+/)?.[0];
    if (leadingWhitespace !== undefined) {
      this.input_ = this.input_.slice(leadingWhitespace.length);
      this.pastInput_ += leadingWhitespace;
      this.yytext = leadingWhitespace;
      this.advanceCursorAndUpdateYyloc();
      return this.lex();
    }

    const ruleToUse = this.rules.find(([regex]) => regex.test(this.input_));

    if (ruleToUse === undefined) {
      this.yytext = this.input_;
      this.advanceCursorAndUpdateYyloc();
      return INVALID;
    }

    const [regex, getTokenType] = ruleToUse;
    this.yytext = this.input_.match(regex)![0];
    this.input_ = this.input_.slice(this.yytext.length);

    const tokenType = getTokenType(this);

    this.pastInput_ += this.yytext;
    this.advanceCursorAndUpdateYyloc();
    return tokenType;
  }

  private advanceCursorAndUpdateYyloc() {
    const startLocation = this.location;
    const endLocation = getEndLocation(this.yytext, startLocation);
    this.yylloc = mergePointLocations(startLocation, endLocation);
    this.location = endLocation;
  }

  public pastInput() {
    return this.pastInput_;
  }

  public upcomingInput() {
    return this.yytext + this.input_;
  }

  public input() {
    const c = this.input_.charAt(0);
    this.yytext += c;
    this.pastInput_ += c;
    this.input_ = this.input_.slice(1);
  }

  public get yylineno(): number {
    return this.location.line;
  }

  public get yyleng(): number {
    return this.yytext.length;
  }
}

const TOKEN_TYPES: TokenType[] = [
  "pub",
  "prot",
  "priv",
  "static",
  "inline",
  "open",
  "abstract",
  "final",
  "magic",
  "class",
  "extends",
  "interface",
  "enum",
  "implements",
  "inst",
  "new",
  "if",
  "else",
  "switch",
  "case",
  "match",
  "default",
  "while",
  "loop",
  "repeat",
  "for",
  "in",
  "do",
  "continue",
  "break",
  "return_",
  "let!",
  "let",
  "re!",
  "re",
  "var",
  "const",
  "try",
  "catch",
  "finally",
  "throw",
  "throws",
  "use",
  "import",
  "copy",
  "as!",
  "as",
  "package",
  "mod",
  "instanceof",
  "_",
  "assert",
  "goto",
  "native",
  "private",
  "protected",
  "public",
  "strictfp",
  "synchronized",
  "transient",
  "volatile",
  "module",
  "requires",
  "exports",
  "NUMBER",
  "STRING",
  "CHARACTER",
  "IDENTIFIER",
  "OBJECT_LITERAL_TYPE",
  "CAST_EXPRESSION_TARGET_TYPE",
  "**",
  "*",
  "/",
  "%",
  "-",
  "+",
  "~",
  "==",
  "!=",
  "~=",
  "<",
  "FUNCTION_CALL_TYPE_ARG_LEFT_ANGLE_BRACKET",
  "<=",
  ">",
  ">=",
  "!",
  "&&",
  "||",
  "?",
  "..=",
  "..",
  ".",
  "[",
  "]",
  "=",
  "**=",
  "*=",
  "/=",
  "%=",
  "+=",
  "-=",
  "(",
  ")",
  "{",
  "}",
  ":",
  ",",
  ";",
  EOF,
  INVALID,
];

type TokenType =
  | "pub"
  | "prot"
  | "priv"
  | "static"
  | "inline"
  | "open"
  | "abstract"
  | "final"
  | "magic"
  | "class"
  | "extends"
  | "interface"
  | "enum"
  | "implements"
  | "inst"
  | "new"
  | "if"
  | "else"
  | "switch"
  | "case"
  | "match"
  | "default"
  | "while"
  | "loop"
  | "repeat"
  | "for"
  | "in"
  | "do"
  | "continue"
  | "break"
  | "return_"
  | "let!"
  | "let"
  | "re!"
  | "re"
  | "var"
  | "const"
  | "try"
  | "catch"
  | "finally"
  | "throw"
  | "throws"
  | "use"
  | "import"
  | "copy"
  | "as!"
  | "as"
  | "package"
  | "mod"
  | "instanceof"
  | "_"
  | "assert"
  | "goto"
  | "native"
  | "private"
  | "protected"
  | "public"
  | "strictfp"
  | "synchronized"
  | "transient"
  | "volatile"
  | "module"
  | "requires"
  | "exports"
  | "NUMBER"
  | "STRING"
  | "CHARACTER"
  | "IDENTIFIER"
  | "OBJECT_LITERAL_TYPE"
  | "CAST_EXPRESSION_TARGET_TYPE"
  | "**"
  | "*"
  | "/"
  | "%"
  | "-"
  | "+"
  | "~"
  | "=="
  | "!="
  | "~="
  | "<"
  | "FUNCTION_CALL_TYPE_ARG_LEFT_ANGLE_BRACKET"
  | "<="
  | ">"
  | ">="
  | "!"
  | "&&"
  | "||"
  | "?"
  | "..="
  | ".."
  | "."
  | "["
  | "]"
  | "="
  | "**="
  | "*="
  | "/="
  | "%="
  | "+="
  | "-="
  | "("
  | ")"
  | "{"
  | "}"
  | ":"
  | ","
  | ";"
  | typeof EOF
  | typeof INVALID;

type TokenizationRule = [RegExp, (scanner: Scanner) => TokenType];

type ShorthandTokenizationRule =
  | TokenType
  | [string, TokenType]
  | [RegExp, (scanner: Scanner) => TokenType];

const SAND_TOKENIZATION_RULES: ShorthandTokenizationRule[] = [
  "pub",
  "prot",
  "priv",
  "static",
  "inline",
  "open",
  "abstract",
  "final",
  "class",
  "extends",
  "interface",
  "enum",
  "implements",
  "inst",
  "new",
  "if",
  "else",
  "switch",
  "case",
  "match",
  "default",
  "while",
  "loop",
  "repeat",
  "for",
  "in",
  "do",
  "continue",
  "break",
  ["return", "return_"],
  "let!",
  "let",
  "re!",
  "re",
  "var",
  "const",
  "try",
  "catch",
  "finally",
  "throw",
  "throws",
  "use",
  "import",
  "copy",
  "as!",
  "as",
  "package",
  "mod",
  "instanceof",
  "_",
  "assert",
  "goto",
  "native",
  "private",
  "protected",
  "public",
  "strictfp",
  "synchronized",
  "transient",
  "volatile",
  "module",
  "requires",
  "exports",
  [
    /-?\d+(\.\d+)?(e-?[1-9]\d*)?(int|long|short|char|byte|float|double)?\b/,
    () => "NUMBER",
  ],
  [/"(\\(u[0-9a-fA-F]{4}|[\\"nt])|[^\\"\n])*\"/, () => "STRING"],
  [/'([^\\'\n]|\\[\\'nt])\'/, () => "CHARACTER"],
  [
    /[_a-zA-Z]\w*/,
    (scanner: Scanner) => {
      const upcoming = scanner.upcomingInput();
      const past = scanner.pastInput();
      const objLitType = getUpcomingObjectLiteralType(upcoming, past);
      console.log("upcoming", upcoming, "objlit", objLitType);
      if (objLitType !== null) {
        let i = Math.max(0, objLitType.length - scanner.yytext.length);
        while (i--) {
          scanner.input();
        }
        return "OBJECT_LITERAL_TYPE";
      } else {
        var castType = getUpcomingCastType(upcoming, past);
        if (castType !== null) {
          let i = Math.max(0, castType.length - scanner.yytext.length);
          while (i--) {
            scanner.input();
          }
          return "CAST_EXPRESSION_TARGET_TYPE";
        } else {
          return "IDENTIFIER";
        }
      }
    },
  ],
  "**",
  "*",
  "/",
  "%",
  "-",
  "+",
  "~",
  "==",
  "!=",
  "~=",
  [
    /</,
    (scanner: Scanner): TokenType => {
      const upcoming = scanner.upcomingInput();
      if (isThereUpcomingTypeArgListAndLeftParen(upcoming)) {
        return "FUNCTION_CALL_TYPE_ARG_LEFT_ANGLE_BRACKET";
      } else {
        return "<";
      }
    },
  ],
  "<=",
  ">",
  ">=",
  "!",
  "&&",
  "||",
  "?",
  "..=",
  "..",
  ".",
  "[",
  "]",
  "=",
  "**=",
  "*=",
  "/=",
  "%=",
  "+=",
  "-=",
  "(",
  ")",
  "{",
  "}",
  ":",
  ",",
  ";",
];

interface PointLocation {
  line: number;
  column: number;
}

function getRules(): TokenizationRule[] {
  return compileShorthand(SAND_TOKENIZATION_RULES);
}

function compileShorthand(
  rules: ShorthandTokenizationRule[],
): TokenizationRule[] {
  return rules.map(rule => {
    if (isTokenType(rule)) {
      const regex = /^\w+$/.test(rule)
        ? new RegExp("^" + rule + "\\b")
        : new RegExp("^" + escapeRegexCharacters(rule));
      const getTokenType = () => rule;
      return [regex, getTokenType];
    } else if ("string" === typeof rule[0]) {
      const tokenType = rule[1] as TokenType;
      const regex = new RegExp("^" + rule[0] + "\\b");
      const getTokenType = () => tokenType;
      return [regex, getTokenType];
    } else {
      const [regex, getTokenType] = rule as TokenizationRule;
      const anchored = regex.source.startsWith("^")
        ? regex
        : new RegExp("^" + regex.source);
      return [anchored, getTokenType];
    }
  });
}

function isTokenType(x: unknown): x is TokenType {
  return "string" === typeof x && (TOKEN_TYPES as string[]).includes(x);
}

function escapeRegexCharacters(unescaped: string): string {
  return unescaped.replace(/[.*+?^${}()|[\]\\\/,]/g, "\\$&");
}

function getEndLocation(str: string, start: PointLocation): PointLocation {
  const lines = str.split("\n");
  if (lines.length === 1) {
    return {
      line: start.line,
      column: start.column + lines[0].length,
    };
  } else {
    const lastLine = lines[lines.length - 1];
    return {
      line: start.line + lines.length - 1,
      column: lastLine.length,
    };
  }
}

function mergePointLocations(
  start: PointLocation,
  end: PointLocation,
): JisonNodeLocation {
  return {
    first_line: start.line,
    first_column: start.column,
    last_line: end.line,
    last_column: end.column,
  };
}
