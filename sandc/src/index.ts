import parser from "./parser/prebuilt";
import SandScanner from "./parser/addApi/scanner";
import { bindFileNode } from "./binder";

const src = `
pub class HelloWorld {
    pub main(args: String[]) {
        use sand.System;

        System.out.println(factorial(5));
    }

    factorial(n: int): int {
        use sand.lang.IllegalArgumentException as err;

        if n < 0 {
            err(n)
        } else if n == 0 {
            1
        } else {
            n * factorial(n - 1)
        }
    }
}
`;

console.log("Parsing...");

const ast = parser.parse(src);
const pbt = bindFileNode(ast);
console.log(JSON.stringify(pbt, null, 4));
