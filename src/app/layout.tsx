import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AssistantBoot from "@/components/assistant-boot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ActBrow — The AI agent that lives inside your product",
  description:
    "Drop in two script tags and ship an AI agent that navigates your app, calls your APIs, runs flows, and answers from your docs — inside your own product. Configured by your coding agent, not weeks of glue code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans">
        <AssistantBoot />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
