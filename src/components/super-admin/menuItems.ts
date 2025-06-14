import {
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
import { SiSimpleanalytics } from "react-icons/si";
export const menuItems = [
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
