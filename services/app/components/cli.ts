import { dirname, isAbsolute, normalize } from "jsr:@std/path";

function isValidRelativePath(path: string): boolean {
  // Normalize the path to handle .. and .
  const normalizedPath = normalize(path);

  // Check if path is absolute
  if (isAbsolute(normalizedPath)) {
    return false;
  }

  // Check if path tries to escape current directory
  if (normalizedPath.startsWith("../")) {
    return false;
  }

  return true;
}

type ComponentConfig = {
  componentsDir: string;
};

const currentScriptUrl = import.meta.url;
const baseUrl = currentScriptUrl.substring(
  0,
  currentScriptUrl.lastIndexOf("/"),
);

async function getConfig(): Promise<ComponentConfig> {
  const configFile = await Deno.readTextFile("./kalena.json");

  const config = JSON.parse(configFile);
  if (!config.componentsDir || !isValidRelativePath(config.componentsDir)) {
    throw new Error(
      "componentsDir is required and must be a valid relative path",
    );
  }

  return config;
}

async function downloadComponent(path: string) {
  const config = await getConfig();
  const fileUrl = `${baseUrl}/${path}`;
  const response = await fetch(fileUrl);
  const content = await response.text();

  // Create directories if they don't exist
  const targetPath = `${config.componentsDir}/${path}`;
  const targetDir = dirname(targetPath);
  await Deno.mkdir(targetDir, { recursive: true });

  // Write the file
  await Deno.writeTextFile(targetPath, content);
}

// CLI interface
const [command, ...args] = Deno.args;

const response = await fetch(`${baseUrl}/componentMap.json`);
const componentsJSON = await response.text();

const components: Record<string, {
  file: string;
  dependencies: string[];
  localDependencies: string[];
}> = JSON.parse(componentsJSON);

switch (command) {
  case "add":
    {
      const [componentName] = args;
      if (componentName && components[componentName]) {
        downloadComponent(components[componentName].file);
        for (const dependency of components[componentName].localDependencies) {
          downloadComponent(dependency);
        }
      } else {
        throw new Error("Component not found");
      }
    }
    break;

  default:
    console.log(`
Usage:
  deno run cli.ts list              List all available components
  deno run cli.ts add <name> [dir]  Add a component to your project
    `);
}
