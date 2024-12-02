import { drizzle } from "drizzle-orm/postgres-js";

const db = drizzle("postgresql://root:root@postgres:5432/root");

const result = await db.execute("select 1");
console.log(result);
