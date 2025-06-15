"use client";

import SuperAdminSidebar from "@/components/super-admin/sidebar";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  // Initialize isSidebarOpen as null to defer rendering until client mount
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { data } = useSession();

  // Set sidebar state and mount flag on client
  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      // Open sidebar by default on desktop (lg and above)
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    // Run on mount
    handleResize();
    // Add resize listener
    window.addEventListener("resize", handleResize);
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Skip rendering until mounted to avoid hydration mismatch
  if (!isMounted || isSidebarOpen === null) {
    return null; // Or a minimal fallback, e.g., <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header with Toggle Button */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          )}
        </Button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white ml-4">Admin Panel</h1>
      </header>

      {/* Sidebar */}
      <SuperAdminSidebar session={data} isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          // No margin on mobile; apply margin only on desktop
          isSidebarOpen ? "lg:ml-64" : "lg:ml-16",
          // Add padding-top on mobile to account for header
          "pt-16 lg:pt-0 min-h-screen"
        )}
      >
        {children}
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default SuperAdminLayout;
