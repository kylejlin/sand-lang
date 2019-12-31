import typeParser from "../../subparsers/type/prebuilt";
import SandScanner from ".";

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

function doesUpcomingTokenIndicateBodyToTheRightOfItIsObjectLiteralBody(
  upcoming: string,
  scanner: SandScanner,
): boolean {
  if (
    /^\s*(if|else|switch|case|match|default|throw|while|loop|repeat|for|do|continue|break|return|let!?|re!?|try|catch|finally)/.test(
      upcoming,
    ) ||
    /^\s*((-?\d+(\.\d+)?(e-?[1-9]\d*)?(int|long|short|char|byte|float|double)?\b)|("(\\(u[0-9a-fA-F]{4}|[\\"nt])|[^\\"\n])*\")|('([^\\'\n]|\\[\\'nt])\')|([_a-zA-Z]\w*))/.test(
      upcoming,
    ) ||
    /^\s*[!~]/.test(upcoming)
  ) {
    return false;
  }

  if (/^\s*-/.test(upcoming)) {
    throw new SyntaxError(
      "Sorry, the parser is not sophisticated enough to determine whether there is an object literal on line " +
        scanner.yylineno +
        ":\n\n" +
        scanner.showPosition() +
        "\n\nPlease parenthesize expressions until your code compiles.",
    );
  }

  if (
    /^\s*(as!|instanceof|\*\*|\*|\/|%|\+|==|!=|~=|<|<=|>|>=|&&|\|\||\.\.=|\.\.|\.)/.test(
      upcoming,
    ) ||
    /^\s*[[\](){,;]/.test(upcoming)
  ) {
    return true;
  }

  if (/^\s*\}/.test(upcoming)) {
    return !scanner.isExpectingCompoundNode();
  }

  throwUnexpectedTokenError(upcoming, scanner);
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
