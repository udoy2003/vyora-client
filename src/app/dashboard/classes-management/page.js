"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  Dumbbell,
  Clock3,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/workouts/admin/all`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load classes"
        );
      }

      setClasses(data.workouts || []);
    } catch (err) {
      console.error("Load admin classes error:", err);

      setError(
        err.message || "Failed to load classes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const updateStatus = async (workout, status) => {
    const action =
      status === "approved"
        ? "approve"
        : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${workout.title}"?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(workout._id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/workouts/admin/${workout._id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update class status"
        );
      }

      setClasses((prev) =>
        prev.map((item) =>
          item._id === workout._id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      setMessage(
        `Class ${status} successfully.`
      );
    } catch (err) {
      console.error(
        "Update class status error:",
        err
      );

      setError(
        err.message ||
          "Failed to update class status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteClass = async (workout) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${workout.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(workout._id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/workouts/admin/${workout._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete class"
        );
      }

      setClasses((prev) =>
        prev.filter(
          (item) => item._id !== workout._id
        )
      );

      setMessage("Class deleted successfully.");
    } catch (err) {
      console.error(
        "Delete admin class error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete class"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const statusStyle = (status) => {
    if (status === "approved") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  const pendingCount = classes.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = classes.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = classes.filter(
    (item) => item.status === "rejected"
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Admin Dashboard
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Class Management
            </h1>

            <p className="mt-4 text-slate-400">
              Review and manage trainer classes.
            </p>
          </div>
        </section>

        <div className="flex min-h-[350px] items-center justify-center">
          <div className="text-center">
            <RefreshCw
              size={32}
              className="mx-auto animate-spin text-emerald-500"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading classes...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Admin Dashboard
          </p>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold md:text-5xl">
                Class Management
              </h1>

              <p className="mt-4 max-w-2xl text-slate-400">
                Review, approve, reject and manage
                trainer classes.
              </p>
            </div>

            <button
              onClick={loadClasses}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold transition hover:border-emerald-500 hover:text-emerald-400"
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Classes
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {classes.length}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Approved
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Rejected
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {rejectedCount}
            </p>
          </div>
        </div>

        {classes.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Dumbbell size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No Classes Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no trainer classes.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Class
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Duration
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Difficulty
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {classes.map((workout) => {
                    const isUpdating =
                      updatingId === workout._id;

                    const isDeleting =
                      deletingId === workout._id;

                    return (
                      <tr
                        key={workout._id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {workout.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Trainer ID:{" "}
                              {workout.userId}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                            {workout.category}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                            <Clock3 size={15} />
                            {workout.duration} min
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {workout.difficulty}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusStyle(
                              workout.status
                            )}`}
                          >
                            {workout.status ||
                              "pending"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            {workout.status !==
                              "approved" && (
                              <button
                                onClick={() =>
                                  updateStatus(
                                    workout,
                                    "approved"
                                  )
                                }
                                disabled={
                                  isUpdating ||
                                  isDeleting
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                              >
                                <CheckCircle2
                                  size={15}
                                />
                                Approve
                              </button>
                            )}

                            {workout.status !==
                              "rejected" && (
                              <button
                                onClick={() =>
                                  updateStatus(
                                    workout,
                                    "rejected"
                                  )
                                }
                                disabled={
                                  isUpdating ||
                                  isDeleting
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                              >
                                <XCircle
                                  size={15}
                                />
                                Reject
                              </button>
                            )}

                            <button
                              onClick={() =>
                                deleteClass(workout)
                              }
                              disabled={
                                isUpdating ||
                                isDeleting
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                            >
                              <Trash2 size={15} />

                              {isDeleting
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}