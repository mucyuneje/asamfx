"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardPage() {
  const [activePage, setActivePage] = useState("/dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "/dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow">Widget 1</div>
            <div className="bg-white p-4 rounded shadow">Widget 2</div>
            <div className="bg-white p-4 rounded shadow">Widget 3</div>
            <div className="bg-white p-4 rounded shadow">Widget 4</div>
          </div>
        );
      case "/mentorship":
        return <div className="bg-white p-4 rounded shadow">Mentorship Content</div>;
      case "/courses":
        return <div className="bg-white p-4 rounded shadow">Courses Content</div>;
      case "/payments":
        return <div className="bg-white p-4 rounded shadow">Payments Content</div>;
      case "/reports":
        return <div className="bg-white p-4 rounded shadow">Reports Content</div>;
      case "/settings":
        return <div className="bg-white p-4 rounded shadow">Settings Content</div>;
      default:
        return <div className="bg-white p-4 rounded shadow">Page Not Found</div>;
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
        {renderContent()}
      </main>
    </div>
  );
}
