// components/dashboard/DashboardLayout.tsx
"use client";

import { ReactNode } from "react";
import { AppSidebar } from "./AppSideBar";
import TopBar from "./TopBar";

export default function DashboardLayout({ children, sidebarData }: { children: ReactNode; sidebarData: any }) {
  return (
    <div className="flex bg-background text-foreground">
      <AppSidebar sidebarData={sidebarData} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
