import type { JWTPayload } from "hono/utils/jwt/types"

export interface JwtPayload extends JWTPayload{
    name: string
    email: string
    created_at: string
}