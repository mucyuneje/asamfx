// app/dashboard/asam/page.tsx
"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ASAM_SIDEBAR } from "@/components/dashboard/data";
import {
  IconUsers,
  IconVideo,
  IconCoins,
  IconShoppingCart,
  IconPlus,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Mock data (replace with Prisma fetch later)
const stats = {
  totalUsers: 120,
  totalVideos: 25,
  totalRevenue: 1500,
  recentPurchases: [
    { id: 1, user: "John Doe", video: "Forex Basics", amount: 20, method: "Crypto", status: "PAID" },
    { id: 2, user: "Jane Smith", video: "Advanced Strategies", amount: 50, method: "Mobile Money", status: "PENDING" },
    { id: 3, user: "Bob Lee", video: "Trading Patterns", amount: 30, method: "Crypto", status: "PAID" },
  ],
  recentVideos: [
    { id: 1, title: "Forex Basics", category: "Trading" },
    { id: 2, title: "Advanced Strategies", category: "Trading" },
    { id: 3, title: "Risk Management", category: "Trading" },
  ],
};

export default function AsamDashboard() {
  const router = useRouter();

  return (
    <DashboardLayout sidebarData={ASAM_SIDEBAR}>
      {/* Header with actions */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Welcome, Asam</h1>
        <div className="flex gap-2">
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => router.push("/dashboard/admin/videos/upload")}
          >
            <IconPlus className="h-4 w-4" />
            Add New Video
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push("/dashboard/admin/sales")}
          >
            <IconShoppingCart className="h-4 w-4" />
            View Sales
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center space-x-4">
          <IconUsers className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="font-bold text-lg">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 flex items-center space-x-4">
          <IconVideo className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Total Videos</p>
            <p className="font-bold text-lg">{stats.totalVideos}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 flex items-center space-x-4">
          <IconCoins className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="font-bold text-lg">${stats.totalRevenue}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 flex items-center space-x-4">
          <IconShoppingCart className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Recent Purchases</p>
            <p className="font-bold text-lg">{stats.recentPurchases.length}</p>
          </div>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.recentPurchases.map((purchase) => (
            <div key={purchase.id} className="bg-card border border-border rounded-lg p-4">
              <p className="font-semibold">{purchase.user}</p>
              <p className="text-sm text-muted-foreground">{purchase.video}</p>
              <p className="text-sm">Amount: ${purchase.amount}</p>
              <p className="text-sm">Method: {purchase.method}</p>
              <p
                className={`text-sm font-medium mt-1 ${
                  purchase.status === "PAID" ? "text-green-500" : "text-yellow-500"
                }`}
              >
                {purchase.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Videos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Videos Uploaded</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.recentVideos.map((video) => (
            <div key={video.id} className="bg-card border border-border rounded-lg p-4">
              <p className="font-semibold">{video.title}</p>
              <p className="text-sm text-muted-foreground">{video.category}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
