"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Dumbbell, Heart, Search } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../../../../../lib/api";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadFavorites = async () => {
    try {
      const response = await api.get("/workouts/favorites/my");
      setFavorites(response.data.favorites || []);
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (workoutId) => {
    try {
      setRemovingId(workoutId);
      setMessage("");

      const response = await api.post(`/workouts/favorites/${workoutId}`);

      if (response.data.favorited === false) {
        setFavorites((current) =>
          current.filter((item) => item.workoutId !== workoutId)
        );
        setMessage("Class removed from favorites.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to update favorite."
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mt-4 h-12 w-72 rounded-lg bg-slate-200" />
          <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="h-72 rounded-2xl bg-white" />
            <div className="h-72 rounded-2xl bg-white" />
            <div className="h-72 rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-7xl">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-slate-950 px-7 py-9 shadow-xl md:px-10 md:py-11"
        >
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-rose-400">
              <Heart size={14} fill="currentColor" />
              Saved Classes
            </div>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              My Favorites
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Keep your favorite fitness classes in one place and quickly
              return to the workouts you want to explore.
            </p>
          </div>
        </motion.section>

        {message && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        {favorites.length === 0 ? (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Heart size={28} />
            </div>

            <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
              No favorite classes yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
              Explore available classes and save the ones you want to come back
              to later.
            </p>

            <Link
              href="/classes"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Search size={17} />
              Explore Classes
            </Link>
          </motion.section>
        ) : (
          <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((item, index) => {
              const workout = item.workout;

              if (!workout) {
                return null;
              }

              return (
                <motion.article
                  key={item.workoutId}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                  }}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative flex h-40 items-center justify-center bg-slate-950">
                    <Dumbbell
                      size={42}
                      className="text-emerald-400 transition duration-300 group-hover:scale-110"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemove(item.workoutId)}
                      disabled={removingId === item.workoutId}
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-rose-600 shadow-md transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Remove from favorites"
                    >
                      <Heart size={19} fill="currentColor" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        {workout.category || "Fitness"}
                      </span>

                      <span className="text-xs font-semibold text-slate-600">
                        {workout.difficulty || "All Levels"}
                      </span>
                    </div>

                    <h2 className="mt-4 line-clamp-2 text-xl font-extrabold text-slate-900">
                      {workout.title}
                    </h2>

                    <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={16} />
                        {workout.duration || 0} min
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Dumbbell size={16} />
                        {workout.exercises?.length || 0} exercises
                      </span>
                    </div>

                    <Link
                      href={`/classes/${workout._id}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
                    >
                      View Class
                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}