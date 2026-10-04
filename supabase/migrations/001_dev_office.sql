create table if not exists public.dev_office_events(
 id uuid primary key default gen_random_uuid(),
 source text not null check(source in('codex','github','vercel','demo')),
 worker_id text not null,
 worker_name text not null,
 role text not null,
 state text not null check(state in('IDLE','READING','CODING','TESTING','REVIEWING','BLOCKED','DONE')),
 message text not null,
 task text,
 created_at timestamptz not null default now()
);
create index if not exists dev_office_events_created_at_idx on public.dev_office_events(created_at desc);
alter table public.dev_office_events enable row level security;
revoke all on public.dev_office_events from anon, authenticated;