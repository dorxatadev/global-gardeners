import { NextResponse } from "next/server";
import { createAuthedSupabaseClient } from "@/lib/supabase/authed-client";
import { resolveAuthenticatedRequest } from "@/lib/supabase/request-session";

type PostRow = {
  id: number;
  user_id: string;
  content: string | null;
  note: string | null;
  heart_count: number | null;
  created_at: string;
};

type PostPhotoRow = {
  post_id: number;
  photo_url: string;
  sort_order: number;
};

type CommentRow = {
  post_id: number;
};

type OwnProfileRow = {
  full_name: string | null;
  nickname: string | null;
  profile_photo_url: string | null;
};

function toTimeAgo(createdAt: string) {
  const date = new Date(createdAt);
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 60) return "just now";
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.floor(seconds / 86400);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function usernameFromUserId(userId: string) {
  return `gardener_${userId.replaceAll("-", "").slice(0, 8)}`;
}

function toNickname(fullName: string) {
  const normalized = fullName.trim().replace(/\s+/g, "").toLowerCase();
  return normalized ? `@${normalized}` : "";
}

export async function GET(request: Request) {
  const auth = await resolveAuthenticatedRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createAuthedSupabaseClient(auth.accessToken);

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("id, user_id, content, note, heart_count, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (postsError) {
    return NextResponse.json({ error: postsError.message }, { status: 400 });
  }

  const postRows = (posts ?? []) as PostRow[];
  const postIds = postRows.map((post) => post.id);

  const [{ data: photos }, { data: comments }, { data: ownProfile }, { data: authData }] = await Promise.all([
    postIds.length
      ? supabase
          .from("post_photos")
          .select("post_id, photo_url, sort_order")
          .in("post_id", postIds)
          .order("sort_order", { ascending: true })
      : Promise.resolve({ data: [] as PostPhotoRow[] }),
    postIds.length
      ? supabase.from("post_comments").select("post_id").in("post_id", postIds)
      : Promise.resolve({ data: [] as CommentRow[] }),
    supabase
      .from("profiles")
      .select("full_name, nickname, profile_photo_url")
      .eq("user_id", auth.userId)
      .maybeSingle(),
    supabase.auth.getUser(),
  ]);

  const photosByPostId = new Map<number, PostPhotoRow[]>();
  for (const photo of (photos ?? []) as PostPhotoRow[]) {
    const list = photosByPostId.get(photo.post_id) ?? [];
    list.push(photo);
    photosByPostId.set(photo.post_id, list);
  }

  const commentsCountByPostId = new Map<number, number>();
  for (const comment of (comments ?? []) as CommentRow[]) {
    commentsCountByPostId.set(comment.post_id, (commentsCountByPostId.get(comment.post_id) ?? 0) + 1);
  }

  const ownProfileRow = ownProfile as OwnProfileRow | null;
  const metadataName =
    typeof authData?.user?.user_metadata?.full_name === "string" ? authData.user.user_metadata.full_name.trim() : "";
  const emailName = authData?.user?.email?.split("@")[0]?.trim() ?? "";
  const fallbackFullName = metadataName || emailName || "Global Gardener";

  const ownName = ownProfileRow?.full_name?.trim() || fallbackFullName;
  const ownNickname = ownProfileRow?.nickname?.trim() || toNickname(ownName);
  const ownProfilePhotoUrl = ownProfileRow?.profile_photo_url?.trim() || null;

  const feed = postRows.map((post, index) => {
    const postPhotos = photosByPostId.get(post.id) ?? [];
    const firstPhoto = postPhotos[0];
    const caption = post.note?.trim() || post.content?.trim() || "Shared a new update.";
    const isOwnPost = post.user_id === auth.userId;

    return {
      id: `post-${post.id}`,
      source: isOwnPost ? "you" : index % 2 === 0 ? "following" : "interest",
      authorName: isOwnPost ? ownName : "Global Gardener",
      username: isOwnPost ? ownNickname.replace(/^@/, "") : usernameFromUserId(post.user_id),
      avatarUrl: isOwnPost ? ownProfilePhotoUrl : null,
      speciesName: undefined,
      mediaUrl: firstPhoto?.photo_url,
      mediaUrls: postPhotos.map((photo) => photo.photo_url),
      caption,
      hearts: Math.max(0, post.heart_count ?? 0),
      comments: commentsCountByPostId.get(post.id) ?? 0,
      publishedAgo: toTimeAgo(post.created_at),
    };
  });

  const response = NextResponse.json({ posts: feed });
  auth.applyRefreshedCookies(response);
  return response;
}
