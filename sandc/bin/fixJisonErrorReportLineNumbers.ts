import replace from "replace-in-file";
import path from "path";

const PATH_TO_SAND_PARSER = path.join(
  __dirname,
  "../src/parser/parser.generated.js",
);

replace.sync({
  files: PATH_TO_SAND_PARSER,
  from: /\(yylineno \+ 1\)/g,
  to: "lexer.yylineno",
});
