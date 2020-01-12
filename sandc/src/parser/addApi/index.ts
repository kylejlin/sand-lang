import {
  CatchType,
  ConstraintType,
  DotExpr,
  Expr,
  Identifier,
  IfAlternativeType,
  InfixExpr,
  InfixOperation,
  NodeType,
  Overridability,
  PrefixExpr,
  PrefixOperation,
  Type,
} from "../../ast";
import { JisonNodeLocation } from "../../jison";
import { wrapPrimitiveIfNeeded } from "../../sandTypes";
import {
  convertToRange,
  merge,
  TextPosition,
  TextRange,
} from "../../textPosition";
import { SandParser } from "../parser.generated";
import typeParser from "../subparsers/type/prebuilt";
import SandScanner from "./scanner";

export default function addApi(parser: SandParser) {
  parser.lexer = new SandScanner();

  const { yy } = parser;

  yy.NodeType = NodeType;
  yy.Overridability = Overridability;
  yy.IfAlternativeType = IfAlternativeType;
  yy.ConstraintType = ConstraintType;
  yy.CatchType = CatchType;

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
      location: convertToRange(location),
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
      location: convertToRange(location),
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
      location: convertToRange(location),
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

  function applyLocationCorrections(node: Type, start: TextPosition): Type {
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
    relative: TextRange,
    offset: TextPosition,
  ): TextRange {
    const absStart = getAbsolutePosition(relative.start, offset);
    const absEnd = getAbsolutePosition(relative.end, offset);
    return { start: absStart, end: absEnd };
  }

  function getAbsolutePosition(
    relative: TextPosition,
    offset: TextPosition,
  ): TextPosition {
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

  yy.wrapPrimitiveIfNeeded = wrapPrimitiveIfNeeded;
  yy.convertToRange = convertToRange;
  yy.merge = merge;
}
