import fs from "fs";
import path from "path";
import { bindFileNodes, BindingResult } from "../src/binder";
import { labelFileNodes } from "../src/labeler";
import parser from "../src/parser/prebuilt";
import * as pbt from "../src/pbt";
import { IfAlternativeType, NodeType, Ref } from "../src/pbt";
import { BindingResultAnalyzer, getDescendants } from "../src/pbtAnalyzer";
import nullishMap from "../src/utils/nullishMap";

const PATH_TO_TEST_FILE = path.join(
  __dirname,
  "./fixtures/pbtAnalyzer/Factorial.sand",
);

const RANDOM_TEST_INDICES = [0, 8, 13];

interface ParentChildPair {
  parent: pbt.Node;
  child: pbt.Node;
}

interface RefAnalysis {
  ref: Ref;
  sources: pbt.Node[];
  dependents: pbt.Node[];
}

describe("BindingResultAnalyzer", () => {
  const src = fs.readFileSync(PATH_TO_TEST_FILE, "utf8");
  const ast = parser.parse(src);
  const labelingResult = labelFileNodes([ast]);
  const bindingResult = bindFileNodes(labelingResult);
  const analyzer = BindingResultAnalyzer.fromResult(bindingResult);

  test("getNodeById() works", () => {
    RANDOM_TEST_INDICES.forEach(index => {
      const node = bindingResult.nodeIdReferents[index];
      const { nodeId } = node;
      expect(analyzer.getNodeById(nodeId)).toEqual(node);
    });
  });

  test("getParent() works", () => {
    getSampleParentChildPairsFromFactorialExample(bindingResult).forEach(
      ({ parent, child }) => {
        expect(analyzer.getParent(child)).toEqual(parent);
      },
    );
  });

  test("getRefSources() works", () => {
    getSampleRefAnalyticsFromFactorialExample(bindingResult).forEach(
      ({ ref, sources: expectedSources }) => {
        const actualSources = analyzer.getRefSources(ref);
        expect(new Set(actualSources)).toEqual(new Set(expectedSources));
      },
    );
  });

  test("getRefDependents() works", () => {
    getSampleRefAnalyticsFromFactorialExample(bindingResult).forEach(
      ({ ref, dependents: expectedDependents }) => {
        const actualDependents = analyzer.getRefDependents(ref);
        expect(new Set(actualDependents)).toEqual(new Set(expectedDependents));
      },
    );
  });
});

/**
 * Warning: this function makes assumptions about the content of Factorial.sand.
 * If you edit Factorial.sand, you will likely have to update this
 * function in order to avoid breaking tests.
 */
function getSampleParentChildPairsFromFactorialExample(
  bindingResult: BindingResult,
): ParentChildPair[] {
  const lt = bindingResult.nodeIdReferents.find(
    (node: pbt.Node): node is pbt.InfixExpr =>
      node.type === NodeType.InfixExpr && node.operation === "<",
  );
  const ltZero = lt?.right;
  const ltN = lt?.left;

  const ifNode = bindingResult.nodeIdReferents.find(
    (node: pbt.Node): node is pbt.If => node.type === NodeType.If,
  );

  const eq = bindingResult.nodeIdReferents.find(
    node => node.type === NodeType.InfixExpr && node.operation === "==",
  );

  const elif = bindingResult.nodeIdReferents.find(
    node =>
      node.type === NodeType.IfAlternative &&
      node.alternativeType === IfAlternativeType.ElseIf,
  );

  const factorialMethodBody = bindingResult.nodeIdReferents.find(
    (node: pbt.Node): node is pbt.ConcreteMethodDeclaration =>
      node.type === NodeType.ConcreteMethodDeclaration &&
      node.name === "factorial",
  )?.body;

  if (
    !(
      lt !== undefined &&
      ltZero !== undefined &&
      ltN !== undefined &&
      ifNode !== undefined &&
      eq !== undefined &&
      elif !== undefined &&
      factorialMethodBody !== undefined
    )
  ) {
    throw new Error(
      "getSampleParentChildParisFromFactorialExample() is out of date with test/fixtures/pbtAnalyzer/Factorial.sand",
    );
  }

  return [
    { parent: lt, child: ltZero },
    { parent: lt, child: ltN },
    { parent: ifNode, child: lt },
    { parent: ifNode, child: elif },
    { parent: elif, child: eq },
    { parent: factorialMethodBody, child: ifNode },
  ];
}

/**
 * Warning: this function makes assumptions about the content of Factorial.sand.
 * If you edit Factorial.sand, you will likely have to update this
 * function in order to avoid breaking tests.
 */
function getSampleRefAnalyticsFromFactorialExample(
  bindingResult: BindingResult,
): RefAnalysis[] {
  const factorialMethod = bindingResult.nodeIdReferents.find(
    (node: pbt.Node): node is pbt.ConcreteMethodDeclaration =>
      node.type === NodeType.ConcreteMethodDeclaration &&
      node.name === "factorial",
  );

  const facNDef = factorialMethod?.args[0];

  const facNRef = facNDef?.outRef;

  const facNDependents = nullishMap(
    factorialMethod?.body,
    getDescendants,
  )?.filter(n => (n as any).name === "n");

  const printMethod = bindingResult.nodeIdReferents.find(
    (node: pbt.Node): node is pbt.ConcreteMethodDeclaration =>
      node.type === NodeType.ConcreteMethodDeclaration &&
      node.name === "printFactorial",
  );

  const printNDef = printMethod?.args[0];

  const printNRef = printNDef?.outRef;

  const printNDependents = nullishMap(
    printMethod?.body,
    getDescendants,
  )?.filter(n => (n as any).name === "n");

  if (
    !(
      facNDef !== undefined &&
      facNRef !== undefined &&
      facNDependents !== undefined &&
      printNDef !== undefined &&
      printNRef !== undefined &&
      printNDependents !== undefined
    )
  ) {
    throw new Error(
      "getSampleRefAnalyticsFromFactorialExample() is out of date with test/fixtures/pbtAnalyzer/Factorial.sand",
    );
  }

  return [
    { ref: facNRef, sources: [facNDef], dependents: facNDependents },
    { ref: printNRef, sources: [printNDef], dependents: printNDependents },
  ];
}
