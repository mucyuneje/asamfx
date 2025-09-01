import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/jwt"; // your JWT verify helper

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      // No token → send to login
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload = verifyJwt(token);

    if (!payload) {
      // Invalid token → send to login
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ Role-based protection
    if (pathname.startsWith("/dashboard/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }

    if (pathname.startsWith("/dashboard/user") && payload.role !== "USER") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
  }

  // Allow the request
  return NextResponse.next();
}

// Apply middleware to dashboard routes only
export const config = {
  matcher: ["/dashboard/:path*"],
};
