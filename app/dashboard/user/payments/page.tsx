"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { USER_SIDEBAR } from "@/components/dashboard/data";

export default function PaymentsPage() {
  return (
    <DashboardLayout sidebarData={USER_SIDEBAR}>
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <p className="text-muted-foreground">All payment records and confirmations will appear here.</p>
    </DashboardLayout>
  );
}
