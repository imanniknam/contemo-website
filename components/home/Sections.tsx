"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import ArcPanel from "../ArcPanel";
import { Reveal } from "../motion-primitives";
import { HOME } from "@/lib/content";
import { fa } from "@/lib/fa";

/* ═════════ shared shell ═════════ */
export function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-28">
      {children}
    </section>
  );
}

export function SectionHead({
  title,
  desc,
  subtitle,
  align = "start",
}: {
  title: string;
  desc?: string;
  subtitle?: string;
  align?: "start" | "center";
}) {
  return (
    <Reveal
      className={`mb-14 border-t border-hairline pt-7 ${align === "center" ? "text-center" : ""}`}
    >
      <h2 className={`display text-[clamp(1.65rem,3.6vw,2.6rem)] ${align === "center" ? "mx-auto" : ""} max-w-[24ch]`}>
        {title}
      </h2>
      {desc && (
        <p className={`mt-5 max-w-[62ch] text-[15.5px] leading-loose text-ink2 ${align === "center" ? "mx-auto" : ""}`}>
          {desc}
        </p>
      )}
      {subtitle && <p className="label mt-6 text-lift">{subtitle}</p>}
    </Reveal>
  );
}

/* ═════════ بخش کانتمو چطور کار می‌کند ═════════
   Four steps, rendered as an orbital track — the doc asked for this section to
   be graphical, showing four simple stages from order to final delivery. */
