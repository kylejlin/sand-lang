import { Type } from "./ast";

export type Primitive = "int" | "double" | "char" | "boolean";

export function wrapPrimitiveIfNeeded(unwrapped: Type): Type {
  const { location } = unwrapped;

  switch (unwrapped.name) {
    case "int":
      return { name: "java.lang.Integer", args: [], location };
    case "double":
      return { name: "java.lang.Double", args: [], location };
    case "char":
      return { name: "java.lang.Character", args: [], location };
    case "boolean":
      return { name: "java.lang.Boolean", args: [], location };
    default:
      return unwrapped;
  }
}
