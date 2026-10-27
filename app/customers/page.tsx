import Link from "next/link"; import { getCustomers } from "@/lib/people";
import { DashboardChrome } from "@/components/DashboardChrome";
import { PeopleTable } from "@/components/PeopleTable";
export default async function CustomersPage() { const customers = await getCustomers(); return <DashboardChrome title="Customers"><div className="dashboard-page"><div className="page-heading"><span className="eyebrow">Directory</span><h1>Customers</h1><p>People and businesses behind the work queue.</p></div><PeopleTable type="customers" initial={customers} /></div></DashboardChrome>; }
