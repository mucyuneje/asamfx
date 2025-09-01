"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ASAM_SIDEBAR } from "@/components/dashboard/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";

const salesData = [
  { date: "Aug 25", sales: 12 },
  { date: "Aug 26", sales: 18 },
  { date: "Aug 27", sales: 25 },
  { date: "Aug 28", sales: 20 },
  { date: "Aug 29", sales: 30 },
  { date: "Aug 30", sales: 22 },
  { date: "Aug 31", sales: 27 },
];

const recentSales = [
  { id: 1, user: "John Doe", item: "Forex Kit", amount: "$49.99", date: "Aug 31" },
  { id: 2, user: "Alice Smith", item: "Single Video", amount: "$9.99", date: "Aug 30" },
  { id: 3, user: "Michael Lee", item: "Crypto Kit", amount: "$59.99", date: "Aug 29" },
  { id: 4, user: "Sarah Kim", item: "Single Video", amount: "$14.99", date: "Aug 28" },
];

export default function SalesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    fetch("/api/me")
      .then(async (res) => {
        if (res.status === 401) return router.push("/login");
        const data = await res.json();
        if (data.role !== "ADMIN") return router.push("/dashboard/user");
        setLoading(false);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (loading) return <p className="p-6">Checking authentication...</p>;

  return (
    <DashboardLayout sidebarData={ASAM_SIDEBAR}>
      <h1 className="text-2xl font-bold mb-6">Sales Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$1,245</p>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Videos Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">152</p>
            <p className="text-sm text-muted-foreground">Single + Kits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Confirmations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">Awaiting Asam’s approval</p>
            <Button size="sm" className="mt-2">Review</Button>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sales Trend (Last 7 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 px-4">User</th>
                  <th className="py-2 px-4">Item</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-muted/30">
                    <td className="py-2 px-4">{sale.user}</td>
                    <td className="py-2 px-4">{sale.item}</td>
                    <td className="py-2 px-4">{sale.amount}</td>
                    <td className="py-2 px-4">{sale.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
