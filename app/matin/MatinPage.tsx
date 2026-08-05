"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/motion-primitives";
import { Topics, TicketForm, Faq, DirectContact } from "./MatinClient";
import { MATIN } from "@/lib/content";

const PATH_ICONS = [
  <path key="a" d="M5 4h14v16l-3-2-2 2-2-2-2 2-2-2-3 2z" strokeWidth="1.5" strokeLinejoin="round" />,
  <path key="b" d="M4 6h16M4 12h10M4 18h7M17 15l3 3-3 3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  <path key="c" d="M4 6.5A2.5 2.5 0 016.5 4h2L10 8l-2 1.5a11 11 0 004.5 4.5L14 12l4 1.5v2A2.5 2.5 0 0115.5 18 12.5 12.5 0 014 6.5z" strokeWidth="1.5" strokeLinejoin="round" />,
  <path key="d" d="M12 17v.01M12 14a2.5 2.5 0 10-2.5-2.5M12 21a9 9 0 110-18 9 9 0 010 18z" strokeWidth="1.5" strokeLinecap="round" />,
];

export default function MatinPage() {
  const [subject, setSubject] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const pick = (t: string) => {
    setSubject(t);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <PageHero title={MATIN.title} subtitle={MATIN.subtitle} desc={MATIN.desc}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:max-w-3xl">
          {MATIN.paths.map((p, i) => (
            <li key={p}>
              <a
                href="#ticket"
                className="flex min-h-[56px] items-center gap-3 border border-hairline bg-panel/50 px-4 py-3 backdrop-blur transition-colors hover:border-core"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="shrink-0 text-lift" aria-hidden>
                  {PATH_ICONS[i]}
                </svg>
                <span className="text-[14px] font-semibold">{p}</span>
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      {/* انتخاب نوع درخواست */}
      <section className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8 lg:py-20">
        <Reveal className="mb-8 border-t border-hairline pt-7">
          <h2 className="display text-[clamp(1.4rem,3vw,2rem)]">{MATIN.topicsTitle}</h2>
        </Reveal>
        <Topics onPick={pick} />
      </section>

      {/* ثبت تیکت */}
      <section id="ticket" ref={formRef} className="mx-auto max-w-[1280px] scroll-mt-24 px-5 pb-16 lg:px-8 lg:pb-20">
        <Reveal className="mb-8 border-t border-hairline pt-7">
          <h2 className="display text-[clamp(1.4rem,3vw,2rem)]">{MATIN.formTitle}</h2>
        </Reveal>
        <div className="max-w-3xl">
          <TicketForm subject={subject} setSubject={setSubject} />
        </div>
      </section>

      {/* ارتباط مستقیم */}
      <section className="mx-auto max-w-[1280px] px-5 pb-16 lg:px-8 lg:pb-20">
        <Reveal>
          <DirectContact />
        </Reveal>
      </section>

      {/* سوالات متداول */}
      <section id="faq" className="mx-auto max-w-[1280px] scroll-mt-24 px-5 pb-16 lg:px-8 lg:pb-20">
        <Reveal className="mb-8 border-t border-hairline pt-7">
          <h2 className="display text-[clamp(1.4rem,3vw,2rem)]">{MATIN.faqTitle}</h2>
        </Reveal>
        <Faq />
      </section>

      {/* فوتر صفحه متین */}
      <section className="mx-auto max-w-[1280px] px-5 pb-24 lg:px-8">
        <div className="flex flex-col gap-6 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label={MATIN.footerLinksTitle}>
            <h2 className="label mb-3">{MATIN.footerLinksTitle}</h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {MATIN.footerLinks.map((l, i) => (
                <li key={l}>
                  <Link
                    href={["/terms", "/privacy", "/guide"][i]}
                    className="text-[14px] text-ink2 transition-colors hover:text-ink"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-[15px] font-bold text-lift">{MATIN.reminder}</p>
        </div>
      </section>
    </>
  );
}
