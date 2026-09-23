"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  Dumbbell,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/bookings/my`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load bookings"
          );
        }

        setBookings(data.bookings || []);
      } catch (err) {
        setError(
          err.message || "Failed to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value === "confirmed" ||
      value === "paid" ||
      value === "success"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      value === "pending" ||
      value === "processing"
    ) {
      return "bg-yellow-100 text-yellow-700";
    }

    if (
      value === "cancelled" ||
      value === "canceled" ||
      value === "failed"
    ) {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div>
            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
              My Bookings
            </h1>

            <p className="mt-2 text-slate-600">
              View all your booked fitness classes.
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl bg-white shadow-sm">
            <div className="text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-slate-700" />

              <p className="mt-4 font-semibold text-slate-600">
                Loading your bookings...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-bold text-red-800">
              Unable to load bookings
            </h2>

            <p className="mt-2 text-red-700">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          bookings.length === 0 && (
            <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <CalendarDays className="h-10 w-10 text-slate-500" />
              </div>

              <h2 className="mt-6 text-2xl font-black text-slate-900">
                No Bookings Yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-slate-600">
                You haven't booked any fitness classes yet.
                Browse available classes and make your first
                booking.
              </p>

              <button
                onClick={() => router.push("/classes")}
                className="mt-7 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
              >
                Browse Classes
              </button>
            </div>
          )}

        {/* Bookings */}
        {!loading &&
          !error &&
          bookings.length > 0 && (
            <div className="grid gap-6">
              {bookings.map((booking, index) => {
                const workout =
                  booking.workout || {};

                return (
                  <motion.div
                    key={
                      booking._id ||
                      booking.id ||
                      index
                    }
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm"
                  >
                    <div className="p-6 sm:p-7">
                      {/* Top */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                              <Dumbbell className="h-6 w-6 text-slate-700" />
                            </div>

                            <div>
                              <h2 className="text-xl font-black text-slate-900">
                                {workout.title ||
                                  booking.title ||
                                  "Fitness Class"}
                              </h2>

                              {workout.category && (
                                <p className="mt-1 text-sm text-slate-500">
                                  {workout.category}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${getStatusStyle(
                            booking.status ||
                              booking.paymentStatus
                          )}`}
                        >
                          <CheckCircle2 className="h-4 w-4" />

                          {booking.status ||
                            booking.paymentStatus ||
                            "Confirmed"}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="mt-7 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                            <CalendarDays className="h-4 w-4" />
                            Date
                          </div>

                          <p className="mt-2 font-bold text-slate-900">
                            {formatDate(
                              booking.bookingDate
                            )}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                            <Clock3 className="h-4 w-4" />
                            Time
                          </div>

                          <p className="mt-2 font-bold text-slate-900">
                            {booking.startTime ||
                              "N/A"}{" "}
                            -{" "}
                            {booking.endTime ||
                              "N/A"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                            <Dumbbell className="h-4 w-4" />
                            Difficulty
                          </div>

                          <p className="mt-2 font-bold capitalize text-slate-900">
                            {workout.difficulty ||
                              booking.difficulty ||
                              "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                          Booking ID:{" "}
                          <span className="font-semibold text-slate-700">
                            {booking._id ||
                              booking.id ||
                              "N/A"}
                          </span>
                        </span>

                        {booking.amount !==
                          undefined && (
                          <span className="font-bold text-slate-900">
                            Amount:{" "}
                            {booking.amount}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
      </div>
    </main>
  );
}