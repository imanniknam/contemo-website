import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/motion-primitives";
import { ProcessRail } from "@/components/ui";
import ApplyForm from "./ApplyForm";
import { APPLY } from "@/lib/content";

export const metadata: Metadata = {
  title: APPLY.title,
  description: APPLY.subtitle,
};

export default function ApplyPage() {
  return (
    <>
      <PageHero title={APPLY.title} subtitle={APPLY.subtitle} />

      {/* مراحل ثبت‌نام و دریافت پروژه — infographic */}
      <section className="mx-auto max-w-[1280px] px-5 pt-16 lg:px-8 lg:pt-20">
        <Reveal className="mb-10 border-t border-hairline pt-7">
          <h2 className="display text-[clamp(1.5rem,3.2vw,2.1rem)]">{APPLY.processTitle}</h2>
        </Reveal>
        <Reveal>
          <ProcessRail steps={APPLY.process} current={0} cols={3} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="border-t border-hairline pt-10">
          <ApplyForm />
        </div>
      </section>
    </>
  );
}
