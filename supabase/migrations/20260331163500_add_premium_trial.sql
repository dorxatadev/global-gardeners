alter table public.profiles
add column if not exists premium_trial_started_at timestamptz,
add column if not exists premium_trial_ends_at timestamptz;

