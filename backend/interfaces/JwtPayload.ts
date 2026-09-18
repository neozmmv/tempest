import type { JWTPayload } from "hono/utils/jwt/types"

export interface JwtPayload extends JWTPayload{
    sub: string
    name: string
    email: string
    createdAt: string
}