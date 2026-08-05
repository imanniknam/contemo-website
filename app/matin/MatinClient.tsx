"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ArcPanel from "@/components/ArcPanel";
import { Button, Field, Modal } from "@/components/ui";
import { Reveal } from "@/components/motion-primitives";
import { MATIN } from "@/lib/content";
import { fa, normalizeFa } from "@/lib/fa";

/** Choosing a topic opens the ticket form, exactly as the spec describes
 *  ("با کلیک بر روی هر کدوم از مشکلات فرم تیکت باز میشه"), and pre-selects
 *  the subject so the visitor doesn't answer the same question twice. */
export function Topics({ onPick }: { onPick: (t: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {MATIN.topics.map((t, i) => (
        <Reveal key={t} delay={(i % 4) * 0.05}>
          <button
            onClick={() => onPick(t)}
            className="group flex min-h-[76px] w-full items-center justify-between gap-3 border border-hairline px-5 py-4 text-right transition-colors hover:border-core hover:bg-panel"
          >
            <span className="text-[14.5px] font-semibold">{t}</span>
            <span aria-hidden className="text-lift transition-transform group-hover:-translate-x-1">
              ←
            </span>
          </button>
        </Reveal>
      ))}
    </div>
  );
}

export function TicketForm({ subject, setSubject }: { subject: string; setSubject: (s: string) => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const err = (label: string, required: boolean) => {
    if (!touched || !required) return undefined;
    const v = label === MATIN.fields[1].label ? subject : (values[label] ?? "").trim();
    return v ? undefined : `${label} الزامی است`;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const ok = MATIN.fields.every((f) => {
      if (!f.required) return true;
      const v = f.label === MATIN.fields[1].label ? subject : (values[f.label] ?? "").trim();
      return !!v;
    });
    if (ok) setSent(true);
  };

  return (
    <>
      <form onSubmit={submit} noValidate className="grid gap-6 sm:grid-cols-2">
        {MATIN.fields.map((f, i) => {
          const isSubject = i === 1;
          const isMessage = i === 3;
          const isFile = i === 5;
          return (
            <div key={f.label} className={isMessage || isFile ? "sm:col-span-2" : ""}>
              {isFile ? (
                <>
                  <p className="mb-2 text-[14px] font-semibold">
                    {f.label} <span className="text-[12px] font-normal text-ink3">(اختیاری)</span>
                  </p>
                  <label
                    htmlFor="ticket-file"
                    className="flex cursor-pointer items-center justify-center gap-3 border border-dashed border-hairline px-5 py-6 text-center text-[13.5px] text-ink3 transition-colors hover:border-core hover:text-ink2"
                  >
                    {values.file ?? f.hint}
                  </label>
                  <input
                    id="ticket-file"
                    type="file"
                    className="sr-only"
                    onChange={(e) =>
                      setValues({ ...values, file: e.target.files?.length ? `${fa(e.target.files.length)} فایل انتخاب شد` : "" })
                    }
                  />
                </>
              ) : (
                <Field
                  id={`t-${i}`}
                  label={f.label}
                  hint={f.hint}
                  required={f.required}
                  as={isSubject ? "select" : isMessage ? "textarea" : "input"}
                  options={isSubject ? MATIN.topics.map((t) => ({ value: t, label: t })) : undefined}
                  error={err(f.label, f.required)}
                  value={isSubject ? subject : (values[f.label] ?? "")}
                  onChange={(v) =>
                    isSubject ? setSubject(v) : setValues({ ...values, [f.label]: normalizeFa(v) })
                  }
                />
              )}
            </div>
          );
        })}

        <div className="sm:col-span-2">
          <Button type="submit">{MATIN.submit}</Button>
        </div>
      </form>

      <Modal
        open={sent}
        onClose={() => setSent(false)}
        title={MATIN.modal}
        actions={<Button onClick={() => setSent(false)}>باشه</Button>}
      />
    </>
  );
}

/** سوالات متداول — accordion. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-hairline border-y border-hairline">
      {MATIN.faq.map((f, i) => {
        const on = open === i;
        return (
          <div key={f.q}>
            <h3>
              <button
                onClick={() => setOpen(on ? null : i)}
                aria-expanded={on}
                aria-controls={`faq-${i}`}
                className="flex w-full items-start justify-between gap-5 py-5 text-right"
              >
                <span className={`text-[15px] font-semibold transition-colors ${on ? "text-ink" : "text-ink2"}`}>
                  {f.q}
                </span>
                <span
                  aria-hidden
                  className={`mt-1 shrink-0 text-lift transition-transform duration-300 ${on ? "rotate-45" : ""}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  id={`faq-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[70ch] pb-6 text-[14.5px] leading-loose text-ink2">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function DirectContact() {
  const items = [
    { label: MATIN.contactItems[0], value: "۰۲۱-۹۱۰۰۰۰۰۰", ltr: true },
    { label: MATIN.contactItems[1], value: "support@contemo.ir", ltr: true },
    { label: MATIN.contactItems[2], value: "۲۴ ساعته، تمام روزهای هفته", ltr: false },
    { label: MATIN.contactItems[3], value: "شروع گفتگو", ltr: false },
  ];
  return (
    <ArcPanel corner="tr" radius={26}>
      <div className="p-7">
        <h2 className="text-[18px] font-bold">{MATIN.directTitle}</h2>
        <p className="mt-3 max-w-[54ch] text-[14.5px] leading-loose text-ink2">{MATIN.directDesc}</p>
        <dl className="mt-7 grid gap-5 sm:grid-cols-2">
          {items.map((it) => (
            <div key={it.label} className="border-r-2 border-hairline pr-4">
              <dt className="label">{it.label}</dt>
              <dd className={`mt-1 text-[14.5px] font-semibold ${it.ltr ? "mono" : ""}`}>
                {it.ltr ? <span className="ltr">{it.value}</span> : it.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </ArcPanel>
  );
}
