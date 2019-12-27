import parser from "./parser/prebuilt";

const src = `
pub class HelloWorld {
    pub main(args: String[]) {
        System.out.println(a < b<c>(d));

        Foo {};

        let x: int[] = [1, 2, 3];
    }
}
`;

console.log("Parsing...");

const res = parser.parse(src);
console.log(res);
console.log(JSON.stringify(res, null, 4));
