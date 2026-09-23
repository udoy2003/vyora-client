"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Search,
  Sparkles,
  UserRound,
  Dumbbell,
} from "lucide-react";
import api from "../../../lib/api";

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const response = await api.get("/forum", {
          params: {
            search,
            page: currentPage,
            limit: 6,
          },
        });

        setPosts(response.data.data || []);

        setPagination(
          response.data.pagination || {
            page: 1,
            limit: 6,
            total: 0,
            totalPages: 1,
          }
        );

        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load forum posts"
        );
      } finally {
        setInitialLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, currentPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage((page) => page + 1);
    }
  };

  const getShortDescription = (description) => {
    if (!description) {
      return "Discover fitness tips, training ideas, and insights from the VYORA community.";
    }

    if (description.length <= 150) {
      return description;
    }

    return `${description.substring(0, 150)}...`;
  };

  if (initialLoading && posts.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400"></div>

            <p className="mt-5 text-sm font-medium text-slate-300">
              Loading forum...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && posts.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-400/20 bg-red-500/10 p-10 text-center">
          <p className="text-lg font-semibold text-red-300">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"></div>

        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-400">
              <Sparkles className="h-4 w-4" />
              VYORA Fitness Forum
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Learn.
              <span className="block text-emerald-400">
                Share. Grow.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
              Explore fitness knowledge, training tips, workout insights, and
              helpful discussions from the VYORA community.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
                <div className="rounded-xl bg-emerald-400/10 p-2">
                  <MessageCircle className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <p className="text-lg font-bold text-white">
                    {pagination.total}
                  </p>

                  <p className="text-xs font-medium text-slate-500">
                    Forum Posts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
                <div className="rounded-xl bg-cyan-400/10 p-2">
                  <Dumbbell className="h-5 w-5 text-cyan-400" />
                </div>

                <div>
                  <p className="text-lg font-bold text-white">VYORA</p>

                  <p className="text-xs font-medium text-slate-500">
                    Fitness Community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FORUM CONTENT
      ====================================================== */}

      <section className="bg-slate-100 px-6 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl">

          {/* Search */}

          <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
              <Search className="h-5 w-5 shrink-0 text-slate-600" />

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search forum posts..."
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Heading */}

          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                Community
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Explore the forum
              </h2>

              <p className="mt-3 text-slate-600">
                Learn from fitness discussions and insights shared by the
                VYORA community.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm sm:flex">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              VYORA Community
            </div>
          </div>

          {/* Empty */}

          {posts.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <MessageCircle className="h-8 w-8 text-slate-600" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                No forum posts found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-slate-600">
                Try searching with another keyword.
              </p>

              {search && (
                <button
                  onClick={clearSearch}
                  className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              {/* =====================================================
                  POST CARDS
              ====================================================== */}

              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post._id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    {/* Image */}

                    <div className="relative h-52 overflow-hidden bg-slate-900">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-slate-900 to-slate-950"></div>

                          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-2xl"></div>

                          <div className="absolute inset-0 flex items-center justify-center">
                            <MessageCircle className="h-14 w-14 text-emerald-400/60" />
                          </div>
                        </>
                      )}

                      <div className="absolute left-5 top-5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur-md">
                        FITNESS FORUM
                      </div>
                    </div>

                    {/* Content */}

                    <div className="p-6">
                      {/* Author */}

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                          <UserRound className="h-5 w-5 text-emerald-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {post.author?.name || "VYORA Member"}
                          </p>

                          <p className="text-xs font-medium capitalize text-slate-500">
                            {post.author?.role || "Community"}
                          </p>
                        </div>
                      </div>

                      {/* Title */}

                      <h3 className="mt-5 line-clamp-2 text-2xl font-black text-slate-900">
                        {post.title}
                      </h3>

                      {/* Description */}

                      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
                        {getShortDescription(post.description)}
                      </p>

                      {/* Stats */}

                      <div className="mt-6 flex items-center gap-3">
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-xs font-semibold text-slate-500">
                            Likes
                          </p>

                          <p className="mt-0.5 font-bold text-slate-900">
                            {post.likes?.length || 0}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-xs font-semibold text-slate-500">
                            Comments
                          </p>

                          <p className="mt-0.5 font-bold text-slate-900">
                            {post.commentCount || 0}
                          </p>
                        </div>
                      </div>

                      {/* Read More */}

                      <Link
                        href={`/forum/${post._id}`}
                        className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 group-hover:bg-emerald-600"
                      >
                        Read More

                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* =====================================================
                  PAGINATION
              ====================================================== */}

              {pagination.totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
                  <p className="text-sm font-semibold text-slate-600">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-bold text-white">
                      {currentPage}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === pagination.totalPages}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}