alter table public.profiles
  add column if not exists user_settings jsonb not null default '{}'::jsonb;

