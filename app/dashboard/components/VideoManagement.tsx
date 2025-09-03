"use client";

import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import MuxPlayer from "@mux/mux-player-react";

type Video = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  difficulty?: string;
  paymentMethod: string;
  price?: number;
  uploadId: string;
  playbackId?: string;
};

export default function VideoManagement() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [openUpload, setOpenUpload] = useState(false);

  // Edit state
  const [openEdit, setOpenEdit] = useState(false);
  const [editVideo, setEditVideo] = useState<Video | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [price, setPrice] = useState<number | "">("");

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/mux/videos");
      if (!res.ok) throw new Error("Failed to fetch videos");
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const pollPlaybackId = async (uploadId: string): Promise<string | null> => {
    let playbackId: string | null = null;
    const maxRetries = 60;
    const interval = 1000;
    let attempts = 0;

    while (!playbackId && attempts < maxRetries) {
      try {
        const res = await fetch(`/api/mux/upload/${uploadId}`);
        if (res.ok) {
          const data = await res.json();
          playbackId = data.playbackId;
          if (playbackId) break;
        }
      } catch (err) {
        console.error("Error polling playbackId:", err);
      }

      attempts++;
      await new Promise((r) => setTimeout(r, interval));
    }

    return playbackId;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      setUploading(true);
      setProgress(0);

      try {
        const res = await fetch("/api/mux/upload", { method: "POST" });
        if (!res.ok) throw new Error("Failed to get upload URL");
        const { uploadUrl, uploadId } = await res.json();

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadUrl, true);
          xhr.setRequestHeader("Content-Type", file.type);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              setProgress(Math.round((event.loaded / event.total) * 100));
            }
          };

          xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(`Upload failed: ${xhr.status}`);
          xhr.onerror = () => reject("Network error during upload");
          xhr.send(file);
        });

        await fetch("/api/mux/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            subtitle: subtitle || undefined,
            description,
            category,
            difficulty: difficulty || undefined,
            paymentMethod,
            price: price === "" ? undefined : Number(price),
            uploadId,
          }),
        });

        const playbackId = await pollPlaybackId(uploadId);
        if (playbackId) {
          await fetch(`/api/mux/update-playback/${uploadId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playbackId }),
          });
        }

        setTitle("");
        setSubtitle("");
        setDescription("");
        setCategory("");
        setDifficulty("");
        setPaymentMethod("");
        setPrice("");
        setProgress(0);
        setOpenUpload(false);
        fetchVideos();
      } catch (err) {
        console.error("Upload & save failed:", err);
      } finally {
        setUploading(false);
      }
    },
    [title, subtitle, description, category, difficulty, paymentMethod, price]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
  });

  // Edit handlers
  const openEditModal = (video: Video) => {
    setEditVideo(video);
    setTitle(video.title);
    setSubtitle(video.subtitle || "");
    setDescription(video.description);
    setCategory(video.category);
    setDifficulty(video.difficulty || "");
    setPaymentMethod(video.paymentMethod);
    setPrice(video.price ?? "");
    setOpenEdit(true);
  };

  const saveEdit = async () => {
    if (!editVideo) return;
    await fetch(`/api/mux/videos/${editVideo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        subtitle,
        description,
        category,
        difficulty,
        paymentMethod,
        price,
      }),
    });
    setOpenEdit(false);
    setEditVideo(null);
    fetchVideos();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Video Management</h1>
        <Button onClick={() => setOpenUpload(true)}>+ Upload Video</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length === 0 && (
          <p className="col-span-full text-center text-gray-400">
            No videos available
          </p>
        )}
        {videos.map((v) => (
          <Card
            key={v.id}
            className="group hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative overflow-hidden rounded">
              {v.playbackId ? (
                <MuxPlayer
                  playbackId={v.playbackId}
                  metadata={{ video_title: v.title }}
                  autoplay={false}
                  controls
                  className="w-full h-48 sm:h-56 lg:h-64"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-48 sm:h-56 lg:h-64 bg-gray-200 text-gray-500">
                  Processing...
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg truncate">{v.title}</h3>
              {v.subtitle && (
                <p className="text-sm text-gray-500 truncate">{v.subtitle}</p>
              )}
              <p className="text-sm text-gray-500 truncate">{v.description}</p>
              {v.difficulty && (
                <p className="text-sm text-gray-400 mt-1">
                  Difficulty: {v.difficulty}
                </p>
              )}
              {v.price !== undefined && (
                <p className="text-sm text-gray-400 mt-1">Price: ${v.price}</p>
              )}
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => openEditModal(v)}>
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Dialog */}
      <Dialog open={openUpload} onOpenChange={setOpenUpload}>
        <DialogContent className="sm:max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Upload New Video</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Video title" value={title} onChange={e => setTitle(e.target.value)} />

              <Label htmlFor="subtitle">Subtitle</Label>
              <Input id="subtitle" placeholder="Optional subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} />

              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Video description" value={description} onChange={e => setDescription(e.target.value)} />

              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />

              <Label htmlFor="difficulty">Difficulty</Label>
              <Input id="difficulty" placeholder="Optional difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value)} />

              <Label htmlFor="payment">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue placeholder="Select payment method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              <Label htmlFor="price">Price</Label>
              <Input type="number" id="price" placeholder="Optional price" value={price} onChange={e => setPrice(e.target.value === "" ? "" : Number(e.target.value))} />
            </div>

            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded p-2 min-h-[300px]">
              <div {...getRootProps()} className="flex-1 flex items-center justify-center w-full h-full cursor-pointer p-2">
                <input {...getInputProps()} />
                <p className="text-sm text-muted-foreground text-center">
                  {isDragActive ? "Drop the video here..." : "Drag & drop video here, or click to browse"}
                </p>
              </div>

              {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4 justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenUpload(false)} disabled={uploading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} />

              <Label>Subtitle</Label>
              <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} />

              <Label>Description</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} />

              <Label>Category</Label>
              <Input value={category} onChange={e => setCategory(e.target.value)} />

              <Label>Difficulty</Label>
              <Input value={difficulty} onChange={e => setDifficulty(e.target.value)} />

              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              <Label>Price</Label>
              <Input type="number" value={price} onChange={e => setPrice(e.target.value === "" ? "" : Number(e.target.value))} />
            </div>
          </div>

          <DialogFooter className="mt-4 justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
