import { Scanner, JisonNodeLocation } from "../../../jison";
import isThereUpcomingTypeArgListAndFunctionCallLeftParen from "./isThereUpcomingTypeArgListAndFunctionCallLeftParen";
import getUpcomingCastType from "./getUpcomingCastType";
import getUpcomingObjectLiteralType from "./getUpcomingObjectLiteralType";

const EOF = "EOF";
const INVALID = "INVALID";

const MAX_DEBUG_LENGTH = 20;
const ELLIPSIS = "...";

export default class SandScanner implements Scanner<TokenType> {
  public yytext: string;
  public yylloc: JisonNodeLocation;

  private rules: TokenizationRule[];
  private input_: string;
  private pastInput_: string;
  private location: PointLocation;

  private braceRelativeLocationStack: BraceRelativeLocation[];

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

    this.braceRelativeLocationStack = [];
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

  public lex(): TokenType {
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

  public showPosition(): string {
    const past = this.getPastInputForDebug();
    const underline = "-".repeat(past.length);
    const upcoming = this.getUpcomingInputForDebug();
    return past + upcoming + "\n" + underline + "^";
  }

  private getPastInputForDebug(): string {
    const withoutCurrentMatch = this.pastInput_.slice(0, -this.yytext.length);
    const withCollapsedWhitespace = withoutCurrentMatch.replace(/\s+/g, " ");
    if (withCollapsedWhitespace.length <= MAX_DEBUG_LENGTH) {
      return withCollapsedWhitespace;
    } else {
      return (
        ELLIPSIS +
        withCollapsedWhitespace.slice(-MAX_DEBUG_LENGTH + ELLIPSIS.length)
      );
    }
  }

  private getUpcomingInputForDebug(): string {
    const withCollapsedWhitespace = this.upcomingInput().replace(/\s+/g, " ");
    if (withCollapsedWhitespace.length <= MAX_DEBUG_LENGTH) {
      return withCollapsedWhitespace;
    } else {
      return (
        withCollapsedWhitespace.slice(0, MAX_DEBUG_LENGTH - ELLIPSIS.length) +
        ELLIPSIS
      );
    }
  }

  onLeftCurlyEncountered(): void {
    if (this.braceRelativeLocationStack.length === 0) {
      return;
    }

    const top = this.braceRelativeLocationStack[
      this.braceRelativeLocationStack.length - 1
    ];

    if (top === BraceRelativeLocation.BetweenFirstTokenAndStartOfCompoundNode) {
      this.braceRelativeLocationStack.pop();
      this.braceRelativeLocationStack.push(
        BraceRelativeLocation.InCompoundNode,
      );
    } else if (
      top === BraceRelativeLocation.BetweenObjectLiteralTypeAndStartOfBody
    ) {
      this.braceRelativeLocationStack.pop();
      this.braceRelativeLocationStack.push(
        BraceRelativeLocation.InObjectLiteralBody,
      );
    } else {
      throw new Error(
        "Attempted to record the start of an object body or compound node when stack was either empty or the top of the stack was `InCompoundNode` or `InObjectLiteralBody`.",
      );
    }
  }

  onRightCurlyEncountered(): void {
    if (this.braceRelativeLocationStack.length === 0) {
      return;
    }

    const top = this.braceRelativeLocationStack[
      this.braceRelativeLocationStack.length - 1
    ];

    if (
      top === BraceRelativeLocation.InCompoundNode ||
      top === BraceRelativeLocation.InObjectLiteralBody
    ) {
      this.braceRelativeLocationStack.pop();
    } else {
      throw new Error(
        "Encountered a right curly brace when the top of the braceRelativeLocationStack was " +
          BraceRelativeLocation[top],
      );
    }
  }

  onStatementWithCompoundNodeStart(): void {
    this.braceRelativeLocationStack.push(
      BraceRelativeLocation.BetweenFirstTokenAndStartOfCompoundNode,
    );
  }

  onObjectLiteralStart(): void {
    this.braceRelativeLocationStack.push(
      BraceRelativeLocation.BetweenObjectLiteralTypeAndStartOfBody,
    );
  }

  isExpectingCompoundNode(): boolean {
    const last = this.braceRelativeLocationStack[
      this.braceRelativeLocationStack.length - 1
    ];
    return (
      last === BraceRelativeLocation.BetweenFirstTokenAndStartOfCompoundNode
    );
  }
}

enum BraceRelativeLocation {
  BetweenFirstTokenAndStartOfCompoundNode = "BetweenFirstTokenAndStartOfCompoundNode",
  InCompoundNode = "InCompoundNode",
  BetweenObjectLiteralTypeAndStartOfBody = "BetweenObjectLiteralTypeAndStartOfBody",
  InObjectLiteralBody = "InObjectLiteralBody",
}

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

type TokenizationRule = [RegExp, (scanner: SandScanner) => TokenType];

type ShorthandTokenizationRule =
  | TokenType
  | [string, TokenType]
  | [RegExp, (scanner: SandScanner) => TokenType];

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
  startOfStatementWithCompoundNode("if"),
  startOfStatementWithCompoundNode("else"),
  startOfStatementWithCompoundNode("switch"),
  startOfStatementWithCompoundNode("case"),
  "match",
  "default",
  startOfStatementWithCompoundNode("while"),
  startOfStatementWithCompoundNode("loop"),
  startOfStatementWithCompoundNode("repeat"),
  startOfStatementWithCompoundNode("for"),
  "in",
  startOfStatementWithCompoundNode("do"),
  "continue",
  "break",
  ["return", "return_"],
  "let!",
  "let",
  "re!",
  "re",
  "var",
  "const",
  startOfStatementWithCompoundNode("try"),
  startOfStatementWithCompoundNode("catch"),
  startOfStatementWithCompoundNode("finally"),
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
    (scanner: SandScanner) => {
      const upcoming = scanner.upcomingInput();
      const past = scanner.pastInput();
      const objLitType = getUpcomingObjectLiteralType(upcoming, past, scanner);
      if (objLitType !== null) {
        let i = Math.max(0, objLitType.length - scanner.yytext.length);
        while (i--) {
          scanner.input();
        }
        scanner.onObjectLiteralStart();
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
    (scanner: SandScanner): TokenType => {
      const upcoming = scanner.upcomingInput();
      if (isThereUpcomingTypeArgListAndFunctionCallLeftParen(upcoming)) {
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
  [
    /\{/,
    (scanner: SandScanner) => {
      scanner.onLeftCurlyEncountered();
      return "{";
    },
  ],
  [
    /\}/,
    (scanner: SandScanner) => {
      scanner.onRightCurlyEncountered();
      return "}";
    },
  ],
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

function startOfStatementWithCompoundNode(token: TokenType): TokenizationRule {
  if (!/^\w+$/.test(token)) {
    throw new Error("Illegally formatted token.");
  }

  const regex = new RegExp("^" + token + "\\b");

  return [
    regex,
    (scanner: SandScanner) => {
      scanner.onStatementWithCompoundNodeStart();
      return token;
    },
  ];
}
