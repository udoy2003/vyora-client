"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ClassesPage() {
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 6,
    totalClasses: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (category) {
        params.append("category", category);
      }

      const response = await fetch(
       `${API_URL}/workouts/public?${params.toString()}`
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load classes");
      }

      setClasses(data.workouts || []);
      setPagination(
        data.pagination || {
          currentPage: 1,
          itemsPerPage: 6,
          totalClasses: 0,
          totalPages: 1,
        }
      );
    } catch (err) {
      console.error("Fetch classes error:", err);
      setError(err.message || "Failed to load classes");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchClasses();
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const goToPage = (newPage) => {
    if (
      newPage < 1 ||
      newPage > pagination.totalPages ||
      newPage === page
    ) {
      return;
    }

    setPage(newPage);
  };

  const getDifficultyClass = (difficulty) => {
    const value = difficulty?.toLowerCase();

    if (value === "beginner") {
      return "bg-green-100 text-green-700";
    }

    if (value === "intermediate") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (value === "advanced") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
     
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Search & Filter */}
        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-4 md:flex-row"
          >
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search Classes
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by class title..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="w-full md:w-64">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">All Categories</option>
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Yoga">Yoga</option>
                <option value="HIIT">HIIT</option>
                <option value="Flexibility">Flexibility</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Building">Muscle Building</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 md:w-auto"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Result Count */}
        {!loading && !error && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Available Classes
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {pagination.totalClasses} class
                {pagination.totalClasses !== 1 ? "es" : ""} found
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

            <p className="mt-4 text-gray-500">
              Loading classes...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-700">
            <p className="font-semibold">Failed to load classes</p>
            <p className="mt-1 text-sm">{error}</p>

            <button
              onClick={fetchClasses}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && classes.length === 0 && (
          <div className="rounded-2xl bg-white px-6 py-20 text-center shadow-sm">
            <div className="text-5xl">🏋️</div>

            <h3 className="mt-4 text-2xl font-bold text-gray-900">
              No Classes Found
            </h3>

            <p className="mt-2 text-gray-500">
              Try changing your search or category filter.
            </p>
          </div>
        )}

        {/* Classes */}
        {!loading && !error && classes.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((item) => (
                <div
                  key={item._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Card Header */}
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                    <span className="text-6xl">💪</span>
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {item.category || "Fitness"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyClass(
                          item.difficulty
                        )}`}
                      >
                        {item.difficulty || "All Levels"}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-xl font-bold text-gray-900">
                      {item.title}
                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Duration</span>
                        <span className="font-semibold text-gray-900">
                          {item.duration} min
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Exercises</span>
                        <span className="font-semibold text-gray-900">
                          {Array.isArray(item.exercises)
                            ? item.exercises.length
                            : 0}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        router.push(`/classes/${item._id}`)
                      }
                      className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold ${
                      pageNumber === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}