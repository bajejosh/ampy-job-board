import { JobBoard } from "@/components/JobBoard";
import { getJobs } from "@/lib/jobs";
import { parseStatus } from "@/lib/types";

type HomePageProps = {
  searchParams: Promise<{ search?: string; status?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const status = parseStatus(params.status);
  const jobs = await getJobs({ search, status });

  return <JobBoard jobs={jobs} search={search} status={status} />;
}
