import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/jwt";
import AdminDashboardContent from "./AdminDashboardContent";

export default async function AdminDashboardPage() {
  const token = (await cookies()).get("token")?.value;
  const payload: any = token ? verifyJwt(token) : null;

  if (!payload || payload.role !== "ADMIN") {
    redirect("/login");
  }

  return <AdminDashboardContent />;
}
