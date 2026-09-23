"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  ThumbsDown,
  MessageCircle,
  Send,
  Pencil,
  Trash2,
  UserRound,
  Sparkles,
  Reply,
} from "lucide-react";

import api from "../../../../lib/api";

export default function ForumDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const postId = params?.id;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comment, setComment] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  /* =========================================================
     CURRENT USER
  ========================================================= */

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user") ||
        localStorage.getItem("userInfo");

      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error(
        "Failed to read user from localStorage:",
        error
      );
    }
  }, []);

  /* =========================================================
     FETCH POST
  ========================================================= */

  const fetchPost = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/forum/${postId}`);

      setPost(response.data.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        router.push(`/login?redirect=/forum/${postId}`);
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load forum post"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  /* =========================================================
     LIKE
  ========================================================= */

  const handleLike = async () => {
    try {
      await api.post(`/forum/${postId}/like`);
      await fetchPost();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to like this post"
      );
    }
  };

  /* =========================================================
     DISLIKE
  ========================================================= */

  const handleDislike = async () => {
    try {
      await api.post(`/forum/${postId}/dislike`);
      await fetchPost();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to dislike this post"
      );
    }
  };

  /* =========================================================
     ADD COMMENT
  ========================================================= */

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      setSubmitting(true);

      await api.post(`/forum/${postId}/comments`, {
        content: comment.trim(),
      });

      setComment("");

      await fetchPost();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to add comment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     ADD REPLY
  ========================================================= */

  const handleAddReply = async (parentId) => {
    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);

      await api.post(`/forum/${postId}/comments`, {
        content: replyContent.trim(),
        parentId,
      });

      setReplyContent("");
      setReplyingTo(null);

      await fetchPost();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to add reply"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     EDIT COMMENT
  ========================================================= */

  const startEditing = (item) => {
    setEditingCommentId(item._id);
    setEditingContent(item.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleEditComment = async (commentId) => {
    if (!editingContent.trim()) return;

    try {
      setSubmitting(true);

      await api.put(`/forum/comments/${commentId}`, {
        content: editingContent.trim(),
      });

      cancelEditing();

      await fetchPost();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update comment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     DELETE COMMENT
  ========================================================= */

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/forum/comments/${commentId}`);

      await fetchPost();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete comment"
      );
    }
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const currentUserId =
    currentUser?._id ||
    currentUser?.id ||
    currentUser?.userId ||
    null;

  const isCommentOwner = (item) => {
    if (!currentUserId || !item?.userId) {
      return false;
    }

    return (
      item.userId.toString() ===
      currentUserId.toString()
    );
  };

  const isAdmin = currentUser?.role === "admin";

  const getReplies = (parentId) => {
    return (
      post?.comments?.filter(
        (item) =>
          item.parentId?.toString() ===
          parentId?.toString()
      ) || []
    );
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" />

            <p className="mt-5 text-sm font-medium text-slate-300">
              Loading forum post...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !post) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-400/20 bg-red-500/10 p-10 text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-red-300" />

          <p className="mt-5 text-lg font-semibold text-red-300">
            {error || "Forum post not found"}
          </p>

          <Link
            href="/forum"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================================
     COMMENTS
  ========================================================= */

  const topLevelComments =
    post.comments?.filter((item) => !item.parentId) || [];

  return (
    <main className="min-h-screen bg-slate-950">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-12 sm:py-16">
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Link>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10">
              <UserRound className="h-5 w-5 text-emerald-400" />
            </div>

            <div>
              <p className="font-bold text-white">
                {post.author?.name || "VYORA Member"}
              </p>

              <p className="text-sm capitalize text-slate-400">
                {post.author?.role || "Community"} •{" "}
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          <h1 className="mt-7 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            {post.title}
          </h1>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="bg-slate-100 px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          {/* POST */}

          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {post.image && (
              <div className="h-64 overflow-hidden bg-slate-900 sm:h-96">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="p-6 sm:p-10">
              <div className="mb-8 flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                  <Sparkles className="h-4 w-4" />
                  FITNESS FORUM
                </span>
              </div>

              <div className="whitespace-pre-wrap text-base leading-8 text-slate-700">
                {post.description}
              </div>

              {/* REACTIONS */}

              <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Heart className="h-5 w-5" />
                  Like

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                    {post.likes?.length || 0}
                  </span>
                </button>

                <button
                  onClick={handleDislike}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-red-400 hover:bg-red-50 hover:text-red-700"
                >
                  <ThumbsDown className="h-5 w-5" />
                  Dislike

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                    {post.dislikes?.length || 0}
                  </span>
                </button>

                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-slate-600">
                  <MessageCircle className="h-5 w-5" />
                  {post.comments?.length || 0} Comments
                </div>
              </div>
            </div>
          </article>

          {/* =================================================
              COMMENTS
          ================================================== */}

          <section className="mt-10">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                Discussion
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Comments
              </h2>

              <p className="mt-2 text-slate-600">
                Join the conversation and share your thoughts.
              </p>
            </div>

            {/* ADD COMMENT */}

            <form
              onSubmit={handleAddComment}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                  Post Comment
                </button>
              </div>
            </form>

            {/* COMMENTS LIST */}

            <div className="mt-8 space-y-5">
              {topLevelComments.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
                  <MessageCircle className="mx-auto h-10 w-10 text-slate-400" />

                  <h3 className="mt-4 text-xl font-bold text-slate-900">
                    No comments yet
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Be the first person to join the discussion.
                  </p>
                </div>
              ) : (
                topLevelComments.map((item) => (
                  <CommentCard
                    key={item._id}
                    item={item}
                    replies={getReplies(item._id)}
                    isOwner={isCommentOwner(item)}
                    isAdmin={isAdmin}
                    editingCommentId={editingCommentId}
                    editingContent={editingContent}
                    setEditingContent={setEditingContent}
                    startEditing={startEditing}
                    cancelEditing={cancelEditing}
                    handleEditComment={handleEditComment}
                    handleDeleteComment={handleDeleteComment}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    replyContent={replyContent}
                    setReplyContent={setReplyContent}
                    handleAddReply={handleAddReply}
                    submitting={submitting}
                    formatDate={formatDate}
                    currentUserId={currentUserId}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   COMMENT COMPONENT
========================================================= */

function CommentCard({
  item,
  replies,
  isOwner,
  isAdmin,
  editingCommentId,
  editingContent,
  setEditingContent,
  startEditing,
  cancelEditing,
  handleEditComment,
  handleDeleteComment,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  handleAddReply,
  submitting,
  formatDate,
  currentUserId,
}) {
  const isEditing = editingCommentId === item._id;
  const isReplying = replyingTo === item._id;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50">
          <UserRound className="h-5 w-5 text-emerald-600" />
        </div>

        <div className="min-w-0 flex-1">
          {/* USER */}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900">
                {item.user?.name || "VYORA Member"}
              </p>

              <p className="text-xs text-slate-500">
                {item.user?.role || "Member"} •{" "}
                {formatDate(item.createdAt)}
              </p>
            </div>
          </div>

          {/* EDIT */}

          {isEditing ? (
            <div className="mt-4">
              <textarea
                value={editingContent}
                onChange={(e) =>
                  setEditingContent(e.target.value)
                }
                rows={3}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
              />

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() =>
                    handleEditComment(item._id)
                  }
                  disabled={
                    submitting || !editingContent.trim()
                  }
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40"
                >
                  Save
                </button>

                <button
                  onClick={cancelEditing}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {item.content}
            </p>
          )}

          {/* ACTIONS */}

          {!isEditing && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={() =>
                  setReplyingTo(
                    isReplying ? null : item._id
                  )
                }
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <Reply className="h-4 w-4" />
                Reply
              </button>

              {isOwner && (
                <button
                  onClick={() => startEditing(item)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
              )}

              {(isOwner || isAdmin) && (
                <button
                  onClick={() =>
                    handleDeleteComment(item._id)
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          )}

          {/* REPLY FORM */}

          {isReplying && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <textarea
                value={replyContent}
                onChange={(e) =>
                  setReplyContent(e.target.value)
                }
                placeholder="Write a reply..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
              />

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() =>
                    handleAddReply(item._id)
                  }
                  disabled={
                    submitting || !replyContent.trim()
                  }
                  className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                  Reply
                </button>

                <button
                  onClick={() => setReplyingTo(null)}
                  className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* REPLIES */}

          {replies.length > 0 && (
            <div className="mt-5 space-y-4 border-l-2 border-emerald-100 pl-5">
              {replies.map((reply) => (
                <ReplyCard
                  key={reply._id}
                  item={reply}
                  isOwner={
                    currentUserId &&
                    reply.userId?.toString() ===
                      currentUserId.toString()
                  }
                  isAdmin={isAdmin}
                  editingCommentId={editingCommentId}
                  editingContent={editingContent}
                  setEditingContent={setEditingContent}
                  startEditing={startEditing}
                  cancelEditing={cancelEditing}
                  handleEditComment={handleEditComment}
                  handleDeleteComment={handleDeleteComment}
                  submitting={submitting}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REPLY COMPONENT
========================================================= */

function ReplyCard({
  item,
  isOwner,
  isAdmin,
  editingCommentId,
  editingContent,
  setEditingContent,
  startEditing,
  cancelEditing,
  handleEditComment,
  handleDeleteComment,
  submitting,
  formatDate,
}) {
  const isEditing = editingCommentId === item._id;

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
          <UserRound className="h-4 w-4 text-emerald-600" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">
            {item.user?.name || "VYORA Member"}
          </p>

          <p className="text-xs text-slate-500">
            {item.user?.role || "Member"} •{" "}
            {formatDate(item.createdAt)}
          </p>

          {isEditing ? (
            <div className="mt-3">
              <textarea
                value={editingContent}
                onChange={(e) =>
                  setEditingContent(e.target.value)
                }
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
              />

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() =>
                    handleEditComment(item._id)
                  }
                  disabled={
                    submitting || !editingContent.trim()
                  }
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-40"
                >
                  Save
                </button>

                <button
                  onClick={cancelEditing}
                  className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {item.content}
            </p>
          )}

          {!isEditing && (
            <div className="mt-3 flex gap-2">
              {isOwner && (
                <button
                  onClick={() => startEditing(item)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-900"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}

              {(isOwner || isAdmin) && (
                <button
                  onClick={() =>
                    handleDeleteComment(item._id)
                  }
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}