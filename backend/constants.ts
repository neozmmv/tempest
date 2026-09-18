export const JWT_SECRET = Bun.env.JWT_SECRET as string;
export const connectionString = Bun.env.DATABASE_URL as string;
export const AUDIENCE = "tempest-users"
export const ISSUER = "tempest"


if(!JWT_SECRET) {
    throw new Error("JWT_SECRET not set in .env!")
}

if (!connectionString) {
    console.log("ENV:", Bun.env.DATABASE_URL);
    throw new Error("DATABASE_URL not set in .env!")
}