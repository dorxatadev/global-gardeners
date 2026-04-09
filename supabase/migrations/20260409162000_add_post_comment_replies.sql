alter table public.post_comments
add column if not exists parent_comment_id bigint references public.post_comments(id) on delete cascade;

create index if not exists post_comments_parent_comment_id_idx
on public.post_comments (parent_comment_id);
