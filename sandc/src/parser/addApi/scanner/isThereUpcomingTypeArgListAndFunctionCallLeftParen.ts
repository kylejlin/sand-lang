import typeParser from "../../subparsers/type/prebuilt";

export default function isThereUpcomingTypeArgListAndFunctionCallLeftParen(
  upcoming: string,
  past: string,
): boolean {
  if (!/^\s*</.test(upcoming)) {
    throw new SyntaxError(
      "There cannot be an upcoming type argument list if the string does not begin with a left angle. This indicates you called this function erroneously.",
    );
  }

  if (/copy\s+([a-zA-Z_]\w*(\s*\.\s*[a-zA-Z_]\w*)*)\s*$/.test(past)) {
    return false;
  }

  const indexOfFirstLeftParen = upcoming.indexOf("(");

  if (indexOfFirstLeftParen === -1) {
    return false;
  }

  const untilParen = upcoming.slice(0, indexOfFirstLeftParen);
  const typeArgs = untilParen.trim();
  const srcStartingWithParen = upcoming.slice(indexOfFirstLeftParen);

  return (
    areTypeArgsWellFormed(typeArgs) &&
    !doesUpcomingLeftParenBeginArgDefs(srcStartingWithParen)
  );
}

function areTypeArgsWellFormed(typeArgs: string): boolean {
  try {
    const stringThatWillBeWellFormedTypeIfTypeArgsAreWellformed =
      "dummyCallee" + typeArgs;
    typeParser.parse(stringThatWillBeWellFormedTypeIfTypeArgsAreWellformed);
    return true;
  } catch {
    return false;
  }
}

function doesUpcomingLeftParenBeginArgDefs(upcoming: string): boolean {
  return (
    /^\s*\(\s*[a-zA-Z_]\w*\s*:/.test(upcoming) ||
    /^\s*\(\s*\)\s*[:{]/.test(upcoming)
  );
}
