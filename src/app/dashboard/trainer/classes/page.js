"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Dumbbell,
  Edit,
  Eye,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../../../../lib/api";

export default function TrainerClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get("/workouts");
        setClasses(response.data.workouts || []);
      } catch (error) {
        console.error("Failed to load classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api.delete(`/workouts/${id}`);

      setClasses((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete the class. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/dashboard/trainer"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
          >
            <ArrowLeft size={17} />
            Back to Trainer Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Trainer Panel
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
                My Classes
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                Manage your workout classes, update class information, and
                remove classes you no longer need.
              </p>
            </div>

            <Link
              href="/workouts/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
            >
              <Plus size={18} />
              Create Class
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-44 bg-slate-200" />

                <div className="space-y-3 p-6">
                  <div className="h-5 w-3/4 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Dumbbell size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
              No classes yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              You have not created any workout classes yet. Create your first
              class and start building your training library.
            </p>

            <Link
              href="/workouts/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <Plus size={18} />
              Create Your First Class
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((item, index) => (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative flex h-44 items-center justify-center bg-slate-900">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || "Workout class"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Dumbbell size={46} className="text-emerald-400" />
                  )}

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm">
                      {item.category || "Workout"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="line-clamp-1 text-xl font-extrabold text-slate-950">
                    {item.title || item.name || "Untitled Class"}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {item.description || "No description available."}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={15} />
                        <span className="text-xs font-semibold">
                          Duration
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {item.duration || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-slate-500">
                        <CalendarDays size={15} />
                        <span className="text-xs font-semibold">
                          Level
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-bold capitalize text-slate-900">
                        {item.level || item.difficulty || "All Level"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <Link
                      href={`/workouts/${item._id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <Eye size={15} />
                      View
                    </Link>

                    <Link
                      href={`/workouts/${item._id}/edit`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                    >
                      <Edit size={15} />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                      {deletingId === item._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}