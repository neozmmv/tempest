import { Hono } from "hono";
import type { Users } from "./interfaces/Users";

const app = new Hono()

app.get("/", (c) => {
    return c.json({})
})

// rota de sign up
app.post("/signUp", async (c) => {
    const body = await c.req.json() as Users;
    const hash = await Bun.password.hash(body.password, {algorithm: "bcrypt", cost: 10})
    body.password = hash
    const res = await fetch("http://localhost:3245/users", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    })
    const a = await res.json();


    return c.json({ok: true}, 201)
})

export default { 
    port: 3000, 
    fetch: app.fetch, 
} 