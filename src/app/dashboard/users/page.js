"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldOff,
  UserCog,
  RefreshCw,
} from "lucide-react";

const API_URL = "http://localhost:5000";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // =========================
  // Load Users
  // =========================
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/users/admin/users`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load users"
        );
      }

      setUsers(data.users || []);
    } catch (err) {
      console.error("Load users error:", err);

      setError(
        err.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =========================
  // Block / Unblock User
  // =========================
  const updateStatus = async (user) => {
    const newStatus =
      user.status === "blocked"
        ? "active"
        : "blocked";

    const confirmed = window.confirm(
      `Are you sure you want to ${
        newStatus === "blocked"
          ? "block"
          : "unblock"
      } ${user.name}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(user._id);

      const response = await fetch(
        `${API_URL}/api/users/admin/users/${user._id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update user status"
        );
      }

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item._id === user._id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "Update user status error:",
        err
      );

      alert(
        err.message ||
          "Failed to update user status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // Change Role
  // =========================
  const updateRole = async (user, newRole) => {
    if (newRole === user.role) return;

    const confirmed = window.confirm(
      `Change ${user.name}'s role to ${newRole}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(user._id);

      const response = await fetch(
        `${API_URL}/api/users/admin/users/${user._id}/role`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update user role"
        );
      }

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item._id === user._id
            ? {
                ...item,
                role: newRole,
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "Update user role error:",
        err
      );

      alert(
        err.message ||
          "Failed to update user role"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Admin Dashboard
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              User Management
            </h1>

            <p className="mt-4 max-w-2xl text-slate-400">
              Manage members, trainers and account
              access from one place.
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
              Loading users...
            </p>
          </div>
        </section>
      </main>
    );
  }

  // =========================
  // Page
  // =========================
  return (
    <main className="min-h-screen bg-slate-50">
      {/* =========================
          Hero
      ========================= */}
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Admin Dashboard
          </p>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold md:text-5xl">
                User Management
              </h1>

              <p className="mt-4 max-w-2xl text-slate-400">
                Manage members, trainers and account
                access from one place.
              </p>
            </div>

            <button
              onClick={loadUsers}
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

      {/* =========================
          Content
      ========================= */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* =========================
            Stats
        ========================= */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Users
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {users.length}
            </p>
          </div>

          {/* Trainers */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Trainers
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {
                users.filter(
                  (user) =>
                    user.role === "trainer"
                ).length
              }
            </p>
          </div>

          {/* Blocked */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Blocked
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {
                users.filter(
                  (user) =>
                    user.status === "blocked"
                ).length
              }
            </p>
          </div>
        </div>

        {/* =========================
            User Table
        ========================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {users.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-slate-500">
                No users found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* User */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-bold text-emerald-700">
                            {user.image ||
                            user.photoURL ? (
                              <img
                                src={
                                  user.image ||
                                  user.photoURL
                                }
                                alt={
                                  user.name ||
                                  "User"
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              user.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                              "U"
                            )}
                          </div>

                          {/* Name */}
                          <div>
                            <p className="font-semibold text-slate-900">
                              {user.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {user.phone ||
                                "No phone"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-5">
                        <select
                          value={
                            user.role || "user"
                          }
                          disabled={
                            updatingId ===
                            user._id
                          }
                          onChange={(e) =>
                            updateRole(
                              user,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="user">
                            Member
                          </option>

                          <option value="trainer">
                            Trainer
                          </option>

                          <option value="admin">
                            Admin
                          </option>
                        </select>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        {user.status ===
                        "blocked" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
                            <ShieldOff
                              size={14}
                            />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <ShieldCheck
                              size={14}
                            />
                            Active
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() =>
                            updateStatus(user)
                          }
                          disabled={
                            updatingId ===
                            user._id
                          }
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            user.status ===
                            "blocked"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          {user.status ===
                          "blocked" ? (
                            <>
                              <ShieldCheck
                                size={16}
                              />
                              Unblock
                            </>
                          ) : (
                            <>
                              <ShieldOff
                                size={16}
                              />
                              Block
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =========================
            Info
        ========================= */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          <UserCog
            size={18}
            className="mt-0.5 shrink-0 text-emerald-500"
          />

          <p>
            Blocked users can still log in and browse
            the platform, but server-side restrictions
            prevent them from performing protected
            actions such as booking classes, applying
            as a trainer, and interacting with forum
            content.
          </p>
        </div>
      </section>
    </main>
  );
}