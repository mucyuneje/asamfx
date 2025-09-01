// app/dashboard/asam/payments/page.tsx
"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ASAM_SIDEBAR } from "@/components/dashboard/data";
import { useState } from "react";

interface Payment {
  id: number;
  user: string;
  type: "MOBILE_MONEY" | "CRYPTO";
  amount: number;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
}

const MOCK_PAYMENTS: Payment[] = [
  { id: 1, user: "Student A", type: "MOBILE_MONEY", amount: 20, status: "PENDING" },
  { id: 2, user: "Student B", type: "CRYPTO", amount: 50, status: "PENDING" },
  { id: 3, user: "Student C", type: "MOBILE_MONEY", amount: 10, status: "CONFIRMED" },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState(MOCK_PAYMENTS);

  const updateStatus = (id: number, status: "CONFIRMED" | "REJECTED") => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  return (
    <DashboardLayout sidebarData={ASAM_SIDEBAR}>
      <h1 className="text-2xl font-bold mb-4">Pending Payments</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-border rounded-md">
          <thead className="bg-accent/10 text-foreground">
            <tr>
              <th className="p-2 border-b border-border text-left">User</th>
              <th className="p-2 border-b border-border text-left">Type</th>
              <th className="p-2 border-b border-border text-left">Amount</th>
              <th className="p-2 border-b border-border text-left">Status</th>
              <th className="p-2 border-b border-border text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-accent/5 transition-colors">
                <td className="p-2 border-b border-border">{payment.user}</td>
                <td className="p-2 border-b border-border">{payment.type}</td>
                <td className="p-2 border-b border-border">${payment.amount}</td>
                <td className="p-2 border-b border-border">{payment.status}</td>
                <td className="p-2 border-b border-border space-x-2">
                  {payment.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => updateStatus(payment.id, "CONFIRMED")}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(payment.id, "REJECTED")}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
