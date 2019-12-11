import { Type } from "./ast";

export type Primitive = "int" | "double" | "char" | "boolean";

export function wrapPrimitiveIfNeeded(unwrapped: Type): Type {
  switch (unwrapped.name) {
    case "int":
      return { name: "java.lang.Integer", args: [] };
    case "double":
      return { name: "java.lang.Double", args: [] };
    case "char":
      return { name: "java.lang.Character", args: [] };
    case "boolean":
      return { name: "java.lang.Boolean", args: [] };
    default:
      return unwrapped;
  }
}
