import { Hono, Context } from "hono";
import type { LoginForm, User } from "./interfaces/Users";

const app = new Hono()

app.get("/", (c) => {
    return c.json({})
})

app.post("/login", async (c: Context) => {
    let errors: string[] = [] 
    const body = await c.req.json() as LoginForm;

    if(!body.email) {
        errors.push("Email necessario para busca")
    }

    if(!body.password) {
        errors.push("Senha necessaria para busca")
    }

    // buscar usuario
    const res = await fetch(`http://localhost:3245/users?email=eq.${body.email}`)
    const users = await res.json() as User[]
    const user = users[0]!
    const isValid = await Bun.password.verify(body.password, user.password)

    if(errors.length != 0) {
        return c.json({errors})
    }
    
    // checagem dos hashes
    if (isValid) {
        // LOGICA DO TOKEN JWT / COOKIE
        return c.json({user}, 200)
    } else {
        return c.json({ok: false}, 401)
    }
})

// rota de sign up
app.post("/signUp", async (c) => {
    const body = await c.req.json() as User;
    const hash = await Bun.password.hash(body.password, {algorithm: "bcrypt", cost: 10})
    body.password = hash
    const res = await fetch("http://localhost:3245/users", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    })
    // 201 CREATED
    if(res.status != 201) {
        const err = await res.json()
        return c.json(err, 400)
    }


    return c.json({ok: true}, 201)
})

export default { 
    port: 3000, 
    fetch: app.fetch, 
} 