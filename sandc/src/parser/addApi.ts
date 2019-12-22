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
  Identifier,
  Type,
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

  yy.buildDotChainIfNeeded = function buildDotChainIfNeeded(
    idents: Identifier[],
  ): Identifier | DotExpr {
    if (idents.length === 0) {
      throw new Error(
        "Cannot build dot chain or identifier out of empty array.",
      );
    }

    if (idents.length === 1) {
      return idents[0];
    }

    const leftmostDot: DotExpr = {
      type: NodeType.DotExpr,
      left: idents[0],
      right: idents[1].value,
      location: merge(idents[0].location, idents[1].location),
    };

    return idents
      .slice(2)
      .reduce((left: DotExpr, right: Identifier): DotExpr => {
        return {
          type: NodeType.DotExpr,
          left,
          right: right.value,
          location: merge(left.location, right.location),
        };
      }, leftmostDot);
  };

  yy.wrapPrimitiveIfNeeded = wrapPrimitiveIfNeeded;
  yy.camelCase = camelCase;
  yy.merge = merge;
}
