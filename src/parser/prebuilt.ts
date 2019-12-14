import addApi from "./addApi";
import parserModule from "./parser.generated";

addApi(parserModule.parser);

export default parserModule.parser;
