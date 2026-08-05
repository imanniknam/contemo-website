import type { Metadata } from "next";
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
              <ArcPanel corner={i % 2 === 0 ? "tr" : "tl"} radius={26} className="h-full">
                <article className="flex h-full gap-5 p-6 lg:p-7">
                  <span className="mono shrink-0 text-[13px] font-bold text-core">
                    {fa(String(i + 1).padStart(2, "0"))}
                  </span>
                  <div>
                    <h3 className="text-[17px] font-bold leading-snug">{s.title}</h3>
                    <p className="mt-3 text-[14px] leading-loose text-ink2">{s.desc}</p>
                  </div>
                </article>
              </ArcPanel>
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
