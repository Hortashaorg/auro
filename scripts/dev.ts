const workspace = Deno.args[0];

const command = new Deno.Command("deno", {
  args: [
    "run",
    "--allow-net",
    "--allow-read",
    "--watch",
    `/app/services/${workspace}/main.ts`,
  ],
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});

await command.output();
