import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
    profile_pic: text(),
    created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
