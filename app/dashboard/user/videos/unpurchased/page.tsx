"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { USER_SIDEBAR } from "@/components/dashboard/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { IconVideo } from "@tabler/icons-react";

// Mock video data
interface Video {
  id: number;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
}

const MOCK_VIDEOS: Video[] = [
  {
    id: 1,
    title: "Forex Basics",
    price: 20,
    description: "Learn the fundamentals of Forex trading step by step.",
    thumbnail: "/thumbnails/forex-basics.jpg",
  },
  {
    id: 2,
    title: "Advanced Strategies",
    price: 50,
    description: "Master advanced strategies to increase your trading profits.",
    thumbnail: "/thumbnails/advanced-strategies.jpg",
  },
];

export default function UnpurchasedVideosPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const openDialog = (video: Video) => {
    setSelectedVideo(video);
    setDialogOpen(true);
  };

  const handlePurchase = (video: Video) => {
    alert(`Redirecting to payment for ${video.title} ($${video.price})`);
    setDialogOpen(false);
    // Here you can integrate payment upload/confirmation logic
  };

  return (
    <DashboardLayout sidebarData={USER_SIDEBAR}>
      <h1 className="text-2xl font-bold mb-6">Unpurchased Videos</h1>

      {MOCK_VIDEOS.length === 0 ? (
        <p className="text-muted-foreground">No unpurchased videos available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_VIDEOS.map((video) => (
            <Card
              key={video.id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => openDialog(video)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover rounded-t-md"
              />
              <CardHeader className="flex items-center gap-2 mt-2">
                <IconVideo className="w-6 h-6" />
                <CardTitle>{video.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{video.description}</CardDescription>
                <p className="mt-2 text-sm font-medium">Price: ${video.price}</p>
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => handlePurchase(video)}
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for preview */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedVideo && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedVideo.title}</DialogTitle>
                <DialogDescription>{selectedVideo.description}</DialogDescription>
              </DialogHeader>
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-full h-48 object-cover rounded-md my-4"
              />
              <p className="text-sm font-medium">Price: ${selectedVideo.price}</p>
              <DialogFooter>
                <Button
                  className="w-full mt-2"
                  onClick={() => handlePurchase(selectedVideo)}
                >
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
