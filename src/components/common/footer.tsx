// components/Footer.tsx
"use client";

import {
  Instagram,
  Twitter,
  Facebook,
  Mail,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  Shield,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 80% 30%, rgba(224, 242, 254, 0.7) 0%, rgba(224, 242, 254, 0) 60%), radial-gradient(circle at 20% 70%, rgba(233, 213, 255, 0.5) 0%, rgba(233, 213, 255, 0) 60%)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                COMMERSELY
              </span>
            </Link>
            <p className="text-gray-600">
              Premium e-commerce experience with carefully curated products and
              exceptional service.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white shadow-sm hover:bg-gray-100"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white shadow-sm hover:bg-gray-100"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white shadow-sm hover:bg-gray-100"
              >
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/listing"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-600">
                  123 Commerce Street, Tech City, TC 10001
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0" />
                <span className="text-gray-600">hello@commersely.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0" />
                <span className="text-gray-600">Mon-Fri: 9AM-6PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Truck className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-sm">Free Shipping Over $50</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <CreditCard className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-sm">30-Day Returns</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Commersely. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
