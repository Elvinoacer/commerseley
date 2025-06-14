"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useAdminNotificationStore } from "@/store/useAdminNotificationStore";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Sun, Moon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  Package,
  Printer,
  SendToBack,
  FileText,
  ListOrdered,
  Users2,
  Tag,
  Bell,
  Clock,
  DollarSign,
  Settings,
  LogOut,
  Boxes,
  Tags,
  ShoppingCart,
  UserCog,
  Activity,
  CreditCard,
} from "lucide-react";
import { SiSimpleanalytics } from "react-icons/si";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  session: {
    user: {
      name: string;
      email: string;
      image: string;
      id: string;
      role: string;
    };
    expires: string;
  } | null;
}

interface MenuGroup {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
  }[];
}

function SuperAdminSidebar({ isOpen, toggle, session }: SidebarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { notifications } = useAdminNotificationStore();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const hasUnreadNotifications = notifications.some((notification) => !notification.isRead);

  const menuGroups: MenuGroup[] = [
    {
      name: "Products",
      icon: Package,
      items: [
        {
          name: "All Products",
          icon: Package,
          href: "/super-admin/products/list",
        },
        {
          name: "Add New",
          icon: Printer,
          href: "/super-admin/products/add",
        },
        {
          name: "Categories",
          icon: Tag,
          href: "/super-admin/categories",
        },
      ],
    },
    {
      name: "Orders",
      icon: ShoppingCart,
      items: [
        {
          name: "All Orders",
          icon: SendToBack,
          href: "/super-admin/orders",
        },
        {
          name: "Recent Activities",
          icon: Clock,
          href: "/super-admin/recent-activities",
        },
      ],
    },
    {
      name: "Marketing",
      icon: Tags,
      items: [
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
      ],
    },
    {
      name: "Users",
      icon: UserCog,
      items: [
        {
          name: "Customers",
          icon: Users2,
          href: "/super-admin/customers",
        },
      ],
    },
    {
      name: "Analytics",
      icon: Activity,
      items: [
        {
          name: "Dashboard",
          icon: SiSimpleanalytics,
          href: "/super-admin/analytics",
        },
        {
          name: "Payments",
          icon: DollarSign,
          href: "/super-admin/payments",
        },
      ],
    },
  ];

  const singleItems = [
    {
      name: "Notifications",
      icon: Bell,
      href: "/super-admin/notifications",
      hasBadge: true,
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/super-admin/settings",
    },
  ];

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  async function handleLogout() {
    try {
      const result = await signOut({
        redirect: false,
        callbackUrl: "/auth/login",
      });

      toast.success("You have been logged out successfully");
      router.push(result.url);
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  }

  const handleItemClick = (href: string) => {
    if (href === "#logout") {
      handleLogout();
    } else {
      router.push(href);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.div
      initial={{ width: isOpen ? 256 : 64 }}
      animate={{ width: isOpen ? 256 : 64 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col",
        "bg-white dark:bg-gray-900",
        "border-r border-gray-200 dark:border-gray-800",
        "shadow-xl"
      )}
    >
      {/* Sidebar Header */}
      <div className={cn("flex h-16 items-center justify-between px-4", "bg-gray-50 dark:bg-gray-800")}>
        {isOpen && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-lg text-gray-900 dark:text-white"
          >
            Admin Panel
          </motion.h1>
        )}
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={toggle}
          className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar Content */}
      <div className="overflow-y-auto h-[calc(100vh-8rem)] custom-scrollbar">
        <div className="space-y-1 py-4 px-2">
          {/* Grouped Items */}
          {menuGroups.map((group) => (
            <div key={group.name} className="mb-2">
              {isOpen ? (
                <>
                  <div
                    onClick={() => toggleGroup(group.name)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      "transition-colors duration-200"
                    )}
                  >
                    <div className="flex items-center">
                      <group.icon className="h-4 w-4" />
                      <span className="ml-3 text-sm font-medium">{group.name}</span>
                    </div>
                    {openGroups[group.name] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  <AnimatePresence>
                    {openGroups[group.name] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-6 pl-2 border-l-2 mt-1 space-y-1">
                          {group.items.map((item) => (
                            <motion.div key={item.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <div
                                onClick={() => handleItemClick(item.href)}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm rounded-md cursor-pointer",
                                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                                  "transition-colors duration-200"
                                )}
                              >
                                <item.icon className="h-4 w-4" />
                                <span className="ml-3">{item.name}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} className="flex justify-center py-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleGroup(group.name)}
                    className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                  >
                    <group.icon className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          ))}

          {/* Single Items */}
          {singleItems.map((item) => (
            <motion.div key={item.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div
                onClick={() => handleItemClick(item.href)}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md cursor-pointer relative",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "transition-colors duration-200",
                  !isOpen && "justify-center"
                )}
              >
                <div className="relative">
                  <item.icon className="h-4 w-4" />
                  {item.hasBadge && hasUnreadNotifications && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"
                    />
                  )}
                </div>
                {isOpen && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 text-sm">
                    {item.name}
                  </motion.span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* User Profile Section */}
      <div
        className={cn("mt-auto border-t p-4", "border-gray-200 dark:border-gray-800", "bg-gray-50 dark:bg-gray-800")}
      >
        {isOpen ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <div className="truncate">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{session?.user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session?.user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        )}

        {/* Logout Button - Always visible */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center mt-2 px-3 py-2 rounded-md cursor-pointer",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "transition-colors duration-200",
            !isOpen && "justify-center"
          )}
          onClick={() => handleLogout()}
        >
          <LogOut className="h-4 w-4" />
          {isOpen && <span className="ml-3 text-sm">Logout</span>}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SuperAdminSidebar;
