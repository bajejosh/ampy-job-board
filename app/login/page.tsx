"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
      });
      if (response.ok) {
        window.location.href = "/";
        return;
      }
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? "Couldn't sign in. Try again.");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    }
    setBusy(false);
  }

  return (
    <main className="login-page">
      <section className="login-intro">
        <img className="admin-login-logo" src="https://ampy.com.au/wp-content/uploads/2025/09/logo.png" alt="Ampy Electrical" />
        <p className="eyebrow">Ampy operations</p>
        <h1>Keep every job moving.</h1>
        <p>One place for the team to manage customers, jobs, and internal updates.</p>
      </section>
      <form className="admin-login login-card" onSubmit={submit}>
        <div className="login-card-heading">
          <span className="eyebrow">Welcome back</span>
          <h2>Sign in to your workspace</h2>
          <p>Use your employee account to continue.</p>
        </div>
        <label>Email<input name="email" type="email" autoComplete="username" placeholder="you@ampy.com.au" required autoFocus /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required /></label>
        <button className="button button-primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>
    </main>
  );
}
