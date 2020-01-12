import { JisonNodeLocation } from "./jison";

export interface TextPosition {
  line: number;
  column: number;
}

export interface TextRange {
  start: TextPosition;
  end: TextPosition;
}

export function merge(
  left: TextRange | JisonNodeLocation,
  right: TextRange | JisonNodeLocation,
): TextRange {
  const convertedLeft = convertIfNeeded(left);
  const convertedRight = convertIfNeeded(right);

  return {
    start: convertedLeft.start,
    end: convertedRight.end,
  };
}

function convertIfNeeded(location: TextRange | JisonNodeLocation): TextRange {
  return "first_line" in location ? convertToRange(location) : location;
}

export function convertToRange(location: JisonNodeLocation): TextRange {
  return {
    start: { line: location.first_line, column: location.first_column },
    end: { line: location.last_line, column: location.last_column },
  };
}
