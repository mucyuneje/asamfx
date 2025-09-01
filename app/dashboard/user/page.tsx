"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { USER_SIDEBAR } from "@/components/dashboard/data";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { IconBox } from "@tabler/icons-react";

// Kit interface
interface Kit {
  id: number;
  title: string;
  purchased: boolean;
  price: number;
  description: string;
  thumbnail: string;
}

// Mock data for unpurchased kits
const MOCK_KITS: Kit[] = [
  {
    id: 1,
    title: "Risk Management Kit",
    purchased: false,
    price: 70,
    description: "Learn risk management techniques.",
    thumbnail: "/thumbnails/risk-kit.jpg",
  },
  {
    id: 2,
    title: "Trading Patterns Kit",
    purchased: false,
    price: 100,
    description: "Learn profitable trading patterns and setups.",
    thumbnail: "/thumbnails/trading-patterns-kit.jpg",
  },
];

export default function UnpurchasedKitsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);

  const openDialog = (kit: Kit) => {
    setSelectedKit(kit);
    setDialogOpen(true);
  };

  const handlePurchase = (kit: Kit) => {
    alert(`Redirecting to payment for ${kit.title} ($${kit.price})`);
    setDialogOpen(false);
    // In real app, trigger backend call for payment confirmation
  };

  return (
    <DashboardLayout sidebarData={USER_SIDEBAR}>
      <h1 className="text-2xl font-bold mb-6">Unpurchased Kits</h1>

      {MOCK_KITS.length === 0 ? (
        <p className="text-muted-foreground">No unpurchased kits available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_KITS.map((kit) => (
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
      )}

      {/* Dialog preview */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedKit && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedKit.title}</DialogTitle>
                <DialogDescription>{selectedKit.description}</DialogDescription>
              </DialogHeader>
              <img
                src={selectedKit.thumbnail}
                alt={selectedKit.title}
                className="w-full h-48 object-cover rounded-md my-4"
              />
              <p className="text-sm font-medium">Price: ${selectedKit.price}</p>
              <DialogFooter>
                <Button className="w-full mt-2" onClick={() => handlePurchase(selectedKit)}>
                  Buy Now
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
