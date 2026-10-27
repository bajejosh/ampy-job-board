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

  return <main className="admin-shell"><div className="admin-login card"><p className="eyebrow">Ampy Services</p><h1>Admin workspace</h1><p>Enter the admin password to manage jobs.</p><form onSubmit={submit}><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus required /></label><button type="submit">Continue</button>{error && <p className="form-error">{error}</p>}</form></div></main>;
}
