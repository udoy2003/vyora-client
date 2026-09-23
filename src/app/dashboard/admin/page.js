"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  UserCog,
  Dumbbell,
  Ban,
  CheckCircle,
  Lock,
  Unlock,
  UserRoundCheck,
  UserRoundX,
  Clock3,
  Trash2,
  Check,
  X,
} from "lucide-react";
import api from "../../../../lib/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [classesLoading, setClassesLoading] = useState(true);

  const [updatingId, setUpdatingId] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [classUpdatingId, setClassUpdatingId] = useState(null);

  const [feedback, setFeedback] = useState({});

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/admin/users");
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get(
        "/users/admin/trainer-applications"
      );
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("Failed to load trainer applications:", error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get("/workouts/admin/all");
      setClasses(response.data.workouts || []);
    } catch (error) {
      console.error("Failed to load classes:", error);
    } finally {
      setClassesLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchApplications();
    fetchClasses();
  }, []);

  const handleStatusChange = async (user) => {
    const newStatus =
      user.status === "blocked" ? "active" : "blocked";

    try {
      setUpdatingId(user._id);

      await api.patch(
        `/users/admin/users/${user._id}/status`,
        {
          status: newStatus,
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === user._id
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update user status:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update user status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      await api.patch(
        `/users/admin/users/${user._id}/role`,
        {
          role: newRole,
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === user._id
            ? { ...item, role: newRole }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update user role:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update user role"
      );
    }
  };

  const handleApplicationReview = async (
    application,
    status
  ) => {
    try {
      setReviewingId(application._id);

      await api.patch(
        `/users/admin/trainer-applications/${application._id}`,
        {
          status,
          feedback: feedback[application._id] || "",
        }
      );

      setApplications((currentApplications) =>
        currentApplications.filter(
          (item) => item._id !== application._id
        )
      );

      await fetchUsers();
    } catch (error) {
      console.error(
        "Failed to review trainer application:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to review application"
      );
    } finally {
      setReviewingId(null);
    }
  };

  const handleClassStatus = async (workout, status) => {
    try {
      setClassUpdatingId(workout._id);

      await api.patch(
        `/workouts/admin/${workout._id}/status`,
        {
          status,
        }
      );

      setClasses((currentClasses) =>
        currentClasses.map((item) =>
          item._id === workout._id
            ? {
                ...item,
                status,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update class status:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update class status"
      );
    } finally {
      setClassUpdatingId(null);
    }
  };

  const handleDeleteClass = async (workout) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${workout.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setClassUpdatingId(workout._id);

      await api.delete(`/workouts/admin/${workout._id}`);

      setClasses((currentClasses) =>
        currentClasses.filter(
          (item) => item._id !== workout._id
        )
      );
    } catch (error) {
      console.error("Failed to delete class:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete class"
      );
    } finally {
      setClassUpdatingId(null);
    }
  };

  const totalUsers = users.length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin"
  ).length;

  const totalTrainers = users.filter(
    (user) => user.role === "trainer"
  ).length;

  const blockedUsers = users.filter(
    (user) => user.status === "blocked"
  ).length;

  const pendingClasses = classes.filter(
    (workout) => workout.status === "pending"
  ).length;

  const approvedClasses = classes.filter(
    (workout) => workout.status === "approved"
  ).length;

  const rejectedClasses = classes.filter(
    (workout) => workout.status === "rejected"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
                <Dumbbell
                  size={30}
                  strokeWidth={2.5}
                  className="text-white"
                />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">
                  VYORA
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Admin Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-600">
                  Manage your fitness platform
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <ShieldCheck size={18} />
              Administrator
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {totalUsers}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Admins
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {totalAdmins}
                </h2>
              </div>

              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                <ShieldCheck size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Trainers
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {totalTrainers}
                </h2>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <UserCog size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Blocked Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {blockedUsers}
                </h2>
              </div>

              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <Ban size={24} />
              </div>
            </div>
          </motion.div>
        </div>

       

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Class Management
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Review and manage fitness classes submitted by trainers.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  {pendingClasses} Pending
                </span>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  {approvedClasses} Approved
                </span>

                <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
                  {rejectedClasses} Rejected
                </span>
              </div>
            </div>
          </div>

          {classesLoading ? (
            <div className="px-6 py-12 text-center text-slate-600">
              Loading classes...
            </div>
          ) : classes.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Dumbbell
                size={42}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 font-semibold text-slate-800">
                No classes found
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Submitted classes will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 p-6 md:grid-cols-2">
              {classes.map((workout) => {
                const isUpdating =
                  classUpdatingId === workout._id;

                return (
                  <motion.div
                    key={workout._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                          <Dumbbell size={21} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold capitalize text-slate-900">
                            {workout.title}
                          </h3>

                          <p className="text-sm text-slate-600">
                            Trainer ID: {workout.userId}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                          workout.status === "approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : workout.status === "rejected"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {workout.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs font-medium text-slate-600">
                          Category
                        </p>

                        <p className="mt-1 text-sm font-bold capitalize text-slate-900">
                          {workout.category}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs font-medium text-slate-600">
                          Duration
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {workout.duration} min
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs font-medium text-slate-600">
                          Difficulty
                        </p>

                        <p className="mt-1 text-sm font-bold capitalize text-slate-900">
                          {workout.difficulty}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs font-medium text-slate-600">
                          Exercises
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {workout.exercises?.length || 0}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {workout.status !== "approved" && (
                        <button
                          onClick={() =>
                            handleClassStatus(
                              workout,
                              "approved"
                            )
                          }
                          disabled={isUpdating}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Check size={16} />
                          Approve
                        </button>
                      )}

                      {workout.status !== "rejected" && (
                        <button
                          onClick={() =>
                            handleClassStatus(
                              workout,
                              "rejected"
                            )
                          }
                          disabled={isUpdating}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <X size={16} />
                          Reject
                        </button>
                      )}

                      {workout.status !== "pending" && (
                        <button
                          onClick={() =>
                            handleClassStatus(
                              workout,
                              "pending"
                            )
                          }
                          disabled={isUpdating}
                          className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Clock3 size={16} />
                          Pending
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleDeleteClass(workout)
                        }
                        disabled={isUpdating}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">
              User Management
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Manage user accounts, roles and access status.
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-slate-600">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-600">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      User
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Role
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const isBlocked = user.status === "blocked";
                    const isAdmin = user.role === "admin";
                    const isUpdating = updatingId === user._id;

                    return (
                      <tr
                        key={user._id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.image || user.photoURL ? (
                              <img
                                src={
                                  user.image ||
                                  user.photoURL
                                }
                                alt={user.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                                {user.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "U"}
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-slate-900">
                                {user.name}
                              </p>

                              <p className="text-xs text-slate-600">
                                {user._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {user.email}
                        </td>

                        <td className="px-6 py-4">
                          {isAdmin ? (
                            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                              Admin
                            </span>
                          ) : (
                            <select
                              value={user.role || "user"}
                              onChange={(e) =>
                                handleRoleChange(
                                  user,
                                  e.target.value
                                )
                              }
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium capitalize text-slate-700 outline-none focus:border-emerald-500"
                            >
                              <option value="user">
                                User
                              </option>

                              <option value="trainer">
                                Trainer
                              </option>

                              <option value="admin">
                                Admin
                              </option>
                            </select>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                              isBlocked
                                ? "bg-red-50 text-red-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {isBlocked ? (
                              <Ban size={13} />
                            ) : (
                              <CheckCircle size={13} />
                            )}

                            {isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          {isAdmin ? (
                            <span className="text-xs font-medium text-slate-600">
                              Admin
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                handleStatusChange(user)
                              }
                              disabled={isUpdating}
                              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                isBlocked
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                  : "bg-red-50 text-red-600 hover:bg-red-100"
                              }`}
                            >
                              {isBlocked ? (
                                <>
                                  <Unlock size={16} />
                                  {isUpdating
                                    ? "Unblocking..."
                                    : "Unblock"}
                                </>
                              ) : (
                                <>
                                  <Lock size={16} />
                                  {isUpdating
                                    ? "Blocking..."
                                    : "Block"}
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}