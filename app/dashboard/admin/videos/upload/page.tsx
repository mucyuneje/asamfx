// app/dashboard/asam/videos/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ASAM_SIDEBAR } from "@/components/dashboard/data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function UploadVideoPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: integrate with Mux uploader later
    setTimeout(() => {
      alert("Video uploaded successfully!");
      setLoading(false);
    }, 1500);
  };

  return (
    <DashboardLayout sidebarData={ASAM_SIDEBAR}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Upload Video</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/admin/videos/manage")}
        >
          Go to Video Management
        </Button>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Video Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Video title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Short description" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g. Forex, Stocks" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" placeholder="e.g. 25" required />
            </div>

            {/* Placeholder for Mux uploader */}
            <div className="space-y-2">
              <Label>Video Upload</Label>
              <div className="border border-dashed border-muted rounded-lg p-6 text-center text-sm text-muted-foreground">
                Mux Uploader will go here
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Uploading..." : "Upload Video"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
