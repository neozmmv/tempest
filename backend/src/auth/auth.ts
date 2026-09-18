import { Context, Hono } from "hono";
import type { LoginBody } from "../../interfaces/LoginBody";
import { sign, verify } from 'hono/jwt'
import { setCookie, getCookie } from "hono/cookie";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { AUDIENCE, ISSUER, JWT_SECRET } from "../../constants";
import { authMiddleware } from "./middleware";
import { zValidator } from "../lib/validator";
import { signUpRequestSchema } from "../schemas/signup.schema";

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
        created_at: users.createdAt
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
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // token expires in 5 min
        aud: AUDIENCE,
        issuer: ISSUER
    }

    const token = await sign(payload, JWT_SECRET, "HS256")

    setCookie(c, "jwt", token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7 // cookie saved for 7 days
    })

    return c.json({});
})

authRouter.post("/signUp", zValidator("json", signUpRequestSchema), async (c) => {
    const body = c.req.valid("json")
    const hashedPassword = await Bun.password.hash(body.password)

    const [user] = await db
        .insert(users)
        .values({
            name: body.name,
            email: body.email,
            password: hashedPassword,
            publicKey: body.publicKey,
            encryptedPrivateKey: body.encryptedPrivateKey,
            encryptedPrivateSignatureKey: body.encryptedPrivateSignatureKey,
            publicSignatureKey: body.publicSignatureKey,
            encryptionNonce: body.encryptionNonce,
            encryptionSalt: body.encryptionSalt,
            signatureNonce: body.signatureNonce,
        })
        .returning()

        const payload = {
        sub: user?.id,
        name: user?.name,
        email: user?.email,
        created_at: user?.createdAt,
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // token expires in 5 min
        aud: AUDIENCE,
        issuer: ISSUER
    }

    const token = await sign(payload, JWT_SECRET, "HS256")

    setCookie(c, "jwt", token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7 // cookie saved for 7 days
    })

    const userToReturn = {
        name: user?.name,
        email: user?.email,
        created_at: user?.createdAt
    }
    
    return c.json(userToReturn)
})

authRouter.get("/me", authMiddleware, async (c: Context) => {
    return c.json({ok: true})
})