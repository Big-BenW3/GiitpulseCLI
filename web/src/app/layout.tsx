import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lenear — Catch it before they do.",
  description:
    "AI code review built for developers who want to catch bugs, security issues, and risky changes before they ship. Run lenear review from your terminal.",
  openGraph: {
    title: "Lenear — Catch it before they do.",
    description: "AI code review for developers who ship. lenear review .",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#0B1F3A]">{children}</body>
    </html>
  );
}
