import addApi from "./addApi";
import parserModule from "./parser.generated";

const preBuiltParser = parserModule.parser;

addApi(preBuiltParser);

export default preBuiltParser;
