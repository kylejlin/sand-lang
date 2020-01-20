import { LanguageDefinedRefMap, Ref } from "../pbt";

export function createLanguageDefinedRefs(
  createRef: (name: string) => Ref,
): LanguageDefinedRefMap {
  return {
    null: createRef("null"),
    true: createRef("true"),
    false: createRef("false"),
    this: createRef("this"),
    super: createRef("super"),

    int: createRef("int"),
    byte: createRef("byte"),
    short: createRef("short"),
    long: createRef("long"),
    char: createRef("char"),
    double: createRef("double"),
    float: createRef("float"),
    boolean: createRef("boolean"),

    void: createRef("void"),
    never: createRef("never"),

    sequence: createRef("sequence"),
    array: createRef("array"),
    rlist: createRef("rlist"),

    nullable: createRef("nullable"),

    java: createRef("java"),
    sand: createRef("sand"),

    Comparable: createRef("Comparable"),
    Iterable: createRef("Iterable"),
    Boolean: createRef("Boolean"),
    Byte: createRef("Byte"),
    Character: createRef("Character"),
    Class: createRef("Class"),
    Double: createRef("Double"),
    Float: createRef("Float"),
    Integer: createRef("Integer"),
    Long: createRef("Long"),
    Math: createRef("Math"),
    Number: createRef("Number"),
    Object: createRef("Object"),
    Short: createRef("Short"),
    String: createRef("String"),
    System: createRef("System"),
    Throwable: createRef("Throwable"),
    Void: createRef("Void"),
  };
}
