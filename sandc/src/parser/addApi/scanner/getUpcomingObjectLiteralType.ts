import SandScanner, { TokenType } from ".";
import typeParser from "../../subparsers/type/prebuilt";

export default function getUpcomingObjectLiteralType(
  upcoming: string,
  past: string,
  scanner: SandScanner,
): string | null {
  if (
    /class\s*$/.test(past) ||
    /\)\s*:\s*$/.test(past) ||
    /\.\s*$/.test(past)
  ) {
    return null;
  }

  const indexOfFirstLeftCurly = upcoming.indexOf("{");

  if (indexOfFirstLeftCurly === -1) {
    return null;
  }

  const untilCurly = upcoming.slice(0, indexOfFirstLeftCurly);
  try {
    typeParser.parse(untilCurly.trim());

    const srcBeginningWithBody = upcoming.slice(indexOfFirstLeftCurly);
    if (isUpcomingBodyAnObjectLiteralBody(srcBeginningWithBody, scanner)) {
      return untilCurly;
    } else {
      return null;
    }
  } catch {
    return null;
  }
}

function isUpcomingBodyAnObjectLiteralBody(
  upcoming: string,
  scanner: SandScanner,
): boolean {
  const body = getUpcomingBody(upcoming);

  if (body.isInvalidObjectLiteralBody) {
    return false;
  }

  if (body.isInvalidCompoundNode) {
    return true;
  }

  const srcBeginningWithTheTokenAfterBody = upcoming.slice(body.src.length);
  console.log("afterbody", srcBeginningWithTheTokenAfterBody);
  return doesUpcomingTokenIndicateBodyToTheRightOfItIsObjectLiteralBody(
    srcBeginningWithTheTokenAfterBody,
    scanner,
  );
}

type UpcomingBody =
  | NotObjectLiteral
  | NotCompoundNode
  | BodyThatCouldBeEitherObjectLiteralBodyOrCompoundNode;

interface NotObjectLiteral {
  isInvalidObjectLiteralBody: true;
}

interface NotCompoundNode {
  isInvalidObjectLiteralBody: false;
  isInvalidCompoundNode: true;
}

interface BodyThatCouldBeEitherObjectLiteralBodyOrCompoundNode {
  src: string;
  isInvalidObjectLiteralBody: false;
  isInvalidCompoundNode: false;
}

function getUpcomingBody(upcoming: string): UpcomingBody {
  const bodyThatIsBothWellFormedObjectLiteralBodyAndCompoundNode = upcoming.match(
    /^\s*\{\s*([a-zA-Z_]\w*)?\s*\}/,
  );

  if (bodyThatIsBothWellFormedObjectLiteralBodyAndCompoundNode !== null) {
    return {
      src: bodyThatIsBothWellFormedObjectLiteralBodyAndCompoundNode[0],
      isInvalidObjectLiteralBody: false,
      isInvalidCompoundNode: false,
    };
  }

  if (
    /^\s*\{\s*[a-zA-Z_]\w*\s*[:,]/.test(upcoming) ||
    /^\s*\{\s*\.\.\./.test(upcoming)
  ) {
    return { isInvalidCompoundNode: true, isInvalidObjectLiteralBody: false };
  }

  return { isInvalidObjectLiteralBody: true };
}

const TOKENS_INDICATING_BODY_IS_COMPOUND_NODE: TokenType[] = [
  "if",
  "else",
  "switch",
  "case",
  "match",
  "default",
  "throw",
  "while",
  "loop",
  "repeat",
  "for",
  "do",
  "continue",
  "break",
  "return_",
  "let!",
  "let",
  "re!",
  "re",
  "try",
  "catch",
  "finally",
  "!",
  "~",
  "NUMBER",
  "STRING",
  "CHARACTER",
  "IDENTIFIER",
  "OBJECT_LITERAL_TYPE",
];
const TOKENS_INDICATING_BODY_IS_OBJECT_LITERAL_BODY: TokenType[] = [
  "as!",
  "instanceof",
  "**",
  "*",
  "/",
  "%",
  "+",
  "==",
  "!=",
  "~=",
  "<",
  "<=",
  ">",
  ">=",
  "&&",
  "||",
  "..=",
  "..",
  ".",
  "[",
  "]",
  "(",
  ")",
  "{",
  ",",
  ";",
];

function doesUpcomingTokenIndicateBodyToTheRightOfItIsObjectLiteralBody(
  upcoming: string,
  scanner: SandScanner,
): boolean {
  const nextTokenType = getNextTokenType(upcoming);

  if (TOKENS_INDICATING_BODY_IS_COMPOUND_NODE.includes(nextTokenType)) {
    return false;
  }

  if (nextTokenType === "-") {
    throw new SyntaxError(
      "Sorry, the parser is not sophisticated enough to determine whether there is an object literal on line " +
        scanner.yylineno +
        ":\n\n" +
        scanner.showPosition() +
        "\n\nPlease parenthesize expressions until your code compiles.",
    );
  }

  if (TOKENS_INDICATING_BODY_IS_OBJECT_LITERAL_BODY.includes(nextTokenType)) {
    return true;
  }

  if (nextTokenType === "}") {
    return !scanner.isExpectingCompoundNode();
  }

  throwUnexpectedTokenError(upcoming, scanner);
}

function getNextTokenType(input: string): TokenType {
  const scanner = new SandScanner();
  scanner.setInput(input);
  return scanner.lex();
}

function throwUnexpectedTokenError(
  upcoming: string,
  completeInputScanner: SandScanner,
): never {
  const scanner = new SandScanner();
  scanner.setInput(upcoming);
  const token = scanner.lex();

  if (token === "EOF") {
    throw new SyntaxError(
      "Unexpected end of input on line " + completeInputScanner.yylineno,
    );
  }

  throw new SyntaxError(
    "Unexpected " +
      token +
      " on line " +
      completeInputScanner.yylineno +
      ":\n\n" +
      completeInputScanner.showPosition(),
  );
}
