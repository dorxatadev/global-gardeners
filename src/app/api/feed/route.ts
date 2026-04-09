import { NextResponse } from "next/server";
import { createAuthedSupabaseClient } from "@/lib/supabase/authed-client";
import { resolveAuthenticatedRequest } from "@/lib/supabase/request-session";

type PostRow = {
  id: number;
  user_id: string;
  content: string | null;
  note: string | null;
  heart_count: number | null;
  comment_count: number | null;
  created_at: string;
};

type PostPhotoRow = {
  post_id: number;
  photo_url: string;
  sort_order: number;
};

type PostHeartRow = {
  post_id: number;
  user_id: string;
};

type OwnProfileRow = {
  user_id?: string;
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

  const postsQuery = await supabase
    .from("posts")
    .select("id, user_id, content, note, heart_count, comment_count, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  let postRows: PostRow[] = [];
  if (!postsQuery.error) {
    postRows = (postsQuery.data ?? []) as PostRow[];
  } else {
    const fallbackQuery = await supabase
      .from("posts")
      .select("id, user_id, content, note, heart_count, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (fallbackQuery.error) {
      return NextResponse.json({ error: fallbackQuery.error.message }, { status: 400 });
    }

    postRows = ((fallbackQuery.data ?? []) as Omit<PostRow, "comment_count">[]).map((post) => ({
      ...post,
      comment_count: null,
    }));
  }
  const postIds = postRows.map((post) => post.id);

  const postUserIds = [...new Set(postRows.map((post) => post.user_id))];

  const [{ data: photos }, { data: authorProfiles }, commentsFallbackResult, postHeartsResult, { data: authUserData }] = await Promise.all([
    postIds.length
      ? supabase
          .from("post_photos")
          .select("post_id, photo_url, sort_order")
          .in("post_id", postIds)
          .order("sort_order", { ascending: true })
      : Promise.resolve({ data: [] as PostPhotoRow[] }),
    postUserIds.length
      ? supabase
          .from("profiles")
          .select("user_id, full_name, nickname, profile_photo_url")
          .in("user_id", postUserIds)
      : Promise.resolve({ data: [] as OwnProfileRow[] }),
    postIds.length && postRows.some((post) => post.comment_count == null)
      ? supabase.from("post_comments").select("post_id").in("post_id", postIds)
      : Promise.resolve({ data: [] as { post_id: number }[] }),
    postIds.length
      ? supabase.from("post_hearts").select("post_id, user_id").in("post_id", postIds)
      : Promise.resolve({ data: [] as PostHeartRow[] }),
    supabase.auth.getUser(),
  ]);

  const photosByPostId = new Map<number, PostPhotoRow[]>();
  for (const photo of (photos ?? []) as PostPhotoRow[]) {
    const list = photosByPostId.get(photo.post_id) ?? [];
    list.push(photo);
    photosByPostId.set(photo.post_id, list);
  }
  const commentsCountByPostId = new Map<number, number>();
  for (const comment of (commentsFallbackResult.data ?? []) as { post_id: number }[]) {
    commentsCountByPostId.set(comment.post_id, (commentsCountByPostId.get(comment.post_id) ?? 0) + 1);
  }
  const heartsCountByPostId = new Map<number, number>();
  const likedPostIdsByMe = new Set<number>();
  for (const heart of (postHeartsResult.data ?? []) as PostHeartRow[]) {
    heartsCountByPostId.set(heart.post_id, (heartsCountByPostId.get(heart.post_id) ?? 0) + 1);
    if (heart.user_id === auth.userId) {
      likedPostIdsByMe.add(heart.post_id);
    }
  }

  const profilesByUserId = new Map<string, OwnProfileRow>();
  for (const profile of (authorProfiles ?? []) as OwnProfileRow[]) {
    if (typeof profile.user_id === "string") {
      profilesByUserId.set(profile.user_id, profile);
    }
  }

  const ownProfileRow = profilesByUserId.get(auth.userId) ?? null;
  const metadataName =
    typeof authUserData?.user?.user_metadata?.full_name === "string"
      ? authUserData.user.user_metadata.full_name.trim()
      : "";
  const emailName = authUserData?.user?.email?.split("@")[0]?.trim() ?? "";
  const ownFallbackName = metadataName || emailName || "Global Gardener";
  const ownFallbackNickname = ownFallbackName ? toNickname(ownFallbackName) : "";
  const ownName = ownProfileRow?.full_name?.trim() || ownFallbackName;
  const ownNickname = ownProfileRow?.nickname?.trim() || ownFallbackNickname;
  const ownAvatarUrl = ownProfileRow?.profile_photo_url?.trim() || null;
  const fallbackFullName = "Global Gardener";

  const feed = postRows.map((post, index) => {
    const postPhotos = photosByPostId.get(post.id) ?? [];
    const firstPhoto = postPhotos[0];
    const caption = post.note?.trim() || post.content?.trim() || "Shared a new update.";
    const isOwnPost = post.user_id === auth.userId;
    const authorProfile = profilesByUserId.get(post.user_id);
    const authorName = isOwnPost
      ? ownName
      : authorProfile?.full_name?.trim() || fallbackFullName;
    const authorNickname = isOwnPost
      ? ownNickname || toNickname(authorName)
      : authorProfile?.nickname?.trim() || toNickname(authorName);
    const authorProfilePhotoUrl = isOwnPost
      ? ownAvatarUrl
      : authorProfile?.profile_photo_url?.trim() || null;

    return {
      id: `post-${post.id}`,
      source: isOwnPost ? "you" : index % 2 === 0 ? "following" : "interest",
      authorName: authorName,
      username: authorNickname ? authorNickname.replace(/^@/, "") : usernameFromUserId(post.user_id),
      avatarUrl: authorProfilePhotoUrl,
      speciesName: undefined,
      mediaUrl: firstPhoto?.photo_url,
      mediaUrls: postPhotos.map((photo) => photo.photo_url),
      caption,
      hearts: Math.max(0, heartsCountByPostId.get(post.id) ?? post.heart_count ?? 0),
      likedByMe: likedPostIdsByMe.has(post.id),
      comments: Math.max(0, post.comment_count ?? commentsCountByPostId.get(post.id) ?? 0),
      publishedAgo: toTimeAgo(post.created_at),
    };
  });

  const response = NextResponse.json({ posts: feed });
  auth.applyRefreshedCookies(response);
  return response;
}
