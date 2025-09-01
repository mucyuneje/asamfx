// app/dashboard/user/UserDashboardContent.tsx
"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { USER_SIDEBAR } from "@/components/dashboard/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconUsers, IconVideo, IconShoppingCart } from "@tabler/icons-react";

// Mock data for users
const stats = {
  totalPurchasedKits: 3,
  totalVideosWatched: 15,
  recentPurchases: [
    { id: 1, kit: "Trading Patterns Kit", amount: 100, status: "PAID" },
    { id: 2, kit: "Risk Management Kit", amount: 70, status: "PAID" },
    { id: 3, kit: "Technical Analysis Kit", amount: 90, status: "PENDING" },
  ],
  purchasedKits: [
    {
      id: 1,
      title: "Trading Patterns Kit",
      description: "Comprehensive guide to profitable trading patterns.",
      thumbnail: "/thumbnails/trading-patterns-kit.jpg",
      videos: [
        { id: 1, title: "Patterns 101" },
        { id: 2, title: "Advanced Patterns" },
      ],
    },
    {
      id: 2,
      title: "Risk Management Kit",
      description: "Learn the fundamentals of risk management in trading.",
      thumbnail: "/thumbnails/risk-kit.jpg",
      videos: [
        { id: 3, title: "Risk Basics" },
        { id: 4, title: "Advanced Risk" },
      ],
    },
  ],
};

export default function UserDashboardContent() {
  const [selectedKit, setSelectedKit] = useState<typeof stats.purchasedKits[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openKitDialog = (kit: typeof stats.purchasedKits[0]) => {
    setSelectedKit(kit);
    setDialogOpen(true);
  };

  return (
    <DashboardLayout sidebarData={USER_SIDEBAR}>
      <h1 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center space-x-4">
          <IconUsers className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Purchased Kits</p>
            <p className="font-bold text-lg">{stats.totalPurchasedKits}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center space-x-4">
          <IconVideo className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Videos Watched</p>
            <p className="font-bold text-lg">{stats.totalVideosWatched}</p>
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

      {/* Purchased Kits */}
      <h2 className="text-xl font-semibold mb-4">Your Purchased Kits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.purchasedKits.map((kit) => (
          <Card key={kit.id} className="cursor-pointer hover:shadow-lg transition" onClick={() => openKitDialog(kit)}>
            <img src={kit.thumbnail} alt={kit.title} className="w-full h-40 object-cover rounded-t-md" />
            <CardHeader className="mt-2">
              <CardTitle>{kit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{kit.description}</CardDescription>
              <p className="mt-2 text-sm font-medium">Videos: {kit.videos.length}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kit Videos Dialog */}
      {dialogOpen && selectedKit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg p-6 w-full max-w-3xl relative">
            <button
              className="absolute top-3 right-3 text-red-500 font-bold text-lg"
              onClick={() => setDialogOpen(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">{selectedKit.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Kit info */}
              <div>
                <img src={selectedKit.thumbnail} alt={selectedKit.title} className="w-full h-48 object-cover rounded-md mb-4" />
                <p>{selectedKit.description}</p>
              </div>
              {/* Right: Videos */}
              <div>
                <h4 className="font-semibold mb-2">Videos in this Kit</h4>
                <div className="space-y-2">
                  {selectedKit.videos.map((video) => (
                    <Button key={video.id} className="w-full" variant="outline">
                      {video.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
