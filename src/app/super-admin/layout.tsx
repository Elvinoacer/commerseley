"use client";

import SuperAdminSidebar from "@/components/super-admin/sidebar";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";

function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminSidebar session={data} isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className={cn("transition-all duration-300", isSidebarOpen ? "ml-64" : "ml-16", "min-h-screen")}>
        {children}
      </div>
    </div>
  );
}

export default SuperAdminLayout;
