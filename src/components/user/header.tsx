"use client";

import commerselylogo from "@/assets/images/commersely-logo-freebg.png";
import { useCartStore } from "@/store/useCartStore";
import { ArrowLeft, Menu, ShoppingBag, ShoppingCart, Sun, Moon, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { legalItems, navItems } from "./navItems";
import { useTheme } from "next-themes";

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileView, setMobileView] = useState<"menu" | "account">("menu");
  const [showSheetDialog, setShowSheetDialog] = useState(false);
  const { fetchCart, items } = useCartStore();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  const renderUserDisplay = () => {
    if (!session?.user) {
      return (
        <Button
          variant="ghost"
          className="text-sm cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-gray-800/50"
          onClick={() => router.push("/auth/login")}
          aria-label="Log in"
        >
          Login
        </Button>
      );
    }

    const userInitial = session.user.name?.charAt(0).toUpperCase() || "U";
    const userImage = session.user.image;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800/50"
            aria-label="User profile menu"
          >
            {userImage ? (
              <Image src={userImage} alt="User profile" fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold">
                {userInitial}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[180px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700"
        >
          <DropdownMenuItem
            onClick={() => router.push("/account")}
            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <User className="mr-2 h-4 w-4" />
            Your Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderMobileMenuItems = () => {
    switch (mobileView) {
      case "account":
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <div className="flex items-center">
              <Button onClick={() => setMobileView("menu")} variant="ghost" size="icon" aria-label="Back to main menu">
                <ArrowLeft />
              </Button>
            </div>
            <nav className="space-y-2">
              <p
                onClick={() => {
                  setShowSheetDialog(false);
                  router.push("/account");
                }}
                className={`block cursor-pointer w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded ${
                  isActive("/account") ? "bg-blue-100 dark:bg-blue-900/50" : ""
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShowSheetDialog(false);
                    router.push("/account");
                  }
                }}
              >
                Your Account
              </p>
              <Button
                onClick={() => {
                  setShowSheetDialog(false);
                  setMobileView("menu");
                  handleLogout();
                }}
                className="w-full"
                aria-label="Log out"
              >
                Logout
              </Button>
            </nav>
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 py-6"
          >
            <div className="space-y-3">
              {navItems.map((navItem) => (
                <motion.p
                  key={navItem.title}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`block w-full font-semibold p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded flex items-center ${
                    isActive(navItem.to) ? "bg-blue-100 dark:bg-blue-900/50" : ""
                  }`}
                  onClick={() => {
                    setShowSheetDialog(false);
                    router.push(navItem.to);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setShowSheetDialog(false);
                      router.push(navItem.to);
                    }
                  }}
                >
                  {navItem.icon || null}
                  {navItem.title}
                </motion.p>
              ))}
            </div>
            <div className="space-y-3">
              {legalItems.map((item) => (
                <motion.p
                  key={item.title}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`block w-full p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded flex items-center text-sm ${
                    isActive(item.to) ? "bg-blue-100 dark:bg-blue-900/50" : ""
                  }`}
                  onClick={() => {
                    setShowSheetDialog(false);
                    router.push(item.to);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setShowSheetDialog(false);
                      router.push(item.to);
                    }
                  }}
                >
                  {item.icon}
                  {item.title}
                </motion.p>
              ))}
            </div>
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                onClick={() => setMobileView("account")}
                className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800/50"
                aria-label="View account options"
              >
                <User className="mr-1 h-4 w-4" />
                Account
              </Button>
              <Button
                onClick={() => {
                  setShowSheetDialog(false);
                  router.push("/cart");
                }}
                className={`w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800/50 ${
                  isActive("/cart") ? "bg-blue-100 dark:bg-blue-900/50" : ""
                }`}
                aria-label={`View cart with ${items?.length || 0} items`}
              >
                <ShoppingBag className="mr-1 h-4 w-4" />
                Cart ({items?.length || 0})
              </Button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <motion.header
      className="sticky overflow-hidden top-0 z-50 shadow-sm dark:bg-gray-900 bg-white"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      style={{
        background:
          theme === "dark"
            ? "radial-gradient(ellipse at top, rgba(9, 9, 44, 0.9) 0%, rgba(4, 2, 19, 0.95) 100%)"
            : "radial-gradient(ellipse at top, rgba(255, 255, 255, 0.96) 0%, rgba(236, 243, 255, 0.9) 100%)",
      }}
      role="banner"
    >
      {theme === "dark" && (
        <>
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 2}px`,
                  height: `${Math.random() * 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random(),
                  animation: `twinkle ${3 + Math.random() * 7}s infinite alternate`,
                }}
              />
            ))}
          </div>
          <div
            className="absolute top-1/4 -left-1/4 w-64 h-64 rounded-full filter blur-[80px] pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-1/4 -right-1/4 w-96 h-96 rounded-full filter blur-[100px] pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
              mixBlendMode: "screen",
            }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-20">
          <Link className="text-2xl text-blue-950 dark:text-white font-bold" href="/" aria-label="Commersely home">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Image
                src={commerselylogo}
                alt="Commersely logo"
                width={120}
                height={40}
                className="filter dark:invert"
              />
            </motion.div>
          </Link>
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            <nav className="flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              {navItems.map((item, index) => (
                <motion.div key={index} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link
                    href={item.to}
                    className={`text-sm font-semibold transition-colors ${
                      isActive(item.to)
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                    }`}
                    aria-current={isActive(item.to) ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-6" role="navigation" aria-label="Legal navigation">
              {legalItems.map((item, index) => (
                <motion.div key={index} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link
                    href={item.to}
                    className={`text-xs transition-colors ${
                      isActive(item.to)
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    }`}
                    aria-current={isActive(item.to) ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="relative cursor-pointer"
              onClick={() => router.push("/cart")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              role="button"
              aria-label={`View cart with ${items?.length || 0} items`}
            >
              <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <AnimatePresence>
                {items?.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center"
                  >
                    {items?.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-gray-100 dark:hover:bg-gray-800/50"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                <motion.div animate={{ rotate: theme === "dark" ? 360 : 0 }} transition={{ duration: 0.5 }}>
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-700" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
            {renderUserDisplay()}
          </div>
          <div className="lg:hidden flex items-center space-x-4">
            <motion.div
              className="relative cursor-pointer"
              onClick={() => router.push("/cart")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              role="button"
              aria-label={`View cart with ${items?.length || 0} items`}
            >
              <ShoppingCart className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <AnimatePresence>
                {items?.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center"
                  >
                    {items?.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-gray-100 dark:hover:bg-gray-800/50"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                <motion.div animate={{ rotate: theme === "dark" ? 360 : 0 }} transition={{ duration: 0.5 }}>
                  {theme === "dark" ? (
                    <Sun className="h-6 w-6 text-yellow-400" />
                  ) : (
                    <Moon className="h-6 w-6 text-gray-700" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
            {renderUserDisplay()}
            <Button
              onClick={() => setShowSheetDialog(!showSheetDialog)}
              size="icon"
              variant="ghost"
              className="hover:bg-gray-100 dark:hover:bg-gray-800/50"
              aria-label="Open mobile menu"
              aria-expanded={showSheetDialog}
            >
              <motion.div whileHover={{ rotate: 90 }} transition={{ type: "spring", stiffness: 300 }}>
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </motion.div>
            </Button>
          </div>
          <div className="lg:hidden">
            <Sheet
              open={showSheetDialog}
              onOpenChange={() => {
                setShowSheetDialog(false);
                setMobileView("menu");
              }}
            >
              <SheetContent
                side="left"
                className={`w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 ${
                  theme === "dark" ? "dark" : ""
                }`}
                aria-label="Mobile menu"
              >
                <SheetHeader>
                  <SheetTitle className="text-left text-gray-900 dark:text-white">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                      COMMERSELY
                    </motion.div>
                  </SheetTitle>
                </SheetHeader>
                {renderMobileMenuItems()}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
        aria-hidden="true"
      />

      <style jsx global>{`
        @keyframes twinkle {
          0% {
            opacity: 0.2;
            transform: translate(0, 0);
          }
          50% {
            opacity: 1;
            transform: translate(2px, -3px);
          }
          100% {
            opacity: 0.3;
            transform: translate(-1px, 1px);
          }
        }
      `}</style>
    </motion.header>
  );
}

export default Header;
