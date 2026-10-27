import { DashboardChrome } from "@/components/DashboardChrome";
import { PeopleTable } from "@/components/PeopleTable";
import { getEmployees } from "@/lib/people";
import { requirePageEmployee } from "@/lib/session";

export default async function EmployeesPage() {
  const employee = await requirePageEmployee();
  const employees = await getEmployees();
  const isAdmin = employee.access === "admin";
  return (
    <DashboardChrome title="Employees" active="employees" employee={employee}>
      <div className="dashboard-page">
        <div className="page-heading"><span className="eyebrow">Team</span><h1>Employees</h1><p>{isAdmin ? "People available to handle Ampy jobs, and who can sign in." : "People available to handle Ampy jobs. Ask an admin to make changes."}</p></div>
        <PeopleTable type="employees" initial={employees} canEdit={isAdmin} currentEmployeeId={employee.id} />
      </div>
    </DashboardChrome>
  );
}
