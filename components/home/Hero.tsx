"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import OrbitField from "../OrbitField";
import { Typewriter, Magnetic } from "../motion-primitives";
import { HOME } from "@/lib/content";

/**
 * Hero — the slogan, lead and CTA exactly as written in the home-page document.
 *
 * The typing animation isn't decoration here: the slogan is
 * «با کانتمو داستان کسب‌وکار خودت رو بنویس!» — the line is *about* writing, so
 * watching it be written is the one place a typewriter effect earns its keep.
 * Persian letters join as the string grows, so appending to a plain string lets
 * the browser reshape the run natively.
 *
 * The full slogan is exposed to assistive tech immediately via aria-label; only
 * the visual layer animates. Reduced-motion users get the finished line.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(false);

  const after = {
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: typed || reduce ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-16 lg:pt-[76px]">
      {/*
        Hero photograph: an 80-minute exposure on Polaris by Adrian Mag
        (Unsplash License — free for commercial use, no attribution required).
        Chosen because star trails around a pole star *are* the Contemo mark:
        concentric arcs around a bright core. It is the one stock image that
        isn't decoration — it's the logo, photographed.

        The frame is desaturated and then recoloured through a `color` blend
        with #2A38FF, so the trails land exactly on the brand hue rather than
        the original mauve. Held to the left on desktop, behind the prose
        column, and scrimmed so type contrast never depends on the picture.
      */}
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-full lg:w-[74%]">
          <picture>
            <source srcSet="/img/star-trails.webp" type="image/webp" />
            <img
              src="/img/star-trails.jpg"
              alt=""
              className="h-full w-full object-cover opacity-[0.34] lg:opacity-[0.46]"
              style={{ filter: "grayscale(1) contrast(1.35) brightness(0.7)" }}
            />
          </picture>
          <div className="absolute inset-0 bg-core mix-blend-color" />
          {/* feather the photo's right edge into the ground */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to left, var(--color-void) 4%, color-mix(in srgb, var(--color-void) 55%, transparent) 42%, transparent 82%)",
            }}
          />
        </div>
        {/* vignette + floor, so the headline sits on a controlled value */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(78% 70% at 24% 50%, transparent 0%, color-mix(in srgb, var(--color-void) 55%, transparent) 45%, var(--color-void) 92%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-56"
          style={{ background: "linear-gradient(to top, var(--color-void), transparent)" }}
        />
      </div>

      <div className="absolute inset-0 -z-10">
        <OrbitField
          density={0.55}
          /* Fixed angular slots, spaced so the labels can never collide with
             each other. The rings keep spinning behind them, so the field
             still reads as live without the labels drifting into the prose. */
          satellites={[
            { ring: 0, angle: -0.85, speed: 0, label: "تیزر تبلیغاتی", stage: "در حال تدوین" },
            { ring: 1, angle: 2.45, speed: 0, label: "رپورتاژ آگهی", stage: "بازبینی نهایی" },
            { ring: 2, angle: 0.78, speed: 0, label: "پادکست برند", stage: "در حال ضبط" },
          ]}
        />
      </div>

      <div className="mx-auto flex min-h-[calc(100svh-76px)] max-w-[1280px] flex-col justify-center px-5 py-16 lg:px-8 lg:pb-24">
       <div className="lg:max-w-[54%]">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="label mb-6 flex items-center gap-3 text-lift"
        >
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="pulse-ring absolute inset-0 rounded-full bg-core" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-core" />
          </span>
          دستیار یکپارچه محتوایی شما
        </motion.p>

        <h1 className="display text-[clamp(2rem,4.6vw,3.5rem)]">
          <Typewriter text={HOME.hero.slogan} speed={52} startDelay={380} onDone={() => setTyped(true)} />
        </h1>

        <motion.p {...after} className="mt-7 max-w-[52ch] text-[15.5px] leading-loose text-ink2 lg:text-[16.5px]">
          {HOME.hero.lead}
        </motion.p>

        <motion.div {...after} transition={{ ...after.transition, delay: 0.1 }} className="mt-10">
          <p className="mb-4 text-[15px] font-semibold text-ink">{HOME.hero.ctaLabel}</p>
          <Magnetic>
            <div className="flex items-stretch">
              <Link
                href={HOME.hero.ctaHref}
                className="arc arc-tr bg-paper px-9 py-4 text-[15px] font-extrabold text-void transition-colors hover:bg-white"
                style={{ ["--arc-r" as string]: "20px" }}
              >
                {HOME.hero.ctaButton}
              </Link>
              <span
                aria-hidden
                className="arc arc-bl mr-1.5 grid w-14 place-items-center border border-hairline text-lift"
                style={{ ["--arc-r" as string]: "18px" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 12H5M11 6l-6 6 6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </Magnetic>
        </motion.div>

        <motion.div
          {...after}
          transition={{ ...after.transition, delay: 0.22 }}
          className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-hairline pt-6"
        >
          {HOME.how.steps.map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              <span className="mono text-[11px] font-bold text-core">{["۰۱", "۰۲", "۰۳", "۰۴"][i]}</span>
              <span className="text-[13.5px] text-ink2">{s}</span>
              {i < 3 && <span aria-hidden className="mr-4 hidden h-px w-5 bg-hairline sm:block" />}
            </span>
          ))}
        </motion.div>
       </div>
      </div>
    </section>
  );
}
