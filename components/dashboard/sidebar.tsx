"use client";

import React, { useState } from "react";
import {
  IconDashboard,
  IconUsers,
  IconFolder,
  IconCreditCard,
  IconChartBar,
  IconSettings,
} from "@tabler/icons-react";

import { asmafxSidebar } from "./data";

const iconsMap: Record<string, any> = {
  dashboard: IconDashboard,
  users: IconUsers,
  folder: IconFolder,
  "credit-card": IconCreditCard,
  chart: IconChartBar,
  settings: IconSettings,
};

export const Sidebar = ({ currentPlan }: { currentPlan?: string }) => {
  const [activePage, setActivePage] = useState("/dashboard");

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-800">
        <img src={asmafxSidebar.brand.logo} alt="logo" className="w-8 h-8" />
        <span className="text-xl font-bold">{asmafxSidebar.brand.name}</span>
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center px-4 py-3 border-b border-gray-800">
        <img
          src={asmafxSidebar.user.avatar}
          alt="user"
          className="w-12 h-12 rounded-full mb-1"
        />
        <span className="text-sm font-semibold">{asmafxSidebar.user.name}</span>
        <span className="text-xs text-gray-400">{asmafxSidebar.user.email}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {asmafxSidebar.navMain.map((item) => {
          const Icon = iconsMap[item.icon];
          const isActive = activePage === item.url;
          return (
            <button
              key={item.title}
              onClick={() => setActivePage(item.url)}
              className={`flex items-center gap-2 px-3 py-2 rounded w-full text-left hover:bg-gray-800 ${
                isActive ? "bg-gray-700" : ""
              }`}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Current Page (Optional small footer indicator) */}
      <div className="px-4 py-2 border-t border-gray-800 text-gray-400 text-sm">
        Active: {activePage.replace("/", "") || "dashboard"}
      </div>
    </aside>
  );
};

// DashboardPage
export default function DashboardPage() {
  const [activePage, setActivePage] = useState("/dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "/dashboard":
        return <div>Welcome to the Dashboard!</div>;
      case "/mentorship":
        return <div>Manage Mentorship Programs here.</div>;
      case "/courses":
        return <div>All Courses Overview</div>;
      case "/payments":
        return <div>Payments & Transactions</div>;
      case "/reports":
        return <div>Reports & Analytics</div>;
      case "/settings":
        return <div>Settings & Preferences</div>;
      default:
        return <div>Page Not Found</div>;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar currentPlan="premium" />

      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, Admin</h1>
          <div>Plan: Premium</div>
        </header>

        {/* Main Content */}
        <div className="p-4 rounded shadow bg-white">{renderContent()}</div>
      </main>
    </div>
  );
}
