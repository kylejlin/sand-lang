import typeParser from "../../subparsers/type/prebuilt";

export default function getUpcomingObjectLiteralType(
  upcoming: string,
  past: string,
): string | null {
  if (/class\s*$/.test(past)) {
    return null;
  }

  const indexOfFirstLeftCurly = upcoming.indexOf("{");

  if (indexOfFirstLeftCurly === -1) {
    return null;
  }

  const untilCurly = upcoming.slice(0, indexOfFirstLeftCurly);
  try {
    typeParser.parse(untilCurly.trim());
    return untilCurly;
  } catch {
    return null;
  }
}
