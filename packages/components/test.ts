const path = Deno.args[0];

console.log("path", path);
if (path) {
  const file = await Deno.readTextFile(path);
  console.log("file", file);
}
