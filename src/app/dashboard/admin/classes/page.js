"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock,
  Dumbbell,
  Eye,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../../../../lib/api";

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchClasses = async () => {
    try {
      const response = await api.get("/workouts/admin/all");

      setClasses(response.data.workouts || []);
    } catch (error) {
      console.error("Failed to load classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      setActionId(id);

      await api.patch(`/workouts/admin/${id}/status`, {
        status,
      });

      await fetchClasses();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update class status."
      );
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this class?"
    );

    if (!confirmed) return;

    try {
      setActionId(id);

      await api.delete(`/workouts/admin/${id}`);

      setClasses((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete class."
      );
    } finally {
      setActionId(null);
    }
  };

  const filteredClasses =
    filter === "all"
      ? classes
      : classes.filter((item) => item.status === filter);

  const pendingCount = classes.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = classes.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = classes.filter(
    (item) => item.status === "rejected"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          Back to Admin Dashboard
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-slate-950 px-7 py-9 shadow-xl md:px-10"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Administration
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Manage Classes
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
            Review trainer-submitted classes, approve or reject them, and
            manage the platform's workout content.
          </p>
        </motion.section>

        <section className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Clock size={19} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                  Pending
                </p>
                <p className="text-2xl font-extrabold text-slate-950">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Check size={19} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Approved
                </p>
                <p className="text-2xl font-extrabold text-slate-950">
                  {approvedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <X size={19} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                  Rejected
                </p>
                <p className="text-2xl font-extrabold text-slate-950">
                  {rejectedCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {["all", "pending", "approved", "rejected"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold capitalize transition ${
                  filter === item
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-2xl bg-white"
                />
              ))}
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Dumbbell size={28} />
              </div>

              <h2 className="mt-5 text-xl font-extrabold text-slate-950">
                No classes found
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                There are no classes available for this filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((item, index) => (
                <motion.article
                  key={item._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.05,
                  }}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex h-36 items-center justify-center bg-slate-900">
                    <Dumbbell size={42} className="text-emerald-400" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="line-clamp-1 text-xl font-extrabold text-slate-950">
                        {item.title}
                      </h2>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          item.status === "approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : item.status === "rejected"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.status || "pending"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-slate-600">
                      {item.category}
                    </p>

                    <div className="mt-5 space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Duration</span>
                        <span className="font-bold text-slate-900">
                          {item.duration} min
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Difficulty</span>
                        <span className="font-bold text-slate-900">
                          {item.difficulty}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Trainer ID</span>
                        <span className="max-w-32 truncate font-bold text-slate-900">
                          {item.userId}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-2">
                      <Link
                        href={`/workouts/${item._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye size={15} />
                        View
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        disabled={actionId === item._id}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>

                    {item.status === "pending" && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            handleStatus(item._id, "approved")
                          }
                          disabled={actionId === item._id}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <Check size={15} />
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleStatus(item._id, "rejected")
                          }
                          disabled={actionId === item._id}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                        >
                          <X size={15} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}