import { JobBoard } from "@/components/JobBoard";
import { getJobs } from "@/lib/jobs";
import { parseStatus } from "@/lib/types";
import { getEmployees } from "@/lib/people";

type HomePageProps = {
  searchParams: Promise<{ search?: string; status?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const status = parseStatus(params.status);
  const jobs = await getJobs();
  const employees = await getEmployees();

  return <JobBoard jobs={jobs} employees={employees} search={search} status={status} />;
}
