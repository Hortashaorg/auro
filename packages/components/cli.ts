console.log(Deno.args);

const currentScriptUrl = import.meta.url;
const baseUrl = currentScriptUrl.substring(
  0,
  currentScriptUrl.lastIndexOf("/"),
);

async function downloadComponent(
  path: string,
) {
  const fileUrl = `${baseUrl}/${path}`;
  const response = await fetch(fileUrl);
  const content = await response.text();

  // Create directories if they don't exist
  const targetPath = `./test/${path}`;
  const targetDir = targetPath.substring(0, targetPath.lastIndexOf("/"));
  await Deno.mkdir(targetDir, { recursive: true });

  // Write the file
  await Deno.writeTextFile(targetPath, content);
}

// CLI interface
const [command, ...args] = Deno.args;

switch (command) {
  case "add":
    {
      const [path] = args;
      if (path) {
        downloadComponent(path);
      } else {
        throw new Error("Path must be provided");
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
