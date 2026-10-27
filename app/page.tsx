import { DashboardChrome } from "@/components/DashboardChrome";
import { JobBoard } from "@/components/JobBoard";
import { getJobs } from "@/lib/jobs";
import { getCustomers, getEmployees } from "@/lib/people";
import { requirePageEmployee } from "@/lib/session";
import { parseStatus } from "@/lib/types";

type HomePageProps = {
  searchParams: Promise<{ search?: string; status?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const employee = await requirePageEmployee();
  const params = await searchParams;
  const [jobs, customers, employees] = await Promise.all([getJobs(), getCustomers(), getEmployees()]);

  return (
    <DashboardChrome title="Jobs" active="overview" employee={employee}>
      <JobBoard
        jobs={jobs}
        customers={customers}
        employees={employees}
        currentEmployee={employee}
        search={params.search?.trim() ?? ""}
        status={parseStatus(params.status)}
      />
    </DashboardChrome>
  );
}
