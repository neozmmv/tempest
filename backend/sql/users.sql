create table if not exists users(
    id uuid default gen_random_uuid() primary key,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    profile_pic text,
    created_at timestamptz not null default now()
);