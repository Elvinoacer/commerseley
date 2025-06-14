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
        theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-blue-50 to-indigo-50"
      }`}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(circle at 70% 30%, rgba(126, 34, 206, 0.4) 0%, transparent 70%)"
              : "radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className={`absolute inset-0 opacity-5 ${
          theme === "dark" ? 'bg-[url("/images/grid-pattern-dark.svg")]' : 'bg-[url("/images/grid-pattern.svg")]'
        }`}
      ></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/" className="flex items-center">
                <span
                  className={`text-2xl font-bold bg-gradient-to-r ${
                    theme === "dark" ? "from-indigo-400 to-purple-400" : "from-indigo-600 to-purple-600"
                  } bg-clip-text text-transparent`}
                >
                  COMMERSELY
                </span>
              </Link>
            </motion.div>
            <p className={`transition-colors duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Premium e-commerce experience with carefully curated products and exceptional service.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Twitter, Facebook].map((Icon, index) => (
                <motion.div key={index} whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full shadow-sm transition-all ${
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                        : "bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-6">
              <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li key={linkIndex} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link
                      href={link.href}
                      className={`flex items-center transition-colors duration-200 ${
                        isActive(link.href)
                          ? theme === "dark"
                            ? "text-indigo-400 font-medium"
                            : "text-indigo-600 font-medium"
                          : theme === "dark"
                          ? "text-gray-400 hover:text-gray-200"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {isActive(link.href) && (
                        <motion.span
                          layoutId="footerActiveLink"
                          className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"
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
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              Contact Us
            </h3>
            <ul className="space-y-4">
              {[
                { icon: MapPin, text: "123 Commerce Street, Tech City, TC 10001" },
                { icon: Mail, text: "hello@commersely.com" },
                { icon: Phone, text: "+1 (555) 123-4567" },
                { icon: Clock, text: "Mon-Fri: 9AM-6PM" },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon
                    className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`}
                  />
                  <span className={`transition-colors ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {[
              { icon: Truck, text: "Free Shipping Over $50" },
              { icon: CreditCard, text: "Secure Payment" },
              { icon: Shield, text: "30-Day Returns" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div
                  className={`p-2 rounded-lg shadow-sm transition-colors ${
                    theme === "dark" ? "bg-gray-800 text-indigo-400" : "bg-white text-indigo-600"
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-12 text-center text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className={`transition-colors ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
            © {new Date().getFullYear()} Commersely. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
