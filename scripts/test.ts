import { expandGlob } from "@std/fs";

const workspaces = await Array.fromAsync(expandGlob("./**/deno.json"));

for (const workspace of workspaces) {
    const file = await Deno.readTextFile(workspace.path);
    const denofile = JSON.parse(file);
    console.log(denofile.name);
}
