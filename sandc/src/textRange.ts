import { JisonSymbolLocation } from "./jison";
import { TextRange } from "./types";

export function convertToTextRangeIfNeeded(
  location: JisonSymbolLocation | TextRange,
): TextRange {
  if ("first_line" in location) {
    return convertToTextRange(location);
  } else {
    return location;
  }
}

export function convertToTextRange(location: JisonSymbolLocation): TextRange {
  return {
    start: {
      line: location.first_line,
      column: location.first_column,
    },
    end: {
      line: location.last_line,
      column: location.last_column,
    },
  };
}

export function mergeRanges(
  start: JisonSymbolLocation | TextRange,
  end: JisonSymbolLocation | TextRange,
): TextRange {
  return {
    start: convertToTextRangeIfNeeded(start).start,
    end: convertToTextRangeIfNeeded(end).end,
  };
}
