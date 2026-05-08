import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AssistantBoot from "@/components/assistant-boot";

export const metadata: Metadata = {
  title: "ActBrow - Embedded AI Assistant Platform",
  description: "Build intelligent assistants with Qwen, Gemini models, predefined flows, HTTP tools & browser automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AssistantBoot />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
