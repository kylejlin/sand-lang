import typeParser from "../../subparsers/type/prebuilt";

export default function isThereUpcomingTypeArgListAndLeftParen(
  upcoming: string,
): boolean {
  const indexOfFirstLeftParen = upcoming.indexOf("(");

  if (indexOfFirstLeftParen === -1) {
    return false;
  }

  const untilParen = upcoming.slice(0, indexOfFirstLeftParen);
  try {
    typeParser.parse(untilParen.trim());
    return true;
  } catch {
    return false;
  }
}
