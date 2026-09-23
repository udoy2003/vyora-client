"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Dumbbell,
  Flame,
  Heart,
  Play,
  Sparkles,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../../../lib/api";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [workout, setWorkout] = useState(null);
  const [trainer, setTrainer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchClassDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Public class details
        const response = await api.get(`/workouts/public/${id}`);

        if (!response.data?.success) {
          throw new Error(
            response.data?.message || "Failed to load class details"
          );
        }

        setWorkout(response.data.workout);
        setTrainer(response.data.trainer);

        // Favorites require authentication.
        // If user is not logged in, simply keep favorite as false.
        try {
          const favoritesResponse = await api.get(
            "/workouts/favorites/my"
          );

          const favorites =
            favoritesResponse.data?.favorites || [];

          const isFavorite = favorites.some(
            (item) =>
              item.workoutId?.toString() === id.toString() ||
              item._id?.toString() === id.toString()
          );

          setFavorite(isFavorite);
        } catch (favoriteError) {
          // Not logged in / favorites unavailable
          setFavorite(false);
        }
      } catch (err) {
        console.error("Class details error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load class details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [id]);

  const handleFavorite = async () => {
    try {
      setFavoriteLoading(true);
      setFavoriteMessage("");

      const response = await api.post(
        `/workouts/favorites/${id}`
      );

      setFavorite(Boolean(response.data?.favorited));

      setFavoriteMessage(
        response.data?.message ||
          (response.data?.favorited
            ? "Added to favorites"
            : "Removed from favorites")
      );

      setTimeout(() => {
        setFavoriteMessage("");
      }, 2500);
    } catch (err) {
      if (err.response?.status === 401) {
        router.push("/login");
        return;
      }

      setFavoriteMessage(
        err.response?.data?.message ||
          "Failed to update favorite"
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleBooking = () => {
    if (!workout?._id) return;

    router.push(`/classes/${workout._id}/book`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />

          <p className="mt-4 font-medium text-slate-600">
            Loading class details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !workout) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Dumbbell className="h-8 w-8 text-slate-600" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Class Not Found
          </h1>

          <p className="mt-3 text-slate-600">
            {error || "This class is no longer available."}
          </p>

          <button
            onClick={() => router.push("/classes")}
            className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Classes
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <button
            onClick={() => router.push("/classes")}
            className="mb-10 inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Classes
          </button>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4" />
                Approved Fitness Class
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {workout.title}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white">
                Build strength, improve your fitness, and stay
                consistent with a structured workout session
                designed for your fitness journey.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {workout.category && (
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900">
                    {workout.category}
                  </span>
                )}

                {workout.difficulty && (
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900">
                    {workout.difficulty}
                  </span>
                )}

                <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900">
                  {workout.duration} Minutes
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-[2rem] bg-white/10 p-3 backdrop-blur-sm">
                <div className="flex min-h-[360px] items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-slate-800 to-slate-700">
                  <div className="text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl">
                      <Play className="ml-1 h-10 w-10 fill-slate-900 text-slate-900" />
                    </div>

                    <p className="mt-6 text-xl font-bold text-white">
                      Ready to Train?
                    </p>

                    <p className="mt-2 text-white">
                      Start your fitness journey today
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Workout */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-600">
                    Workout Program
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    What You&apos;ll Do
                  </h2>
                </div>

                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 sm:flex">
                  <Dumbbell className="h-7 w-7 text-slate-700" />
                </div>
              </div>

              {Array.isArray(workout.exercises) &&
              workout.exercises.length > 0 ? (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {workout.exercises.map((exercise, index) => (
                    <motion.div
                      key={`${exercise}-${index}`}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.08,
                      }}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <span className="font-bold text-slate-900">
                        {exercise}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
                  No exercise details available.
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Information */}
            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <h3 className="text-xl font-black text-slate-900">
                Class Information
              </h3>

              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                    <Clock className="h-5 w-5 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">
                      Duration
                    </p>

                    <p className="font-bold text-slate-900">
                      {workout.duration} minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                    <Flame className="h-5 w-5 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">
                      Difficulty
                    </p>

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
                    <p className="text-sm text-slate-600">
                      Category
                    </p>

                    <p className="font-bold text-slate-900">
                      {workout.category || "Fitness"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trainer */}
            <div className="rounded-3xl bg-slate-900 p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                  <UserRound className="h-7 w-7 text-slate-900" />
                </div>

                <div>
                  <p className="text-sm text-white">
                    Trainer
                  </p>

                  <h3 className="text-xl font-black text-white">
                    {trainer?.name || "VYORA Trainer"}
                  </h3>
                </div>
              </div>

              {trainer?.trainerApplication?.specialty && (
                <p className="mt-5 text-white">
                  Specialty:{" "}
                  {trainer.trainerApplication.specialty}
                </p>
              )}

              {trainer?.email && (
                <p className="mt-3 break-all text-sm text-white">
                  {trainer.email}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Booking / Favorite */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Ready to Start?
              </h2>

              <p className="mt-2 text-slate-600">
                Book this class and take the next step in your
                fitness journey.
              </p>

              {favoriteMessage && (
                <p className="mt-3 text-sm font-semibold text-emerald-700">
                  {favoriteMessage}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleFavorite}
                disabled={favoriteLoading}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 font-bold transition ${
                  favorite
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                } ${
                  favoriteLoading
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    favorite ? "fill-white" : ""
                  }`}
                />

                {favoriteLoading
                  ? "Updating..."
                  : favorite
                  ? "Favorited"
                  : "Add to Favorites"}
              </button>

              <button
                onClick={handleBooking}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3 font-bold text-white transition hover:bg-slate-800"
              >
                Book Now

                <ArrowLeft className="h-5 w-5 rotate-180" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}