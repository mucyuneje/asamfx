"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { USER_SIDEBAR } from "@/components/dashboard/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { IconBox, IconVideo } from "@tabler/icons-react";

// Mock purchased kits with videos
const PURCHASED_KITS = [
  {
    id: 1,
    title: "Trading Patterns Kit",
    description: "A kit covering profitable trading patterns.",
    thumbnail: "/thumbnails/trading-patterns-kit.jpg",
    videos: [
      { id: 101, title: "Pattern 1", url: "/videos/pattern1.mp4" },
      { id: 102, title: "Pattern 2", url: "/videos/pattern2.mp4" },
    ],
  },
];

export default function MyKitsPage() {
  const [kitDialogOpen, setKitDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedKit, setSelectedKit] = useState<typeof PURCHASED_KITS[0] | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ id: number; title: string; url: string } | null>(null);

  const openKitDialog = (kit: typeof PURCHASED_KITS[0]) => {
    setSelectedKit(kit);
    setKitDialogOpen(true);
  };

  const openVideoDialog = (video: { id: number; title: string; url: string }) => {
    setSelectedVideo(video);
    setVideoDialogOpen(true);
  };

  return (
    <DashboardLayout sidebarData={USER_SIDEBAR}>
      <h1 className="text-2xl font-bold mb-6">My Kits</h1>

      {PURCHASED_KITS.length === 0 ? (
        <p className="text-muted-foreground">You haven't purchased any kits yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PURCHASED_KITS.map((kit) => (
            <Card
              key={kit.id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => openKitDialog(kit)}
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
                <p className="mt-2 text-sm font-medium">Videos: {kit.videos.length}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Kit Dialog: List of videos */}
      <Dialog open={kitDialogOpen} onOpenChange={setKitDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedKit && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedKit.title}</DialogTitle>
                <DialogDescription>{selectedKit.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                {selectedKit.videos.map((video) => (
                  <Button
                    key={video.id}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={() => openVideoDialog(video)}
                  >
                    <IconVideo className="w-4 h-4" /> {video.title}
                  </Button>
                ))}
              </div>
              <DialogFooter>
                <Button className="w-full mt-4" onClick={() => setKitDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Dialog: Watch video */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedVideo && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedVideo.title}</DialogTitle>
              </DialogHeader>
              <video
                src={selectedVideo.url}
                controls
                className="w-full h-64 object-cover rounded-md my-4"
              />
              <DialogFooter>
                <Button className="w-full mt-2" onClick={() => setVideoDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
