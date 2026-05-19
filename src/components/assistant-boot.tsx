"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_BASE = "http://localhost:8080";
/** Bump when actbrow-sdk.js changes so browsers fetch the latest bundle. */
const SDK_ASSET_VERSION = "3";

export default function AssistantBoot() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const baseUrl =
    process.env.NEXT_PUBLIC_ACTBROW_BASE_URL?.replace(/\/$/, "") ??
    DEFAULT_BASE;

  useEffect(() => {
    const syncConfig = () => {
      const assistantId =
        process.env.NEXT_PUBLIC_ACTBROW_ASSISTANT_ID ??
        localStorage.getItem("actbrow_active_assistant_id");
      const apiKey =
        process.env.NEXT_PUBLIC_ACTBROW_API_KEY ??
        localStorage.getItem("actbrow_api_key");

      if (!assistantId || !apiKey) {
        setReady(false);
        return;
      }

      (window as any).ActbrowWidgetConfig = {
        assistantId: assistantId,
        apiKey: apiKey,
        baseUrl: baseUrl,
        debug: true,
        navigate: (path: string) => router.push(path),
      };
      setReady(true);
    };

    syncConfig();
    window.addEventListener("actbrow-active-assistant-changed", syncConfig);
    return () => window.removeEventListener("actbrow-active-assistant-changed", syncConfig);
  }, [baseUrl, router]);

  if (!ready) {
    return null;
  }

  return (
    <>
      <Script src={`${baseUrl}/actbrow-sdk.js?v=${SDK_ASSET_VERSION}`} strategy="afterInteractive" />
      <Script src={`${baseUrl}/actbrow-widget.js?v=${SDK_ASSET_VERSION}`} strategy="afterInteractive" />
    </>
  );
}
