import type { db } from "@db/mod.ts";

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
