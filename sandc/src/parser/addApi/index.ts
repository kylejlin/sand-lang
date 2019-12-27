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
  Type,
  NodeLocation,
} from "../../ast";
import { wrapPrimitiveIfNeeded } from "../../sandTypes";
import { SandParser } from "../parser.generated";
import typeParser from "../subparsers/type/prebuilt";
import getUpcomingObjectLiteralType from "./lexUtils/getUpcomingObjectLiteralType";
import isThereUpcomingTypeArgListAndOpenParen from "./lexUtils/isThereUpcomingTypeArgListAndOpenParen";

interface PointLocation {
  line: number;
  column: number;
}

export default function addApi(parser: SandParser) {
  const { yy } = parser;

  yy.lexUtils = {};

  yy.lexUtils.isThereUpcomingTypeArgListAndOpenParen = isThereUpcomingTypeArgListAndOpenParen;
  yy.lexUtils.getUpcomingObjectLiteralType = getUpcomingObjectLiteralType;

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

  yy.parseType = function parseType(
    src: string,
    location: JisonNodeLocation,
  ): Type {
    const start = { line: location.first_line, column: location.first_column };
    const incorrectlyLocated = typeParser.parse(src);
    return applyLocationCorrections(incorrectlyLocated, start);
  };

  function applyLocationCorrections(node: Type, start: PointLocation): Type {
    return {
      type: NodeType.Type,
      name: node.name,
      args: node.args.map(subType => applyLocationCorrections(subType, start)),
      location: getAbsoluteNodeLocation(node.location, start),
    };
  }

  /**
   * Takes a location relative to its start position (offset)
   * and computes the absolute location.
   */
  function getAbsoluteNodeLocation(
    relative: NodeLocation,
    offset: PointLocation,
  ): NodeLocation {
    const absStart = getAbsolutePointLocation(getStart(relative), offset);
    const absEnd = getAbsolutePointLocation(getEnd(relative), offset);
    return mergePointLocations(absStart, absEnd);
  }

  function getStart(location: NodeLocation): PointLocation {
    return {
      line: location.firstLine,
      column: location.firstColumn,
    };
  }

  function getEnd(location: NodeLocation): PointLocation {
    return {
      line: location.lastLine,
      column: location.lastColumn,
    };
  }

  function getAbsolutePointLocation(
    relative: PointLocation,
    offset: PointLocation,
  ): PointLocation {
    if (relative.line === 1) {
      return {
        line: relative.line + offset.line - 1,
        column: relative.column + offset.column,
      };
    } else {
      return {
        line: relative.line + offset.line - 1,
        column: relative.column,
      };
    }
  }

  function mergePointLocations(
    start: PointLocation,
    end: PointLocation,
  ): NodeLocation {
    return {
      firstLine: start.line,
      firstColumn: start.column,
      lastLine: end.line,
      lastColumn: end.column,
    };
  }

  yy.wrapPrimitiveIfNeeded = wrapPrimitiveIfNeeded;
  yy.camelCase = camelCase;
  yy.merge = merge;
}
