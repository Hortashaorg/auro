import { expandGlob } from "@std/fs";
import { basename } from "@std/path";

function findComponentDependencies(content: string) {
  const importRegex = /^import\s+.*?from\s+["'](.+?)["'];?$/gm;

  const compImports = new Set<string>();
  for (const match of content.matchAll(importRegex)) {
    const aImport = match[1];
    // We could guarantee a specific components here, to not suddenly add stuff that we donæt want.
    if (aImport) {
      compImports.add(aImport);
    }
  }

  return [...compImports];
}

type ComponentMap = {
  [key: string]: {
    file: string;
    dependencies: string[];
    localDependencies: string[];
  };
};

const currentDir = new URL(".", import.meta.url).pathname;
const allComponents = await Array.fromAsync(expandGlob("./**/*.{tsx,ts}", {
  includeDirs: false,
}));

const componentMap: ComponentMap = {};

for (const file of allComponents) {
  // Remove the currentDir prefix to get the relative path
  const relativePath = file.path.replace(currentDir, "");

  // Skip if not in a category directory
  const parts = relativePath.split("/");
  if (parts.length < 2) continue; // Skip files not in category/component structure

  const splitPath = basename(file.path).split(".")[0];
  let componentName: string;

  if (splitPath) {
    componentName = splitPath.toLowerCase();
  } else {
    throw new Error(`Invalid path name: ${file.path}`);
  }

  const content = await Deno.readTextFile(file.path);
  const compImports = findComponentDependencies(content);

  if (!componentMap[componentName]) {
    componentMap[componentName] = {
      file: relativePath,
      dependencies: compImports.filter((compimport) =>
        !compimport.startsWith("@comp/")
      ),
      localDependencies: compImports.filter((compimport) =>
        compimport.startsWith("@comp/")
      ).map((compimport) => compimport.replace("@comp/", "")),
    };
  }
}

await Deno.writeTextFile(
  "./components/componentMap.json",
  JSON.stringify(componentMap),
);
