import parser from "./parser";

const src = `
pub class HelloWorld {
    pub main(args: String,): void {
        System.out.println("Hello world!",)
    }
}
`;

console.log(parser.parse(src));
