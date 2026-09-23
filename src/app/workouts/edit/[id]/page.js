
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Dumbbell } from "lucide-react";
import api from "../../../../../lib/api";

export default function EditWorkoutPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    difficulty: "",
    exercises: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchWorkout = async () => {
      try {
        const response = await api.get(`/workouts/${id}`);

        const workout = response.data.workout;

        setFormData({
          title: workout.title || "",
          category: workout.category || "",
          duration: workout.duration || "",
          difficulty: workout.difficulty || "",
          exercises: workout.exercises?.join(", ") || "",
        });
      } catch (err) {
        if (err.response?.status === 401) {
          router.push("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Failed to load workout."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id, router]);

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const body = {
        title: formData.title,
        category: formData.category,
        duration: Number(formData.duration),
        difficulty: formData.difficulty,
        exercises: formData.exercises
          .split(",")
          .map((exercise) => exercise.trim())
          .filter(Boolean),
      };

      const response = await api.put(`/workouts/${id}`, body);

      setMessage(
        response.data.message || "Workout updated successfully."
      );

      setTimeout(() => {
        router.push(`/workouts/${id}`);
      }, 1000);
    } catch (err) {
      if (err.response?.status === 401) {
        router.push("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to update workout."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="h-10 w-48 rounded-lg bg-slate-200" />
          <div className="mt-8 h-[600px] rounded-3xl bg-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => router.push(`/workouts/${id}`)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
        >
          <ArrowLeft size={17} />
          Back to Workout
        </button>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="bg-slate-950 px-7 py-9 md:px-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400">
                <Dumbbell className="h-7 w-7 text-slate-950" />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                  Workout Management
                </p>

                <h1 className="mt-1 text-3xl font-black text-white md:text-4xl">
                  Edit Workout
                </h1>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Update your workout title, category, duration, difficulty,
              and exercise list.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-7 md:p-10">
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {message}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Workout Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="Enter workout title"
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
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="Strength, Cardio, Yoga"
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
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    placeholder="30"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
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
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">Select difficulty</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="md:col-span-2">
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="Squats, Push Ups, Lunges"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Separate each exercise with a comma.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-7 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push(`/workouts/${id}`)}
                className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {saving ? "Updating..." : "Update Workout"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
