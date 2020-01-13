import parser from "./parser/prebuilt";
import SandScanner from "./parser/addApi/scanner";
import { bindFileNode } from "./binder";

const src = `pub class Args<T, U extends Foo> {
    indexOf(elem: String, arr: String[+]): int {

    }
}`;

console.log("Parsing...");

const ast = parser.parse(src);
console.log(JSON.stringify(ast.pubClass.typeArgDefs, null, 4));
