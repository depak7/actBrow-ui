'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

interface DemoVideoProps {
  /** YouTube/Vimeo embed URL, e.g. https://www.youtube.com/embed/VIDEO_ID */
  embedUrl?: string;
  /** Direct MP4/WebM URL (used when embed URL is not set) */
  fileUrl?: string;
}

/** Append a query param to a URL without clobbering existing ones. */
function withParam(url: string, key: string, value: string): string {
  const sep = url.includes('?') ? '&' : '?';
  return url.includes(`${key}=`) ? url : `${url}${sep}${key}=${value}`;
}

/**
 * Product demo video that plays only when scrolled into view (or after the
 * "Watch demo" CTA scrolls the user here) and pauses automatically when it
 * leaves the viewport. It never autoplays on initial page load because the
 * section sits below the fold.
 */
export function DemoVideo({ embedUrl, fileUrl }: DemoVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // For iframe embeds: only mount the player once the section is in view, and
  // unmount it when scrolled away — this reliably stops playback/audio across
  // providers without needing per-provider postMessage APIs.
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        setInView(visible);

        const video = videoRef.current;
        if (video) {
          if (visible) {
            // play() can reject if the browser blocks it; ignore the rejection.
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: [0, 0.5, 1] },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── YouTube/Vimeo embed ──
  if (embedUrl) {
    // Autoplay (muted) is required for browsers to start playback without a
    // direct click; users can unmute via the player controls.
    const playSrc = withParam(withParam(embedUrl, 'autoplay', '1'), 'mute', '1');
    return (
      <div ref={containerRef} className="relative aspect-video w-full">
        {inView ? (
          <iframe
            title="ActBrow product demo"
            src={playSrc}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/[0.06] to-white/[0.02]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white">
              <Play className="ml-1 h-8 w-8" fill="currentColor" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Direct MP4/WebM file ──
  if (fileUrl) {
    return (
      <div ref={containerRef}>
        <video
          ref={videoRef}
          className="aspect-video w-full bg-black"
          controls
          muted
          playsInline
          preload="metadata"
        >
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support embedded video.
        </video>
      </div>
    );
  }

  // ── Placeholder (no video configured) ──
  return (
    <div className="flex aspect-video flex-col items-center justify-center gap-4 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-6 py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white">
        <Play className="ml-1 h-8 w-8" fill="currentColor" />
      </div>
      <p className="text-lg font-medium text-white">Product demo video</p>
      <p className="max-w-md text-center text-sm text-neutral-500">
        Set{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-neutral-300">
          NEXT_PUBLIC_DEMO_VIDEO_EMBED_URL
        </code>{' '}
        (embed link) or{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-neutral-300">
          NEXT_PUBLIC_PRODUCT_DEMO_VIDEO_URL
        </code>{' '}
        (MP4 URL) in <span className="text-neutral-400">.env.local</span>, then restart the dev
        server.
      </p>
    </div>
  );
}
