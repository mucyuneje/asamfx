"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import MuxPlayer from "@mux/mux-player-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";

type Video = { id: string; title: string; playbackId?: string };
type Kit = { id: string; name: string; price: number; thumbnail: string; videos: { video: Video }[] };

export default function AdminKitManagement() {
  const [kitName, setKitName] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  const [videos, setVideos] = useState<Video[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);

  const [openKitModal, setOpenKitModal] = useState<Kit | null>(null);
  const [openCreateKit, setOpenCreateKit] = useState(false);

  // Fetch videos
  const fetchVideos = async () => {
    const res = await fetch("/api/mux/videos");
    const data = await res.json();
    setVideos(data);
  };

  // Fetch kits
  const fetchKits = async () => {
    const res = await fetch("/api/admin/kits");
    const data = await res.json();
    setKits(data);
  };

  useEffect(() => {
    fetchVideos();
    fetchKits();
  }, []);

  // Create Kit
  const handleCreateKit = async (closeModal?: () => void) => {
    if (!kitName || !price || !thumbnail || selectedVideos.length === 0) {
      toast.error("Fill all fields before creating a kit");
      return;
    }

    const formData = new FormData();
    formData.append("name", kitName);
    formData.append("price", price);
    formData.append("thumbnail", thumbnail);
    formData.append("videoIds", JSON.stringify(selectedVideos));

    try {
      const res = await fetch("/api/admin/kits", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to create kit");
      const data = await res.json();
      toast.success(`Kit "${data.name}" created successfully!`);
      setKitName(""); setPrice(""); setThumbnail(null); setThumbnailPreview(null); setSelectedVideos([]);
      fetchKits();
      closeModal?.();
    } catch (err) {
      console.error(err);
      toast.error("Error creating kit");
    }
  };

  // Update Kit
  const handleUpdateKit = async (kitId: string, newName: string, newPrice: number) => {
    try {
      const res = await fetch(`/api/admin/kits/${kitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, price: newPrice })
      });
      if (!res.ok) throw new Error("Failed to update kit");
      const data = await res.json();
      toast.success("Kit updated successfully");
      fetchKits();
      if (openKitModal) setOpenKitModal({ ...openKitModal, name: newName, price: newPrice });
    } catch (err) {
      console.error(err);
      toast.error("Error updating kit");
    }
  };

  // Remove video from kit
  const handleRemoveVideo = async (kitId: string, videoId: string) => {
    try {
      const res = await fetch(`/api/admin/kits/${kitId}/remove-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId })
      });
      if (!res.ok) throw new Error("Failed to remove video");
      toast.success("Video removed successfully");
      fetchKits();
      if (openKitModal) setOpenKitModal({
        ...openKitModal,
        videos: openKitModal.videos.filter(v => v.video.id !== videoId)
      });
    } catch (err) {
      console.error(err);
      toast.error("Error removing video");
    }
  };

  // Add videos to kit
  const handleAddVideos = async (kitId: string, videoIds: string[]) => {
    try {
      const res = await fetch(`/api/admin/kits/${kitId}/add-videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoIds })
      });
      if (!res.ok) throw new Error("Failed to add videos");
      toast.success("Videos added successfully");
      fetchKits();
      if (openKitModal) {
        const newVideos = videos.filter(v => videoIds.includes(v.id)).map(v => ({ video: v }));
        setOpenKitModal({ ...openKitModal, videos: [...openKitModal.videos, ...newVideos] });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding videos");
    }
  };

  return (
    <div className="space-y-6">

      {/* Button to open Create Kit */}
      <Button onClick={() => setOpenCreateKit(true)}>+ Create Kit</Button>

      {/* Kits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {kits.map(kit => (
          <div key={kit.id} className="relative flex flex-col items-center border rounded-lg p-3 hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-gray-800 to-gray-900">
            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              <button
                className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
                onClick={(e) => { e.stopPropagation(); setOpenKitModal(kit); }}
                title="Update Kit"
              >
                <IconEdit size={18} />
              </button>
              <button
                className="p-1 rounded bg-red-600 hover:bg-red-500 text-white"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!confirm(`Are you sure you want to delete "${kit.name}"?`)) return;
                  try {
                    const res = await fetch(`/api/admin/kits/${kit.id}`, { method: "DELETE" });
                    if (!res.ok) throw new Error("Failed to delete kit");
                    toast.success("Kit deleted successfully");
                    fetchKits();
                  } catch (err) {
                    console.error(err);
                    toast.error("Error deleting kit");
                  }
                }}
                title="Delete Kit"
              >
                <IconTrash size={18} />
              </button>
            </div>

            {/* Thumbnail */}
            <div className="w-full h-48 md:h-56 lg:h-64 overflow-hidden rounded-xl mb-4 border border-gray-700">
              <img src={kit.thumbnail} alt={kit.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" />
            </div>

            {/* Info */}
            <div className="flex flex-col items-center gap-1 w-full">
              <p className="text-sm font-semibold text-center text-white truncate w-full" title={kit.name}>{kit.name}</p>
              <p className="text-sm font-bold text-center text-green-300 drop-shadow-lg">${kit.price.toFixed(2)}</p>
              <p className="text-xs text-gray-400">{kit.videos.length} Video{kit.videos.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Update Kit Modal */}
      {openKitModal && (
        <Dialog open={true} onOpenChange={() => setOpenKitModal(null)}>
          <DialogContent className="sm:max-w-[900px] flex gap-4">
            {/* Left: Info + Add/Remove videos */}
            <div className="flex-1 space-y-4">
              <DialogHeader>
                <DialogTitle className="flex flex-col gap-2">
                  <Input
                    value={openKitModal.name}
                    onChange={e => setOpenKitModal({ ...openKitModal, name: e.target.value })}
                    className="text-lg font-semibold w-full"
                  />
                  <Input
                    type="number"
                    value={openKitModal.price}
                    onChange={e => setOpenKitModal({ ...openKitModal, price: Number(e.target.value) })}
                    className="w-32"
                  />
                  <Button size="sm" onClick={() => handleUpdateKit(openKitModal.id, openKitModal.name, openKitModal.price)}>Update Kit</Button>
                </DialogTitle>
              </DialogHeader>

              <img src={openKitModal.thumbnail} alt={openKitModal.name} className="w-full h-48 object-cover rounded" />

              <h3 className="font-medium">Videos:</h3>
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                {openKitModal.videos.map(v => (
                  <div key={v.video.id} className="flex items-center gap-1 border rounded p-1 hover:bg-accent/10">
                    <p className="text-xs">{v.video.title}</p>
                    <Button size="icon" variant="outline" onClick={() => handleRemoveVideo(openKitModal.id, v.video.id)}>
                      <IconTrash size={14} />
                    </Button>
                  </div>
                ))}
              </div>

              <h3 className="font-medium mt-2">Add Videos:</h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {videos.filter(v => !openKitModal.videos.some(ov => ov.video.id === v.id)).map(v => (
                  <Button key={v.id} size="sm" variant="outline" onClick={() => handleAddVideos(openKitModal.id, [v.id])}>+ {v.title}</Button>
                ))}
              </div>
            </div>

            {/* Right: Video Preview */}
            <div className="flex-1 space-y-2">
              <h3 className="font-medium">Video Preview</h3>
              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                {openKitModal.videos.map(v => (
                  <div key={v.video.id} className="border rounded p-2 hover:bg-accent/10">
                    <p className="mb-1 text-sm">{v.video.title}</p>
                    {v.video.playbackId ? (
                      <MuxPlayer playbackId={v.video.playbackId} metadata={{ video_title: v.video.title, video_id: v.video.id }} autoPlay={false} controls className="w-full h-48 rounded" />
                    ) : (
                      <div className="w-full h-48 bg-black rounded flex items-center justify-center text-white text-sm">No Preview</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Kit Modal */}
      {openCreateKit && (
        <Dialog open={true} onOpenChange={() => setOpenCreateKit(false)}>
          <DialogContent className="sm:max-w-[900px] flex gap-4">
            {/* Left: Kit info + video selection */}
            <div className="flex-1 space-y-4">
              <DialogHeader>
                <DialogTitle className="flex flex-col gap-2">
                  <Input value={kitName} onChange={e => setKitName(e.target.value)} placeholder="Kit Name" className="text-lg font-semibold w-full" />
                  <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" className="w-32" />
                  <Button size="sm" onClick={() => handleCreateKit(() => setOpenCreateKit(false))}>Create Kit</Button>
                </DialogTitle>
              </DialogHeader>

              <label className="block">
                Thumbnail:
                <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0] ?? null;
                  setThumbnail(file);
                  if (file) setThumbnailPreview(URL.createObjectURL(file));
                }} className="mt-1" />
              </label>
              {thumbnailPreview && <img src={thumbnailPreview} className="w-full h-48 object-cover rounded" />}

              <h3 className="font-medium">Select Videos:</h3>
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                {videos.map(v => (
                  <Button key={v.id} size="sm" variant={selectedVideos.includes(v.id) ? "default" : "outline"} onClick={() => {
                    if (selectedVideos.includes(v.id)) setSelectedVideos(selectedVideos.filter(id => id !== v.id));
                    else setSelectedVideos([...selectedVideos, v.id]);
                  }}>
                    {v.title}
                  </Button>
                ))}
              </div>
            </div>

            {/* Right: Video Preview */}
            <div className="flex-1 space-y-2">
              <h3 className="font-medium">Video Preview</h3>
              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                {selectedVideos.length === 0 && <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">No videos selected</div>}
                {videos.filter(v => selectedVideos.includes(v.id)).map(v => (
                  <div key={v.id} className="border rounded p-2 hover:bg-accent/10">
                    <p className="mb-1 text-sm">{v.title}</p>
                    {v.playbackId ? (
                      <MuxPlayer playbackId={v.playbackId} metadata={{ video_title: v.title, video_id: v.id }} autoPlay={false} controls className="w-full h-48 rounded" />
                    ) : (
                      <div className="w-full h-48 bg-black rounded flex items-center justify-center text-white text-sm">No Preview</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
