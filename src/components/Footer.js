
import Link from "next/link";
import { ArrowUpRight, Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="lg:pr-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950 transition-transform duration-200 group-hover:scale-105">
                <Dumbbell size={21} strokeWidth={2.5} />
              </span>

              <span className="text-2xl font-bold tracking-tight">
                VYORA
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              A modern fitness and gym management platform designed to make
              fitness simple, organized, and accessible.
            </p>

            <Link
              href="/classes"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Explore Classes
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
              Platform
            </h3>

            <div className="mt-5 space-y-3.5">
              <FooterLink href="/" label="Home" />
              <FooterLink href="/classes" label="Classes" />
              <FooterLink href="/forum" label="Community Forum" />
              <FooterLink href="/dashboard" label="Dashboard" />
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
              Account
            </h3>

            <div className="mt-5 space-y-3.5">
              <FooterLink href="/login" label="Login" />
              <FooterLink href="/register" label="Register" />
              <FooterLink
                href="/dashboard/bookings"
                label="My Bookings"
              />
              <FooterLink
                href="/dashboard/profile"
                label="Profile"
              />
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
              About VYORA
            </h3>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Train smarter, stay consistent, and build a healthier lifestyle
              with VYORA.
            </p>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Built for
              </p>

              <p className="mt-1 text-sm font-medium text-slate-200">
                Members • Trainers • Administrators
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-slate-800 pt-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500 sm:text-sm">
              © {new Date().getFullYear()} VYORA. All rights reserved.
            </p>

            <p className="text-xs leading-5 text-slate-500 sm:text-sm">
              Fitness & Gym Management Platform
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }) {
  return (
    <Link
      href={href}
      className="group flex w-fit items-center gap-1 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
    >
      <span>{label}</span>

      <ArrowUpRight
        size={14}
        className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
      />
    </Link>
  );
}
