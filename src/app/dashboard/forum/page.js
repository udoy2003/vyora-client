"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  ArrowLeft,
  FileText,
} from "lucide-react";

import api from "../../../../lib/api";

export default function ForumManagementPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/forum/admin/all");

      console.log("ADMIN FORUM RESPONSE:", res.data);

      setPosts(res.data?.data || []);
    } catch (err) {
      console.error("Forum admin error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load forum posts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/forum/${id}`);

      setPosts((prev) =>
        prev.filter((post) => post._id !== id)
      );
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Failed to delete post."
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-emerald-400"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-emerald-400">
                <FileText size={20} />

                <span className="text-sm font-semibold uppercase tracking-wider">
                  Forum Management
                </span>
              </div>

              <h1 className="text-4xl font-bold">
                Manage Forum Posts
              </h1>

              <p className="mt-3 text-slate-400">
                Manage VYORA community forum posts.
              </p>
            </div>

            <Link
              href="/dashboard/forum/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Plus size={18} />
              Create Post
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">
              Loading forum posts...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <FileText
              size={40}
              className="mx-auto mb-4 text-slate-300"
            />

            <h2 className="text-xl font-semibold text-slate-800">
              No forum posts yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create your first forum post.
            </p>

            <Link
              href="/dashboard/forum/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Plus size={17} />
              Create Post
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Post
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                      Author
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-slate-500">
                      Likes
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-slate-500">
                      Comments
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {posts.map((post) => (
                    <tr
                      key={post._id}
                      className="hover:bg-slate-50"
                    >
                      {/* Post */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          {post.image ? (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="h-16 w-24 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-slate-100">
                              <FileText
                                size={22}
                                className="text-slate-400"
                              />
                            </div>
                          )}

                          <div className="max-w-md">
                            <h3 className="font-semibold text-slate-800">
                              {post.title}
                            </h3>

                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                              {post.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-slate-700">
                          {post.author?.name ||
                            post.authorName ||
                            "Unknown"}
                        </span>
                      </td>

                      {/* Likes */}
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                          <Heart
                            size={16}
                            className="text-rose-500"
                          />

                          {post.likes?.length || 0}
                        </span>
                      </td>

                      {/* Comments */}
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                          <MessageCircle
                            size={16}
                            className="text-emerald-500"
                          />

                          {post.commentCount || 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/forum/${post._id}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                            title="View"
                          >
                            <Eye size={17} />
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(post._id)
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}