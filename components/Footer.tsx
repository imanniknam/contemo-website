import Link from "next/link";
import Logo from "./Logo";
import { FOOTER } from "@/lib/content";

/** Footer — description, subtitle, link list, social block and legal links,
 *  exactly as laid out at the end of the home-page document. */
export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-hairline lg:mt-32">
      <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1.7fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size={32} color="var(--color-core)" />
              <span className="tech text-base font-black">CONTEMO</span>
            </div>
            <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-ink">{FOOTER.desc}</p>
            <p className="mt-2 max-w-[40ch] text-[14px] leading-relaxed text-ink3">{FOOTER.subtitle}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <nav aria-label="پیوندهای سایت">
              <h2 className="label mb-4 text-lift">پیوندها</h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                {FOOTER.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-[14px] text-ink2 transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="label mb-4 text-lift">{FOOTER.socialTitle}</h2>
              <p className="text-[14px] text-ink2">{FOOTER.socialDesc}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {["Instagram", "LinkedIn", "Telegram", "Aparat", "YouTube"].map((s) => (
                  <li key={s}>
                    <a
                      href="#"
                      className="label block border border-hairline px-2.5 py-1.5 transition-colors hover:border-core hover:text-ink"
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="label mt-5 leading-relaxed">
                <span className="ltr">support@contemo.ir</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-hairline pt-6 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p className="label">© ۱۴۰۵ کانتمو</p>
          <ul className="flex flex-wrap gap-5">
            {FOOTER.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink3 transition-colors hover:text-ink2">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
