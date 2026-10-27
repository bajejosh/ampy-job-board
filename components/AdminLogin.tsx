"use client";

import { FormEvent, useState } from "react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!response.ok) {
      setError("That password was not accepted.");
      return;
    }
    window.location.reload();
  }

  return <main className="admin-shell"><div className="admin-login card"><img className="admin-login-logo" src="https://ampy.com.au/wp-content/uploads/2025/09/logo.png" alt="Ampy Electrical" /><p className="eyebrow">Operations workspace</p><h1>Admin workspace</h1><p>Enter the admin password to manage jobs.</p><form onSubmit={submit}><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus required /></label><button className="button button-primary" type="submit">Continue</button>{error && <p className="form-error">{error}</p>}</form></div></main>;
}
