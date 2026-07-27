import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AssistantBoot from "@/components/assistant-boot";
import { PostHogProvider } from "./posthog-provider";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_TAGLINE, GITHUB_URL, absoluteUrl } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "in-app chat that takes action",
    "embed assistant that navigates your app",
    "Intercom alternative that acts",
    "Zendesk chatbot alternative",
    "two script tag product assistant",
    "self-hosted in-product assistant",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

// Site-wide structured data. SoftwareApplication + Organization feed AI Overviews and
// ChatGPT/Perplexity-style citations with the verbatim facts we want quoted (two-script
// embed, no backend rewrite, Docker self-host).
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      sameAs: [GITHUB_URL],
    },
    {
      "@type": "SoftwareApplication",
      "@id": absoluteUrl("/#software"),
      name: SITE_NAME,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web, Docker (self-hosted)",
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Open-source, self-hostable with Docker.",
      },
      featureList: [
        "Chat widget that navigates your app and calls your APIs",
        "Finishes tasks so users don't open tickets",
        "Embed with two script tags — no backend rewrite",
        "Unlike Intercom / Zendesk — acts inside the product",
        "Self-host with Docker",
      ],
      publisher: { "@id": absoluteUrl("/#organization") },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased font-sans">
        <PostHogProvider>
          <AssistantBoot />
          {children}
          <Toaster />
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
