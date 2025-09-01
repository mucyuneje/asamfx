// app/dashboard/asam/videos/manage/page.tsx
"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ASAM_SIDEBAR } from "@/components/dashboard/data";
import { useState } from "react";
import { IconEdit, IconTrash, IconUpload } from "@tabler/icons-react";
import Link from "next/link";

interface Video {
  id: number;
  title: string;
  category: string;
  price: number;
  createdAt: string;
  playbackId?: string;
  thumbnail?: string;
}

// Mock videos
const MOCK_VIDEOS: Video[] = [
  {
    id: 1,
    title: "Forex Basics",
    category: "Trading",
    price: 20,
    createdAt: "2025-09-01",
    playbackId: "abc123",
    thumbnail: "/thumbnails/video1.jpg",
  },
  {
    id: 2,
    title: "Advanced Strategies",
    category: "Trading",
    price: 50,
    createdAt: "2025-09-02",
    playbackId: "def456",
    thumbnail: "/thumbnails/video2.jpg",
  },
];

export default function VideoManagementPage() {
  const [videos, setVideos] = useState(MOCK_VIDEOS);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this video?")) {
      setVideos((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <DashboardLayout sidebarData={ASAM_SIDEBAR}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Video Management</h1>
        <Link
          href="/dashboard/admin/videos/upload"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:brightness-90 transition"
        >
          <IconUpload className="w-5 h-5" />
          <span>Upload Video</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-card border border-border rounded-lg overflow-hidden shadow hover:shadow-md transition"
          >
            {/* Thumbnail */}
            <div className="w-full h-40 relative">
              <img
                src={video.thumbnail || "/thumbnails/placeholder.jpg"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Video Info */}
            <div className="p-4 flex flex-col space-y-2">
              <h2 className="font-semibold text-lg">{video.title}</h2>
              <p className="text-sm text-muted-foreground">{video.category}</p>
              <p className="text-sm font-medium">Price: ${video.price}</p>
              <p className="text-xs text-muted-foreground">Uploaded: {video.createdAt}</p>

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-2">
                {video.playbackId && (
                  <a
                    href={`https://stream.mux.com/${video.playbackId}.m3u8`}
                    target="_blank"
                    className="flex-1 px-2 py-1 bg-primary text-primary-foreground text-center rounded hover:brightness-90 transition text-sm"
                  >
                    Play
                  </a>
                )}
                <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex-1 text-sm flex items-center justify-center space-x-1">
                  <IconEdit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex-1 text-sm flex items-center justify-center space-x-1"
                >
                  <IconTrash className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
