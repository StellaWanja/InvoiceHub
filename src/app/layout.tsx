import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WEB_TITLE } from "@/constants/invoices";
import Spinner from "@/components/Spinner";
import "./globals.css";

const inter = Inter({
  weight: ["400", "500", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: WEB_TITLE,
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} antialiased min-h-screen grid grid-rows-[auto_1fr_auto] bg-[#f5f4ff]`}
        >
          <Header />
          <Suspense fallback={<Spinner />}>{children}</Suspense>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
