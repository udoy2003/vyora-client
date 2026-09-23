"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  CalendarCheck2,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../../../lib/api";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setStatus("error");
      setMessage("Payment session was not found.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await api.post(
          "/bookings/verify-payment",
          {
            sessionId,
          }
        );

        if (!response.data?.success) {
          setStatus("error");
          setMessage(
            response.data?.message ||
              "Payment verification failed."
          );
          return;
        }

        setStatus("success");
        setMessage(
          response.data?.message ||
            "Payment completed successfully. Your booking has been confirmed."
        );
      } catch (err) {
        if (err.response?.status === 401) {
          router.push("/login");
          return;
        }

        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Payment verification failed. Please try again."
        );
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl sm:p-10"
      >
        {/* Processing */}
        {status === "processing" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <Loader2 className="h-10 w-10 animate-spin text-slate-700" />
            </div>

            <h1 className="mt-6 text-3xl font-black text-slate-900">
              Verifying Payment
            </h1>

            <p className="mt-3 text-slate-600">
              {message}
            </p>

            <p className="mt-4 text-sm text-slate-400">
              Please do not close this page.
            </p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-11 w-11 text-green-700" />
            </div>

            <h1 className="mt-6 text-3xl font-black text-slate-900">
              Payment Successful
            </h1>

            <p className="mt-3 leading-7 text-slate-600">
              {message}
            </p>

            <div className="mt-8 space-y-3">
              <button
                onClick={() =>
                  router.push("/dashboard/bookings")
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-bold text-white transition hover:bg-slate-800"
              >
                <CalendarCheck2 className="h-5 w-5" />
                View My Bookings
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-800 transition hover:bg-slate-50"
              >
                <LayoutDashboard className="h-5 w-5" />
                Go to Dashboard
              </button>
            </div>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <CheckCircle2 className="h-11 w-11 text-red-600" />
            </div>

            <h1 className="mt-6 text-3xl font-black text-slate-900">
              Payment Verification Failed
            </h1>

            <p className="mt-3 leading-7 text-slate-600">
              {message}
            </p>

            <button
              onClick={() => router.push("/classes")}
              className="mt-8 w-full rounded-xl bg-slate-900 px-6 py-4 font-bold text-white transition hover:bg-slate-800"
            >
              Back to Classes
            </button>
          </>
        )}
      </motion.div>
    </main>
  );
}