import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ArcPanel from "@/components/ArcPanel";
import Logo from "@/components/Logo";
import { Reveal } from "@/components/motion-primitives";
import { Button, ProcessRail } from "@/components/ui";
import { CONTROL_ROOM as CR } from "@/lib/content";
import { fa } from "@/lib/fa";

export const metadata: Metadata = {
  title: CR.title,
  description: CR.desc,
};

const Section = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <section id={id} className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8 lg:py-20">
    {children}
  </section>
);

const Head = ({ title, desc }: { title: string; desc?: string }) => (
  <Reveal className="mb-10 border-t border-hairline pt-7">
    <h2 className="display max-w-[24ch] text-[clamp(1.5rem,3.2vw,2.1rem)]">{title}</h2>
    {desc && <p className="mt-4 max-w-[60ch] text-[15px] leading-loose text-ink2">{desc}</p>}
  </Reveal>
);

export default function ControlRoomPage() {
  return (
    <>
      <PageHero title={CR.title} subtitle={CR.subtitle} desc={CR.desc} />

      {/* مأموریت ما */}
      <Section>
        <Head title={CR.missionTitle} />
        <Reveal>
          <ArcPanel corner="tl" radius={34}>
            <div className="grid gap-8 p-7 lg:grid-cols-[auto_1fr] lg:gap-12 lg:p-12">
              <div className="shrink-0">
                <Logo size={78} color="var(--color-core)" />
              </div>
              <div>
                <p className="display text-[clamp(1.25rem,2.6vw,1.75rem)] leading-relaxed">
                  {CR.mission[0]}
                </p>
                <p className="mt-6 max-w-[58ch] text-[15px] leading-loose text-ink2">{CR.mission[1]}</p>
              </div>
            </div>
          </ArcPanel>
        </Reveal>
      </Section>

      {/* تیم‌های اتاق فرمان */}
      <Section>
        <Head title={CR.teamsTitle} desc={CR.teamsDesc} />
        <div className="grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2">
          {CR.teams.map((t, i) => (
            <Reveal key={t.name} delay={(i % 2) * 0.07}>
              <article className="group h-full bg-void p-7 transition-colors duration-300 hover:bg-panel lg:p-8">
                <span className="mono text-[12px] font-bold text-core">
                  {fa(String(i + 1).padStart(2, "0"))}
                </span>
                <h3 className="mt-4 text-[18px] font-bold">{t.name}</h3>
                <p className="mt-3 max-w-[46ch] text-[14px] leading-loose text-ink2">{t.role}</p>
                <span
                  aria-hidden
                  className="mt-6 block h-px w-10 origin-right bg-core transition-transform duration-500 group-hover:scale-x-[3.5]"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* یک پروژه چطور رصد می‌شود */}
      <Section>
        <Head title={CR.monitorTitle} desc={CR.monitorDesc} />
        <Reveal>
          <ProcessRail steps={CR.monitor.map((m) => ({ title: m.t, desc: m.d }))} cols={4} />
        </Reveal>
      </Section>

      {/* اعضای اتاق فرمان */}
      <Section>
        <Head title={CR.membersTitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CR.teams.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <ArcPanel corner="br" radius={22} className="h-full">
                <div className="p-5">
                  <div
                    className="relative grid h-32 w-full place-items-center overflow-hidden"
                    style={{
                      background: `radial-gradient(110% 90% at 60% 25%, hsl(${228 + i * 7} 80% 20%), var(--color-panel) 72%)`,
                    }}
                  >
                    <Logo size={40} color={`hsl(${228 + i * 7} 100% 78%)`} />
                  </div>
                  <p className="label mt-4 text-lift">{t.name}</p>
                  <p className="mt-1 text-[13.5px] text-ink3">{CR.membersNote}</p>
                </div>
              </ArcPanel>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ارزش‌ها */}
      <Section>
        <Head title={CR.valuesTitle} />
        <div className="grid gap-5 md:grid-cols-3">
          {CR.values.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.08}>
              <ArcPanel corner="tr" radius={26} className="h-full">
                <div className="p-6 lg:p-7">
                  <h3 className="text-[18px] font-extrabold">{v.t}</h3>
                  <p className="mt-3 text-[14px] leading-loose text-ink2">{v.d}</p>
                </div>
              </ArcPanel>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* راه‌های ارتباطی — the footer points here for social links */}
      <Section id="contact">
        <Head title={CR.contactTitle} desc={CR.contactDesc} />
        <Reveal>
          <div className="flex flex-col gap-8 border-t border-hairline pt-8 lg:flex-row lg:items-center lg:justify-between">
            <ul className="flex flex-wrap gap-2.5">
              {CR.socials.map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="label block border border-hairline px-4 py-2.5 transition-colors hover:border-core hover:text-ink"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
            <div className="label flex flex-wrap gap-x-6 gap-y-1">
              <span className="ltr">support@contemo.ir</span>
              <Link href="/matin" className="text-lift transition-colors hover:text-ink">
                ثبت تیکت در متین ←
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* CTA */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden border border-hairline bg-panel/40 px-6 py-14 text-center lg:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 90% at 50% 120%, color-mix(in srgb, var(--color-core) 38%, transparent), transparent 70%)",
              }}
            />
            <div className="relative">
              <h2 className="display text-[clamp(1.6rem,3.8vw,2.6rem)]">{CR.ctaTitle}</h2>
              <div className="mt-9 flex flex-wrap justify-center gap-8">
                {CR.ctaButtons.map((b) => (
                  <div key={b.href}>
                    <p className="mb-3 text-[14px] font-semibold text-ink2">{b.q}</p>
                    <Button href={b.href}>{b.label}</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
