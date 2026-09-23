"use client";

import { useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/users/reset-password", {
        email: formData.email,
        newPassword: formData.newPassword,
      });

      setMessage(response.data.message);

      setFormData({
        email: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Reset Your Password</h1>

      <p>
        Enter your registered email address and choose a new password.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your registered email"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword">New Password</label>

          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter your new password"
            minLength="6"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm New Password</label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your new password"
            minLength="6"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <p>
        Remember your password? <Link href="/login">Login</Link>
      </p>
    </main>
  );
}