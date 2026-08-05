"use client";

import { useMemo, useState } from "react";
import PageHero from "@/components/PageHero";
import ArcPanel from "@/components/ArcPanel";
import { Button } from "@/components/ui";
import { Counter } from "@/components/motion-primitives";
import { motion } from "motion/react";
import { CATEGORIES, VOLUMES, URGENCIES, TIERS, EMPTY_BRIEF, estimate, type Brief, type ContentKind } from "@/lib/pricing";
import { fa, groupFa } from "@/lib/fa";

/**
 * برآورد هزینه — the standalone estimator from the menu.
 *
 * It imports the same `estimate()` used by the project form rather than
 * re-implementing the maths, so the two screens can never quote different
 * numbers for the same brief. Selections carry over to /start via the query
 * string, so nothing has to be re-entered.
 */
export default function EstimatePage() {
  const [brief, setBrief] = useState<Brief>({ ...EMPTY_BRIEF, category: "text", type: "blog" });
  const est = useMemo(() => estimate(brief), [brief]);
  const category = CATEGORIES.find((c) => c.id === brief.category);

  const groups = [
    { key: "volume" as const, title: "حجم پروژه", opts: VOLUMES },
    { key: "urgency" as const, title: "فوریت تحویل", opts: URGENCIES },
    { key: "tier" as const, title: "سطح کارپذیر", opts: TIERS },
  ];

  return (
    <>
      <PageHero
        title="برآورد هزینه پروژه"
        subtitle="پیش از ثبت‌نام، هزینه و زمان تقریبی پروژه خود را ببینید"
        desc="نوع پروژه و نوع محتوا را انتخاب کنید و به سه پرسش کوتاه پاسخ دهید. هزینه و زمان تحویل به‌صورت لحظه‌ای محاسبه می‌شود و می‌توانید همین انتخاب‌ها را مستقیم به فرم ثبت پروژه منتقل کنید."
      />

      <section className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-10">
          <div className="space-y-8">
            <fieldset>
              <legend className="mb-3 text-[14px] font-semibold">نوع پروژه</legend>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {CATEGORIES.map((c) => {
                  const on = brief.category === c.id;
                  return (
                    <button
                      key={c.id}
                      aria-pressed={on}
                      onClick={() => setBrief({ ...brief, category: c.id as ContentKind, type: c.types[0].id })}
                      className={`min-h-[52px] border px-3 py-3 text-[14px] font-semibold transition-colors ${
                        on ? "border-core bg-core text-white" : "border-hairline text-ink2 hover:border-ink3 hover:text-ink"
                      }`}
                    >
                      {c.title.replace("محتوای ", "")}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-[14px] font-semibold">نوع محتوا</legend>
              <div className="flex flex-wrap gap-2.5">
                {category?.types.map((t) => {
                  const on = brief.type === t.id;
                  return (
                    <button
                      key={t.id}
                      aria-pressed={on}
                      onClick={() => setBrief({ ...brief, type: t.id })}
                      className={`min-h-[44px] border px-4 py-2.5 text-[14px] transition-colors ${
                        on ? "border-core bg-core text-white" : "border-hairline text-ink2 hover:border-ink3 hover:text-ink"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {groups.map((g) => (
              <fieldset key={g.key}>
                <legend className="mb-3 text-[14px] font-semibold">{g.title}</legend>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {g.opts.map((o) => {
                    const on = brief[g.key] === o.id;
                    return (
                      <button
                        key={o.id}
                        aria-pressed={on}
                        onClick={() => setBrief({ ...brief, [g.key]: o.id })}
                        className={`min-h-[60px] border px-4 py-3 text-right transition-colors ${
                          on ? "border-core bg-core/12" : "border-hairline hover:border-ink3"
                        }`}
                      >
                        <span className={`block text-[14px] font-semibold ${on ? "text-ink" : "text-ink2"}`}>{o.label}</span>
                        <span className="block text-[12px] text-ink3">{o.note}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24">
            <ArcPanel corner="tl" radius={26}>
              <div className="p-6">
                <h2 className="label text-lift">برآورد لحظه‌ای</h2>
                <p className="mono mt-5 text-[clamp(1.6rem,4vw,2.1rem)] font-bold leading-none">
                  <Counter to={est.total} grouped persian duration={0.5} />
                  <span className="mr-2 text-[14px] font-medium text-ink3">تومان</span>
                </p>
                <p className="mono mt-3 text-[18px] font-bold">{fa(est.days)} روز کاری</p>

                <div className="mt-6 border-t border-hairline pt-5">
                  <p className="label mb-3">این هزینه چگونه محاسبه شد؟</p>
                  <ul className="space-y-3">
                    {est.lines.map((l) => (
                      <li key={l.key}>
                        <div className="mono flex items-baseline justify-between text-[12.5px]">
                          <span className="text-ink3">{l.label}</span>
                          <span className="text-ink2">{groupFa(l.amount)} ت</span>
                        </div>
                        <div className="mt-1.5 h-1 bg-panel2">
                          <motion.div
                            className="h-full bg-core"
                            initial={false}
                            animate={{ width: `${Math.round(l.share * 100)}%` }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7">
                  <Button href={`/start?c=${brief.category}&t=${brief.type}`} className="w-full">
                    ادامه به ثبت پروژه
                  </Button>
                </div>
                <p className="mt-4 text-[12px] leading-relaxed text-ink3">
                  این عدد یک برآورد است. هزینه نهایی پس از تکمیل پرسشنامه پروژه مشخص می‌شود.
                </p>
              </div>
            </ArcPanel>
          </aside>
        </div>
      </section>
    </>
  );
}
