"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Logo from "./Logo";
import { MENU } from "@/lib/content";

/**
 * Navigation — the six items from the specification, in order.
 *
 * The document asked for tooltips on the four brand code-names so the visitor
 * knows what a page holds before clicking. A hover-only tooltip would be dead
 * on touch, so this implementation exposes the same text three ways: as a
 * hover/focus popover on pointer devices, as `aria-describedby` for assistive
 * tech, and as permanent inline text in the mobile menu.
 */

function MenuItem({ item, active }: { item: (typeof MENU)[number]; active: boolean }) {
  const [open, setOpen] = useState(false);
  const tipId = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    timer.current = setTimeout(() => setOpen(false), 90);
  };

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <Link
        href={item.href}
        onFocus={show}
        onBlur={hide}
        aria-describedby={item.tip && open ? tipId : undefined}
        aria-current={active ? "page" : undefined}
        className={`relative block px-3.5 py-2 text-[14px] font-medium transition-colors ${
          active ? "text-ink" : "text-ink2 hover:text-ink"
        }`}
      >
        {item.label}
        <span
          className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-right bg-core transition-transform duration-300 ${
            active ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </Link>

      {item.tip && (
        <AnimatePresence>
          {open && (
            <motion.span
              id={tipId}
              role="tooltip"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="pointer-events-none absolute right-1/2 top-full z-50 mt-2 w-max max-w-[240px] translate-x-1/2 border border-hairline bg-panel px-3 py-2 text-[12.5px] leading-relaxed text-ink2 shadow-xl"
            >
              {item.tip}
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[70] focus:bg-core focus:px-4 focus:py-2 focus:text-white"
      >
        رفتن به محتوای اصلی
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid ? "border-b border-hairline bg-void/90 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-5 lg:h-[76px] lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="کانتمو، صفحه اصلی">
            <Logo size={30} color="var(--color-core)" />
            <span className="tech text-[15px] font-black">CONTEMO</span>
          </Link>

          <nav className="mx-auto hidden items-center lg:flex" aria-label="منوی اصلی">
            {MENU.map((item) => (
              <MenuItem key={item.href} item={item} active={path === item.href} />
            ))}
          </nav>

          <div className="mr-auto flex items-center gap-2.5 lg:mr-0">
            <Link
              href="/login"
              className="hidden px-3 py-2 text-[13.5px] font-medium text-ink2 transition-colors hover:text-ink sm:block"
            >
              ورود
            </Link>
            <Link
              href="/start"
              className="arc arc-tr hidden bg-core px-5 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-lift sm:block"
              style={{ ["--arc-r" as string]: "14px" }}
            >
              ثبت پروژه
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="باز کردن منو"
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center border border-hairline lg:hidden"
            >
              <span className="relative block h-3 w-4" aria-hidden>
                <span className="absolute inset-x-0 top-0 h-0.5 bg-ink" />
                <span className="absolute inset-x-0 top-1.5 h-0.5 bg-ink" />
                <span className="absolute inset-x-0 top-3 h-0.5 bg-ink" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="منوی اصلی"
            className="fixed inset-0 z-[60] flex flex-col bg-void lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between px-5">
              <Logo size={28} color="var(--color-core)" />
              <button
                onClick={() => setOpen(false)}
                aria-label="بستن منو"
                className="grid h-11 w-11 place-items-center border border-hairline text-lg"
              >
                ✕
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 pb-4" aria-label="منوی موبایل">
              {MENU.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={item.href} className="block border-b border-hairline py-4">
                    <span className="text-xl font-bold">{item.label}</span>
                    {/* the spec's tooltip text, permanent on touch */}
                    {item.tip && <span className="mt-1 block text-[13px] text-ink3">{item.tip}</span>}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="shrink-0 space-y-3 border-t border-hairline p-5 pb-8">
              <Link
                href="/start"
                className="arc arc-tr block bg-core py-4 text-center font-bold text-white"
                style={{ ["--arc-r" as string]: "18px" }}
              >
                ثبت پروژه
              </Link>
              <Link href="/login" className="block border border-hairline py-3.5 text-center font-semibold text-ink2">
                ورود به پنل کاربری
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
