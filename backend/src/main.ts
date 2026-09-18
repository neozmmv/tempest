import { Hono, Context } from "hono";
import type { ILoginForm, IUser } from "../interfaces/Users";
import { db } from "../db";
import { users } from "../db/schema";
import { authRouter } from "./auth/auth";

const app = new Hono()

app.route("/auth", authRouter)

app.get("/", (c) => {
    return c.json({})
})

// drizzle calls need await!!

export default { 
    port: 3000, 
    fetch: app.fetch, 
} 