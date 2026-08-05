import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ArcPanel from "@/components/ArcPanel";
import { Reveal } from "@/components/motion-primitives";
import { Button, ProcessRail } from "@/components/ui";
import { CREATORS } from "@/lib/content";
import { fa } from "@/lib/fa";

export const metadata: Metadata = {
  title: CREATORS.title,
  description: CREATORS.subtitle.slice(0, 155),
};

export default function CreatorsPage() {
  return (
    <>
      <PageHero title={CREATORS.title} subtitle={CREATORS.subtitle}>
        <div className="flex flex-col items-start gap-5 border-r-2 border-core pr-5 sm:flex-row sm:items-center">
          <p className="max-w-[50ch] text-[15px] leading-relaxed text-ink">{CREATORS.cta}</p>
          <Button href="/creators/apply" className="shrink-0">
            {CREATORS.button}
          </Button>
        </div>
      </PageHero>

      {/* چرا کارپذیرهای حرفه‌ای کانتمو را انتخاب می‌کنند؟ */}
      <section className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24">
        <Reveal className="mb-12 border-t border-hairline pt-7">
          <h2 className="display max-w-[24ch] text-[clamp(1.6rem,3.4vw,2.4rem)]">{CREATORS.whyTitle}</h2>
          <p className="mt-5 max-w-[64ch] text-[15px] leading-loose text-ink2">{CREATORS.whyDesc}</p>
          <p className="label mt-7 text-lift">{CREATORS.benefitsTitle}</p>
        </Reveal>

        <div className="grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {CREATORS.benefits.map((b, i) => (
            <Reveal key={b.title} delay={(i % 4) * 0.06}>
              <article className="group h-full bg-void p-6 transition-colors hover:bg-panel">
                <span className="mono text-[12px] font-bold text-core">{fa(String(i + 1).padStart(2, "0"))}</span>
                <h3 className="mt-4 text-[16px] font-bold leading-snug">{b.title}</h3>
                <p className="mt-3 text-[13.5px] leading-loose text-ink2">{b.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* فرایند همکاری کارپذیران با کانتمو */}
      <section className="mx-auto max-w-[1280px] px-5 pb-20 lg:px-8 lg:pb-24">
        <Reveal className="mb-10 border-t border-hairline pt-7">
          <h2 className="display text-[clamp(1.5rem,3.2vw,2.1rem)]">{CREATORS.processTitle}</h2>
        </Reveal>
        <Reveal>
          <ProcessRail steps={CREATORS.process} cols={3} />
        </Reveal>
      </section>

      {/* مهارت‌ها */}
      <section className="mx-auto max-w-[1280px] px-5 pb-20 lg:px-8 lg:pb-24">
        <Reveal className="mb-12 border-t border-hairline pt-7">
          <h2 className="display max-w-[26ch] text-[clamp(1.6rem,3.4vw,2.4rem)]">{CREATORS.skillsIntroTitle}</h2>
          <p className="mt-5 max-w-[62ch] text-[15px] leading-loose text-ink2">{CREATORS.skillsIntroDesc}</p>
        </Reveal>

        <Reveal>
          <h3 className="label mb-6 text-lift">{CREATORS.skillsTitle}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {CREATORS.skills.map((s, i) => (
              <ArcPanel key={s.group} corner={i % 2 === 0 ? "tr" : "tl"} radius={22} className="h-full">
                <div className="p-6">
                  <h4 className="text-[15.5px] font-bold">{s.group}</h4>
                  <p className="mt-2.5 text-[14px] leading-loose text-ink2">{s.items}</p>
                </div>
              </ArcPanel>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-9">
          <Button href="/creators/skills" variant="secondary">
            {CREATORS.skillsButton}
          </Button>
        </Reveal>
      </section>

      {/* در کانتمو شما خالق محتوا هستید */}
      <section className="mx-auto max-w-[1280px] px-5 pb-24 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden border border-hairline bg-panel/40 px-6 py-14 lg:px-14 lg:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 100% at 90% 110%, color-mix(in srgb, var(--color-core) 35%, transparent), transparent 70%)",
              }}
            />
            <div className="relative">
              <h2 className="display max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.4rem)]">{CREATORS.missionTitle}</h2>
              <div className="mt-6 max-w-[66ch] space-y-4">
                {CREATORS.mission.map((p) => (
                  <p key={p} className="text-[15px] leading-loose text-ink2">
                    {p}
                  </p>
                ))}
              </div>
              <div className="mt-9">
                <Button href="/creators/apply">{CREATORS.button}</Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
