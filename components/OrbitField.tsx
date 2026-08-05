"use client";

import { useEffect, useRef } from "react";

interface Satellite {
  ring: number;
  angle: number;
  speed: number;
  label: string;
  stage: string;
}

/**
 * The ambient orbital field behind the hero.
 *
 * Finding HP-02/HP-03: the site has no proof of any kind. Rather than a stock
 * illustration, the hero background *is* the proof surface — each satellite is
 * a live project in production, labelled with its type, stage and time left.
 * Wire `satellites` to the real queue and the honesty becomes the feature: ten
 * projects means ten dots.
 *
 * Canvas rather than SVG because the dot-paths run into the thousands.
 */
export default function OrbitField({
  satellites = [],
  density = 1,
  className = "",
}: {
  satellites?: Satellite[];
  density?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const hover = useRef<{ i: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0, cx = 0, cy = 0, base = 0, raf = 0, mobile = false;
    const rings = [0.4, 0.58, 0.76, 0.95, 1.16];

    const resize = () => {
      const r = cvs.getBoundingClientRect();
      W = r.width; H = r.height;
      mobile = W < 760;
      cvs.width = Math.round(W * dpr);
      cvs.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // RTL: prose starts on the right, so the system sits in the left third
      // and never runs under the headline column.
      cx = mobile ? W * 0.5 : W * 0.27;
      cy = mobile ? H * 0.4 : H * 0.52;
      base = Math.min(W, H) * (mobile ? 0.5 : 0.42);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      // orbital dot-paths
      for (let ri = 0; ri < rings.length; ri++) {
        const R = base * rings[ri];
        const count = Math.round((44 + ri * 26) * density * (mobile ? 0.62 : 1));
        const spin = reduce ? 0 : t * (ri % 2 === 0 ? 0.045 : -0.032);
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2 + spin;
          // squash the far rings so the field reads as a system seen at an angle
          const x = cx + Math.cos(a) * R;
          const y = cy + Math.sin(a) * R * (mobile ? 0.9 : 0.62);
          // brighten where the path passes behind the headline block
          const lift = 1 - Math.min(1, Math.abs(y - cy) / (base * 0.5));
          const alpha = (0.06 + lift * 0.2) * (1 - ri * 0.11);
          ctx.beginPath();
          ctx.arc(x, y, 1.15, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(110,120,255,${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      // core
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 0.7);
      g.addColorStop(0, "rgba(42,56,255,0.20)");
      g.addColorStop(1, "rgba(42,56,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // satellites — real projects in production
      hover.current = null;
      satellites.forEach((s, i) => {
        const R = base * rings[s.ring % rings.length];
        const a = s.angle + (reduce ? 0 : t * s.speed);
        const x = cx + Math.cos(a) * R;
        const y = cy + Math.sin(a) * R * (mobile ? 0.9 : 0.62);

        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(42,56,255,0.18)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "#9AA2FF";
        ctx.fill();

        // Labels only where there is empty canvas: never over the prose column
        // on the right, never clipped by the left edge.
        if (!mobile && x > W * 0.1 && x < W * 0.46) {
          const flip = Math.cos(a) < 0;
          ctx.save();
          ctx.font = '500 10px "JetBrains Mono", monospace';
          ctx.textAlign = flip ? "right" : "left";
          ctx.textBaseline = "middle";
          const lx = x + (flip ? -14 : 14);
          // Labels sit over a photographic background, so they get their own
          // shadow plate rather than relying on the picture staying dark.
          ctx.shadowColor = "rgba(5,6,15,0.95)";
          ctx.shadowBlur = 7;
          ctx.strokeStyle = "rgba(200,205,255,0.6)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x + (flip ? -6 : 6), y);
          ctx.lineTo(x + (flip ? -12 : 12), y);
          ctx.stroke();
          ctx.fillStyle = "rgba(238,239,250,0.95)";
          ctx.fillText(s.label, lx, y - 6);
          ctx.fillStyle = "rgba(178,184,224,0.9)";
          ctx.fillText(s.stage, lx, y + 7);
          ctx.shadowBlur = 0;
          ctx.restore();
        }
        void i;
      });
    };

    let t0: number | null = null;
    const loop = (ts: number) => {
      if (t0 === null) t0 = ts;
      draw((ts - t0) / 1000);
      if (!reduce) raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduce) draw(0);
    else raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(cvs);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [satellites, density]);

  return <canvas ref={ref} aria-hidden className={`h-full w-full ${className}`} />;
}
