// components/dashboard/AppSidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ASAM_SIDEBAR, USER_SIDEBAR } from "./data";

interface SidebarProps {
  sidebarData: typeof ASAM_SIDEBAR;
}

export function AppSidebar({ sidebarData }: SidebarProps) {
  return (
    <aside className="flex flex-col w-64 h-screen bg-background border-r border-border text-foreground fixed">
      {/* Header */}
      <div className="p-4 text-lg font-bold border-b border-border">
        {sidebarData.user.name}'s Dashboard
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-auto p-4 space-y-1">
        {sidebarData.navMain.map((link) => (
          <Link
            key={link.url}
            href={link.url}
            className="flex items-center space-x-2 p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <link.icon className="w-5 h-5" />
            <span>{link.title}</span>
          </Link>
        ))}
      </nav>

      {/* Secondary Navigation */}
      <div className="p-4 border-t border-border">
        {sidebarData.navSecondary.map((link) => (
          <Link
            key={link.url}
            href={link.url}
            className="flex items-center space-x-2 p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors mb-1"
          >
            <link.icon className="w-5 h-5" />
            <span>{link.title}</span>
          </Link>
        ))}
      </div>

      {/* Footer / User Info */}
      <div className="p-4 border-t border-border flex items-center space-x-3">
        <Image
          src={sidebarData.user.avatar}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="text-foreground">
          <p className="text-sm font-semibold">{sidebarData.user.name}</p>
          <p className="text-xs text-muted-foreground">{sidebarData.user.email}</p>
        </div>
      </div>
    </aside>
  );
}
