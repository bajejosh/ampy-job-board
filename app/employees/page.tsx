import Link from "next/link"; import { getEmployees } from "@/lib/people";
import { DashboardChrome } from "@/components/DashboardChrome";
import { PeopleTable } from "@/components/PeopleTable";
export default async function EmployeesPage() { const employees = await getEmployees(); return <DashboardChrome title="Employees"><div className="dashboard-page"><div className="page-heading"><span className="eyebrow">Team</span><h1>Employees</h1><p>People available to handle Ampy jobs.</p></div><PeopleTable type="employees" initial={employees} /></div></DashboardChrome>; }
