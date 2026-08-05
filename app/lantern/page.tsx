import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ArcPanel from "@/components/ArcPanel";
import { Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui";
import Newsletter from "./Newsletter";
import { LANTERN } from "@/lib/content";
import { fa } from "@/lib/fa";

export const metadata: Metadata = {
  title: `${LANTERN.title} — ${LANTERN.subtitle}`,
  description: LANTERN.desc,
};

/** فانوس is the one surface where the beacon amber is allowed to appear.
 *  Reserving a colour for a single meaning is what lets a reader know where
 *  they are before they read a word. */
export default function LanternPage() {
  return (
    <>
      <PageHero title={LANTERN.title} subtitle={LANTERN.subtitle} desc={LANTERN.desc} />

      {/* آشنایی با فانوس */}
      <section className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24">
        <Reveal className="border-t border-hairline pt-7">
          <h2 className="display text-[clamp(1.5rem,3.2vw,2.1rem)]">{LANTERN.aboutTitle}</h2>
          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-[18px] font-bold text-beacon">{LANTERN.aboutLead}</p>
              <p className="mt-3 max-w-[54ch] text-[15px] leading-loose text-ink2">{LANTERN.about}</p>
            </div>
            <div>
              <p className="max-w-[54ch] text-[15px] leading-loose text-ink2">{LANTERN.aboutIntro}</p>
              <ul className="mt-5 space-y-2.5">
                {LANTERN.aboutList.map((l) => (
                  <li key={l} className="flex items-start gap-3 text-[15px] text-ink">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-beacon" />
                    {l}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[15px] font-semibold">{LANTERN.aboutClose}</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* دسته‌بندی‌ها */}
      <section className="mx-auto max-w-[1280px] px-5 pb-20 lg:px-8 lg:pb-24">
        <Reveal className="mb-10 border-t border-hairline pt-7">
          <h2 className="display text-[clamp(1.5rem,3.2vw,2.1rem)]">{LANTERN.categoriesTitle}</h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LANTERN.categories.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 0.07}>
              <ArcPanel corner="tr" radius={22} className="group h-full transition-transform hover:-translate-y-1">
                <a href="#" className="flex h-full flex-col p-6">
                  <span className="mono text-[12px] font-bold text-beacon">{fa(String(i + 1).padStart(2, "0"))}</span>
                  <h3 className="mt-4 text-[16px] font-bold leading-snug">{c.title}</h3>
                  <p className="mt-3 flex-1 text-[13.5px] leading-loose text-ink2">{c.desc}</p>
                  <span aria-hidden className="mt-5 block h-px w-8 origin-right bg-beacon transition-transform duration-500 group-hover:scale-x-[3]" />
                </a>
              </ArcPanel>
            </Reveal>
          ))}
        </div>
      </section>

      {/* آخرین نوشته‌ها + محبوب‌ترین نوشته‌ها */}
      <section className="mx-auto max-w-[1280px] px-5 pb-20 lg:px-8 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <h2 className="display mb-8 border-t border-hairline pt-7 text-[clamp(1.4rem,3vw,1.9rem)]">
              {LANTERN.latestTitle}
            </h2>
            <ul className="divide-y divide-hairline border-y border-hairline">
              {LANTERN.latest.map((p, i) => (
                <li key={p.title}>
                  <a href="#" className="group flex items-start gap-5 py-6 transition-colors hover:bg-panel/40">
                    <span className="mono pt-1 text-[12px] text-ink3">{fa(String(i + 1).padStart(2, "0"))}</span>
                    <span>
                      <h3 className="text-[16px] font-bold leading-snug transition-colors group-hover:text-beacon">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-[13.5px] text-ink2">{p.desc}</p>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="display mb-8 border-t border-hairline pt-7 text-[clamp(1.4rem,3vw,1.9rem)]">
              {LANTERN.popularTitle}
            </h2>
            <ol className="space-y-4">
              {LANTERN.popular.map((p, i) => (
                <li key={p}>
                  <a href="#" className="group flex gap-4 text-[14.5px] leading-relaxed">
                    <span className="mono text-[13px] font-bold text-beacon">{fa(i + 1)}</span>
                    <span className="text-ink2 transition-colors group-hover:text-ink">{p}</span>
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* فانوس چگونه به کارپذیر کمک می‌کند؟ */}
      <section className="mx-auto max-w-[1280px] px-5 pb-20 lg:px-8 lg:pb-24">
        <Reveal className="border-t border-hairline pt-7">
          <h2 className="display text-[clamp(1.5rem,3.2vw,2.1rem)]">{LANTERN.helpTitle}</h2>
          <div className="mt-7 grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              {LANTERN.helpDesc.map((p) => (
                <p key={p} className="max-w-[56ch] text-[15px] leading-loose text-ink2">
                  {p}
                </p>
              ))}
            </div>
            <div>
              <p className="text-[15px] font-semibold">{LANTERN.helpLead}</p>
              <ul className="mt-4 space-y-2.5">
                {LANTERN.helpList.map((l) => (
                  <li key={l} className="flex items-start gap-3 text-[14.5px] text-ink2">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-beacon" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* خبرنامه فانوس */}
      <section className="mx-auto max-w-[1280px] px-5 pb-24 lg:px-8">
        <Reveal>
          <ArcPanel corner="tl" radius={30}>
            <div className="grid gap-8 p-7 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:p-12">
              <div>
                <h2 className="display text-[clamp(1.4rem,3vw,2rem)]">{LANTERN.newsletterTitle}</h2>
                <p className="mt-4 max-w-[54ch] text-[14.5px] leading-loose text-ink2">{LANTERN.newsletterDesc}</p>
              </div>
              <Newsletter />
            </div>
          </ArcPanel>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 border-t border-hairline pt-10">
          <h2 className="display max-w-[26ch] text-[clamp(1.4rem,3vw,2rem)]">{LANTERN.closingTitle}</h2>
          <p className="mt-4 max-w-[64ch] text-[15px] leading-loose text-ink2">{LANTERN.closing}</p>
          <div className="mt-8">
            <Button href="/creators/apply" variant="secondary">
              ثبت‌نام کارپذیر
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
