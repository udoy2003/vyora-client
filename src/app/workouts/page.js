"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  Dumbbell,
  Edit3,
  Plus,
  Trash2,
  Target,
} from "lucide-react";
import api from "../../../lib/api";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const fetchWorkouts = async () => {
    try {
      setError("");

      const response = await api.get("/workouts");

      setWorkouts(response.data.workouts || []);
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = "/login";
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load workouts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await api.delete(`/workouts/${id}`);

      setWorkouts((currentWorkouts) =>
        currentWorkouts.filter((workout) => workout._id !== id)
      );
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = "/login";
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to delete workout."
      );
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-12">
          <div className="animate-pulse">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="mt-4 h-11 w-72 rounded-lg bg-slate-200" />
            <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div className="h-80 rounded-2xl bg-white" />
              <div className="h-80 rounded-2xl bg-white" />
              <div className="h-80 rounded-2xl bg-white" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && workouts.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Target size={25} />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-slate-950">
            Unable to load workouts
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            {error}
          </p>

          <button
            onClick={() => {
              setLoading(true);
              setError("");
              fetchWorkouts();
            }}
            className="mt-6 rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-12">
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Dumbbell size={21} />
              </div>

              <span className="text-sm font-bold uppercase tracking-widest text-emerald-600">
                Workout Library
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
              My Workouts
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
              Manage your training sessions, explore your routines, and
              keep your fitness journey organized.
            </p>
          </div>

          <Link
            href="/workouts/create"
            className="group inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/15 transition hover:bg-emerald-700"
          >
            <Plus size={19} />
            Create Workout
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Dumbbell size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                Your Library
              </p>

              <p className="mt-1 text-xl font-extrabold text-slate-950">
                {workouts.length}{" "}
                {workouts.length === 1 ? "Workout" : "Workouts"}
              </p>
            </div>
          </div>

          <div className="text-sm font-medium text-slate-500">
            Keep building your routine one session at a time.
          </div>
        </motion.div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {workouts.length === 0 ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Dumbbell size={29} />
            </div>

            <h2 className="mt-6 text-2xl font-extrabold text-slate-950">
              No workouts yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              Your workout library is waiting for its first session.
              Create a workout and start building your personal training
              routine.
            </p>

            <Link
              href="/workouts/create"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-700"
            >
              <Plus size={18} />
              Create Your First Workout
            </Link>
          </motion.section>
        ) : (
          <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {workouts.map((workout, index) => (
              <motion.article
                key={workout._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + index * 0.08,
                }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="border-b border-slate-100 px-6 py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                      <Dumbbell size={22} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold capitalize text-slate-600">
                      {workout.difficulty}
                    </span>
                  </div>

                  <h2 className="mt-6 line-clamp-2 text-2xl font-extrabold tracking-tight text-slate-950">
                    {workout.title}
                  </h2>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold capitalize text-emerald-700">
                      {workout.category}
                    </span>

                    <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                      <Clock3 size={13} />
                      {workout.duration} min
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-6 py-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Exercises
                    </p>

                    {workout.exercises?.length > 0 ? (
                      <div className="mt-4 space-y-2.5">
                        {workout.exercises
                          .slice(0, 4)
                          .map((exercise, exerciseIndex) => (
                            <div
                              key={exerciseIndex}
                              className="flex items-center gap-3 text-sm font-medium text-slate-600"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                                {exerciseIndex + 1}
                              </span>

                              <span className="truncate">
                                {exercise}
                              </span>
                            </div>
                          ))}

                        {workout.exercises.length > 4 && (
                          <p className="pt-1 text-xs font-semibold text-slate-400">
                            +{workout.exercises.length - 4} more exercises
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-400">
                        No exercises added yet.
                      </p>
                    )}
                  </div>

                  <div className="mt-8 border-t border-slate-100 pt-5">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
            href={`/workouts/${workout._id}`}
           className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
         View Details
       <ArrowRight size={16} />
          </Link>
                      <Link
                        href={`/workouts/edit/${workout._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Edit3 size={16} />
                        Edit
                      </Link>
                    </div>

                    <button
                      onClick={() => handleDelete(workout._id)}
                      disabled={deletingId === workout._id}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                      {deletingId === workout._id
                        ? "Deleting..."
                        : "Delete Workout"}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}