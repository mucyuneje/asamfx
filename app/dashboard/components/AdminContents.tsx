"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Video = {
  id: string;
  title: string;
  category: string;
  paymentMethod: string;
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminContent() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch stats for admin dashboard
  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch all videos
      const videoRes = await fetch("/api/mux/videos");
      const videoData = await videoRes.json();
      setVideos(videoData);

      // Fetch all users
      const userRes = await fetch("/api/users"); // make sure your backend returns all users for admin
      const userData = await userRes.json();
      setUsers(userData);

    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading admin stats...</p>;

  const totalVideos = videos.length;
  const totalPaidVideos = videos.filter(v => v.paymentMethod === "Paid").length;
  const totalUsers = users.length;
  const recentVideos = videos
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5); // show 5 most recent uploads

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalVideos}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paid Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalPaidVideos}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Uploads</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentVideos.map(video => (
            <Card key={video.id}>
              <CardHeader>
                <CardTitle>{video.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Category: {video.category}</p>
                <p className="text-sm text-gray-500">Type: {video.paymentMethod}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Uploaded: {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
