"use client";

import Script from "next/script";
import { useEffect } from "react";

const DEFAULT_BASE = "http://localhost:8080";

export default function AssistantBoot() {
  const baseUrl =
    process.env.NEXT_PUBLIC_ACTBROW_BASE_URL?.replace(/\/$/, "") ??
    DEFAULT_BASE;

  const assistantId =
    process.env.NEXT_PUBLIC_ACTBROW_ASSISTANT_ID ??
    "bb3d1327-5ea7-44bb-b203-bcd5a5d4c959";

  const apiKey =
    process.env.NEXT_PUBLIC_ACTBROW_API_KEY ??
    "ak_SiC3AVwngnHzzZB-iaZN52Oa1A1kFL2YzyZed7XKWTU";

  // Set config immediately before scripts load
  useEffect(() => {
    (window as any).ActbrowWidgetConfig = {
      assistantId: assistantId,
      apiKey: apiKey,
      baseUrl: baseUrl,
      debug: true
    };
  }, [assistantId, apiKey, baseUrl]);

  return (
    <>
      <Script
        id="actbrow-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.ActbrowWidgetConfig = {
              assistantId: "${assistantId}",
              apiKey: "${apiKey}",
              baseUrl: "${baseUrl}",
              debug: true
            };
          `,
        }}
      />
      <Script src={`${baseUrl}/actbrow-sdk.js`} strategy="afterInteractive" />
      <Script src={`${baseUrl}/actbrow-widget.js`} strategy="afterInteractive" />
    </>
  );
}
