import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ActBrow — Chat that finishes the work inside your product';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(145deg, #0a0a0b 0%, #111827 45%, #0f172a 100%)',
          padding: '64px 72px',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            color: '#ffffff',
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #34d399 0%, #14b8a6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#052e16',
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            A
          </div>
          ActBrow
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              color: '#ffffff',
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              maxWidth: 980,
            }}
          >
            Chat that finishes the work inside your product.
          </div>
          <div
            style={{
              color: '#a3a3a3',
              fontSize: 28,
              lineHeight: 1.4,
              maxWidth: 860,
            }}
          >
            When users stall or leave, finish the task in-product — navigate, call APIs, done.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#737373',
            fontSize: 22,
          }}
        >
          <div style={{ display: 'flex', gap: 24 }}>
            <span>Two script tags</span>
            <span>·</span>
            <span>No backend rewrite</span>
            <span>·</span>
            <span>Self-hostable</span>
          </div>
          <span style={{ color: '#a3a3a3' }}>actbrow.depak.dev</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
