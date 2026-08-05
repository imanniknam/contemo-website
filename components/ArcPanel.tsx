import type { ReactNode, CSSProperties } from "react";

type Corner = "tl" | "tr" | "bl" | "br";

const POS: Record<Corner, { x: string; y: string }> = {
  tl: { x: "0%", y: "0%" },
  tr: { x: "100%", y: "0%" },
  bl: { x: "0%", y: "100%" },
  br: { x: "100%", y: "100%" },
};

function maskFor(corner: Corner, r: number): CSSProperties {
  const { x, y } = POS[corner];
  const m = `radial-gradient(circle ${r}px at ${x} ${y}, transparent ${r}px, #000 ${r + 0.5}px)`;
  return { WebkitMaskImage: m, maskImage: m };
}

/**
 * The house container.
 *
 * One corner is carved away by a circular arc — the concave bite echoes the
 * concentric rings in the Contemo mark. This is deliberately *not* the 45°
 * chamfer the reference shot used; a straight chamfer belongs to that brand,
 * an arc belongs to this one.
 *
 * Built from two stacked masked layers so the 1px accent hairline follows the
 * curve. No SVG, no JS, no fixed dimensions — it reflows with the content.
 */
export default function ArcPanel({
  children,
  corner = "tr",
  radius = 26,
  className = "",
  bg = "var(--color-panel)",
  border = "var(--color-hairline)",
  glow = false,
}: {
  children: ReactNode;
  corner?: Corner;
  radius?: number;
  className?: string;
  bg?: string;
  border?: string;
  glow?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* hairline layer */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ ...maskFor(corner, radius), background: border }}
      />
      {/* fill layer, inset by 1px to reveal the hairline as a rim */}
      <div
        aria-hidden
        className="absolute inset-px"
        style={{ ...maskFor(corner, radius - 1), background: bg }}
      />
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bloom-soft"
          style={maskFor(corner, radius)}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
