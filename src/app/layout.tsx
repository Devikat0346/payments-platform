import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NavShell } from "@/components/shell/NavShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Payments Platform",
  description:
    "A multi-rail payments system built end-to-end: live observability, AI-assisted incident response, reconciliation, and business insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavShell>{children}</NavShell>
      </body>
    </html>
  );
}
