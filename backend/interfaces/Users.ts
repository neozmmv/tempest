
export interface User {
    id?: string
    name: string
    email: string
    password: string
    profile_pic?: string
    created_at?: string
}

export interface LoginForm {
    email: string
    password: string
}