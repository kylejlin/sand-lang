import fs from "fs";
import path from "path";
import jisonCli from "../../src/jison/cli";

interface UpToDateTesterOptions {
  pathToPrebuiltParser: string;
  pathToTempDir: string;
  pathToGrammar: string;
}

export default function testPrebuiltParserIsUpToDate({
  pathToPrebuiltParser,
  pathToTempDir,
  pathToGrammar,
}: UpToDateTesterOptions) {
  test("the prebuilt parser is up to date", () => {
    const pathToLatestParser = path.join(
      pathToTempDir,
      "./parser.generated.js",
    );

    if (!fs.existsSync(pathToTempDir)) {
      fs.mkdirSync(pathToTempDir, { recursive: true });
    }

    if (fs.existsSync(pathToLatestParser)) {
      deleteSync(pathToLatestParser);
    }

    jisonCli.main({
      file: pathToGrammar,
      outfile: pathToLatestParser,
    });

    const prebuilt = removeTrailingNewline(
      fs.readFileSync(pathToPrebuiltParser, "utf8"),
    );
    const latest = removeTrailingNewline(
      applyYylinenoReplacements(fs.readFileSync(pathToLatestParser, "utf8")),
    );
    expect(prebuilt).toBe(latest);
  });
}

function deleteSync(path: string): void {
  fs.unlinkSync(path);
}

function removeTrailingNewline(generated: string): string {
  if (generated.slice(-1) === "\n") {
    return generated.slice(0, -1);
  } else {
    return generated;
  }
}

function applyYylinenoReplacements(generated: string): string {
  return generated.replace(/\(yylineno \+ 1\)/g, "lexer.yylineno");
}
