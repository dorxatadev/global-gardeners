create or replace function public.normalize_profile_nickname(name text)
returns text
language sql
immutable
as $$
  select case
    when coalesce(trim(name), '') = '' then ''
    else '@' || lower(regexp_replace(trim(name), '\s+', '', 'g'))
  end
$$;

create or replace function public.set_profile_nickname()
returns trigger
language plpgsql
as $$
begin
  new.nickname = public.normalize_profile_nickname(new.full_name);
  return new;
end;
$$;

update public.profiles
set nickname = public.normalize_profile_nickname(full_name);
