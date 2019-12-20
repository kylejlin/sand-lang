import {
  BinaryExpr,
  BinaryOperation,
  camelCase,
  ConstraintType,
  IfAlternativeType,
  JisonNodeLocation,
  merge,
  NodeType,
  UnaryExpr,
  UnaryOperation,
  Expr,
  DotExpr,
} from "../ast";
import { wrapPrimitiveIfNeeded } from "../sandTypes";
import { SandParser } from "./parser.generated";

export default function addApi(parser: SandParser) {
  const { yy } = parser;

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

  yy.dotExpr = function dotExpr(
    left: Expr,
    right: string,
    location: JisonNodeLocation,
  ): DotExpr {
    return {
      type: NodeType.DotExpr,
      left,
      right,
      location: camelCase(location),
    };
  };

  yy.wrapPrimitiveIfNeeded = wrapPrimitiveIfNeeded;
  yy.camelCase = camelCase;
  yy.merge = merge;
}
