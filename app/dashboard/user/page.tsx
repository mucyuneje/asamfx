// app/dashboard/user/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/jwt";
import UserDashboardContent from "./UserDashboardContent";

export default async function UserDashboardPage() {
  // Get token from cookies
  const token = (await cookies()).get("token")?.value;
  const payload: any = token ? verifyJwt(token) : null;

  // Redirect if no token or role is not USER
  if (!payload || payload.role !== "USER") {
    redirect("/login");
  }

  // Render user dashboard content
  return <UserDashboardContent />;
}
