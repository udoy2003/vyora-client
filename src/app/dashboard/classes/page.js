
"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  Dumbbell,
  Clock3,
  CheckCircle2,
  CircleAlert,
  Layers3,
} from "lucide-react";

const API_URL = "http://localhost:5000";

const emptyForm = {
  title: "",
  category: "",
  duration: "",
  difficulty: "",
  exercises: "",
};

export default function TrainerClassesPage() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/workouts`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load classes");
      }

      setClasses(data.workouts || []);
    } catch (err) {
      console.error("Load classes error:", err);
      setError(err.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const openEditForm = (workout) => {
    setEditingId(workout._id);

    setForm({
      title: workout.title || "",
      category: workout.category || "",
      duration: workout.duration || "",
      difficulty: workout.difficulty || "",
      exercises: Array.isArray(workout.exercises)
        ? workout.exercises.join("\n")
        : "",
    });

    setError("");
    setMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !form.title.trim() ||
      !form.category.trim() ||
      !form.duration ||
      !form.difficulty
    ) {
      setError(
        "Title, category, duration and difficulty are required."
      );
      return;
    }

    const exercises = form.exercises
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      setSaving(true);

      const isEditing = Boolean(editingId);

      const url = isEditing
        ? `${API_URL}/api/workouts/${editingId}`
        : `${API_URL}/api/workouts`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category.trim(),
          duration: Number(form.duration),
          difficulty: form.difficulty,
          exercises,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save class");
      }

      setMessage(
        isEditing
          ? "Class updated successfully and sent for Admin approval."
          : "Class created successfully and sent for Admin approval."
      );

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadClasses();
    } catch (err) {
      console.error("Save class error:", err);
      setError(err.message || "Failed to save class");
    } finally {
      setSaving(false);
    }
  };

  const deleteClass = async (workout) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${workout.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(workout._id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/workouts/${workout._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete class");
      }

      setClasses((prev) =>
        prev.filter((item) => item._id !== workout._id)
      );

      setMessage("Class deleted successfully.");
    } catch (err) {
      console.error("Delete class error:", err);
      setError(err.message || "Failed to delete class");
    } finally {
      setDeletingId(null);
    }
  };

  const statusStyle = (status) => {
    if (status === "approved") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (status === "rejected") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-amber-200 bg-amber-50 text-amber-700";
  };

  const difficultyStyle = (difficulty) => {
    if (difficulty === "Beginner") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (difficulty === "Advanced") {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
            <div className="animate-pulse">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="mt-4 h-10 w-64 rounded-lg bg-slate-200" />
              <div className="mt-4 h-5 w-96 max-w-full rounded bg-slate-100" />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <Dumbbell size={14} />
                Trainer Dashboard
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                My Classes
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Create, edit and manage your fitness classes from one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={loadClasses}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <RefreshCw size={17} />
                Refresh
              </button>

              <button
                onClick={openCreateForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/15 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl"
              >
                <Plus size={18} />
                Create Class
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <CircleAlert className="mt-0.5 shrink-0" size={18} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
            <span>{message}</span>
          </div>
        )}

        {showForm && (
          <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-6 md:px-8">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-600">
                  <Dumbbell size={16} />
                  {editingId ? "Edit Class" : "New Class"}
                </div>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  {editingId
                    ? "Update your class"
                    : "Create a new class"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Fill in the details below and submit your class for approval.
                </p>
              </div>

              <button
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl border border-slate-200 p-2.5 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Class Title
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Full Body Strength"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Category
                  </label>

                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Strength Training"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Duration
                  </label>

                  <div className="relative">
                    <Clock3
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="duration"
                      type="number"
                      min="1"
                      value={form.duration}
                      onChange={handleChange}
                      placeholder="60"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      min
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Difficulty
                  </label>

                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="">Select difficulty</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Exercises
                </label>

                <textarea
                  name="exercises"
                  value={form.exercises}
                  onChange={handleChange}
                  rows={6}
                  placeholder={"Push Ups\nSquats\nBench Press\nPlank"}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />

                <p className="mt-2 text-xs font-medium text-slate-400">
                  Write one exercise per line.
                </p>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/15 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Class"
                    : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Total Classes
              </p>

              <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600">
                <Layers3 size={19} />
              </div>
            </div>

            <p className="mt-4 text-3xl font-black text-slate-950">
              {classes.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Approved
              </p>

              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <CheckCircle2 size={19} />
              </div>
            </div>

            <p className="mt-4 text-3xl font-black text-emerald-600">
              {
                classes.filter(
                  (item) => item.status === "approved"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Pending
              </p>

              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <Clock3 size={19} />
              </div>
            </div>

            <p className="mt-4 text-3xl font-black text-amber-600">
              {
                classes.filter(
                  (item) => item.status === "pending"
                ).length
              }
            </p>
          </div>
        </div>

        {classes.length === 0 ? (
          <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Dumbbell size={30} />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-950">
              No Classes Yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first fitness class and submit it for Admin
              approval.
            </p>

            <button
              onClick={openCreateForm}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/15 transition hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              <Plus size={18} />
              Create Class
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {classes.map((workout) => (
              <div
                key={workout._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5">
                  <span className="max-w-[65%] rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    {workout.category}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${statusStyle(
                      workout.status
                    )}`}
                  >
                    {workout.status || "pending"}
                  </span>
                </div>

                <div className="p-6">
                  <h2 className="line-clamp-2 min-h-[56px] text-xl font-black leading-7 text-slate-950">
                    {workout.title}
                  </h2>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                      <Clock3 size={15} />
                      {workout.duration} min
                    </span>

                    <span
                      className={`rounded-lg px-3 py-2 text-xs font-bold ${difficultyStyle(
                        workout.difficulty
                      )}`}
                    >
                      {workout.difficulty}
                    </span>
                  </div>

                  {Array.isArray(workout.exercises) &&
                    workout.exercises.length > 0 && (
                      <div className="mt-6 rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Exercises
                          </p>

                          <span className="text-xs font-bold text-slate-400">
                            {workout.exercises.length}
                          </span>
                        </div>

                        <ul className="mt-3 space-y-2">
                          {workout.exercises
                            .slice(0, 4)
                            .map((exercise, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-sm text-slate-600"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                <span className="line-clamp-1">
                                  {exercise}
                                </span>
                              </li>
                            ))}

                          {workout.exercises.length > 4 && (
                            <li className="pt-1 text-xs font-semibold text-slate-400">
                              +{workout.exercises.length - 4} more exercises
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => openEditForm(workout)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => deleteClass(workout)}
                      disabled={deletingId === workout._id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      {deletingId === workout._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
