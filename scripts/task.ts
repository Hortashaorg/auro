import { expandGlob } from "@std/fs";
import { globToRegExp } from "@std/path";

const glob = Deno.args[0];
const task = Deno.args[1];

if (!glob || !task) {
    throw new Error("Glob and Script arguments are required");
}

const workspaceFiles = await Array.fromAsync(expandGlob("./**/deno.json"));

type Workspace = {
    name: string;
    path: string;
    tasks: string[];
};
const workspaces: Workspace[] = [];

for (const workspaceFile of workspaceFiles) {
    const file = await Deno.readTextFile(workspaceFile.path);
    const denofile = JSON.parse(file);

    workspaces.push({
        name: denofile.name,
        path: workspaceFile.path,
        tasks: denofile.tasks ? Object.keys(denofile.tasks) : [],
    });
}
const globRegExp = globToRegExp(glob);
const matchingWorkspaces = workspaces.filter((workspace) =>
    globRegExp.test(workspace.name)
);

const workspaceWithValidTask = matchingWorkspaces.filter((workspace) =>
    workspace.tasks.find((taskname) => taskname === task)
);

const tasks = workspaceWithValidTask.map(async (workspace) => {
    const command = new Deno.Command("deno", {
        args: [
            "task",
            "--config",
            workspace.path,
            task,
        ],
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit",
    });

    await command.output();
});

await Promise.all(tasks);
