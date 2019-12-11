import parser from "./parser";

// const src = `
// pub class HelloWorld {
//     pub main(args: String) {
//         System.out.println("Hello world!");
//     }

//     factorial(n: int): int {
//         if 0 {
//             1
//         } else {
//             n * factorial(n - 1)
//         }
//     }
// }
// `;

const src = `
pub class HelloWorld {
    pub main(args: String) {
        System.out.println("Hello world!")
    }

    factorial(n: int): int {
        foo(0)
    }
}
`;

console.log("hi");
console.log(parser.parse(src));
