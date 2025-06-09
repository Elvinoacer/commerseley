"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ListOrdered,
  LogOut,
  Package,
  Users2,
  Printer,
  SendToBack,
  Settings,
  Tag,
  Clock,
  Bell,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SiSimpleanalytics } from "react-icons/si";
import { useAuthStore } from "@/store/useAuthStore";
import { useAdminNotificationStore } from "@/store/useAdminNotificationStore"; // Import the notification store

interface SidebarProps {
  isOpen: Boolean;
  toggle: () => void;
}

const menuItems = [
  {
    name: "Products",
    icon: Package,
    href: "/super-admin/products/list",
  },
  {
    name: "Add New Product",
    icon: Printer,
    href: "/super-admin/products/add",
  },
  {
    name: "Orders",
    icon: SendToBack,
    href: "/super-admin/orders",
  },
  {
    name: "Coupons",
    icon: FileText,
    href: "/super-admin/coupons/list",
  },
  {
    name: "Create Coupon",
    icon: ListOrdered,
    href: "/super-admin/coupons/add",
  },
  {
    name: "Customers",
    icon: Users2,
    href: "/super-admin/customers",
  },
  {
    name: "Categories",
    icon: Tag,
    href: "/super-admin/categories",
  },
  {
    name: "Notifications",
    icon: Bell,
    href: "/super-admin/notifications",
  },
  {
    name: "Recent Actions",
    icon: Clock,
    href: "/super-admin/recent-activities",
  },
  {
    name: "Analytics",
    icon: SiSimpleanalytics,
    href: "/super-admin/analytics",
  },
  {
    name: "Payments",
    icon: DollarSign,
    href: "/super-admin/payments",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/super-admin/settings",
  },
  {
    name: "logout",
    icon: LogOut,
    href: "",
  },
];

function SuperAdminSidebar({ isOpen, toggle }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { notifications } = useAdminNotificationStore(); // Access notifications from the store

  // Check if there are any unread notifications
  const hasUnreadNotifications = notifications.some((notification) => !notification.isRead);

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-background transition-all duration-300",
        isOpen ? "w-64" : "w-16",
        "border-r"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <h1 className={cn("font-semibold", !isOpen && "hidden")}>Admin Panel</h1>
        <Button variant={"ghost"} size={"icon"} className="ml-auto" onClick={toggle}>
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      <div className="space-y-1 py-4">
        {menuItems.map((item) => (
          <div
            onClick={item.name === "logout" ? handleLogout : () => router.push(item.href)}
            key={item.name}
            className={cn(
              "flex cursor-pointer items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4",
                item.name === "Notifications" && hasUnreadNotifications && "text-red-500" // Highlight bell icon if there are unread notifications
              )}
            />
            <span className={cn("ml-3", !isOpen && "hidden")}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuperAdminSidebar;
