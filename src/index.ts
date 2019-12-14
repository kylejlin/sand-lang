import parser from "./parser/prebuilt";

const src = `
pub class HelloWorld {
    pub main(args: String[]) {
        System.out.println("Hello world!");
    }

    factorial(n: int): int {
        if n == 0 {
            1
        } else {
            n * factorial(n - 1)
        }
    }

    pop(stack: int[:]): int {
        stack.remove(stack.size() - 1);
        item
    }
}
`;

console.log("Parsing...");

const res = parser.parse(src);
console.log(res);
console.log(JSON.stringify(res, null, 4));
