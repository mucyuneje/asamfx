"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { USER_SIDEBAR } from "@/components/dashboard/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { IconVideo } from "@tabler/icons-react";

// Mock purchased videos
const PURCHASED_VIDEOS = [
  { id: 1, title: "Forex Basics", description: "Learn the fundamentals of Forex trading.", thumbnail: "/thumbnails/forex-basics.jpg", url: "/videos/forex-basics.mp4" },
  { id: 2, title: "Advanced Strategies", description: "Master advanced trading strategies.", thumbnail: "/thumbnails/advanced-strategies.jpg", url: "/videos/advanced-strategies.mp4" },
];

export default function MyVideosPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<typeof PURCHASED_VIDEOS[0] | null>(null);

  const openDialog = (video: typeof PURCHASED_VIDEOS[0]) => {
    setSelectedVideo(video);
    setDialogOpen(true);
  };

  return (
    <DashboardLayout sidebarData={USER_SIDEBAR}>
      <h1 className="text-2xl font-bold mb-6">My Videos</h1>

      {PURCHASED_VIDEOS.length === 0 ? (
        <p className="text-muted-foreground">You haven't purchased any videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PURCHASED_VIDEOS.map((video) => (
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
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => openDialog(video)}
                >
                  Watch
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog to watch video */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedVideo && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedVideo.title}</DialogTitle>
                <DialogDescription>{selectedVideo.description}</DialogDescription>
              </DialogHeader>
              <video
                src={selectedVideo.url}
                controls
                className="w-full h-64 object-cover rounded-md my-4"
              />
              <DialogFooter>
                <Button className="w-full mt-2" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
