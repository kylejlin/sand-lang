enum TokenType {
  LeftAngle,
  RightAngle,
  OneOrMoreDotSeparatedIdentifiers,
  Comma,
}

export default function getUpcomingObjectLiteralType(
  upcoming: string,
  past: string,
): string | null {
  if (/class\s*$/.test(past)) {
    return null;
  }

  if (upcoming === "") {
    return null;
  }

  const dotSepWithLeftCurly = upcoming.match(
    /^\s*[a-zA-Z_]\w*(?:\s*\.\s*[a-zA-Z_]\w*)*\s*{/,
  );
  if (dotSepWithLeftCurly !== null) {
    return dotSepWithLeftCurly[0].slice(-1);
  }

  const dotSepWithLeftAngle = upcoming.match(
    /^\s*[a-zA-Z_]\w*(?:\s*\.\s*[a-zA-Z_]\w*)*\s*</,
  );
  if (dotSepWithLeftAngle === null) {
    return null;
  }

  let prevMatch = TokenType.LeftAngle;
  let numberOfEnclosingAngleBrackets = 1;

  let i = dotSepWithLeftAngle[0].length;
  while (i < upcoming.length) {
    const next = upcoming.slice(i);

    const dotSepIdents = next.match(
      /^\s*[a-zA-Z_]\w*(?:\s*\.\s*[a-zA-Z_]\w*)*\s*/,
    );
    if (dotSepIdents !== null) {
      if (prevMatch === TokenType.LeftAngle || prevMatch === TokenType.Comma) {
        i += dotSepIdents[0].length;
        prevMatch = TokenType.OneOrMoreDotSeparatedIdentifiers;
        continue;
      } else {
        return null;
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
        return null;
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
        return null;
      }
    }

    const rightAngle = next.match(/^\s*>\s*/);
    if (rightAngle !== null) {
      if (
        prevMatch === TokenType.OneOrMoreDotSeparatedIdentifiers ||
        prevMatch === TokenType.RightAngle
      ) {
        i += rightAngle[0].length;
        prevMatch = TokenType.RightAngle;
        numberOfEnclosingAngleBrackets--;

        if (numberOfEnclosingAngleBrackets === 0) {
          if (upcoming.charAt(i) === "{") {
            return upcoming.slice(0, i);
          } else {
            return null;
          }
        } else {
          continue;
        }
      } else {
        return null;
      }
    }

    return null;
  }

  throw new Error("Unreachable");
}
