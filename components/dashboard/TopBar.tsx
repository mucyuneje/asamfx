"use client";

import { usePathname, useRouter } from "next/navigation";
import ThemeToggleButton from "../ThemeToggle";

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();

  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const pageTitle = pathSegments.length > 0
    ? pathSegments[pathSegments.length - 1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Dashboard";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <header className="w-full h-16 flex items-center justify-between px-6 bg-background border-b border-border text-foreground">
      <div className="flex flex-col">
        <h1 className="text-lg font-bold">{pageTitle}</h1>
        {pathSegments.length > 1 && (
          <p className="text-sm text-muted-foreground">
            {pathSegments.join(" / ").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggleButton />
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
