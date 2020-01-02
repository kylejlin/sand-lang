enum TokenType {
  LeftAngle,
  RightAngle,
  OneOrMoreDotSeparatedIdentifiers,
  Comma,
  LeftSquare,
  Star,
  RightSquare,
}

export default function getUpcomingCastType(
  upcoming: string,
  past: string,
): string | null {
  if (!/as!\s*$/.test(past)) {
    return null;
  }

  if (/^\s*$/.test(upcoming)) {
    return null;
  }

  const dotSepWithLeftAngle = upcoming.match(
    /^\s*[a-zA-Z_]\w*(?:\s*\.\s*[a-zA-Z_]\w*)*\s*</,
  );
  if (dotSepWithLeftAngle !== null) {
    return getUpcomingCastTypeThatStartsWithLeftAngle(
      upcoming,
      dotSepWithLeftAngle[0].length,
    );
  }

  const withoutLeftAngle = upcoming.match(
    /^\s*[a-zA-Z_]\w*(?:\s*\.\s*[a-zA-Z_]\w*)*\s*((\[\s*\*?\s*\]|\?)\s*)*/,
  );
  if (withoutLeftAngle === null) {
    return null;
  } else {
    return withoutLeftAngle[0];
  }
}

function getUpcomingCastTypeThatStartsWithLeftAngle(
  upcoming: string,
  startIndex: number,
): string | null {
  let prevMatch = TokenType.LeftAngle;
  let numberOfEnclosingAngleBrackets = 1;

  let i = startIndex;
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
        prevMatch === TokenType.RightAngle ||
        prevMatch === TokenType.RightSquare
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
        prevMatch === TokenType.RightAngle ||
        prevMatch === TokenType.RightSquare
      ) {
        i += rightAngle[0].length;
        prevMatch = TokenType.RightAngle;
        numberOfEnclosingAngleBrackets--;

        if (numberOfEnclosingAngleBrackets === 0) {
          return upcoming.slice(0, i);
        } else {
          continue;
        }
      } else {
        return null;
      }
    }

    const leftSquare = next.match(/^\s*\[\s*/);
    if (leftSquare !== null) {
      if (
        prevMatch === TokenType.OneOrMoreDotSeparatedIdentifiers ||
        prevMatch === TokenType.RightAngle ||
        prevMatch === TokenType.RightSquare
      ) {
        i += leftSquare[0].length;
        prevMatch = TokenType.LeftSquare;
        continue;
      } else {
        return null;
      }
    }

    const star = next.match(/^\s*\*\s*/);
    if (star !== null) {
      if (prevMatch === TokenType.LeftSquare) {
        i += star[0].length;
        prevMatch = TokenType.Star;
        continue;
      } else {
        return null;
      }
    }

    const rightSquare = next.match(/^\s*\]\s*/);
    if (rightSquare !== null) {
      if (prevMatch === TokenType.LeftSquare || prevMatch === TokenType.Star) {
        i += rightSquare[0].length;
        prevMatch = TokenType.RightSquare;
        continue;
      } else {
        return null;
      }
    }

    return null;
  }

  throw new Error("Unreachable");
}
