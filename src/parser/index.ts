import {
  BinaryExpr,
  BinaryOperation,
  NodeType,
  UnaryExpr,
  UnaryOperation,
  IfAlternativeType,
  ConstraintType,
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
): BinaryExpr {
  return { type: NodeType.BinaryExpr, operation, left, right };
};

yy.unaryExpr = function unaryExpr(
  operation: UnaryOperation,
  right: any,
): UnaryExpr {
  return { type: NodeType.UnaryExpr, operation, right };
};

yy.wrapPrimitiveIfNeeded = wrapPrimitiveIfNeeded;

export default parser;
