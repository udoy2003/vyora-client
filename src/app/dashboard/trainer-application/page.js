"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Send, CheckCircle2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TrainerApplicationPage() {
  const [experience, setExperience] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [status, setStatus] = useState("none");
  const [feedback, setFeedback] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/users/profile`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      const application = data.user?.trainerApplication || {};

      setExperience(application.experience || "");
      setSpecialty(application.specialty || "");
      setStatus(application.status || "none");
      setFeedback(application.feedback || "");
    } catch (err) {
      console.error("Load profile error:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!experience.trim() || !specialty.trim()) {
      setError("Experience and specialty are required.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_URL}/users/trainer-application`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            experience: experience.trim(),
            specialty: specialty.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit trainer application"
        );
      }

      setStatus("pending");
      setFeedback("");
      setMessage(
        "Your trainer application has been submitted successfully."
      );
    } catch (err) {
      console.error("Submit trainer application error:", err);

      setError(
        err.message || "Failed to submit trainer application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto max-w-4xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Member Dashboard
            </p>

            <h1 className="text-4xl font-bold">
              Apply as a Trainer
            </h1>
          </div>
        </section>

        <div className="flex min-h-[350px] items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  if (status === "pending") {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto max-w-4xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Member Dashboard
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Trainer Application
            </h1>

            <p className="mt-4 text-slate-400">
              Your application is currently under review.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <BriefcaseBusiness size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              Application Pending
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-slate-500">
              Your trainer application has been submitted
              and is waiting for an admin to review it.
            </p>

            <div className="mt-6 rounded-xl bg-slate-50 p-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Specialty
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {specialty}
              </p>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Experience
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {experience}
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (status === "approved") {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto max-w-4xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Member Dashboard
            </p>

            <h1 className="text-4xl font-bold">
              Trainer Application
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              You Are a Trainer
            </h2>

            <p className="mt-3 text-slate-500">
              Your trainer application was approved.
              You can now access trainer features.
            </p>

            {feedback && (
              <div className="mt-6 rounded-xl bg-slate-50 p-5 text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Admin Feedback
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feedback}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Member Dashboard
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Apply as a Trainer
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Share your fitness experience and specialty.
            An admin will review your application.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {status === "rejected" && feedback && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-800">
                Previous Application Feedback
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-700">
                {feedback}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Fitness Specialty
              </label>

              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. Strength Training, Yoga, Cardio"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Experience
              </label>

              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                rows={7}
                placeholder="Describe your fitness training experience, certifications, previous work, achievements, etc."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={18} />

              {submitting
                ? "Submitting..."
                : "Submit Application"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}