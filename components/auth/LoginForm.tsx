"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/rate");
      router.refresh();
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
          <h1 className="auth-card__title">Welcome Back</h1>
          <p className="auth-card__subtitle">Sign in to your StarRate account</p>
        </div>

        {error && (
          <div className="auth-error" role="alert" id="login-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">Email Address</label>
            <input
              id="login-email"
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
            <label htmlFor="login-password" className="auth-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`auth-btn animate-gradient-shift${loading ? " loading" : ""}`}
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <div className="auth-link-row">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="auth-link" id="login-register-link">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
