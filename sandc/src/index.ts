import parser from "./parser/prebuilt";
import SandScanner from "./parser/addApi/scanner";

const src = `
pub class HelloWorld {
    pub main(args: String[]) {
        System.out.println(a < b<c>(d));

        Foo {};

        let x: int[] = [1, 2, 3];
        let y = x as! Foo<Bar<Baz, int>, int, String, Baz[+]>;
        
        let ascDigits = (0..=9).rList();
        let foo = (-5..-3).arr();

        if x {}
    }
}
`;

console.log("Parsing...");

const res = parser.parse(src);
console.log(res);
console.log(JSON.stringify(res, null, 4));
