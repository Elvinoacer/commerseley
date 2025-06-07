"use client";
import { Shield, Lock, EyeOff, Server } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center bg-indigo-100 p-4 rounded-full mb-6">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600">Last updated: June 2023</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="prose max-w-none">
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Lock className="w-6 h-6 text-indigo-600 mr-3" />
                  Introduction
                </h2>
                <p className="text-gray-700 mb-4">
                  At Commersely, we are committed to protecting your privacy.
                  This Privacy Policy explains how we collect, use, disclose,
                  and safeguard your information when you visit our website or
                  make a purchase.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <EyeOff className="w-6 h-6 text-indigo-600 mr-3" />
                  Information We Collect
                </h2>
                <p className="text-gray-700 mb-4">
                  We may collect personal information that you voluntarily
                  provide to us when you:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-700">
                  <li>Register an account</li>
                  <li>Make a purchase</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact customer support</li>
                </ul>
                <p className="text-gray-700">
                  This information may include your name, email address, phone
                  number, payment information, and shipping address.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Server className="w-6 h-6 text-indigo-600 mr-3" />
                  How We Use Your Information
                </h2>
                <p className="text-gray-700 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders</li>
                  <li>Improve our products and services</li>
                  <li>Prevent fraudulent transactions</li>
                  <li>Send promotional communications (if you opt-in)</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-6">Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement security measures designed to protect your
                  information from unauthorized access, alteration, or
                  disclosure. All transactions are processed through a gateway
                  provider and are not stored or processed on our servers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6">
                  Changes to This Policy
                </h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the &quot;Last updated&quot; date.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
