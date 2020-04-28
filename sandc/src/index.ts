import { parseFiles } from "./parser";
import SandScanner from "./parser/addApi/scanner";
import { EOF, INVALID } from "./types/tokens";

const src =
  'import java.util.InputMismatchException;\nimport java.util.Scanner;\n\nimport java.awt.EventQueue;\nimport javax.swing.JFileChooser;\nimport javax.swing.filechooser.FileNameExtensionFilter;\n\nimport java.lang.reflect.InvocationTargetException;\nimport java.io.File;\nimport java.io.FileWriter;\nimport java.io.IOException;\n\nuse System.out.println;\nuse System.out.print;\n\npub class SpiderSolitaire {\n    pub static NUM_STACKS = 7int;\n    pub static NUM_DECKS = 4int;\n\n    var board: Board;\n    input: Scanner;\n\n    pub new() {\n        board = Board(numStacks: NUM_STACKS, numDecks: NUM_DECKS);\n        input = Scanner(System.~in);\n    }\n\n    pub play() {\n        board.print();\n\n        loop {\n            printCommandHelp();\n\n            let command = input.next();\n            switch command {\n                case "move" {\n                   handleMoveCommand();\n                }\n\n                case "draw" {\n                    board.drawCards();\n                }\n\n                case "clear" {\n                    handleClearCommand();\n                }\n\n                case "restart" {\n                    board = Board(numStacks: NUM_STACKS, numDecks: NUM_DECKS);\n                }\n\n                case "save" {\n                    save();\n                }\n\n                case "load" {\n                    load();\n                }\n\n                case "quit" {\n                    println("Goodbye!");\n                    System.exit(0);\n                }\n\n                else {\n                    println("Invalid command");\n                }\n            }\n\n            if (board.isEmpty()) {\n                break;\n            }\n        }\n\n        println("Congratulations! You win!");\n    }\n\n    printCommandHelp() {\n        println("\\nCommands:");\n        println("   move [card] [source_stack] [destination_stack]");\n        println("   draw");\n        println("   clear [source_stack]");\n        println("   restart");\n        println("   save");\n        println("   load");\n        println("   quit");\n        print(">");\n    }\n\n    handleMoveCommand() {\n         try {\n            let symbol = input.next();\n            let srcIndex = input.nextInt();\n            let destIndex = input.nextInt();\n            board.makeMove(symbol: \'\', srcIndex: destIndex - 1, destIndex: destIndex - 1);\n        } catch _e: InputMismatchException {\n            printCommandSyntaxError();\n        }\n    }\n\n    handleClearCommand() {\n        try {\n            let index = input.nextInt();\n            board.clear(index: index - 1);\n        } catch _e: InputMismatchException {\n            printCommandSyntaxError();\n        }\n    }\n\n    printCommandSyntaxError() {\n        println("Invalid command syntax. Please consult the Commands list for help.");\n        input.nextLine();\n    }\n\n    save() {\n        try {\n            EventQueue.invokeAndWait(\\ -> {\n                let chooser = JFileChooser();\n\n                let filter = FileNameExtensionFilter("Spider solitaire files", "solitaire");\n                chooser.setFileFilter(filter);\n                chooser.setAcceptAllFileFilterUsed(false);\n\n                chooser.showSaveDialog(null);\n\n                let file = chooser.getSelectedFile();\n\n                var path = file.getAbsolutePath();\n                if !path.endsWith(".solitaire") {\n                    path += ".solitaire";\n                }\n\n                let boardStr = board.serialize();\n\n                try {\n                    let writer = FileWriter(path);\n                    writer.write(boardStr);\n                    writer.close();\n\n                    println("Successfully saved game to {path}");\n                } catch e: IOException {\n                    println("Unknown file error: {e#message}");\n                }\n            });\n        } catch e: InterruptedException {\n            println("Unknown file error: {e#message}");\n        } catch e: InvocationTargetException {\n            println("Unknown file error: {e#message}");\n        }\n    }\n\n    load() {\n        try {\n            EventQueue.invokeAndWait(\\ -> {\n                let chooser = JFileChooser();\n\n                let filter = FileNameExtensionFilter("Spider solitaire files", "solitaire");\n                chooser.setFileFilter(filter);\n                chooser.setAcceptAllFileFilterUsed(false);\n\n                chooser.showOpenDialog(null);\n\n                let file = chooser.getSelectedFile();\n\n                var path = file.getAbsolutePath();\n\n                if (!path.endsWith(".solitaire")) {\n                    println("Invalid file. Please choose a .solitaire file.");\n                    return;\n                }\n\n                try {\n                    let scanner = Scanner(file);\n                    // Force scanner.next() to give us the whole file (\\Z matches end of input)\n                    scanner.useDelimiter("\\\\Z");\n                    let boardStr = scanner.next();\n                    board = Board.deserialize(boardStr);\n                    scanner.close();\n\n                    println("\\nSucessfully loaded {path}\\n");\n                } catch e: IOException {\n                    println("Unknown file error: {e#message}");\n                } catch e: DeserializationException {\n                    println("Could not accept {path} because it was either malformatted or it used an unsupported format.");\n                }\n            });\n        } catch e: InterruptedException {\n            println("Unknown file error: {e#message}");\n        } catch e: InvocationTargetException {\n            println("Unknown file error: {e#message}");\n        }\n    }\n}';

function parse() {
  console.log("Parsing...");

  const contentMap = new Map([["src/App.sand", src]]);

  parseFiles(contentMap).match({
    ok: ast => {
      console.log("ast: ", ast);
    },
    err: e => {
      console.log("parse error: ", e);
    },
  });
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

parse();
