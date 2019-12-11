import parser from "./parser";

const src = `
pub class HelloWorld {
    pub main(args: String[]) {
        System.out.println("Hello world!");
    }

    factorial(n: int): int {
        x
    }

    pop(stack: int[:]): int {

    }
}
`;

console.log("Parsing...");

const res = parser.parse(src);
console.log(res);
console.log(JSON.stringify(res, null, 4));
