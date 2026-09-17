import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
    // x25519
    publicKey: text().notNull(),
    encryptedPrivateKey: text().notNull(),
    // ed25519
    publicSignatureKey: text().notNull(),
    encryptedPrivateSignatureKey: text().notNull(),
    encryptionSalt: text().notNull(),
    encryptionNonce: text().notNull(),
    signatureNonce: text().notNull(),
    profilePic: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable("messages", {
    id: uuid().defaultRandom().primaryKey(),
    senderId: uuid().references(() => users.id, { onDelete: "set null"}),
    receiverId: uuid().references(() => users.id, { onDelete: "set null"}),
    content: text().notNull(),
    createdAt: timestamp().defaultNow().notNull()
})