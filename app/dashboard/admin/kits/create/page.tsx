"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ASAM_SIDEBAR } from "@/components/dashboard/data";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

// Mock videos (replace with Prisma fetch later)
const MOCK_VIDEOS = [
  { id: 1, title: "Forex Basics" },
  { id: 2, title: "Advanced Strategies" },
  { id: 3, title: "Risk Management" },
];

export default function CreateKitPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);

  const handleToggleVideo = (id: number) => {
    setSelectedVideos((prev) =>
      prev.includes(id) ? prev.filter((vid) => vid !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, description, price, selectedVideos });
    alert("Kit created (mock)!");
    setTitle("");
    setDescription("");
    setPrice("");
    setSelectedVideos([]);
  };

  return (
    <DashboardLayout sidebarData={ASAM_SIDEBAR}>
      {/* Header with redirect button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Kit</h1>
        <Link
          href="/dashboard/admin/kits/manage"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:brightness-90 transition"
        >
          View Kits
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Kit Info */}
        <div className="space-y-2">
          <label className="font-medium">Kit Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter kit title"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter kit description"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">Price ($)</label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>

        {/* Video Selection */}
        <div className="space-y-2">
          <label className="font-medium">Select Videos</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MOCK_VIDEOS.map((video) => (
              <label
                key={video.id}
                className="flex items-center space-x-2 p-2 border border-border rounded hover:bg-accent/5 cursor-pointer"
              >
                <Checkbox
                  checked={selectedVideos.includes(video.id)}
                  onCheckedChange={() => handleToggleVideo(video.id)}
                />
                <span>{video.title}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button type="submit">Create Kit</Button>
      </form>
    </DashboardLayout>
  );
}
