"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ASAM_SIDEBAR } from "@/components/dashboard/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function VideoUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  // Client-side auth check
  useEffect(() => {
    fetch("/api/me")
      .then(async (res) => {
        if (res.status === 401) return router.push("/auth/login");
        const data = await res.json();
        if (data.role !== "ASAM") return router.push("/dashboard/user");
        setLoading(false);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return alert("Please select a video file");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const res = await fetch("/api/videos/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Video uploaded successfully!");
      router.refresh();
      setTitle("");
      setCategory("");
      setPrice("");
      setDescription("");
      setVideoFile(null);
      setThumbnail(null);
    } else {
      alert("Upload failed");
    }
  };

  if (loading) return <p className="p-6">Checking authentication...</p>;

  return (
    <DashboardLayout sidebarData={ASAM_SIDEBAR}>
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="font-medium mb-1 block">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video title" required />
        </div>

        <div>
          <label className="font-medium mb-1 block">Category</label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Trading, Forex, etc." required />
        </div>

        <div>
          <label className="font-medium mb-1 block">Price ($)</label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="20" required />
        </div>

        <div>
          <label className="font-medium mb-1 block">Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" required />
        </div>

        <div>
          <label className="font-medium mb-1 block">Video File</label>
          <Input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} required />
        </div>

        <div>
          <label className="font-medium mb-1 block">Thumbnail (optional)</label>
          <Input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
        </div>

        <Button type="submit" className="mt-2">
          Upload Video
        </Button>
      </form>
    </DashboardLayout>
  );
}
