import { camelCase, NodeType } from "../../../ast";
import { TypeParser } from "./parser.generated";

export default function addApi(parser: TypeParser) {
  const { yy } = parser;

  yy.NodeType = NodeType;

  yy.camelCase = camelCase;
}
