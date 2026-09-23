"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Dumbbell,
  MessageSquare,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../../../lib/api";

export default function TrainerDashboard() {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const profileResponse = await api.get("/users/profile");
        const workoutsResponse = await api.get("/workouts");

        setUser(profileResponse.data.user);
        setWorkouts(workoutsResponse.data.workouts || []);
      } catch (error) {
        if (error.response?.status === 401) {
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="mt-4 h-12 w-80 rounded-lg bg-slate-200" />
          <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="h-40 rounded-2xl bg-white" />
            <div className="h-40 rounded-2xl bg-white" />
            <div className="h-40 rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
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
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Sparkles size={14} />
              Trainer Dashboard
            </div>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              Welcome back, {user.name}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Manage your training content, track your activity, and build
              better fitness experiences for your members.
            </p>
          </div>
        </motion.section>

        <section className="mt-7 grid gap-5 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                <Dumbbell size={22} />
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Active
              </span>
            </div>

            <p className="mt-6 text-sm font-semibold text-slate-600">
              My Workouts
            </p>

            <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">
              {workouts.length}
            </p>

            <p className="mt-2 text-xs font-medium text-slate-500">
              Training routines in your library
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Users size={22} />
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                Members
              </span>
            </div>

            <p className="mt-6 text-sm font-semibold text-slate-600">
              My Students
            </p>

            <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">
              0
            </p>

            <p className="mt-2 text-xs font-medium text-slate-500">
              Students currently assigned to you
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.26 }}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                <MessageSquare size={22} />
              </div>

              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                Community
              </span>
            </div>

            <p className="mt-6 text-sm font-semibold text-slate-600">
              Forum Posts
            </p>

            <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">
              0
            </p>

            <p className="mt-2 text-xs font-medium text-slate-500">
              Posts shared with the community
            </p>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Quick Actions
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
              Manage your training
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href="/workouts/create"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-50/70 transition duration-300 group-hover:scale-125" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Plus size={23} />
                  </div>

                  <ArrowRight
                    size={20}
                    className="text-slate-400 transition duration-300 group-hover:translate-x-1 group-hover:text-emerald-600"
                  />
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-slate-950">
                  Create Workout
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Build a new workout routine with exercises, duration,
                  category, and difficulty.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                  Create now
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>

            <Link
              href="/workouts"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-50 transition duration-300 group-hover:scale-125" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Dumbbell size={23} />
                  </div>

                  <ArrowRight
                    size={20}
                    className="text-slate-400 transition duration-300 group-hover:translate-x-1 group-hover:text-slate-700"
                  />
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-slate-950">
                  Manage Workouts
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  View your workout library and update or remove existing
                  training routines.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-800">
                  View workouts
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}