import Link from "next/link";
import { MENU } from "@/lib/content";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-[1280px] flex-col justify-center px-5 py-24 lg:px-8">
      <p className="mono text-[13px] font-bold text-core">۴۰۴</p>
      <h1 className="display mt-4 max-w-[20ch] text-[clamp(1.9rem,4.4vw,3rem)]">
        این صفحه پیدا نشد
      </h1>
      <p className="mt-5 max-w-[52ch] text-[15.5px] leading-loose text-ink2">
        ممکن است نشانی تغییر کرده باشد یا صفحه هنوز منتشر نشده باشد. از مسیرهای زیر ادامه دهید:
      </p>
      <nav className="mt-9 grid gap-3 sm:grid-cols-2 lg:max-w-2xl lg:grid-cols-3" aria-label="مسیرهای پیشنهادی">
        {MENU.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="border border-hairline px-4 py-3.5 transition-colors hover:border-core hover:bg-panel"
          >
            <span className="block text-[14.5px] font-semibold">{m.label}</span>
            {m.tip && <span className="mt-1 block text-[12.5px] text-ink3">{m.tip}</span>}
          </Link>
        ))}
      </nav>
    </section>
  );
}
