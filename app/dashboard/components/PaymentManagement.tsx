"use client";

import { useState, useEffect, useMemo } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Payment = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  proofUrl: string;
  description: string;
  user: { id: string; name: string; email: string };
  video: { id: string; title: string };
  createdAt: string;
};

export default function PaymentTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Fetch payments from backend API
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/payments"); // <-- replace with your real API endpoint
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data: Payment[] = await res.json();
      setPayments(data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Update payment status via API
  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/admin/payments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update payment status");

      setPayments(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
      if (selectedPayment && selectedPayment.id === id) {
        setSelectedPayment({ ...selectedPayment, status });
      }
    } catch (err) {
      console.error("Failed to update payment:", err);
    }
  };

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "APPROVED": return "success";
      case "REJECTED": return "destructive";
      case "PENDING": return "primary";
    }
  };

  const filteredPayments = useMemo(() => {
    let data = [...payments];
    if (search) {
      const lower = search.toLowerCase();
      data = data.filter(p =>
        p.user.name.toLowerCase().includes(lower) ||
        p.user.email.toLowerCase().includes(lower) ||
        p.video.title.toLowerCase().includes(lower)
      );
    }
    if (filterStatus !== "ALL") data = data.filter(p => p.status === filterStatus);
    return data;
  }, [payments, search, filterStatus]);

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <p>Loading payments...</p>;

  return (
    <div className="space-y-6 p-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input placeholder="Search by user or video" value={search} onChange={e => setSearch(e.target.value)} className="flex-1" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Video</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPayments.map(payment => (
            <TableRow key={payment.id} className="cursor-pointer hover:bg-muted" onClick={() => setSelectedPayment(payment)}>
              <TableCell>{payment.user.name}</TableCell>
              <TableCell>{payment.user.email}</TableCell>
              <TableCell>{payment.video.title}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(payment.status)}>{payment.status}</Badge>
              </TableCell>
              <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
        <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            size="sm"
            variant={currentPage === i + 1 ? "default" : "outline"}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
      </div>

      {/* Full-Screen Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/80 p-6 overflow-auto">
          <div className="bg-background rounded-xl shadow-2xl w-full max-w-6xl p-8 flex flex-col gap-6 relative">
            <button className="absolute top-6 right-6 text-4xl font-bold" onClick={() => setSelectedPayment(null)}>✕</button>

            <h2 className="text-4xl font-bold">{selectedPayment.video.title}</h2>
            <Badge variant={getStatusColor(selectedPayment.status)} className="mb-4 text-lg">{selectedPayment.status}</Badge>

            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={selectedPayment.proofUrl}
                alt="Payment Proof"
                className="w-full md:w-2/5 rounded-lg shadow-lg object-cover max-h-[600px]"
              />
              <div className="flex-1 flex flex-col gap-4">
                <p className="text-lg"><strong>Requested By:</strong> {selectedPayment.user.name} ({selectedPayment.user.email})</p>
                <p className="text-lg"><strong>Description:</strong> {selectedPayment.description}</p>
                <p className="text-lg"><strong>Requested On:</strong> {new Date(selectedPayment.createdAt).toLocaleString()}</p>

                {selectedPayment.status === "PENDING" && (
                  <div className="flex gap-4 mt-6">
                    <Button variant="success" size="lg" onClick={() => handleUpdateStatus(selectedPayment.id, "APPROVED")}>Approve</Button>
                    <Button variant="destructive" size="lg" onClick={() => handleUpdateStatus(selectedPayment.id, "REJECTED")}>Reject</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
