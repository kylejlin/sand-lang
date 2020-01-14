import path from "path";
import { bindFileNodes } from "../src/binder";
import { Tester } from "./binderTester";

const SUCCESS_CASE_DIR = path.join(
  __dirname,
  "/fixtures/pbtRegression/shouldSucceed/",
);
const FAILURE_CASE_DIR = path.join(
  __dirname,
  "/fixtures/pbtRegression/shouldFail/",
);

const tester = Tester.fromDirectories({
  success: SUCCESS_CASE_DIR,
  failure: FAILURE_CASE_DIR,
});

tester.test(bindFileNodes, "the binder");
