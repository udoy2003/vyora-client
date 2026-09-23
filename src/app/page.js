
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  HeartPulse,
  Target,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-50 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-teal-50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
              <HeartPulse size={17} />
              Fitness made simple
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
              Build your body.
              <span className="text-emerald-600">
                {" "}
                Build your best self.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
              VYORA gives you a simple and organized way to create workouts,
              manage your fitness routine, and stay consistent with your goals.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/workouts/create"
                className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/25"
              >
                Start Training
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/workouts"
                className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-bold text-slate-800 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Explore Workouts
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <CheckCircle2 size={18} className="text-emerald-600" />
                Personalized workouts
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <CheckCircle2 size={18} className="text-emerald-600" />
                Easy progress tracking
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative mx-auto max-w-lg overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-100 p-3 shadow-2xl shadow-slate-200/60"
            >
              <div className="relative min-h-[430px] overflow-hidden rounded-[1.6rem]">
                <img
                  src="/fitness-hero.jpg"
                  alt="Fitness training"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/85 via-emerald-500/60 to-slate-950/75" />

                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15"
                />

                <motion.div
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white/10"
                />

                <div className="relative flex min-h-[430px] flex-col justify-between p-8">
                  <div className="flex items-center justify-between">
                    <motion.div
                      animate={{ rotate: [0, 8, -8, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="rounded-xl bg-white/20 p-3 text-white shadow-sm backdrop-blur"
                    >
                      <Dumbbell size={28} />
                    </motion.div>

                    <span className="rounded-full border border-white/20 bg-white/20 px-4 py-2 text-sm font-bold text-white shadow-sm backdrop-blur">
                      VYORA
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-white">
                      Today's Workout
                    </p>

                    <h2 className="mt-2 text-4xl font-black tracking-tight text-white">
                      Full Body
                    </h2>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-lg shadow-emerald-900/10"
                      >
                        <p className="text-2xl font-black text-slate-900">
                          60
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          Minutes
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-lg shadow-emerald-900/10"
                      >
                        <p className="text-2xl font-black text-slate-900">
                          8
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          Exercises
                        </p>
                      </motion.div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/90 p-5 text-white shadow-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-300">
                          Weekly Progress
                        </span>

                        <span className="font-bold text-emerald-400">
                          75%
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{
                            duration: 1.5,
                            delay: 0.8,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full bg-emerald-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 -left-2 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:block md:left-0"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <TrendingUp size={21} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Keep going
                  </p>

                  <p className="font-bold text-slate-900">
                    Stay consistent
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="text-sm font-extrabold uppercase tracking-widest text-emerald-600">
              Why VYORA
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              Everything you need to stay on track.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Your workouts, routine, and fitness goals organized in one
              simple platform.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:border-emerald-100 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                <Dumbbell size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-950">
                Create Workouts
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Build personalized workout plans with exercises, duration,
                category, and difficulty.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:border-emerald-100 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                <Target size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-950">
                Focus on Your Goals
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Keep your training organized so you can focus on building
                better fitness habits.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -8 }}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:border-emerald-100 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                <TrendingUp size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-950">
                Track Your Progress
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Manage your workouts and stay consistent as you work toward
                your fitness goals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    
<section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    className="relative overflow-hidden rounded-3xl border border-green-200 bg-green-100 px-6 py-12 text-center shadow-sm md:px-12"
  >
    <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-100/70 blur-2xl" />
    <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-teal-100/60 blur-2xl" />

    <div className="relative">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
        <Dumbbell size={27} />
      </div>

      <h2 className="mt-6 text-3xl font-black text-slate-950 md:text-4xl">
        Ready to start training?
      </h2>

      <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-500">
        Create your first workout and start building a routine that works
        for you.
      </p>

      <Link
        href="/workouts/create"
        className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/25"
      >
        Create Your Workout
        <ArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  </motion.div>
</section>

    </main>
  );
}
