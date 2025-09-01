"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ASAM_SIDEBAR } from "@/components/dashboard/data";
import { useState } from "react";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

interface Kit {
  id: number;
  title: string;
  description: string;
  price: number;
  videosCount: number;
  createdAt: string;
}

// Mock kits
const MOCK_KITS: Kit[] = [
  {
    id: 1,
    title: "Beginner Forex Kit",
    description: "A complete kit for Forex beginners.",
    price: 100,
    videosCount: 5,
    createdAt: "2025-09-01",
  },
  {
    id: 2,
    title: "Advanced Trading Kit",
    description: "Advanced trading strategies.",
    price: 250,
    videosCount: 8,
    createdAt: "2025-09-03",
  },
];

export default function KitManagementPage() {
  const [kits, setKits] = useState(MOCK_KITS);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this kit?")) {
      setKits((prev) => prev.filter((k) => k.id !== id));
    }
  };

  return (
    <DashboardLayout sidebarData={ASAM_SIDEBAR}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kit Management</h1>
        <Link
          href="/dashboard/admin/kits/create"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:brightness-90 transition"
        >
          <IconPlus className="w-5 h-5" />
          <span>Create Kit</span>
        </Link>
      </div>

      {/* Kits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kits.map((kit) => (
          <div
            key={kit.id}
            className="bg-card border border-border rounded-lg overflow-hidden shadow hover:shadow-md transition"
          >
            <div className="p-4 flex flex-col space-y-2">
              <h2 className="font-semibold text-lg">{kit.title}</h2>
              <p className="text-sm text-muted-foreground">{kit.description}</p>
              <p className="text-sm font-medium">Price: ${kit.price}</p>
              <p className="text-xs text-muted-foreground">
                Videos: {kit.videosCount} | Created: {kit.createdAt}
              </p>

              <div className="flex space-x-2 mt-2">
                <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex-1 text-sm flex items-center justify-center space-x-1">
                  <IconEdit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(kit.id)}
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

      {/* Empty state */}
      {kits.length === 0 && (
        <div className="text-center text-muted-foreground mt-10">
          No kits available.{" "}
          <Link
            href="/dashboard/asam/kits"
            className="text-primary underline"
          >
            Create your first kit
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
