create table if not exists "user" (
  id text primary key,
  email text not null unique,
  name text,
  role text,
  password_hash text not null,
  created_at timestamptz not null default now(),
  constraint user_role_check check (role is null or role in ('admin', 'super_admin', 'owner'))
);

create index if not exists user_email_lower_idx on "user" (lower(email));

create table if not exists "session" (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists session_token_idx on "session" (token);
create index if not exists session_user_id_idx on "session" (user_id);