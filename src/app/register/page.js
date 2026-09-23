"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
} from "lucide-react";
import api from "../../../lib/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
    setLoading(true);

    try {
      const response = await api.post("/users/register", formData);

      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 md:px-10">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14"
          >
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-white no-underline"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                  <Dumbbell size={29} strokeWidth={2.6} />
                </div>

                <span className="text-3xl font-black tracking-tight text-white">
                  VYORA
                </span>
              </Link>

              <p className="mt-10 text-sm font-extrabold uppercase tracking-widest text-emerald-400">
                Welcome to VYORA
              </p>

              <h2 className="mt-4 text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Build your routine.
                <br />
                Build yourself.
              </h2>

              <p className="mt-6 max-w-md text-base font-medium leading-8 text-slate-300">
                Create your VYORA account and start organizing your workouts,
                tracking your training goals, and building a consistent fitness
                routine.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <CheckCircle2
                  size={20}
                  strokeWidth={2.5}
                  className="shrink-0 text-emerald-600"
                />
                Personal workout management
              </div>

              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <CheckCircle2
                  size={20}
                  strokeWidth={2.5}
                  className="shrink-0 text-emerald-600"
                />
                Organized training plans
              </div>

              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <CheckCircle2
                  size={20}
                  strokeWidth={2.5}
                  className="shrink-0 text-emerald-600"
                />
                Simple and focused experience
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-7 sm:p-10 lg:p-12 xl:p-14"
          >
            <div className="mx-auto max-w-lg">
              

              <div className="mt-7 lg:mt-0">
                <p className="text-sm font-extrabold uppercase tracking-widest text-emerald-700">
                  Get Started
                </p>

                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
                  Create your account
                </h1>

                <p className="mt-3 text-sm font-medium leading-7 text-slate-600 md:text-base">
                  Join VYORA and start building a better fitness routine.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 max-w-none gap-5 border-0 bg-transparent p-0 shadow-none"
              >
                <div className="grid gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-extrabold text-slate-900"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-extrabold text-slate-900"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-extrabold text-slate-900"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {message && (
                  <div className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-800">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-700"
                    />
                    <span>{message}</span>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-800">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating Account..." : "Create Account"}

                  {!loading && (
                    <ArrowRight
                      size={18}
                      strokeWidth={2.5}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <div className="mt-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Already registered?
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <Link
                href="/login"
                className="mt-5 flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Login to VYORA
              </Link>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}