
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Dumbbell,
  Flame,
  Pencil,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../../../lib/api";

export default function WorkoutDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [workout, setWorkout] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchWorkout = async () => {
      try {
        const response = await api.get(`/workouts/${id}`);

        setWorkout(response.data.workout);
        setTrainer(response.data.trainer || null);
      } catch (err) {
        if (err.response?.status === 401) {
          router.push("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Failed to load workout details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-10 w-40 rounded-lg bg-slate-200" />
          <div className="mt-8 h-72 rounded-3xl bg-white" />
        </div>
      </main>
    );
  }

  if (error || !workout) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Dumbbell className="h-8 w-8 text-slate-600" />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            Workout Not Found
          </h1>

          <p className="mt-3 text-slate-600">
            {error || "This workout could not be found."}
          </p>

          <button
            onClick={() => router.push("/workouts")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={17} />
            Back to My Workouts
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <button
            onClick={() => router.push("/workouts")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeft size={17} />
            Back to My Workouts
          </button>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <Dumbbell size={15} />
                My Workout
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
                {workout.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                Review your workout information, exercises, difficulty level,
                and training details.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900">
                  {workout.category || "Fitness"}
                </span>

                <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900">
                  {workout.difficulty || "All Levels"}
                </span>

                <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900">
                  {workout.duration || 0} Minutes
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl bg-white/10 p-3"
            >
              <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-slate-800">
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-400">
                    <Dumbbell className="h-11 w-11 text-slate-950" />
                  </div>

                  <p className="mt-6 text-xl font-black text-white">
                    Workout Overview
                  </p>

                  <p className="mt-2 text-slate-300">
                    Your training program details
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2"
          >
            <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Training Program
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    Exercises
                  </h2>
                </div>

                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 sm:flex">
                  <Dumbbell className="h-7 w-7 text-slate-700" />
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {workout.exercises?.length ? (
                  workout.exercises.map((exercise, index) => (
                    <div
                      key={`${exercise}-${index}`}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <span className="font-bold text-slate-900">
                        {exercise}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600">
                    No exercises added to this workout.
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">
                Workout Information
              </h2>

              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                    <Clock className="h-5 w-5 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Duration</p>
                    <p className="font-bold text-slate-900">
                      {workout.duration || 0} minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                    <Flame className="h-5 w-5 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Difficulty</p>
                    <p className="font-bold text-slate-900">
                      {workout.difficulty || "All Levels"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                    <Dumbbell className="h-5 w-5 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Category</p>
                    <p className="font-bold text-slate-900">
                      {workout.category || "Fitness"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                  <UserRound className="h-7 w-7 text-slate-900" />
                </div>

                <div>
                  <p className="text-sm text-slate-400">Trainer</p>

                  <h3 className="text-xl font-black text-white">
                    {trainer?.name || "VYORA Trainer"}
                  </h3>
                </div>
              </div>

              {trainer?.trainerApplication?.specialty && (
                <p className="mt-5 text-sm text-slate-300">
                  Specialty: {trainer.trainerApplication.specialty}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Need to make changes?
            </h2>

            <p className="mt-2 text-slate-600">
              Update your workout information whenever needed.
            </p>
          </div>

          <button
            onClick={() => router.push(`/workouts/edit/${workout._id}`)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
          >
            <Pencil size={17} />
            Edit Workout
          </button>
        </div>
      </section>
    </main>
  );
}
