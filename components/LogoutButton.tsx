"use client";

import { useState } from "react";

export function LogoutButton() {
  const [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    await fetch("/api/logout", { method: "POST" }).catch(() => null);
    window.location.href = "/login";
  }
  return <button type="button" className="table-action" onClick={logout} disabled={busy}>{busy ? "Signing out…" : "Sign out"}</button>;
}
