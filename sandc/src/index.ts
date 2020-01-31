import parser from "./parser";
import SandScanner from "./parser/addApi/scanner";
import { EOF, INVALID } from "./types/tokens";

const src = `//
  /**/
  
  // blah
  /* blah */
  /* blah
  blah
  */
  
  package/* blah */foo/*
  */. /* blah */ foo; // blah
  
  import foo.foo;
  import foo.foo;
  
  use foo.foo;
  use foo.foo;
  
  pub class Foo {
      use/* blah */foo/*
  */. /* blah */ foo; // blah
  
      use/* blah */foo/*
  */. /* blah */ * /* blah */; /* blah
  blah */
  
      // blah
      foo(/* blah */ x: int, /* blah */x: int, x:/* blah */int/* blah */) throws /* blah */ Foo { // blah
          // blah
          x += /* blah */ y/*blah*/; // blah
      }
  
      /**
        * blah
        *
        * @param x blah
        * @param x blah
        *
        * @return blah
        *
        * @throws blah
        * @throws blah
        *
        * blah
        */
      foo() {
          
      }
  }
  `;

function parse() {
  console.log("Parsing...");

  try {
    const ast = parser.parse(src);
    console.log("ast:", ast);
  } catch (e) {
    throw e;
  }
}

function scan() {
  console.log("Scanning");

  const scanner = new SandScanner();
  scanner.setInput(src);

  const tokenTypes = [];

  while (true) {
    const tokenType = scanner.lex();
    tokenTypes.push([tokenType, scanner.yytext]);
    if (tokenType === EOF || tokenType === INVALID) {
      break;
    }
  }

  console.log("tokens:", tokenTypes);
  console.log("comments", scanner.getComments());
}

scan();
