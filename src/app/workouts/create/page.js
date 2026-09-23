"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Dumbbell, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../../../lib/api";

export default function CreateWorkoutPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    difficulty: "",
    exercises: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.title.trim()) {
      setError("Please enter a class title.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Please enter a category.");
      return;
    }

    if (!formData.duration || Number(formData.duration) <= 0) {
      setError("Please enter a valid duration.");
      return;
    }

    if (!formData.difficulty) {
      setError("Please select a difficulty level.");
      return;
    }

    setLoading(true);

    try {
      const body = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        duration: Number(formData.duration),
        difficulty: formData.difficulty,
        exercises: formData.exercises
          .split(",")
          .map((exercise) => exercise.trim())
          .filter((exercise) => exercise),
      };

      const response = await api.post("/workouts", body);

      setMessage(
        response.data.message ||
          "Class submitted successfully and is waiting for Admin approval."
      );

      setFormData({
        title: "",
        category: "",
        duration: "",
        difficulty: "",
        exercises: "",
      });

      setTimeout(() => {
        router.push("/dashboard/trainer/classes");
      }, 1500);
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to create class. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/dashboard/trainer"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
          >
            <ArrowLeft size={17} />
            Back to Trainer Dashboard
          </Link>

          <div className="rounded-3xl bg-slate-950 px-7 py-8 shadow-xl md:px-10 md:py-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Dumbbell size={28} />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-emerald-400">
              Trainer Panel
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Create New Class
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Create a workout class for your members. After submission, the
              class will remain pending until an Admin reviews it.
            </p>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Class Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Full Body Strength"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="Example: Strength"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="duration"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Duration
              </label>

              <div className="relative">
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Example: 45"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-16 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  minutes
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="difficulty"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Difficulty
              </label>

              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="">Select difficulty</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="exercises"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Exercises
              </label>

              <input
                id="exercises"
                name="exercises"
                type="text"
                value={formData.exercises}
                onChange={handleChange}
                placeholder="Squats, Push Ups, Lunges"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />

              <p className="mt-2 text-xs font-medium text-slate-500">
                Separate multiple exercises with commas.
              </p>
            </div>
          </div>

          {message && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/trainer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <X size={17} />
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} />
              {loading ? "Submitting..." : "Submit Class"}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}