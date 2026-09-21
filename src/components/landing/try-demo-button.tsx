"use client";

import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";

/** Poll interval and budget for a widget that is still loading when the visitor clicks. */
const RETRY_INTERVAL_MS = 150;
const RETRY_BUDGET_MS = 3000;

type ActbrowWidgetApi = {
  open?: () => void;
};

function getWidget(): ActbrowWidgetApi | null {
  const widget = (window as unknown as { ActbrowWidget?: ActbrowWidgetApi }).ActbrowWidget;
  return widget && typeof widget.open === "function" ? widget : null;
}

/**
 * The demo used to be a separate app at /demo. It is now the widget on this page — the same
 * two-script embed a customer would add to their own product — so the CTA opens it in place
 * rather than navigating anywhere.
 */
export function TryDemoButton() {
  const router = useRouter();

  const handleClick = useCallback(() => {
    const widget = getWidget();
    if (widget) {
      widget.open!();
      return;
    }

    // Clicked before the SDK finished loading. Wait briefly rather than doing nothing, and if the
    // widget never arrives (misconfigured backend URL, blocked script) send them to the docs so the
    // button is never a dead end.
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const ready = getWidget();
      if (ready) {
        window.clearInterval(timer);
        ready.open!();
        return;
      }
      if (Date.now() - startedAt >= RETRY_BUDGET_MS) {
        window.clearInterval(timer);
        router.push("/docs");
      }
    }, RETRY_INTERVAL_MS);
  }, [router]);

  return (
    <Button
      size="lg"
      variant="outline"
      onClick={handleClick}
      className="border border-white/15 bg-transparent text-white hover:bg-white/10"
    >
      <span className="flex items-center gap-2">
        <Play className="h-4 w-4" />
        Try live demo
      </span>
    </Button>
  );
}
