import {
  BinaryExpr,
  BinaryOperation,
  camelCase,
  ConstraintType,
  IfAlternativeType,
  NodeType,
  UnaryExpr,
  UnaryOperation,
  merge,
  JisonNodeLocation,
} from "../ast";
import { wrapPrimitiveIfNeeded } from "../sandTypes";
import parser from "./parser.generated";

const { yy } = parser.parser;

yy.NodeType = NodeType;
yy.IfAlternativeType = IfAlternativeType;
yy.ConstraintType = ConstraintType;

yy.binaryExpr = function binaryExpr(
  operation: BinaryOperation,
  left: any,
  right: any,
  location: JisonNodeLocation,
): BinaryExpr {
  return {
    type: NodeType.BinaryExpr,
    operation,
    left,
    right,
    location: camelCase(location),
  };
};

yy.unaryExpr = function unaryExpr(
  operation: UnaryOperation,
  right: any,
  location: JisonNodeLocation,
): UnaryExpr {
  return {
    type: NodeType.UnaryExpr,
    operation,
    right,
    location: camelCase(location),
  };
};

yy.wrapPrimitiveIfNeeded = wrapPrimitiveIfNeeded;
yy.camelCase = camelCase;
yy.merge = merge;

export default parser;
