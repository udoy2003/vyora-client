"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  FileText,
  Sparkles,
} from "lucide-react";
import api from "../../../../../lib/api";

export default function CreateForumPostPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Please enter a post title.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter the post description.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/forum", {
        title: form.title.trim(),
        image: form.image.trim(),
        description: form.description.trim(),
      });

      router.push("/forum");
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to create forum post. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />

        <div className="relative mx-auto max-w-5xl px-6 py-16">
          <Link
            href="/forum"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-emerald-400"
          >
            <ArrowLeft size={18} />
            Back to Forum
          </Link>

          <div className="flex items-center gap-3 text-emerald-400">
            <Sparkles size={22} />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Community Forum
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Create a Forum Post
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Share fitness knowledge, training tips, announcements, or helpful
            advice with the VYORA community.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Post Title
              </label>

              <div className="relative">
                <FileText
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter your post title"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Image URL
                <span className="ml-2 font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <div className="relative">
                <ImageIcon
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Use a publicly accessible image URL.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={10}
                placeholder="Write your forum post here..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />

              <div className="mt-2 flex justify-end text-xs text-slate-400">
                {form.description.length} characters
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/forum"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={17} />

                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}