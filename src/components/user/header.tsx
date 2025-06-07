"use client";

import { ArrowLeft, Menu, ShoppingBag, ShoppingCart, User, Info, Mail, FileText, Shield, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import commerselylogo from "@/assets/images/commersely-logo-freebg.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";

const navItems = [
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

const legalItems = [
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

function Header() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const [mobileView, setMobileView] = useState<"menu" | "account">("menu");
  const [showSheetDialog, setShowSheetDialog] = useState(false);
  const { fetchCart, items } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
  }

  const renderMobileMenuItems = () => {
    switch (mobileView) {
      case "account":
        return (
          <div className="space-y-2">
            <div className="flex items-center">
              <Button onClick={() => setMobileView("menu")} variant="ghost" size="icon">
                <ArrowLeft />
              </Button>
            </div>
            <nav className="space-y-2">
              <p
                onClick={() => {
                  setShowSheetDialog(false);
                  router.push("/account");
                }}
                className="block cursor-pointer w-full p-2"
              >
                Your Account
              </p>
              <Button
                onClick={() => {
                  setShowSheetDialog(false);
                  setMobileView("menu");
                  handleLogout();
                }}
              >
                Logout
              </Button>
            </nav>
          </div>
        );

      default:
        return (
          <div className="space-y-6 py-6">
            <div className="space-y-3">
              {navItems.map((navItem) => (
                <p
                  className="block w-full font-semibold p-2 cursor-pointer hover:bg-gray-50 rounded flex items-center"
                  onClick={() => {
                    setShowSheetDialog(false);
                    router.push(navItem.to);
                  }}
                  key={navItem.title}
                >
                  {navItem.icon || null}
                  {navItem.title}
                </p>
              ))}
            </div>
            <div className="space-y-3">
              {legalItems.map((item) => (
                <p
                  className="block w-full p-2 cursor-pointer hover:bg-gray-50 rounded flex items-center text-sm"
                  onClick={() => {
                    setShowSheetDialog(false);
                    router.push(item.to);
                  }}
                  key={item.title}
                >
                  {item.icon}
                  {item.title}
                </p>
              ))}
            </div>
            <div className="space-y-4 pt-4 border-t">
              <Button onClick={() => setMobileView("account")} className="w-full justify-start">
                <User className="mr-1 h-4 w-4" />
                Account
              </Button>
              <Button
                onClick={() => {
                  setShowSheetDialog(false);
                  router.push("/cart");
                }}
                className="w-full justify-start"
              >
                <ShoppingBag className="mr-1 h-4 w-4" />
                Cart ({items?.length || 0})
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <header
      className="sticky top-0 z-50 shadow-sm"
      style={{
        background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.9) 0%, rgba(236,238,240,0.9) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link className="text-2xl text-blue-950 font-bold" href="/">
            <Image src={commerselylogo} alt="Commersely logo" width={120} height={40} />
          </Link>
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            <nav className="flex items-center space-x-8">
              {navItems.map((item, index) => (
                <Link
                  href={item.to}
                  key={index}
                  className="text-sm font-semibold hover:text-gray-700 transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              {legalItems.map((item, index) => (
                <Link
                  href={item.to}
                  key={index}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <div className="relative cursor-pointer" onClick={() => router.push("/cart")}>
              <ShoppingCart className="h-5 w-5" />
              {items?.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-black text-white text-xs rounded-full flex items-center justify-center">
                  {items?.length}
                </span>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant={"ghost"} className="hover:bg-gray-100">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                <DropdownMenuItem onClick={() => router.push("/account")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Your Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="lg:hidden">
            <Sheet
              open={showSheetDialog}
              onOpenChange={() => {
                setShowSheetDialog(false);
                setMobileView("menu");
              }}
            >
              <Button
                onClick={() => setShowSheetDialog(!showSheetDialog)}
                size="icon"
                variant="ghost"
                className="hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">COMMERSELY</SheetTitle>
                </SheetHeader>
                {renderMobileMenuItems()}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
