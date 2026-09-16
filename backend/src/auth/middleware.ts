import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { JWT_SECRET } from "../../constants";
import type { JwtPayload } from "../../interfaces/JwtPayload";

export const authMiddleware: MiddlewareHandler = async(c, next) => {
    const jwt = getCookie(c, "jwt");
    if(!jwt) {
        return c.json({message: "Unauthorized"}, 401);
    }
    let payload: JwtPayload;
    try {
        payload = await verify(jwt, JWT_SECRET, "HS256") as JwtPayload;
    } catch (err) {
        return c.json({message: "Unauthorized"}, 401)
    }

    // set payload into jwtPayload var in c: Context
    c.set("jwtPayload", payload);

    await next();
}