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
  const { data: targetComment, error: findError } = await supabase
    .from("post_comments")
    .select("id")
    .eq("id", normalizedCommentId)
    .eq("post_id", normalizedPostId)
    .eq("user_id", auth.userId)
    .maybeSingle();

  if (findError || !targetComment) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  const { error: deleteError } = await supabase
    .from("post_comments")
    .delete()
    .eq("id", normalizedCommentId)
    .eq("post_id", normalizedPostId)
    .eq("user_id", auth.userId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  const { data: post } = await supabase
    .from("posts")
    .select("comment_count")
    .eq("id", normalizedPostId)
    .maybeSingle();

  const response = NextResponse.json({
    deleted: true,
    totalCount: Math.max(0, post?.comment_count ?? 0),
  });
  auth.applyRefreshedCookies(response);
  return response;
}
