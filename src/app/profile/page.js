"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("vyora_token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await api.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error("Profile error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <h1>My VYORA Profile</h1>

      {user && (
        <div>
          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      )}

      <button
         onClick={() => {
         localStorage.removeItem("vyora_token");
         window.location.href = "/login";
         }}
>
  Logout
</button>
    </main>
  );
}