import { AdminJobs } from "@/components/AdminJobs";
import { getJobs } from "@/lib/jobs";
import { cookies } from "next/headers";
import { COOKIE_NAME, isAdminCookie } from "@/lib/admin-auth";
import { AdminLogin } from "@/components/AdminLogin";

export default async function AdminPage() {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!isAdminCookie(cookie)) return <AdminLogin />;
  return <AdminJobs initialJobs={await getJobs()} />;
}
