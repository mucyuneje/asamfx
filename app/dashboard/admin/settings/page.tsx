"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ASAM_SIDEBAR } from "@/components/dashboard/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import IconCoinBitcoin from "@tabler/icons-react/dist/esm/icons/IconCoinBitcoin";
import IconDeviceMobile from "@tabler/icons-react/dist/esm/icons/IconDeviceMobile";

export default function SettingsPage() {
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

  // Payment states
  const [cryptoAddress, setCryptoAddress] = useState("0x123...abc");
  const [cryptoBlockchain, setCryptoBlockchain] = useState("Ethereum");
  const [cryptoCoin, setCryptoCoin] = useState("USDT");
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState("+2507XXXXXXXX");
  const [payeeName, setPayeeName] = useState("Asam FX");

  // Modal control
  const [currentMethod, setCurrentMethod] = useState<"crypto" | "mobile" | null>(null);

  const openDialog = (method: "crypto" | "mobile") => setCurrentMethod(method);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${currentMethod === "crypto" ? "Crypto" : "Mobile Money"} updated!`);
    setCurrentMethod(null);
  };

  if (loading) return <p className="p-6">Checking authentication...</p>;

  return (
    <DashboardLayout sidebarData={ASAM_SIDEBAR}>
      <h1 className="text-2xl font-bold mb-6">Payment Methods</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Crypto Card */}
        <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => openDialog("crypto")}>
          <CardHeader className="flex items-center gap-4">
            <IconCoinBitcoin className="w-8 h-8 text-yellow-500" />
            <CardTitle>Crypto</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <div><strong>Address:</strong> {cryptoAddress}</div>
            <div><strong>Blockchain:</strong> {cryptoBlockchain}</div>
            <div><strong>Coin:</strong> {cryptoCoin}</div>
            <div><strong>Payee Name:</strong> {payeeName}</div>
            <Button size="sm" className="mt-2 w-full">Update</Button>
          </CardContent>
        </Card>

        {/* Mobile Money Card */}
        <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => openDialog("mobile")}>
          <CardHeader className="flex items-center gap-4">
            <IconDeviceMobile className="w-8 h-8 text-green-500" />
            <CardTitle>Mobile Money</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <div><strong>Number:</strong> {mobileMoneyNumber}</div>
            <div><strong>Payee Name:</strong> {payeeName}</div>
            <Button size="sm" className="mt-2 w-full">Update</Button>
          </CardContent>
        </Card>
      </div>

      {/* Dialog */}
      <Dialog open={currentMethod !== null} onOpenChange={() => setCurrentMethod(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentMethod === "crypto" ? "Update Crypto" : "Update Mobile Money"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 mt-2">
            {currentMethod === "crypto" && (
              <>
                <div className="space-y-2">
                  <label className="font-medium">Crypto Address</label>
                  <Input value={cryptoAddress} onChange={(e) => setCryptoAddress(e.target.value)} placeholder="0x123...abc" required />
                </div>
                <div className="space-y-2">
                  <label className="font-medium">Blockchain</label>
                  <Select value={cryptoBlockchain} onValueChange={setCryptoBlockchain}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select Blockchain" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ethereum">Ethereum</SelectItem>
                      <SelectItem value="BSC">BSC</SelectItem>
                      <SelectItem value="Polygon">Polygon</SelectItem>
                      <SelectItem value="Solana">Solana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="font-medium">Coin</label>
                  <Select value={cryptoCoin} onValueChange={setCryptoCoin}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select Coin" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDT">USDT</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="BNB">BNB</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentMethod === "mobile" && (
              <div className="space-y-2">
                <label className="font-medium">Mobile Money Number</label>
                <Input value={mobileMoneyNumber} onChange={(e) => setMobileMoneyNumber(e.target.value)} placeholder="+2507XXXXXXXX" required />
              </div>
            )}

            <div className="space-y-2">
              <label className="font-medium">Payee Name</label>
              <Input value={payeeName} onChange={(e) => setPayeeName(e.target.value)} placeholder="Asam FX" required />
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
