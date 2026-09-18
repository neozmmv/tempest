import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";
import { connectionString } from "../constants";


export const db = drizzle(connectionString, { schema, casing: "snake_case" });
