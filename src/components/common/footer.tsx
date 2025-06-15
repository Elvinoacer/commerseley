"use client";

import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, Clock, CreditCard, Shield, Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { href: "/", label: "Home" },
      { href: "/listing", label: "Products" },
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/account", label: "My Account" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/shipping", label: "Shipping Policy" },
      { href: "/returns", label: "Returns & Exchanges" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export default function Footer() {
  const { theme } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <footer
      className={`relative overflow-hidden transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900"
          : "bg-gradient-to-b from-blue-50 via-indigo-50 to-gray-50"
      }`}
    >
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      >
        <div
          className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 rounded-full filter blur-[60px]"
          style={{
            background:
              theme === "dark"
                ? "radial-gradient(circle, rgba(96, 165, 250, 0.2) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 rounded-full filter blur-[80px]"
          style={{
            background:
              theme === "dark"
                ? "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Grid pattern overlay */}
      <div
        className={`absolute inset-0 opacity-5 bg-[url('/images/grid-pattern.svg')] bg-cover ${
          theme === "dark" ? "invert" : ""
        }`}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="touch-manipulation">
              <Link href="/" className="flex items-center">
                <span
                  className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${
                    theme === "dark"
                      ? "from-blue-400 via-purple-400 to-pink-400"
                      : "from-blue-600 via-purple-600 to-pink-600"
                  } bg-clip-text text-transparent`}
                >
                  COMMERSELY
                </span>
              </Link>
            </motion.div>
            <p
              className={`text-xs sm:text-sm max-w-xs transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Premium e-commerce experience with carefully curated products and exceptional service.
            </p>
            <div className="flex items-center space-x-2 sm:space-x-3">
              {[
                { Icon: Instagram, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Facebook, href: "#" },
              ].map(({ Icon, href }, index) => (
                <motion.div key={index} whileHover={{ y: 0 }} whileTap={{ scale: 0.9 }} className="touch-manipulation">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 sm:h-9 sm:w-10 rounded-lg bg-gray-800/20 dark:bg-gray-800/40 backdrop-blur-md border ${
                      theme === "dark"
                        ? "border-indigo-500/30 hover:border-indigo-400"
                        : "border-gray-200/30 hover:border-blue-200"
                    } transition-all hover:shadow-lg hover:bg-blue-100/80 dark:hover:bg-indigo-900/80`}
                  >
                    <Link href={href} aria-label={`Visit our ${Icon.name} page`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-800 dark:text-gray-300" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4 sm:space-y-6">
              <h3 className={`text-base sm:text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {section.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="touch-manipulation"
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center text-xs sm:text-sm transition-colors duration-200 ${
                        isActive(link.href)
                          ? theme === "dark"
                            ? "text-indigo-400 font-semibold"
                            : "text-blue-600 font-semibold"
                          : theme === "dark"
                          ? "text-gray-300 hover:text-indigo-400"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      {isActive(link.href) && (
                        <motion.span
                          layoutId="footerActiveLink"
                          className="w-1.5 h-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-500 dark:bg-indigo-400 mr-2"
                          transition={{ type: "spring", stiffness: 500 }}
                        />
                      )}
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className={`text-base sm:text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Contact Us
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { icon: MapPin, text: "123 Commerce Street, Tech City, Nairobi, Kenya" },
                { icon: Mail, text: "smiley@store.com" },
                { icon: Phone, text: "+254 792 156094" },
                { icon: Clock, text: "Mon-Fri: 9AM-5PM" },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.3 }}
                  className="touch-manipulation"
                >
                  <item.icon
                    className={`h-4 w-4 sm:h-5 mt-0.5 mr-2 sm:mr-3 flex-shrink-0 ${
                      theme === "dark" ? "text-indigo-400 animate-pulse" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-xs sm:text-sm transition-colors ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200/50 dark:border-indigo-500/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: Truck, text: "Free Shipping Over $50" },
              { icon: CreditCard, text: "Secure Payment" },
              { icon: Shield, text: "30-Day Returns" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2 sm:space-x-3"
                whileHover={{ y: -2, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="touch-manipulation"
              >
                <div
                  className={`p-2 sm:p-3 rounded-lg backdrop-blur-md shadow-md transition-colors ${
                    theme === "dark"
                      ? "bg-indigo-900/40 border-indigo-500/30 hover:border-indigo-400"
                      : "bg-white/70 border-gray-200/30 hover:border-blue-200"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${theme === "dark" ? "text-indigo-400" : "text-blue-600"}`}
                  />
                </div>
                <span className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-8 sm:mt-12 text-center text-xs sm:text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p
            className={`bg-clip-text text-transparent bg-gradient-to-r ${
              theme === "dark" ? "from-gray-400 to-gray-200" : "from-gray-600 to-gray-400"
            }`}
          >
            © {new Date().getFullYear()} Commersely. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
