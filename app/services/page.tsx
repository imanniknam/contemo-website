import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ArcPanel from "@/components/ArcPanel";
import { Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui";
import { SERVICES } from "@/lib/content";
import { fa } from "@/lib/fa";

export const metadata: Metadata = {
  title: SERVICES.title,
  description: SERVICES.desc.slice(0, 155),
};

export default function ServicesPage() {
  return (
    <>
      <PageHero title={SERVICES.title} subtitle={SERVICES.subtitle} desc={SERVICES.desc} />

      <section className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24">
        <Reveal>
          <h2 className="display mb-12 border-t border-hairline pt-7 text-[clamp(1.6rem,3.4vw,2.4rem)]">
            {SERVICES.sectionTitle}
          </h2>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          {SERVICES.items.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 0.08}>
              {/* Every service is a route into the form. `?c=` preselects
                  نوع پروژه on arrival, so clicking a service and then having to
                  choose it again never happens. The whole card is the target —
                  a link-sized hit area inside a card is a mobile trap. */}
              <Link
                href={`/start?c=${s.cat}`}
                className="group block h-full focus-visible:outline-none"
                aria-label={`${s.title} — ثبت پروژه`}
              >
                <ArcPanel
                  corner={i % 2 === 0 ? "tr" : "tl"}
                  radius={26}
                  className="h-full transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1"
                  border="var(--color-hairline)"
                >
                  <article className="flex h-full gap-5 p-6 lg:p-7">
                    <span className="mono shrink-0 text-[13px] font-bold text-core">
                      {fa(String(i + 1).padStart(2, "0"))}
                    </span>
                    <div className="flex h-full flex-col">
                      <h3 className="text-[17px] font-bold leading-snug transition-colors group-hover:text-lift">
                        {s.title}
                      </h3>
                      <p className="mt-3 flex-1 text-[14px] leading-loose text-ink2">{s.desc}</p>
                      <span className="mt-5 flex items-center gap-2 text-[13.5px] font-bold text-lift">
                        ثبت پروژه
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                          className="transition-transform duration-300 group-hover:-translate-x-1"
                        >
                          <path
                            d="M19 12H5M11 6l-6 6 6 6"
                            stroke="currentColor"
                            strokeWidth="1.9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </article>
                </ArcPanel>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-col items-start gap-6 border-t border-hairline pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[16px] font-semibold">{SERVICES.cta}</p>
            <Button href="/start">{SERVICES.button}</Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
