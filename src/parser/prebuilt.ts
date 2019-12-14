import addApi from "./addApi";
import parser from "./parser.generated";

addApi(parser.parser);

export default parser.parser;
