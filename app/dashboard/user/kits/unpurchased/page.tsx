"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { USER_SIDEBAR } from "@/components/dashboard/data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconBox, IconVideo } from "@tabler/icons-react";

// Mock unpurchased kits with videos
const KITS = [
  {
    id: 1,
    title: "Risk Management Kit",
    description: "Learn the fundamentals of risk management in trading.",
    thumbnail: "/thumbnails/risk-kit.jpg",
    price: 70,
    videos: [
      { id: 1, title: "Risk Basics" },
      { id: 2, title: "Stop Loss Strategies" },
    ],
  },
  {
    id: 2,
    title: "Trading Patterns Kit",
    description: "Comprehensive guide to profitable trading patterns.",
    thumbnail: "/thumbnails/trading-patterns-kit.jpg",
    price: 100,
    videos: [
      { id: 3, title: "Patterns Overview" },
      { id: 4, title: "Chart Patterns Deep Dive" },
    ],
  },
];

export default function UnpurchasedKitsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedKit, setSelectedKit] = useState<typeof KITS[0] | null>(null);

  const openDialog = (kit: typeof KITS[0]) => {
    setSelectedKit(kit);
    setDialogOpen(true);
  };

  const handlePurchase = (kit: typeof KITS[0]) => {
    alert(`Redirect to payment for ${kit.title} ($${kit.price})`);
    setDialogOpen(false);
  };

  return (
    <DashboardLayout sidebarData={USER_SIDEBAR}>
      <h1 className="text-2xl font-bold mb-6">Unpurchased Kits</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {KITS.map((kit) => (
          <Card
            key={kit.id}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => openDialog(kit)}
          >
            <img
              src={kit.thumbnail}
              alt={kit.title}
              className="w-full h-40 object-cover rounded-t-md"
            />
            <CardHeader className="flex items-center gap-2 mt-2">
              <IconBox className="w-6 h-6" />
              <CardTitle>{kit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{kit.description}</CardDescription>
              <p className="mt-2 text-sm font-medium">Price: ${kit.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog for kit details */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedKit && (
            <>
              {/* Left column: kit info */}
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle>{selectedKit.title}</DialogTitle>
                  <DialogDescription>{selectedKit.description}</DialogDescription>
                </DialogHeader>
                <img
                  src={selectedKit.thumbnail}
                  alt={selectedKit.title}
                  className="w-full h-48 object-cover rounded-md"
                />
                <p className="text-sm font-medium">Price: ${selectedKit.price}</p>
                <DialogFooter>
                  <Button
                    className="w-full mt-2"
                    onClick={() => handlePurchase(selectedKit)}
                  >
                    Buy Kit
                  </Button>
                </DialogFooter>
              </div>

              {/* Right column: videos in kit */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold mb-2">Videos in this Kit</h3>
                {(selectedKit.videos || []).map((video) => (
                  <Button
                    key={video.id}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <IconVideo className="w-4 h-4" /> {video.title}
                  </Button>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
