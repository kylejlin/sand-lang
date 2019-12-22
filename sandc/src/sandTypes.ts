import { NodeType, Type } from "./ast";

export type Primitive = "int" | "double" | "char" | "boolean";

export function wrapPrimitiveIfNeeded(unwrapped: Type): Type {
  const { location } = unwrapped;

  switch (unwrapped.name) {
    case "int":
      return {
        type: NodeType.Type,
        name: "java.lang.Integer",
        args: [],
        location,
      };
    case "double":
      return {
        type: NodeType.Type,
        name: "java.lang.Double",
        args: [],
        location,
      };
    case "char":
      return {
        type: NodeType.Type,
        name: "java.lang.Character",
        args: [],
        location,
      };
    case "boolean":
      return {
        type: NodeType.Type,
        name: "java.lang.Boolean",
        args: [],
        location,
      };
    default:
      return unwrapped;
  }
}
