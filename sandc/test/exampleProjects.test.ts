import fs from "fs";
import path from "path";
import recursiveReadDir from "recursive-readdir";
import { parseFiles } from "../src/parser";

const PATH_TO_EXAMPLE_PROJECTS_DIRECTORY = path.join(
  __dirname,
  "fixtures/exampleProjects",
);

testExampleProjects();

function testExampleProjects() {
  const pathsToProjects = getPathsToSubdirectories(
    PATH_TO_EXAMPLE_PROJECTS_DIRECTORY,
  );
  pathsToProjects.forEach(pathToProject => {
    const projectName = pathToProject.split(path.sep).slice(-1)[0];
    test(
      "example project " + projectName + " compiles successfully",
      createTestFunctionForProjectAt(pathToProject),
    );
  });
}

function getPathsToSubdirectories(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(dirEnt => dirEnt.isDirectory())
    .map(dirEnt => path.join(dir, dirEnt.name));
}

function createTestFunctionForProjectAt(
  pathToProject: string,
): () => Promise<void> {
  return async function performTest() {
    const pathToSrcDir = path.join(pathToProject, "src");
    const fileContentMap = await getSandFileContentMap(pathToSrcDir);
    const fileContentMapWithPathsRelativeToProjectDir = new Map(
      [
        ...fileContentMap.entries(),
      ].map(([filePathRelativeToSrcDir, fileContent]) => [
        path.posix.join("src", filePathRelativeToSrcDir),
        fileContent,
      ]),
    );
    const parseResult = parseFiles(fileContentMapWithPathsRelativeToProjectDir);
    parseResult.ifErr(err => {
      throw err;
    });
  };
}

function getSandFileContentMap(dirPath: string): Promise<Map<string, string>> {
  return recursiveReadDir(dirPath)
    .then(paths => paths.filter(path => path.endsWith(".sand")))
    .then(absoluteFilePaths => {
      return Promise.all(
        absoluteFilePaths.map(absolutePath => {
          const relativePath = path.relative(dirPath, absolutePath);
          const content = readFile(absolutePath);
          return Promise.all([relativePath, content]);
        }),
      ).then(entries => new Map(entries));
    });
}

function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
}
