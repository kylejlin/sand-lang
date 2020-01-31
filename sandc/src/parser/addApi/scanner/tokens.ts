import {
  CHAR_LITERAL,
  ESCAPED_IDENTIFIER,
  NUMBER_LITERAL,
  RETURN,
  TokenType,
  UNRESERVED_IDENTIFIER,
} from "../../../types/tokens";

export type TokenizationRule = [RegExp, TokenType];

type ShorthandTokenizationRule = TokenType | TokenizationRule;

const SHORTHAND_RULES: ShorthandTokenizationRule[] = [
  "abstract",
  "assert",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "default",
  "do",
  "double",
  "else",
  "enum",
  "extends",
  "final",
  "finally",
  "float",
  "for",
  "goto",
  "if",
  "implements",
  "import",
  "instanceof",
  "int",
  "interface",
  "long",
  "native",
  "new",
  "package",
  "private",
  "protected",
  "public",
  [/^return\b/, RETURN],
  "short",
  "static",
  "strictfp",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "try",
  "void",
  "volatile",
  "while",

  "_",
  "as",
  "copy",
  "downto",
  "downuntil",
  "false",
  "in",
  "inline",
  "let",
  "loop",
  "never",
  "notinstanceof",
  "null",
  "open",
  "override",
  "prot",
  "pub",
  "repeat",
  "shadow",
  "true",
  "tryorthrow",
  "upto",
  "upuntil",
  "use",
  "var",

  "get",
  "intenc",
  "set",
  "priv",

  "(",
  ")",
  "{",
  "}",
  "[",
  "]",
  ";",
  ",",
  ".",
  "#",
  "&",
  "|",
  ":",
  "=",
  "**=",
  "*=",
  "/=",
  "%=",
  "+=",
  "-=",
  "\\",
  "->",
  "||",
  "&&",
  "==",
  "!=",
  "~=",
  "!~=",
  "<",
  "<=",
  ">",
  ">=",
  "~<",
  "~<=",
  "~>",
  "~>=",
  "...",
  "..=",
  "=..",
  "=.=",
  "+",
  "-",
  "*",
  "/",
  "%",
  "**",
  "!",
  "?",
  "@",

  [/^[a-zA-Z_]\w*/, UNRESERVED_IDENTIFIER],
  [/^~[a-zA-Z_]\w*/, ESCAPED_IDENTIFIER],
  [
    /^-?\d+(?:\.\d+)?(?:e-?\d+)?(?:int|short|long|byte|char|float|double)?/,
    NUMBER_LITERAL,
  ],
  [/^'(?:[^'\\]|\\(?:['\\nrvft]|u[\dA-F]{4,5}))'/, CHAR_LITERAL],
];

export const SAND_TOKENIZATION_RULES: TokenizationRule[] = SHORTHAND_RULES.slice()
  .sort(sortFromLongestToShortestToLonghand)
  .map(compileShorthandRule);

assertEachRuleRegexStartsWithACaret(SAND_TOKENIZATION_RULES);

function sortFromLongestToShortestToLonghand(
  a: ShorthandTokenizationRule,
  b: ShorthandTokenizationRule,
): number {
  if (Array.isArray(a) && Array.isArray(b)) {
    return 0;
  }

  if (Array.isArray(a) && !Array.isArray(b)) {
    return 1;
  }

  if (!Array.isArray(a) && Array.isArray(b)) {
    return -1;
  }

  return b.length - a.length;
}

function compileShorthandRule(
  rule: ShorthandTokenizationRule,
): TokenizationRule {
  if (Array.isArray(rule)) {
    return rule;
  }

  if (/^\w+$/.test(rule)) {
    return [new RegExp("^" + rule + "\\b"), rule];
  }

  return [new RegExp("^" + escapeRegex(rule)), rule];
}

function escapeRegex(re: string): string {
  return re.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function assertEachRuleRegexStartsWithACaret(rules: TokenizationRule[]): void {
  rules.forEach(assertRuleRegexStartsWithACaret);
}

function assertRuleRegexStartsWithACaret(rule: TokenizationRule): void {
  if (rule[0].source.charAt(0) !== "^") {
    throw new Error(
      "Illegal tokenization rule: " +
        stringifyRule(rule) +
        '. Tokenization rules must start with a caret ("^").',
    );
  }
}

function stringifyRule(rule: TokenizationRule): string {
  return "(/" + rule[0].source + "/ -> " + rule[1] + ")";
}
