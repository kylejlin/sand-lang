import parser from "./parser/prebuilt";
import SandScanner from "./parser/addApi/scanner";
import { bindFileNodes } from "./binder/index";
import { labelFileNodes } from "./labeler";

const src = `pub class Args<T, U extends sand.Foo> {
    indexOf(elem: String, arr: String[+]): int {

    }
}`;

console.log("Parsing...");

const ast = parser.parse(src);
const lst = labelFileNodes([ast]).fileNodes[0];
const res = bindFileNodes([lst]);
console.log(JSON.stringify(res.refs, null, 4));
