alter table public.profiles
  add column if not exists profile_photo_url text,
  add column if not exists nickname text;

update public.profiles
set nickname = '@' || trim(full_name)
where coalesce(trim(nickname), '') = ''
  and coalesce(trim(full_name), '') <> '';

alter table public.profiles
  alter column nickname set not null,
  alter column nickname set default '';

create or replace function public.set_profile_nickname()
returns trigger
language plpgsql
as $$
begin
  if coalesce(trim(new.full_name), '') = '' then
    new.nickname = '';
  else
    new.nickname = '@' || trim(new.full_name);
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_set_nickname on public.profiles;
create trigger profiles_set_nickname
before insert or update of full_name
on public.profiles
for each row
execute function public.set_profile_nickname();
