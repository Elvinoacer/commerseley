import { Info, Mail, Heart, FileText, Shield } from "lucide-react";
export const navItems = [
  {
    title: "HOME",
    to: "/",
  },
  {
    title: "PRODUCTS",
    to: "/listing",
  },
  {
    title: "ABOUT",
    to: "/about",
    icon: <Info className="h-4 w-4 mr-2" />,
  },
  {
    title: "CONTACT",
    to: "/contact",
    icon: <Mail className="h-4 w-4 mr-2" />,
  },
  {
    title: "WISHLIST",
    to: "/wishlist",
    icon: <Heart />,
  },
];

export const legalItems = [
  {
    title: "TERMS",
    to: "/terms",
    icon: <FileText className="h-4 w-4 mr-2" />,
  },
  {
    title: "PRIVACY",
    to: "/privacy",
    icon: <Shield className="h-4 w-4 mr-2" />,
  },
];
