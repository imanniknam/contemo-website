import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/motion-primitives";
import { ProcessRail } from "@/components/ui";
import ProjectForm from "./ProjectForm";
import { START } from "@/lib/content";

export const metadata: Metadata = {
  title: START.title,
  description: START.subtitle,
};

export default function StartPage() {
  return (
    <>
      <PageHero title={START.title} subtitle={START.subtitle} desc={START.desc} />

      {/* فرایند ثبت پروژه — the document asks for this as an infographic */}
      <section className="mx-auto max-w-[1280px] px-5 pt-16 lg:px-8 lg:pt-20">
        <Reveal>
          <h2 className="display mb-10 border-t border-hairline pt-7 text-[clamp(1.5rem,3.2vw,2.1rem)]">
            {START.processTitle}
          </h2>
          <ProcessRail steps={START.process} current={0} cols={4} />
        </Reveal>
      </section>

      {/* فرم ثبت پروژه */}
      <section className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8 lg:py-20">
        <Reveal>
          <h2 className="display mb-10 border-t border-hairline pt-7 text-[clamp(1.5rem,3.2vw,2.1rem)]">
            {START.formTitle}
          </h2>
        </Reveal>
        <ProjectForm />
      </section>
    </>
  );
}
