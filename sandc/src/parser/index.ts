import { option, Result, result } from "rusty-ts";
import { JisonUnexpectedTokenError } from "../jison";
import { convertToTextRange } from "../textRange";
import * as ast from "../types/ast";
import { ParseError, ParseErrorType, SandParser } from "../types/parser";
import { TokenType } from "../types/tokens";
import addApi from "./addApi";
import {
  parser as generatedParser,
  SandParserGeneratedByJison,
} from "./parser.generated";

addApi(generatedParser);

const wrappedParser = wrapGeneratedParser(generatedParser);

export default wrappedParser;

function wrapGeneratedParser(
  generated: SandParserGeneratedByJison,
): SandParser {
  return {
    parse(input: string): Result<ast.FileNode, ParseError> {
      try {
        return result.ok(generated.parse(input));
      } catch (e) {
        if (!("object" === typeof e && e !== null)) {
          throw new Error("Unhandled error: " + e);
        }

        if ("object" === typeof e.hash) {
          const {
            hash: { token, text, loc, expected },
          }: JisonUnexpectedTokenError<TokenType> = e;
          return result.err({
            errorType: ParseErrorType.UnexpectedToken,
            token,
            text: text === undefined ? option.none() : option.some(text),
            location: convertToTextRange(loc),
            expected,
          });
        }

        throw new Error("Unhandled error: " + e);
      }
    },
  };
}
