import { NextResponse } from "next/server";
import { createAuthedSupabaseClient } from "@/lib/supabase/authed-client";
import { resolveAuthenticatedRequest } from "@/lib/supabase/request-session";

type Params = {
  params: Promise<{
    postId: string;
    commentId: string;
  }>;
};

function parseId(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

async function getCommentHeartCount(supabase: ReturnType<typeof createAuthedSupabaseClient>, commentId: number) {
  const { count } = await supabase
    .from("comment_hearts")
    .select("id", { count: "exact", head: true })
    .eq("comment_id", commentId);

  return Math.max(0, count ?? 0);
}

export async function POST(request: Request, context: Params) {
  const auth = await resolveAuthenticatedRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { postId, commentId } = await context.params;
  const normalizedPostId = parseId(postId);
  const normalizedCommentId = parseId(commentId);
  if (!normalizedPostId || !normalizedCommentId) {
    return NextResponse.json({ error: "Invalid ids." }, { status: 400 });
  }

  const supabase = createAuthedSupabaseClient(auth.accessToken);
  const { data: comment } = await supabase
    .from("post_comments")
    .select("id")
    .eq("id", normalizedCommentId)
    .eq("post_id", normalizedPostId)
    .maybeSingle();
  if (!comment) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  const { error: insertError } = await supabase.from("comment_hearts").insert({
    comment_id: normalizedCommentId,
    user_id: auth.userId,
  });
  if (insertError && insertError.code !== "23505") {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  const response = NextResponse.json({
    likedByMe: true,
    heartCount: await getCommentHeartCount(supabase, normalizedCommentId),
  });
  auth.applyRefreshedCookies(response);
  return response;
}

export async function DELETE(request: Request, context: Params) {
  const auth = await resolveAuthenticatedRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { postId, commentId } = await context.params;
  const normalizedPostId = parseId(postId);
  const normalizedCommentId = parseId(commentId);
  if (!normalizedPostId || !normalizedCommentId) {
    return NextResponse.json({ error: "Invalid ids." }, { status: 400 });
  }

  const supabase = createAuthedSupabaseClient(auth.accessToken);
  const { data: comment } = await supabase
    .from("post_comments")
    .select("id")
    .eq("id", normalizedCommentId)
    .eq("post_id", normalizedPostId)
    .maybeSingle();
  if (!comment) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  const { error: deleteError } = await supabase
    .from("comment_hearts")
    .delete()
    .eq("comment_id", normalizedCommentId)
    .eq("user_id", auth.userId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  const response = NextResponse.json({
    likedByMe: false,
    heartCount: await getCommentHeartCount(supabase, normalizedCommentId),
  });
  auth.applyRefreshedCookies(response);
  return response;
}
