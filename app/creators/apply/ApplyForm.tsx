"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { Button, Field, Check, Modal } from "@/components/ui";
import { APPLY } from "@/lib/content";
import { toLatin } from "@/lib/fa";

/**
 * The three tabs from the specification: اطلاعات شخصی، اطلاعات بانکی،
 * تنظیمات حساب کاربری — each with its own confirm modal, then the two consent
 * checkboxes and the final registration modal.
 */
export default function ApplyForm() {
  const [tab, setTab] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [consents, setConsents] = useState([false, false]);
  const [touched, setTouched] = useState<Record<number, boolean>>({});
  const [modal, setModal] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  const current = APPLY.tabs[tab];
  const key = (label: string) => `${current.id}-${label.replace(/\s/g, "-")}`;

  const errorFor = (label: string, type: string) => {
    if (!touched[tab]) return undefined;
    const v = (values[key(label)] ?? "").trim();
    if (!v) return `${label} را وارد کنید`;
    const digits = toLatin(v).replace(/\D/g, "");
    if (label === "کد ملی" && digits.length !== 10) return "کد ملی باید ۱۰ رقم باشد";
    if (label === "کد پستی" && digits.length !== 10) return "کد پستی باید ۱۰ رقم باشد";
    if (label === "شماره تلفن همراه" && !/^09\d{9}$/.test(digits)) return "شماره موبایل معتبر نیست";
    if (label === "شماره شبا" && digits.length !== 24) return "شماره شبا باید ۲۴ رقم بعد از IR باشد";
    if (type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return "ایمیل معتبر نیست";
    return undefined;
  };

  const tabValid = current.fields.every((f) => !errorFor(f.label, f.type) && (values[key(f.label)] ?? "").trim());

  const saveTab = () => {
    setTouched({ ...touched, [tab]: true });
    if (!current.fields.every((f) => (values[key(f.label)] ?? "").trim())) return;
    if (!tabValid) return;
    if (current.modal) setModal(current.modal);
    else commitTab();
  };

  const commitTab = () => {
    setModal(null);
    setSaved({ ...saved, [tab]: true });
    if (tab < APPLY.tabs.length - 1) setTab(tab + 1);
  };

  const allSaved = APPLY.tabs.every((_, i) => saved[i]);
  const canFinish = allSaved && consents.every(Boolean);

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
      {/* tab rail */}
      <LayoutGroup id="apply-tabs">
        <div
          role="tablist"
          aria-label="مراحل ثبت‌نام"
          className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {APPLY.tabs.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={`relative shrink-0 px-4 py-3 text-right text-[14px] font-semibold transition-colors lg:w-full ${
                tab === i ? "text-ink" : "text-ink3 hover:text-ink2"
              }`}
            >
              {tab === i && (
                <motion.span
                  layoutId="apply-ind"
                  className="absolute inset-y-0 right-0 w-0.5 bg-core max-lg:inset-x-0 max-lg:bottom-0 max-lg:top-auto max-lg:h-0.5 max-lg:w-full"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="mono ml-2 text-[11px] text-core">{["۰۱", "۰۲", "۰۳"][i]}</span>
              {t.tab}
              {saved[i] && (
                <span className="mr-2 text-signal" aria-label="تکمیل شد">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </LayoutGroup>

      {/* panel */}
      <div>
        <AnimatePresence mode="wait">
          <motion.section
            key={current.id}
            role="tabpanel"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-[19px] font-bold">{current.title}</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink2">{current.desc}</p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {current.fields.map((f) => (
                <div key={f.label} className={f.type === "file" ? "sm:col-span-2" : ""}>
                  <Field
                    id={key(f.label)}
                    label={f.label}
                    type={f.type}
                    required
                    prefix={f.type === "iban" ? "IR" : undefined}
                    error={errorFor(f.label, f.type)}
                    value={values[key(f.label)] ?? ""}
                    onChange={(v) => setValues({ ...values, [key(f.label)]: v })}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={saveTab}>{current.primary}</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setSaved({ ...saved, [tab]: false });
                  setTouched({ ...touched, [tab]: false });
                }}
              >
                {current.secondary}
              </Button>
            </div>
          </motion.section>
        </AnimatePresence>

        {/* گزینه‌های تأیید */}
        <div className="mt-12 border-t border-hairline pt-8">
          <h2 className="mb-4 text-[15px] font-bold">گزینه‌های تأیید</h2>
          <div className="space-y-2">
            {APPLY.consents.map((c, i) => (
              <Check
                key={c}
                id={`consent-${i}`}
                checked={consents[i]}
                onChange={(v) => setConsents(consents.map((x, k) => (k === i ? v : x)) as [boolean, boolean])}
                label={c}
              />
            ))}
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-[15px] font-bold">{APPLY.doneTitle}</h3>
            <Button disabled={!canFinish} onClick={() => setDone(true)}>
              تکمیل ثبت‌نام
            </Button>
            {!canFinish && (
              <p className="mt-3 text-[12.5px] text-ink3">
                برای تکمیل ثبت‌نام، هر سه تب را ذخیره کرده و هر دو گزینه تأیید را انتخاب کنید.
              </p>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal ?? ""}
        actions={
          <>
            <Button onClick={commitTab}>بله، تایید می‌کنم</Button>
            <Button variant="secondary" onClick={() => setModal(null)}>
              ویرایش
            </Button>
          </>
        }
      />

      <Modal
        open={done}
        onClose={() => setDone(false)}
        title={APPLY.doneModal}
        actions={
          <Button href="/creators/skills">
            {APPLY.doneButton}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        }
      />
    </div>
  );
}
