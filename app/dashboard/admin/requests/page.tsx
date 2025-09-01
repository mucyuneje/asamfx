"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ASAM_SIDEBAR } from "@/components/dashboard/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconSearch, IconSortAscending, IconSortDescending, IconX } from "@tabler/icons-react";

// Mock requests (replace with Prisma fetch later)
interface Request {
  id: number;
  user: string;
  video: string;
  type: "SINGLE" | "KIT";
  amount: number;
  method: "Crypto" | "Mobile Money";
  status: "PENDING" | "PAID" | "REJECTED";
  createdAt: string;
  description: string;
}

const MOCK_REQUESTS: Request[] = [
  { id: 1, user: "John Doe", video: "Forex Basics", type: "SINGLE", amount: 20, method: "Crypto", status: "PAID", createdAt: "2025-09-01", description: "Request for Forex Basics video" },
  { id: 2, user: "Jane Smith", video: "Advanced Strategies", type: "KIT", amount: 50, method: "Mobile Money", status: "PENDING", createdAt: "2025-09-02", description: "Request for Advanced Strategies Kit" },
  { id: 3, user: "Bob Lee", video: "Trading Patterns", type: "SINGLE", amount: 30, method: "Crypto", status: "REJECTED", createdAt: "2025-09-03", description: "Request for Trading Patterns video" },
];

export default function RequestsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [drawerRequest, setDrawerRequest] = useState<Request | null>(null);

  // Filtered and sorted requests
  const filteredRequests = useMemo(() => {
    let filtered = MOCK_REQUESTS.filter(
      (r) =>
        r.user.toLowerCase().includes(search.toLowerCase()) ||
        r.video.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter && statusFilter !== "ALL") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }
    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return filtered;
  }, [search, statusFilter, sortOrder]);

  const handleApprove = (req: Request) => {
    alert(`Approved request ${req.id}`);
    setDrawerRequest(null);
  };

  const handleReject = (req: Request) => {
    alert(`Rejected request ${req.id}`);
    setDrawerRequest(null);
  };

  return (
    <DashboardLayout sidebarData={ASAM_SIDEBAR}>
      <h1 className="text-2xl font-bold mb-6">Requests Management</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <Input
          placeholder="Search by user or video"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select onValueChange={(v) => setStatusFilter(v === "ALL" ? null : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? (
            <>
              <IconSortAscending className="w-4 h-4" />
              Asc
            </>
          ) : (
            <>
              <IconSortDescending className="w-4 h-4" />
              Desc
            </>
          )}
        </Button>
      </div>

      {/* Requests Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Video</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((req) => (
            <TableRow key={req.id} onClick={() => setDrawerRequest(req)} className="cursor-pointer hover:bg-accent/10">
              <TableCell>{req.user}</TableCell>
              <TableCell>{req.video}</TableCell>
              <TableCell>{req.type}</TableCell>
              <TableCell>${req.amount}</TableCell>
              <TableCell>{req.method}</TableCell>
              <TableCell className={`font-medium ${
                req.status === "PAID"
                  ? "text-green-500"
                  : req.status === "PENDING"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}>{req.status}</TableCell>
              <TableCell>{req.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Drawer */}
      <Dialog open={!!drawerRequest} onOpenChange={() => setDrawerRequest(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {drawerRequest?.user} - {drawerRequest?.video}
            </DialogTitle>
          </DialogHeader>
          <CardContent className="space-y-2">
            <p><strong>Type:</strong> {drawerRequest?.type}</p>
            <p><strong>Amount:</strong> ${drawerRequest?.amount}</p>
            <p><strong>Method:</strong> {drawerRequest?.method}</p>
            <p><strong>Status:</strong> {drawerRequest?.status}</p>
            <p><strong>Description:</strong> {drawerRequest?.description}</p>
            <p><strong>Created:</strong> {drawerRequest?.createdAt}</p>
          </CardContent>
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={() => handleReject(drawerRequest!)}>Reject</Button>
            <Button onClick={() => handleApprove(drawerRequest!)}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
