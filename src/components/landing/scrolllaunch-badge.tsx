const BADGE_HREF =
  "https://www.scrolllaunch.com/products/actbrow?ref=badge";
const BADGE_SRC =
  "https://www.scrolllaunch.com/api/badge/actbrow?variant=top5&theme=dark";
const BADGE_ALT =
  "ActBrow — Top 5 Product of the Week on ScrollLaunch";

export function ScrollLaunchBadge({ className }: { className?: string }) {
  return (
    <a
      href={BADGE_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BADGE_SRC}
        alt={BADGE_ALT}
        width={220}
        height={48}
        className="h-12 w-[220px]"
      />
    </a>
  );
}
