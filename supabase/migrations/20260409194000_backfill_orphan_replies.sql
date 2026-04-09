-- Backfill likely orphaned replies created before parent_comment_id was available.
-- Heuristic: comments containing "reply" with no parent are attached to the nearest previous
-- top-level comment in the same post within a short time window.

with reply_like_comments as (
  select c.id, c.post_id, c.created_at
  from public.post_comments c
  where c.parent_comment_id is null
    and c.comment_text ~* '\\breply\\b'
),
nearest_parent as (
  select
    r.id as orphan_comment_id,
    p.id as parent_comment_id,
    row_number() over (
      partition by r.id
      order by p.created_at desc, p.id desc
    ) as rn
  from reply_like_comments r
  join public.post_comments p
    on p.post_id = r.post_id
   and p.id <> r.id
   and p.parent_comment_id is null
   and p.created_at <= r.created_at
   and r.created_at - p.created_at <= interval '2 hours'
)
update public.post_comments c
set parent_comment_id = np.parent_comment_id
from nearest_parent np
where c.id = np.orphan_comment_id
  and np.rn = 1
  and c.parent_comment_id is null;
