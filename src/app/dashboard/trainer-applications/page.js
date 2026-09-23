"use client";

import { useEffect, useState } from "react";
import {
  UserRound,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

const API_URL = "http://localhost:5000";

export default function TrainerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/users/admin/trainer-applications`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load trainer applications"
        );
      }

      setApplications(data.applications || []);
    } catch (err) {
      console.error(
        "Load trainer applications error:",
        err
      );

      setError(
        err.message ||
          "Failed to load trainer applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const reviewApplication = async (
    application,
    status
  ) => {
    let feedback = "";

    if (status === "rejected") {
      feedback =
        window.prompt(
          "Enter rejection feedback (optional):"
        ) || "";
    }

    const actionText =
      status === "approved"
        ? "approve"
        : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} ${application.name}'s trainer application?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(application._id);

      const response = await fetch(
        `${API_URL}/api/users/admin/trainer-applications/${application._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            feedback,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to review application"
        );
      }

      setApplications((prevApplications) =>
        prevApplications.filter(
          (item) =>
            item._id !== application._id
        )
      );
    } catch (err) {
      console.error(
        "Review trainer application error:",
        err
      );

      alert(
        err.message ||
          "Failed to review application"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Admin Dashboard
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Trainer Applications
            </h1>

            <p className="mt-4 max-w-2xl text-slate-400">
              Review pending applications from users
              who want to become trainers.
            </p>
          </div>
        </section>

        <section className="mx-auto flex min-h-[350px] max-w-7xl items-center justify-center px-6">
          <div className="text-center">
            <RefreshCw
              size={32}
              className="mx-auto animate-spin text-emerald-500"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading applications...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Admin Dashboard
          </p>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold md:text-5xl">
                Trainer Applications
              </h1>

              <p className="mt-4 max-w-2xl text-slate-400">
                Review pending applications from users
                who want to become trainers.
              </p>
            </div>

            <button
              onClick={loadApplications}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold transition hover:border-emerald-500 hover:text-emerald-400 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <ClipboardList size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Pending Applications
              </p>

              <p className="text-3xl font-bold text-slate-900">
                {applications.length}
              </p>
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No Pending Applications
            </h2>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              There are currently no trainer applications
              waiting for review.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {applications.map((application) => {
              const trainerApplication =
                application.trainerApplication || {};

              const appliedDate =
                trainerApplication.appliedAt
                  ? new Date(
                      trainerApplication.appliedAt
                    ).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "Unknown";

              const isUpdating =
                updatingId === application._id;

              return (
                <div
                  key={application._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Card Header */}
                  <div className="border-b border-slate-100 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                          {application.image ||
                          application.photoURL ? (
                            <img
                              src={
                                application.image ||
                                application.photoURL
                              }
                              alt={
                                application.name ||
                                "Applicant"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            application.name
                              ?.charAt(0)
                              ?.toUpperCase() || "U"
                          )}
                        </div>

                        <div>
                          <h2 className="text-lg font-bold text-slate-900">
                            {application.name ||
                              "Unknown User"}
                          </h2>

                          <p className="text-sm text-slate-500">
                            {application.email}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
                        Pending
                      </span>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="space-y-5 p-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-emerald-500">
                        <BriefcaseBusiness
                          size={19}
                        />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Specialty
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {trainerApplication.specialty ||
                            "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-emerald-500">
                        <UserRound size={19} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Experience
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {trainerApplication.experience ||
                            "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-emerald-500">
                        <CalendarDays
                          size={19}
                        />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Applied On
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {appliedDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 border-t border-slate-100 bg-slate-50 p-6">
                    <button
                      onClick={() =>
                        reviewApplication(
                          application,
                          "approved"
                        )
                      }
                      disabled={isUpdating}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 size={18} />

                      {isUpdating
                        ? "Processing..."
                        : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        reviewApplication(
                          application,
                          "rejected"
                        )
                      }
                      disabled={isUpdating}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle size={18} />

                      {isUpdating
                        ? "Processing..."
                        : "Reject"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}