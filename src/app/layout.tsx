import CommonLayout from "@/components/common/layout";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from "./ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Commerseley | Your Next Big Online Store",
    template: "%s | Commerseley",
  },
  description:
    "Discover a seamless shopping experience with Commerseley - The ultimate e-commerce platform for modern businesses and savvy shoppers.",
  keywords: ["ecommerce", "online store", "shopping", "nextjs ecommerce", "modern ecommerce platform"],
  authors: [
    {
      name: "Commerseley Team",
      url: "https://commerseley.com",
    },
  ],
  creator: "Commerseley",
  publisher: "Commerseley Inc.",
  metadataBase: new URL("https://commerseley.com"),
  openGraph: {
    title: "Commerseley | Your Next Big Online Store",
    description: "Discover a seamless shopping experience with Commerseley",
    url: "https://commerseley.com",
    siteName: "Commerseley",
    images: [
      {
        url: "/images/commersely-logo-freebg.png",
        width: 1200,
        height: 630,
        alt: "Commerseley - Modern Ecommerce Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Commerseley | Your Next Big Online Store",
    description: "Discover a seamless shopping experience with Commerseley",
    images: ["/images/commersely-logo-freebg.png"],
    creator: "@commerseley",
  },
  icons: {
    icon: [
      {
        url: "/images/commersely-logo-freebg.png",
        type: "image/x-icon",
      },
      {
        url: "/images/commersely-logo-freebg.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/images/commersely-logo-freebg.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/images/commersely-logo-freebg.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/images/commersely-logo-freebg.png",
        color: "#5bbad5",
      },
    ],
  },
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon links */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          storageKey="commerseley-theme"
        >
          <Providers>
            <CommonLayout>{children}</CommonLayout>
          </Providers>
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
