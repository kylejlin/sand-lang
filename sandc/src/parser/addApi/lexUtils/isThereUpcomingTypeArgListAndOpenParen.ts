enum TokenType {
  LeftAngle,
  RightAngle,
  OneOrMoreDotSeparatedIdentifiers,
  Comma,
}

export default function isThereUpcomingTypeArgListAndOpenParen(
  upcoming: string,
): boolean {
  const trimmed = upcoming.trim();
  if (trimmed.charAt(0) !== "<") {
    throw new Error(
      'A string not starting with "<" is obviously not a type arg list. This indicates you called this function erroneously.',
    );
  }
  const withoutLeftAngle = trimmed.slice(1);

  if (withoutLeftAngle === "") {
    return false;
  }

  let prevMatch = TokenType.LeftAngle;
  let numberOfEnclosingAngleBrackets = 1;

  let i = 0;
  while (i < withoutLeftAngle.length) {
    const next = withoutLeftAngle.slice(i);

    const dotSepIdents = next.match(
      /^\s*[a-zA-Z_]\w*(?:\s*\.\s*[a-zA-Z_]\w*)*\s*/,
    );
    if (dotSepIdents !== null) {
      if (prevMatch === TokenType.LeftAngle || TokenType.Comma) {
        i += dotSepIdents[0].length;
        prevMatch = TokenType.OneOrMoreDotSeparatedIdentifiers;
        continue;
      } else {
        return false;
      }
    }

    const comma = next.match(/^\s*,\s*/);
    if (comma !== null) {
      if (
        prevMatch === TokenType.OneOrMoreDotSeparatedIdentifiers ||
        prevMatch === TokenType.RightAngle
      ) {
        i += comma[0].length;
        prevMatch = TokenType.Comma;
        continue;
      } else {
        return false;
      }
    }

    const leftAngle = next.match(/^\s*<\s*/);
    if (leftAngle !== null) {
      if (prevMatch === TokenType.OneOrMoreDotSeparatedIdentifiers) {
        i += leftAngle[0].length;
        prevMatch = TokenType.LeftAngle;
        numberOfEnclosingAngleBrackets++;
        continue;
      } else {
        return false;
      }
    }

    const rightAngle = next.match(/^\s*>\s*/);
    if (rightAngle !== null) {
      if (prevMatch === TokenType.OneOrMoreDotSeparatedIdentifiers) {
        i += rightAngle[0].length;
        prevMatch = TokenType.RightAngle;
        numberOfEnclosingAngleBrackets--;

        if (numberOfEnclosingAngleBrackets === 0) {
          return withoutLeftAngle.charAt(i) === "(";
        } else {
          continue;
        }
      } else {
        return false;
      }
    }

    return false;
  }

  throw new Error("Unreachable");
}
