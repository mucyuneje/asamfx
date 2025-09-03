// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/jwt";

export default function DashboardRoot() {
  // 1️⃣ Get JWT from cookie
  const token = cookies().get("token")?.value;

  // 2️⃣ Verify JWT
  const payload: any = token ? verifyJwt(token) : null;

  // 3️⃣ If no valid token, redirect to login
  if (!payload) {
    redirect("/login");
  }

  // 4️⃣ Redirect based on role
  if (payload.role === "ADMIN") {
    redirect("/dashboard/admin");
  } else if (payload.role === "USER") {
    redirect("/dashboard/user");
  } else {
    // fallback for unknown roles
    redirect("/login");
  }

  // This page doesn't render anything, it just redirects
  return null;
}
