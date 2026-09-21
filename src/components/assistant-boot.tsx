"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_BASE = "http://localhost:8080";
/**
 * Public demo assistant, shown to logged-out visitors across the marketing site. A widget key is
 * public by design (it ships in the page source of every embedding site); the backend ties it to an
 * account by the assistant's allowed-origins list, so restrict this assistant to the site domain.
 */
const PUBLIC_ASSISTANT_ID = process.env.NEXT_PUBLIC_ACTBROW_PUBLIC_ASSISTANT_ID ?? null;
const PUBLIC_API_KEY = process.env.NEXT_PUBLIC_ACTBROW_PUBLIC_API_KEY ?? null;
/**
 * Starter prompts for anonymous visitors, who have no reason to guess what the widget can do. Each
 * one resolves to a real route on this site, so the answer demonstrates navigation rather than
 * describing it. Signed-in users see their own assistant's configured suggestions instead.
 */
const PUBLIC_SUGGESTIONS = [
  "How is this different from a chatbot?",
  "What can it actually do in my app?",
  "Can it call my APIs?",
  "Is it open source?",
];
/** Bump when actbrow-sdk.js changes so browsers fetch the latest bundle. */
const SDK_ASSET_VERSION = "7";

export default function AssistantBoot() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  /**
   * The widget bootstrap throws if the SDK is not already on window, and next/script injects both
   * tags asynchronously with no ordering guarantee — the 4KB widget reliably wins the race against
   * the 133KB SDK on a cold load. So the widget tag is only rendered once the SDK has run.
   */
  const [sdkLoaded, setSdkLoaded] = useState(false);
  /** Identity the mounted widget was built with, so a change can force a remount. */
  const mountedIdentity = useRef<string | null>(null);
  const baseUrl =
    process.env.NEXT_PUBLIC_ACTBROW_BASE_URL?.replace(/\/$/, "") ??
    DEFAULT_BASE;

  useEffect(() => {
    const syncConfig = () => {
      // Signed-in visitors drive the widget with their own assistant; everyone else falls back to
      // the public demo assistant so the marketing site is itself a live trial of the product.
      const ownAssistantId =
        process.env.NEXT_PUBLIC_ACTBROW_ASSISTANT_ID ??
        localStorage.getItem("actbrow_active_assistant_id");
      const ownApiKey =
        process.env.NEXT_PUBLIC_ACTBROW_API_KEY ??
        localStorage.getItem("actbrow_api_key");

      // Resolved as a pair: never combine one visitor's assistant with the public demo key.
      const signedIn = Boolean(ownAssistantId && ownApiKey);
      const assistantId = signedIn ? ownAssistantId : PUBLIC_ASSISTANT_ID;
      const apiKey = signedIn ? ownApiKey : PUBLIC_API_KEY;

      if (!assistantId || !apiKey) {
        // Nothing to show: signed out with no public demo assistant configured. Tear down any
        // mounted widget so it doesn't linger on screen with credentials that no longer apply.
        mountedIdentity.current = null;
        const w = window as any;
        if (w.ActbrowWidget && typeof w.ActbrowWidget.destroy === 'function') {
          try {
            w.ActbrowWidget.destroy();
          } catch {
            /* ignore teardown errors */
          }
        }
        w.ActbrowWidget = undefined;
        w.ActbrowWidgetConfig = undefined;
        setReady(false);
        return;
      }

      const w = window as any;
      w.ActbrowWidgetConfig = {
        assistantId: assistantId,
        apiKey: apiKey,
        baseUrl: baseUrl,
        // Anonymous visitors get a clean console; signed-in users keep the dev trace.
        debug: signedIn,
        suggestions: signedIn ? undefined : PUBLIC_SUGGESTIONS,
        navigate: (path: string) => router.push(path),
      };

      // The widget reads its config once, at script boot. When the identity changes while it is
      // already mounted — signing in, or signing out back to the public demo — the scripts are
      // already loaded and will not re-execute, so ask the bootstrap to remount explicitly.
      const identity = `${assistantId}:${apiKey}`;
      if (mountedIdentity.current !== null && mountedIdentity.current !== identity
        && typeof w.ActbrowWidgetBoot === "function") {
        w.ActbrowWidgetBoot();
      }
      mountedIdentity.current = identity;
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
      <Script
        src={`${baseUrl}/actbrow-sdk.js?v=${SDK_ASSET_VERSION}`}
        strategy="afterInteractive"
        onLoad={() => setSdkLoaded(true)}
        onReady={() => setSdkLoaded(true)}
      />
      {sdkLoaded && (
        <Script src={`${baseUrl}/actbrow-widget.js?v=${SDK_ASSET_VERSION}`} strategy="afterInteractive" />
      )}
    </>
  );
}
