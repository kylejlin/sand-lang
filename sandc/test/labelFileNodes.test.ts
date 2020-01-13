import path from "path";
import { labelFileNodes } from "../src/labelFileNodes";
import { Tester } from "./labelerTester";

const SUCCESS_CASES_DIR = path.join(
  __dirname,
  "/fixtures/lstRegression/shouldSucceed/",
);

const tester = Tester.fromConfig({
  directory: SUCCESS_CASES_DIR,
  fileCombinations: [
    [
      "AbstractClass.sand",
      "Factorial.sand",
      "literals/Strings.sand",
      "Package.sand",
    ],
  ],
});

tester.test(labelFileNodes, "the tree-labeler");
