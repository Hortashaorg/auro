const workspace = Deno.args[0];

const command = new Deno.Command("deno", {
	args: ["run", "--allow-net", "--watch", `services/${workspace}/main.ts`],
	stdin: "inherit",
	stdout: "inherit",
	stderr: "inherit",
});

await command.output();
