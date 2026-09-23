"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Dumbbell, Menu, X } from "lucide-react";
import api from "../../lib/api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const response = await api.get("/users/profile");

        if (mounted) {
          setUser(response.data?.user || null);
        }
      } catch (error) {
        if (mounted) {
          setUser(null);
        }
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setMenuOpen(false);
      window.location.href = "/login";
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900"
        >
          <Dumbbell size={27} strokeWidth={2.5} />
          VYORA
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="font-medium text-slate-700 transition hover:text-emerald-600"
          >
            Home
          </Link>

          <Link
            href="/classes"
            className="font-medium text-slate-700 transition hover:text-emerald-600"
          >
            Classes
          </Link>

          <Link
            href="/forum"
            className="font-medium text-slate-700 transition hover:text-emerald-600"
          >
            Forum
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className="font-medium text-slate-700 transition hover:text-emerald-600"
            >
              Dashboard
            </Link>
          )}

          {user && (
            <Link
              href="/dashboard/bookings"
              className="font-medium text-slate-700 transition hover:text-emerald-600"
            >
              My Bookings
            </Link>
          )}

          {user ? (
            <>
              <Link
                href="/dashboard/profile"
                className="rounded-full bg-emerald-50 px-4 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                {user.name || "Profile"}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-emerald-600 px-5 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white transition hover:bg-emerald-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="ml-auto rounded-lg bg-emerald-600 p-3 text-white transition hover:bg-emerald-700 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="absolute right-4 top-full mt-3 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
            >
              Home
            </Link>

            <Link
              href="/classes"
              onClick={closeMenu}
              className="rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
            >
              Classes
            </Link>

            <Link
              href="/forum"
              onClick={closeMenu}
              className="rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
            >
              Forum
            </Link>

            {user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
                >
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/bookings"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
                >
                  My Bookings
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={closeMenu}
                  className="rounded-lg bg-emerald-50 px-3 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  {user.name || "Profile"}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-left font-semibold text-white transition hover:bg-emerald-700"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="mt-1 rounded-lg border border-emerald-600 px-4 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}