import {
  camelCase,
  ConstraintType,
  DotExpr,
  Expr,
  Identifier,
  IfAlternativeType,
  InfixExpr,
  InfixOperation,
  JisonNodeLocation,
  merge,
  NodeType,
  PrefixExpr,
  PrefixOperation,
} from "../../ast";
import { wrapPrimitiveIfNeeded } from "../../sandTypes";
import { SandParser } from "../parser.generated";
import isThereUpcomingTypeArgListAndOpenParen from "./lexUtils/isThereUpcomingTypeArgListAndOpenParen";

export default function addApi(parser: SandParser) {
  const { yy } = parser;

  yy.lexUtils = {};

  yy.lexUtils.isThereUpcomingTypeArgListAndOpenParen = isThereUpcomingTypeArgListAndOpenParen;

  yy.NodeType = NodeType;
  yy.IfAlternativeType = IfAlternativeType;
  yy.ConstraintType = ConstraintType;

  yy.binaryExpr = function binaryExpr(
    operation: InfixOperation,
    left: any,
    right: any,
    location: JisonNodeLocation,
  ): InfixExpr {
    return {
      type: NodeType.InfixExpr,
      operation,
      left,
      right,
      location: camelCase(location),
    };
  };

  yy.unaryExpr = function unaryExpr(
    operation: PrefixOperation,
    right: any,
    location: JisonNodeLocation,
  ): PrefixExpr {
    return {
      type: NodeType.PrefixExpr,
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
      right: idents[1].name,
      location: merge(idents[0].location, idents[1].location),
    };

    return idents
      .slice(2)
      .reduce((left: DotExpr, right: Identifier): DotExpr => {
        return {
          type: NodeType.DotExpr,
          left,
          right: right.name,
          location: merge(left.location, right.location),
        };
      }, leftmostDot);
  };

  yy.wrapPrimitiveIfNeeded = wrapPrimitiveIfNeeded;
  yy.camelCase = camelCase;
  yy.merge = merge;
}
