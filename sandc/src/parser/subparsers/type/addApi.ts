import { NodeType } from "../../../ast";
import { convertToRange } from "../../../textPosition";
import { TypeParser } from "./parser.generated";

export default function addApi(parser: TypeParser) {
  const { yy } = parser;

  yy.NodeType = NodeType;

  yy.convertToRange = convertToRange;
}
