import { drizzle } from "drizzle-orm/postgres-js";

const db = drizzle({
    connection: "postgresql://root:root@postgres:5432/root",
    casing: "snake_case",
});

const result = await db.execute("select 1");
console.log(result);
