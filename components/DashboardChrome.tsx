import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/LogoutButton";
import type { CurrentEmployee } from "@/lib/session";

type Props = {
  children: ReactNode;
  title: string;
  active: "overview" | "customers" | "employees";
  employee: CurrentEmployee;
  sidebarExtra?: ReactNode;
};

export function DashboardChrome({ children, title, active, employee, sidebarExtra }: Props) {
  const link = (key: Props["active"], href: string, label: string) => (
    <Link className={`sidebar-link ${active === key ? "sidebar-link-active" : ""}`} href={href} aria-current={active === key ? "page" : undefined}>{label}</Link>
  );
  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link className="sidebar-brand" href="/"><img className="brand-logo" src="https://ampy.com.au/wp-content/uploads/2025/09/logo.png" alt="Ampy Electrical" /></Link>
        <div className="sidebar-label">Workspace</div>
        <nav className="sidebar-directory-links" aria-label="Workspace">
          {link("overview", "/", "Overview")}
          {link("customers", "/customers", "Customers")}
          {link("employees", "/employees", "Employees")}
        </nav>
        {sidebarExtra}
        <div className="sidebar-spacer" />
        <div className="sidebar-account">
          <span>Signed in as <strong>{employee.name}</strong></span>
          <LogoutButton />
        </div>
      </aside>
      <section className="dashboard-main">
        <header className="topbar">
          <span className="brand-context">Operations workspace</span>
          <div className="topbar-page-title">{title}</div>
          <a className="brand-call" href="tel:0344163638">Call Ampy · (03) 4416 3638</a>
        </header>
        {children}
      </section>
    </main>
  );
}
