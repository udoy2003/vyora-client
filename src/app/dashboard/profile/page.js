"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/users/profile");
        setUser(response.data.user);
      } catch (error) {
        if (error.response?.status === 401) {
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-10">
        <div className="mx-auto max-w-4xl">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-8 h-80 animate-pulse rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Please login first.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-extrabold text-emerald-600">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-slate-950">
                My Profile
              </h1>

              <p className="mt-1 text-slate-500">
                Account information
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-sm font-semibold text-slate-400">
                Name
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-400">
                Email
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-400">
                Role
              </p>

              <span className="mt-1 inline-block rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold capitalize text-emerald-700">
                {user.role}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-400">
                Phone
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {user.phone || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-400">
                Account Created
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}