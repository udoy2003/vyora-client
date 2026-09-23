
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Dumbbell,
  FileText,
  Heart,
  ShieldCheck,
  Users,
  UserRound,
  Plus,
  MessageSquare,
  Clock3,
} from "lucide-react";
import Link from "next/link";
import api from "../../../lib/api";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const profileResponse = await api.get("/users/profile");
        const currentUser = profileResponse.data?.user;

        setUser(currentUser);

        const bookingPromise = api
          .get("/bookings/my")
          .catch(() => ({ data: { bookings: [] } }));

        const favoritePromise = api
          .get("/workouts/favorites/my")
          .catch(() => null);

        let workoutPromise = Promise.resolve(null);

        if (currentUser?.role === "trainer") {
          workoutPromise = api
            .get("/workouts")
            .catch(() => null);
        }

        const [
          bookingsResponse,
          favoritesResponse,
          workoutsResponse,
        ] = await Promise.all([
          bookingPromise,
          favoritePromise,
          workoutPromise,
        ]);

        setBookings(bookingsResponse?.data?.bookings || []);
        setFavorites(favoritesResponse?.data?.favorites || []);
        setWorkouts(workoutsResponse?.data?.workouts || []);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  const role = user?.role || "user";

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "paid"
  ).length;

  const totalDuration = workouts.reduce(
    (total, workout) => total + Number(workout.duration || 0),
    0
  );

  const categories = new Set(
    workouts.map((workout) => workout.category).filter(Boolean)
  ).size;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-600">
                Welcome back
              </p>

              <h1 className="mt-1 text-3xl font-black text-slate-900">
                {user?.name || "User"}
              </h1>

              <p className="mt-2 text-slate-600">
                Manage your VYORA account and activities.
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-900 px-4 py-2 text-sm font-bold capitalize text-white">
              {role}
            </span>
          </div>
        </div>

        {role === "user" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Bookings"
                value={bookings.length}
                icon={CalendarDays}
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <StatCard
                title="Paid Bookings"
                value={paidBookings}
                icon={CheckCircle2}
                iconClass="bg-blue-50 text-blue-600"
              />

              <StatCard
                title="Favorites"
                value={favorites.length}
                icon={Heart}
                iconClass="bg-rose-50 text-rose-600"
              />

              <StatCard
                title="Account Status"
                value={user?.status || "active"}
                icon={UserRound}
                iconClass="bg-purple-50 text-purple-600"
                capitalize
              />
            </div>

            <div className="mt-10">
              <SectionTitle
                title="Quick Actions"
                subtitle="Everything you need to manage your fitness journey."
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ActionCard
                  href="/classes"
                  icon={Dumbbell}
                  title="Browse Classes"
                  description="Explore approved fitness classes."
                />

                <ActionCard
                  href="/dashboard/bookings"
                  icon={CalendarDays}
                  title="My Bookings"
                  description="View your booked classes and schedule."
                />

                <ActionCard
                  href="/forum"
                  icon={MessageSquare}
                  title="Community Forum"
                  description="Read discussions and join the community."
                />

                <ActionCard
                  href="/dashboard/trainer-application"
                  icon={ClipboardList}
                  title="Become a Trainer"
                  description="Apply to become a VYORA trainer."
                />
              </div>
            </div>

            <DashboardSection
              className="mt-8"
              eyebrow="Your Schedule"
              title="Recent Bookings"
              description="Your latest class bookings."
              actionHref="/dashboard/bookings"
              actionText="View All"
            >
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <EmptyState
                    icon={CalendarDays}
                    title="No bookings yet"
                    description="Browse classes and book your first fitness session."
                    href="/classes"
                    button="Browse Classes"
                  />
                ) : (
                  bookings.slice(0, 5).map((booking) => (
                    <BookingRow
                      key={booking._id}
                      booking={booking}
                    />
                  ))
                )}
              </div>
            </DashboardSection>

            <DashboardSection
              className="mt-8"
              eyebrow="Saved Classes"
              title="My Favorites"
              description="Classes you saved for later."
              actionHref="/classes"
              actionText="Explore Classes"
            >
              {favorites.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title="No favorite classes"
                  description="Save classes you want to access later."
                  href="/classes"
                  button="Explore Classes"
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {favorites.slice(0, 6).map((item) => {
                    const workout = item.workout;

                    if (!workout) return null;

                    return (
                      <motion.div
                        key={item._id}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-shadow hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="rounded-xl bg-rose-50 p-3">
                            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
                          </div>

                          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
                            {workout.category}
                          </span>
                        </div>

                        <h3 className="mt-5 line-clamp-1 text-lg font-bold text-slate-900">
                          {workout.title}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                          {workout.duration} min{" "}
                          {workout.difficulty
                            ? `• ${workout.difficulty}`
                            : ""}
                        </p>

                        <Link
                          href={`/classes/${workout._id}`}
                          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
                        >
                          View Details
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </DashboardSection>
          </>
        )}

        {role === "trainer" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="My Classes"
                value={workouts.length}
                icon={Dumbbell}
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <StatCard
                title="Total Duration"
                value={`${totalDuration} min`}
                icon={Clock3}
                iconClass="bg-blue-50 text-blue-600"
              />

              <StatCard
                title="Categories"
                value={categories}
                icon={Dumbbell}
                iconClass="bg-purple-50 text-purple-600"
              />

              <StatCard
                title="Bookings"
                value={bookings.length}
                icon={CalendarDays}
                iconClass="bg-amber-50 text-amber-600"
              />
            </div>

            <div className="mt-10">
              <SectionTitle
                title="Trainer Tools"
                subtitle="Create classes and manage your trainer activities."
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ActionCard
                  href="/dashboard/classes"
                  icon={Dumbbell}
                  title="My Classes"
                  description="Create, edit and manage your classes."
                />

                <ActionCard
                  href="/dashboard/classes"
                  icon={Plus}
                  title="Create Class"
                  description="Submit a new fitness class for approval."
                />

                <ActionCard
                  href="/dashboard/forum/create"
                  icon={FileText}
                  title="Create Forum Post"
                  description="Share fitness knowledge with members."
                />

                <ActionCard
                  href="/forum"
                  icon={MessageSquare}
                  title="Forum"
                  description="View community discussions."
                />
              </div>
            </div>

            <DashboardSection
              className="mt-8"
              eyebrow="Trainer Classes"
              title="Recent Classes"
              description="Your latest submitted fitness classes."
              actionHref="/dashboard/classes"
              actionText="Manage"
            >
              <div className="space-y-3">
                {workouts.length === 0 ? (
                  <EmptyState
                    icon={Dumbbell}
                    title="No classes yet"
                    description="Create your first class to get started."
                    href="/dashboard/classes"
                    button="Create Class"
                  />
                ) : (
                  workouts.slice(0, 5).map((workout) => (
                    <div
                      key={workout._id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/20 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <Dumbbell className="h-5 w-5 text-emerald-600" />
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900">
                            {workout.title}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {workout.category} • {workout.duration} min
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={workout.status || "pending"} />
                    </div>
                  ))
                )}
              </div>
            </DashboardSection>
          </>
        )}

        {role === "admin" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Admin Account"
                value="Active"
                icon={ShieldCheck}
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <StatCard
                title="Bookings"
                value={bookings.length}
                icon={CalendarDays}
                iconClass="bg-blue-50 text-blue-600"
              />

              <StatCard
                title="Forum"
                value="Manage"
                icon={MessageSquare}
                iconClass="bg-purple-50 text-purple-600"
              />

              <StatCard
                title="Platform"
                value="Control"
                icon={ShieldCheck}
                iconClass="bg-amber-50 text-amber-600"
              />
            </div>

            <div className="mt-10">
              <SectionTitle
                title="Administration"
                subtitle="Manage users, trainers, classes and community content."
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ActionCard
                  href="/dashboard/users"
                  icon={Users}
                  title="Manage Users"
                  description="View, block and manage user accounts."
                />

                <ActionCard
                  href="/dashboard/trainer-applications"
                  icon={ClipboardList}
                  title="Trainer Applications"
                  description="Review pending trainer applications."
                />

                <ActionCard
                  href="/dashboard/classes-management"
                  icon={Dumbbell}
                  title="Manage Classes"
                  description="Approve, reject and delete classes."
                />

                <ActionCard
                  href="/dashboard/forum"
                  icon={MessageSquare}
                  title="Manage Forum"
                  description="Manage community forum posts."
                />
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <ActionCard
                href="/dashboard/users"
                icon={ShieldCheck}
                title="Platform Control"
                description="Manage accounts and platform access."
                large
              />

              <ActionCard
                href="/forum"
                icon={MessageSquare}
                title="View Public Forum"
                description="Preview the public community experience."
                large
              />
            </div>
          </>
        )}

        <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <UserRound className="h-7 w-7 text-emerald-600" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Account
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {user?.name || "User"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {user?.email}
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/profile"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              View Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconClass,
  capitalize = false,
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 truncate text-2xl font-black tracking-tight text-slate-900 ${
              capitalize ? "capitalize" : ""
            }`}
          >
            {value}
          </p>
        </div>

        <div className={`shrink-0 rounded-2xl p-3.5 ${iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

function ActionCard({
  href,
  icon: Icon,
  title,
  description,
  large = false,
}) {
  return (
    <Link href={href} className="block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={`group h-full rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md ${
          large ? "min-h-[150px] p-6" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-xl bg-emerald-50 p-3 transition-colors group-hover:bg-emerald-100">
            <Icon className="h-6 w-6 text-emerald-600" />
          </div>

          <ArrowRight className="h-5 w-5 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-emerald-600" />
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </motion.div>
    </Link>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

function DashboardSection({
  eyebrow,
  title,
  description,
  actionHref,
  actionText,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">
            {eyebrow}
          </p>

          <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          )}
        </div>

        {actionHref && (
          <Link
            href={actionHref}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            {actionText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  href,
  button,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-5 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
        <Icon className="h-7 w-7 text-slate-400" />
      </div>

      <p className="mt-4 font-bold text-slate-900">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {href && (
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          {button}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function BookingRow({ booking }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/20">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="shrink-0 rounded-xl bg-white p-3 shadow-sm">
            <Dumbbell className="h-5 w-5 text-emerald-600" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-900">
              {booking.title || "Fitness Class"}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {booking.category || "Fitness"}
              {booking.duration
                ? ` • ${booking.duration} min`
                : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <InfoBox
            label="Date"
            value={booking.bookingDate || "N/A"}
          />

          <InfoBox
            label="Time"
            value={`${booking.startTime || "N/A"} - ${
              booking.endTime || "N/A"
            }`}
          />

          <InfoBox
            label="Payment"
            value={booking.paymentStatus || "N/A"}
            valueClass="capitalize text-emerald-700"
          />
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, valueClass = "" }) {
  return (
    <div className="min-w-0 rounded-xl bg-white px-3 py-2.5 shadow-sm">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-sm font-semibold text-slate-800 ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    approved: "bg-emerald-50 text-emerald-700",
    confirmed: "bg-emerald-50 text-emerald-700",
    paid: "bg-blue-50 text-blue-700",
    pending: "bg-amber-50 text-amber-700",
    rejected: "bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}
