alter table public.posts
add column if not exists comment_count integer not null default 0;

update public.posts p
set comment_count = coalesce(c.comment_count, 0)
from (
  select post_id, count(*)::integer as comment_count
  from public.post_comments
  group by post_id
) c
where p.id = c.post_id;

update public.posts
set comment_count = 0
where comment_count is null;

create or replace function public.sync_post_comment_count()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update public.posts
    set comment_count = greatest(0, coalesce(comment_count, 0) + 1)
    where id = new.post_id;
    return new;
  end if;

  if tg_op = 'DELETE' then
    update public.posts
    set comment_count = greatest(0, coalesce(comment_count, 0) - 1)
    where id = old.post_id;
    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists trg_sync_post_comment_count on public.post_comments;

create trigger trg_sync_post_comment_count
after insert or delete on public.post_comments
for each row execute function public.sync_post_comment_count();
