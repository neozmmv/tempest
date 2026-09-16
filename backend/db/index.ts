import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL not set in .env!")
}

export const db = drizzle(connectionString, { schema });
