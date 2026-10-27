import { DashboardChrome } from "@/components/DashboardChrome";
import { PeopleTable } from "@/components/PeopleTable";
import { getCustomers } from "@/lib/people";
import { requirePageEmployee } from "@/lib/session";

export default async function CustomersPage() {
  const employee = await requirePageEmployee();
  const customers = await getCustomers();
  return (
    <DashboardChrome title="Customers" active="customers" employee={employee}>
      <div className="dashboard-page">
        <div className="page-heading"><span className="eyebrow">Directory</span><h1>Customers</h1><p>People and businesses behind the work queue.</p></div>
        <PeopleTable type="customers" initial={customers} canEdit currentEmployeeId={employee.id} />
      </div>
    </DashboardChrome>
  );
}
