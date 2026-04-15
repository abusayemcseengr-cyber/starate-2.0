"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      {/* Aurora blobs */}
      <div className="auth-page__bg">
        <div className="auth-page__blob auth-page__blob--1" />
        <div className="auth-page__blob auth-page__blob--2" />
        <div className="auth-page__blob auth-page__blob--3" />
      </div>

      <div className="auth-card">
        <div className="auth-card__logo">
          <div className="auth-card__logo-icon">⭐</div>
          <h1 className="auth-card__title">Join StarRate</h1>
          <p className="auth-card__subtitle">Create your account to start rating</p>
        </div>

        {error && (
          <div className="auth-error" role="alert" id="register-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="register-name" className="auth-label">Full Name</label>
            <input
              id="register-name"
              type="text"
              className="auth-input"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email" className="auth-label">Email Address</label>
            <input
              id="register-email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password" className="auth-label">Password</label>
            <input
              id="register-password"
              type="password"
              className="auth-input"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className={`auth-btn animate-gradient-shift${loading ? " loading" : ""}`}
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <div className="auth-link-row">
          Already have an account?{" "}
          <Link href="/login" className="auth-link" id="register-login-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
