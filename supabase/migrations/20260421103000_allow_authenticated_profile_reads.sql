-- Feed and comments need to resolve author names for other users.
-- Allow authenticated users to read profiles while keeping write access owner-only.
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_authenticated" on public.profiles;

create policy "profiles_select_authenticated"
on public.profiles
for select
to authenticated
using (true);
