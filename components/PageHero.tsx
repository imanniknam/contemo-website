import type { ReactNode } from "react";
import OrbitField from "./OrbitField";

/** Shared page opener: main title, sub-title and description, in the order the
 *  specification documents use (عنوان اصلی / سابتایتل / دیسکریپشن). */
export default function PageHero({
  title,
  subtitle,
  desc,
  children,
}: {
  title: string;
  subtitle?: string;
  desc?: string | string[];
  children?: ReactNode;
}) {
  const paragraphs = Array.isArray(desc) ? desc : desc ? [desc] : [];

  return (
    <section className="relative overflow-hidden border-b border-hairline pt-16 lg:pt-[76px]">
      <div className="absolute inset-0 -z-10 opacity-70">
        <OrbitField density={0.7} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40"
        style={{ background: "linear-gradient(to top, var(--color-void), transparent)" }}
      />
      <div className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8 lg:py-24">
        <h1 className="display max-w-[20ch] text-[clamp(1.9rem,4.4vw,3.2rem)]">{title}</h1>
        {subtitle && (
          <p className="mt-5 max-w-[56ch] text-[16px] font-semibold leading-relaxed text-lift lg:text-[18px]">
            {subtitle}
          </p>
        )}
        {paragraphs.length > 0 && (
          <div className="mt-6 max-w-[68ch] space-y-4">
            {paragraphs.map((p) => (
              <p key={p} className="text-[15px] leading-loose text-ink2">
                {p}
              </p>
            ))}
          </div>
        )}
        {children && <div className="mt-9">{children}</div>}
      </div>
    </section>
  );
}
