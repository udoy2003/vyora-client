"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Dumbbell,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../../../../lib/api";

export default function BookClassPage() {
  const { id } = useParams();
  const router = useRouter();

  const [workout, setWorkout] = useState(null);

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchWorkout = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/workouts/public/${id}`
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Failed to load class"
          );
        }

        setWorkout(response.data.workout);
      } catch (err) {
        console.error("Fetch workout error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load class"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!bookingDate || !startTime || !endTime) {
      setError(
        "Please select date, start time and end time."
      );
      return;
    }

    if (endTime <= startTime) {
      setError(
        "End time must be later than start time."
      );
      return;
    }

    try {
      setBooking(true);

      const response = await api.post(
        "/bookings/create-checkout-session",
        {
          workoutId: id,
          bookingDate,
          startTime,
          endTime,
        }
      );

      if (response.data?.url) {
        window.location.href = response.data.url;
        return;
      }

      setSuccess(
        response.data?.message ||
          "Booking created successfully."
      );
    } catch (err) {
      console.error("Booking error:", err);

      if (err.response?.status === 401) {
        router.push("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to start payment."
      );
    } finally {
      setBooking(false);
    }
  };

  const today = new Date()
    .toISOString()
    .split("T")[0];

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />

          <p className="mt-4 font-medium text-slate-600">
            Loading booking page...
          </p>
        </div>
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Dumbbell className="h-8 w-8 text-slate-700" />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            Class Not Found
          </h1>

          <p className="mt-3 text-slate-600">
            {error ||
              "This class is no longer available."}
          </p>

          <button
            onClick={() => router.push("/classes")}
            className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
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
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <button
            onClick={() =>
              router.push(`/classes/${id}`)
            }
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Class
          </button>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">
              Book Your Session
            </p>

            <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">
              {workout.title}
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-white">
              Choose your preferred date and workout time
              to reserve this fitness class.
            </p>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Class Summary */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
                <Dumbbell className="h-8 w-8 text-slate-900" />
              </div>

              <h2 className="mt-7 text-2xl font-black">
                {workout.title}
              </h2>

              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-4">
                  <CalendarDays className="h-5 w-5 text-white" />

                  <div>
                    <p className="text-sm text-white">
                      Category
                    </p>

                    <p className="font-bold">
                      {workout.category ||
                        "Fitness"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-white" />

                  <div>
                    <p className="text-sm text-white">
                      Duration
                    </p>

                    <p className="font-bold">
                      {workout.duration} minutes
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-white/20 pt-6">
                <p className="text-sm text-white">
                  Difficulty
                </p>

                <p className="mt-1 font-bold">
                  {workout.difficulty ||
                    "All Levels"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleBooking}
              className="rounded-3xl bg-white p-7 shadow-sm sm:p-9"
            >
              <h2 className="text-2xl font-black text-slate-900">
                Select Schedule
              </h2>

              <p className="mt-2 text-slate-600">
                Select when you want to attend this
                class.
              </p>

              {/* Error */}
              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  {success}
                </div>
              )}

              {/* Date */}
              <div className="mt-8">
                <label
                  htmlFor="bookingDate"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Booking Date
                </label>

                <input
                  id="bookingDate"
                  type="date"
                  value={bookingDate}
                  min={today}
                  onChange={(e) =>
                    setBookingDate(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Time */}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="startTime"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Start Time
                  </label>

                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) =>
                      setStartTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="endTime"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    End Time
                  </label>

                  <input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) =>
                      setEndTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              {/* Summary */}
              {bookingDate &&
                startTime &&
                endTime && (
                  <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-bold text-slate-700">
                      Booking Summary
                    </p>

                    <div className="mt-3 grid gap-2 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-900">
                          Date:
                        </span>{" "}
                        {bookingDate}
                      </p>

                      <p>
                        <span className="font-semibold text-slate-900">
                          Time:
                        </span>{" "}
                        {startTime} - {endTime}
                      </p>

                      <p>
                        <span className="font-semibold text-slate-900">
                          Class:
                        </span>{" "}
                        {workout.title}
                      </p>
                    </div>
                  </div>
                )}

              <button
                type="submit"
                disabled={booking}
                className="mt-8 w-full rounded-xl bg-slate-900 px-6 py-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {booking
                  ? "Redirecting to Payment..."
                  : "Confirm Booking & Pay"}
              </button>

              <p className="mt-4 text-center text-xs text-slate-500">
                You will be redirected to the secure
                payment page after confirmation.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}