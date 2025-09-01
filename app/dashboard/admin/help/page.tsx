"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ASAM_SIDEBAR } from "@/components/dashboard/data";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IconHelp, IconVideo, IconPackage, IconCoin, IconUser, IconSettings } from "@tabler/icons-react";

export default function HelpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Client-side auth check
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
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <IconHelp className="w-6 h-6 text-primary" />
        Documentation & Help
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video Management Help */}
        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex items-center gap-2">
            <IconVideo className="w-6 h-6 text-blue-500" />
            <CardTitle>Video Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="upload">
                <AccordionTrigger>Uploading Videos</AccordionTrigger>
                <AccordionContent>
                  Go to <strong>Upload Video</strong> page, fill in the details, and use the Mux uploader to add videos to the platform.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="manage">
                <AccordionTrigger>Managing Videos</AccordionTrigger>
                <AccordionContent>
                  You can edit, delete, or play videos from the <strong>Manage Videos</strong> page. Use filters and search to find specific videos.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Kit Management Help */}
        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex items-center gap-2">
            <IconPackage className="w-6 h-6 text-purple-500" />
            <CardTitle>Kit Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="create-kit">
                <AccordionTrigger>Creating Kits</AccordionTrigger>
                <AccordionContent>
                  Select videos and create kits. Assign a price and description. Kits help bundle multiple videos for sale.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="manage-kit">
                <AccordionTrigger>Managing Kits</AccordionTrigger>
                <AccordionContent>
                  Edit or delete existing kits. Use search to locate kits by title or included videos.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Payment Methods Help */}
        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex items-center gap-2">
            <IconCoin className="w-6 h-6 text-yellow-500" />
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="crypto">
                <AccordionTrigger>Crypto Payments</AccordionTrigger>
                <AccordionContent>
                  Admin can set crypto addresses and supported blockchains. Users pay manually, and you confirm transactions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="mobile">
                <AccordionTrigger>Mobile Money</AccordionTrigger>
                <AccordionContent>
                  Set mobile money numbers and payee names. Users pay manually via mobile money.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Requests Management Help */}
        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex items-center gap-2">
            <IconUser className="w-6 h-6 text-green-500" />
            <CardTitle>Requests Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="view">
                <AccordionTrigger>Viewing Requests</AccordionTrigger>
                <AccordionContent>
                  Admin can see all user requests, filter by status, sort by date, and open details in a drawer/dialog.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="approve">
                <AccordionTrigger>Approving Requests</AccordionTrigger>
                <AccordionContent>
                  Once a user pays, you can approve or reject requests. Details show the video purchased and payment info.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Settings Help */}
        <Card className="hover:shadow-lg transition">
          <CardHeader className="flex items-center gap-2">
            <IconSettings className="w-6 h-6 text-gray-500" />
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="payment-settings">
                <AccordionTrigger>Payment Settings</AccordionTrigger>
                <AccordionContent>
                  Admin can update crypto addresses, supported coins, blockchains, mobile money numbers, and payee names via a modern dialog.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
