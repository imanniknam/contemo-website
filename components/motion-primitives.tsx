"use client";

import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { fa, group } from "@/lib/fa";

/* ─────────────────────────────────────────────
   Reveal — scroll-triggered entrance.
   Rises and un-blurs once, never replays. Honors reduced motion by
   rendering the final state immediately rather than skipping content.
   ───────────────────────────────────────────── */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Typewriter — the typing animation.

   Persian letters join, so a naive per-character reveal that measures width
   causes the whole line to reflow on every frame. Appending to a plain string
   lets the browser reshape the run natively, which is both correct and cheap.
   The caret is CSS-only.
   ───────────────────────────────────────────── */
export function Typewriter({
  text,
  speed = 55,
  startDelay = 0,
  className = "",
  onDone,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  onDone?: () => void;
}) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? text.length : 0);
  const done = n >= text.length;

  useEffect(() => {
    if (reduce) {
      onDone?.();
      return;
    }
    let i = 0;
    let tick: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      tick = setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) {
          clearInterval(tick);
          onDone?.();
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, startDelay, reduce]);

  return (
    <span className={`${className} ${done ? "" : "caret"}`} aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
    </span>
  );
}

/* ─────────────────────────────────────────────
   Counter — animated numerals.
   Used for the telemetry strip (finding HP-03) and for every price change in
   the brief form, so a changing figure reads as *computed* rather than swapped.
   ───────────────────────────────────────────── */
export function Counter({
  to,
  duration = 1.1,
  persian = false,
  grouped = false,
  decimals = 0,
  className = "",
}: {
  to: number;
  duration?: number;
  persian?: boolean;
  grouped?: boolean;
  decimals?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const from = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = (v: number) => {
      const rounded = decimals ? v.toFixed(decimals) : String(Math.round(v));
      const withSep = grouped ? group(Math.round(v)) : rounded;
      // Persian numerals take the Persian thousands separator (٬), not the
      // Latin comma — mixing the two inside one figure looks like a bug.
      el.textContent = persian ? fa(withSep).replace(/,/g, "٬") : withSep;
    };
    if (reduce || !inView) {
      if (!inView) render(0);
      else render(to);
      return;
    }
    const controls = animate(from.current, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: render,
    });
    from.current = to;
    return () => controls.stop();
  }, [to, inView, reduce, duration, persian, grouped, decimals]);

  return <span ref={ref} className={className} />;
}

/* ─────────────────────────────────────────────
   MagneticButton — cursor-following lift on pointer devices only.
   ───────────────────────────────────────────── */
export function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [d, setD] = useState({ x: 0, y: 0 });

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      ref={ref}
      animate={{ x: d.x, y: d.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.5 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setD({
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
        });
      }}
      onPointerLeave={() => setD({ x: 0, y: 0 })}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
