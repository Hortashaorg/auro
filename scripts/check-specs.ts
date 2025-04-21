// check-specs.ts
import { walk } from "@std/fs";
import { join } from "@std/path";

const missingTests: string[] = [];

for await (const entry of walk(".", { exts: [".tsx"], includeDirs: false })) {
  if (entry.name.endsWith(".page.tsx")) {
    const testFile = join(entry.path.replace(".page.tsx", ".spec.ts"));
    try {
      await Deno.stat(testFile);
    } catch (_) {
      missingTests.push(entry.path);
    }
  }
}

if (missingTests.length > 0) {
  console.error(
    "Missing corresponding .spec.ts for the following .page.tsx files:",
  );
  for (const file of missingTests) {
    console.error(`❌ ${file}`);
  }
  Deno.exit(1);
} else {
  console.log("✅ All .page.tsx files have corresponding .spec.ts tests.");
}