export function How() {
  const reduce = useReducedMotion();
  return (
    <Section id="how">
      <SectionHead title={HOME.how.title} desc={HOME.how.desc} />
      <div className="relative">
        <div aria-hidden className="absolute inset-x-0 top-[30px] hidden h-px bg-hairline lg:block" />
        <ol className="grid gap-8 lg:grid-cols-4 lg:gap-5">
          {HOME.how.steps.map((s, i) => (
            <Reveal key={s} delay={i * 0.1}>
              <li className="relative flex items-start gap-5 lg:block">
                <motion.span
                  className="relative z-10 grid h-[60px] w-[60px] shrink-0 place-items-center rounded-full border border-core/45 bg-void"
                  initial={reduce ? false : { scale: 0.72, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 250, damping: 20 }}
                >
                  <span aria-hidden className="absolute inset-0 rounded-full border border-core/25" style={{ transform: "scale(1.4)" }} />
                  <span className="mono text-[16px] font-bold text-lift">{fa(i + 1)}</span>
                </motion.span>
                <h3 className="pt-3.5 text-[17px] font-bold lg:mt-7 lg:pt-0">{s}</h3>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ═════════ بخش خدمات محتوایی ═════════
   Four cards with icon and short description, per the spec's structure note. */
const SERVICE_GLYPHS = [
  // ویدئویی
  <path key="v" d="M4 7h11v10H4zM15 10l5-3v10l-5-3z" strokeWidth="1.4" strokeLinejoin="round" />,
  // متنی
  <path key="t" d="M5 6h14M5 11h14M5 16h8" strokeWidth="1.4" strokeLinecap="round" />,
  // صوتی
  <path key="a" d="M4 12v2M8 8v10M12 5v14M16 9v6M20 11v2" strokeWidth="1.4" strokeLinecap="round" />,
  // تصویری
  <path key="i" d="M4 5h16v14H4zM4 15l4.5-4.5L14 16M15 9.5h.01" strokeWidth="1.4" strokeLinejoin="round" />,
];

export function Services() {
  return (
    <Section id="services">
      <SectionHead title={HOME.services.title} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {HOME.services.items.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <ArcPanel corner="tr" radius={24} className="group h-full transition-transform duration-300 hover:-translate-y-1">
              <div className="flex h-full flex-col p-6">
                <span className="grid h-12 w-12 place-items-center border border-hairline text-lift transition-colors group-hover:border-core group-hover:text-core">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                    {SERVICE_GLYPHS[i]}
                  </svg>
                </span>
                <h3 className="mt-6 text-[17px] font-bold leading-snug">{s.title}</h3>
                <p className="mt-3 flex-1 text-[14px] leading-loose text-ink2">{s.desc}</p>
              </div>
            </ArcPanel>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.15} className="mt-10">
        <Link
          href={HOME.services.href}
          className="arc arc-tr inline-block border border-hairline px-8 py-3.5 text-[14.5px] font-bold transition-colors hover:border-core hover:bg-core hover:text-white"
          style={{ ["--arc-r" as string]: "16px" }}
        >
          {HOME.services.button}
        </Link>
      </Reveal>
    </Section>
  );
}

/* ═════════ بخش چرا کانتمو؟ ═════════
   All eight benefit cards from the document, kept in order. */
export function Why() {
  return (
    <Section id="why">
      <SectionHead title={HOME.why.title} desc={HOME.why.desc} subtitle={HOME.why.subtitle} />
      <div className="grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
        {HOME.why.items.map((c, i) => (
          <Reveal key={c.title} delay={(i % 4) * 0.06}>
            <article className="group h-full bg-void p-6 transition-colors duration-300 hover:bg-panel">
              <span className="mono text-[12px] font-bold text-core">{fa(String(i + 1).padStart(2, "0"))}</span>
              <h3 className="mt-4 text-[16px] font-bold leading-snug">{c.title}</h3>
              <p className="mt-3 text-[13.5px] leading-loose text-ink2">{c.desc}</p>
              <span
                aria-hidden
                className="mt-5 block h-px w-8 origin-right bg-core transition-transform duration-500 group-hover:scale-x-[3]"
              />
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ═════════ بخش داستان موفقیت مشتریان ═════════
   Slider of client quotes with a short text and a rating, as specified.
   The entries below are placeholders and are labelled as such — a testimonial
   without a real name, brand and outcome reads as invented, so these are wired
   to be replaced rather than shipped as-is. */
const QUOTES = [
  { text: "از ثبت سفارش تا تحویل، همه‌چیز در پنل قابل پیگیری بود و دقیقاً سر موعد تحویل گرفتیم.", name: "نام کارفرما", role: "سمت / نام برند", score: 5 },
  { text: "کیفیت خروجی از چیزی که انتظار داشتیم بالاتر بود و بازبینی‌ها سریع انجام شد.", name: "نام کارفرما", role: "سمت / نام برند", score: 5 },
  { text: "قیمت از ابتدا مشخص بود و هیچ هزینه‌ی اضافه‌ای در میانه‌ی کار اضافه نشد.", name: "نام کارفرما", role: "سمت / نام برند", score: 4 },
];

export function Success() {
  const [i, setI] = useState(0);
  const q = QUOTES[i];

  return (
    <Section id="success">
      <SectionHead title={HOME.success.title} />

      <ArcPanel corner="tl" radius={34}>
        <div className="p-7 lg:p-12">
          <div className="flex gap-1" aria-label={`امتیاز ${fa(q.score)} از ۵`}>
            {Array.from({ length: 5 }).map((_, s) => (
              <svg key={s} width="17" height="17" viewBox="0 0 24 24" aria-hidden
                   fill={s < q.score ? "var(--color-beacon)" : "var(--color-hairline)"}>
                <path d="M12 2l2.9 6.3 6.6.8-4.9 4.6 1.3 6.6L12 17l-5.9 3.3 1.3-6.6L2.5 9.1l6.6-.8z" />
              </svg>
            ))}
          </div>

          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6"
          >
            <p className="max-w-[46ch] text-[clamp(1.05rem,2.4vw,1.5rem)] font-semibold leading-relaxed">
              «{q.text}»
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full border border-hairline bg-panel2 text-[13px] font-bold text-ink3">
                ؟
              </span>
              <span>
                <cite className="block text-[14.5px] font-bold not-italic">{q.name}</cite>
                <span className="label">{q.role}</span>
              </span>
            </footer>
          </motion.blockquote>

          <div className="mt-9 flex items-center gap-2" role="tablist" aria-label="نظرات کارفرماها">
            {QUOTES.map((_, k) => (
              <button
                key={k}
                role="tab"
                aria-selected={k === i}
                aria-label={`نظر ${fa(k + 1)}`}
                onClick={() => setI(k)}
                className="group grid h-11 w-11 place-items-center"
              >
                <span className={`h-1 transition-all duration-300 ${k === i ? "w-9 bg-core" : "w-4 bg-hairline group-hover:bg-ink3"}`} />
              </button>
            ))}
          </div>
        </div>
      </ArcPanel>

      <Reveal delay={0.1} className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <p className="text-[15.5px] text-ink2">{HOME.success.cta}</p>
        <Link
          href={HOME.success.href}
          className="arc arc-tr shrink-0 bg-core px-8 py-3.5 text-[14.5px] font-bold text-white transition-colors hover:bg-lift"
          style={{ ["--arc-r" as string]: "16px" }}
        >
          {HOME.success.button}
        </Link>
      </Reveal>
    </Section>
  );
}

/* ═════════ بخش نیروهای کانتمو ═════════
   Creator profiles displayed on the site, per the spec. */
const PROFILES = [
  { skill: "تدوین ویدیو", n: "کارپذیر کانتمو", hue: 232 },
  { skill: "کپی‌رایتینگ", n: "کارپذیر کانتمو", hue: 244 },
  { skill: "طراحی گرافیک", n: "کارپذیر کانتمو", hue: 220 },
  { skill: "گویندگی", n: "کارپذیر کانتمو", hue: 250 },
];

export function Creators() {
  return (
    <Section id="creators">
      <SectionHead title={HOME.creators.title} desc={HOME.creators.subtitle} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROFILES.map((p, i) => (
          <Reveal key={p.skill} delay={i * 0.07}>
            <ArcPanel corner="br" radius={22} className="group h-full">
              <div className="p-5">
                <div
                  className="relative h-32 w-full overflow-hidden"
                  style={{ background: `radial-gradient(110% 90% at 65% 20%, hsl(${p.hue} 88% 22%), var(--color-panel) 70%)` }}
                >
                  <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 160 100" fill="none" aria-hidden>
                    {[14, 24, 34].map((r, k) => (
                      <circle key={r} cx={112} cy={34} r={r} stroke={`hsl(${p.hue} 100% 80% / ${0.45 - k * 0.12})`} strokeWidth="0.7" strokeDasharray="1.5 3" />
                    ))}
                    <circle cx={112} cy={34} r={4} fill={`hsl(${p.hue} 100% 82%)`} />
                  </svg>
                </div>
                <h3 className="mt-4 text-[15.5px] font-bold">{p.skill}</h3>
                <p className="label mt-1">{p.n}</p>
              </div>
            </ArcPanel>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <p className="text-[15.5px] text-ink2">{HOME.creators.cta}</p>
        <Link
          href={HOME.creators.href}
          className="arc arc-tr shrink-0 border border-hairline px-8 py-3.5 text-[14.5px] font-bold transition-colors hover:border-core hover:bg-core hover:text-white"
          style={{ ["--arc-r" as string]: "16px" }}
        >
          {HOME.creators.button}
        </Link>
      </Reveal>
    </Section>
  );
}
