/**
 * The Contemo mark, rebuilt as vector.
 *
 * Concentric arcs opening to the right around a solid core — a "C" that is
 * also an orbital system. Every structural device in this site (arc-cut
 * corners, the progress rail, the section dividers) is derived from this
 * geometry, so the mark had to exist as real paths rather than a raster.
 */
export default function Logo({
  size = 34,
  className = "",
  color = "currentColor",
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  const arc = (r: number) => {
    const a0 = (52 * Math.PI) / 180;
    const a1 = (308 * Math.PI) / 180;
    const x0 = 50 + r * Math.cos(a0);
    const y0 = 50 + r * Math.sin(a0);
    const x1 = 50 + r * Math.cos(a1);
    const y1 = 50 + r * Math.sin(a1);
    return `M ${x0} ${y0} A ${r} ${r} 0 1 1 ${x1} ${y1}`;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      role="img"
      aria-label="کانتمو"
    >
      <g stroke={color} strokeLinecap="round" fill="none">
        <path d={arc(44)} strokeWidth={8} opacity={0.55} />
        <path d={arc(32)} strokeWidth={8} opacity={0.8} />
        <path d={arc(20)} strokeWidth={8} />
      </g>
      <circle cx="50" cy="50" r="8.5" fill={color} />
      <circle cx="27" cy="15" r="5" fill={color} opacity={0.9} />
      <circle cx="27" cy="85" r="5" fill={color} opacity={0.9} />
    </svg>
  );
}
