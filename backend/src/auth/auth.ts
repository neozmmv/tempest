import { Context, Hono } from "hono";
import type { LoginBody } from "../../interfaces/LoginBody";
import { decode, sign, verify } from 'hono/jwt'
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { password } from "bun";
import type { User } from "../../interfaces/Users";

export const authRouter = new Hono();

// /auth/login
authRouter.post("/login", async (c: Context) => {
    let errors: string[] = [];
    const body = await c.req.json() as LoginBody;
    if(!body.email) {
        errors.push("'email' field missing.");
    }
    if(!body.password) {
        errors.push("'password' field missing");
    }

    if(errors.length > 0) {
        return c.json(errors, 400);
    }

    const [user] = await db.select({
        id: users.id,
        password: users.password,
        name: users.name,
        email: users.email,
        created_at: users.created_at
    })
    .from(users)
    .where(eq(users.email, body.email))
    .limit(1);

    if(!user) {
        return c.json({
            message: "Invalid email or password!"
        })
    }

    const verified = await Bun.password.verify(body.password, user.password);

    if(!verified) {
        return c.json({
            message: "Invalid email or password!"
        });
    }

    const payload = {
        sub: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        exp: Math.floor(Date.now() / 1000) + 60 * 5 // token expires in 5 min
    }

    const token = await sign(payload, Bun.env.JWT_SECRET!, "HS256")

    return c.json({token});
})

authRouter.post("/signUp", async (c: Context) => {
    const body = await c.req.json() as User;
    const errors: string[] = []
    if(!body.email) {
        errors.push("'email' field required!")
    }
    if(!body.name) {
        errors.push("'name' field required!")
    }
    if(!body.password) {
        errors.push("'password' field required!")
    }
    if(body.password.length < 8) {
        errors.push("Password should be at least 8 characters long!")
    }

    if(errors.length > 0) {
        return c.json({errors})
    }

    const hashedPassword = await Bun.password.hash(body.password)

    const [user] = await db
        .insert(users)
        .values({
            name: body.name,
            email: body.email,
            password: hashedPassword
        })
        .returning()

    const userToReturn = {
        name: user?.name,
        email: user?.email,
        created_at: user?.created_at
    }
    
    return c.json(userToReturn)
})