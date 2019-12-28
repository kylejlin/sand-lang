import typeParser from "../../subparsers/type/prebuilt";

export default function isThereUpcomingTypeArgListAndLeftParen(
  upcoming: string,
): boolean {
  if (!/^\s*</.test(upcoming)) {
    throw new SyntaxError(
      "There cannot be an upcoming type argument list if the string does not begin with a left angle. This indicates you called this function erroneously.",
    );
  }

  const indexOfFirstLeftParen = upcoming.indexOf("(");

  if (indexOfFirstLeftParen === -1) {
    return false;
  }

  const untilParen = upcoming.slice(0, indexOfFirstLeftParen);
  const typeArgs = untilParen.trim();
  return areTypeArgsWellFormed(typeArgs);
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
