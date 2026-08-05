"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ArcPanel from "@/components/ArcPanel";
import { Button, Field, Check, Modal } from "@/components/ui";
import { Counter } from "@/components/motion-primitives";
import { START } from "@/lib/content";
import { CATEGORIES, VOLUMES, URGENCIES, TIERS, EMPTY_BRIEF, estimate, type Brief, type ContentKind } from "@/lib/pricing";
import { fa, groupFa } from "@/lib/fa";

/** The three questions of «پرسشنامه پروژه». The spec left them as
 *  "پرسش ۱ / ۲ / ۳"; they are the parameters the estimate actually depends on,
 *  so they are also what drives the live cost and delivery figures. */
const QUESTIONS = [
  { key: "volume" as const, q: "پرسش ۱ — حجم پروژه چقدر است؟", opts: VOLUMES },
  { key: "urgency" as const, q: "پرسش ۲ — زمان تحویل چقدر فوری است؟", opts: URGENCIES },
  { key: "tier" as const, q: "پرسش ۳ — چه سطحی از کارپذیر لازم دارید؟", opts: TIERS },
];

export default function ProjectForm() {
  const [brief, setBrief] = useState<Brief>(EMPTY_BRIEF);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [modal, setModal] = useState(false);
  const [sent, setSent] = useState(false);

  const est = useMemo(() => estimate(brief), [brief]);
  const category = CATEGORIES.find((c) => c.id === brief.category);

  const errors = {
    title: touched && !title.trim() ? "عنوان پروژه را وارد کنید" : undefined,
    category: touched && !brief.category ? "نوع پروژه را انتخاب کنید" : undefined,
    type: touched && !brief.type ? "نوع محتوا را انتخاب کنید" : undefined,
    confirmed: touched && !confirmed ? "برای ادامه، صحت اطلاعات را تأیید کنید" : undefined,
  };
  const valid = title.trim() && brief.category && brief.type && confirmed;

  const submit = () => {
    setTouched(true);
    if (valid) setModal(true);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-10">
      {/* ── فرم ثبت پروژه ── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        noValidate
        className="space-y-8"
      >
        <Field
          id="project-title"
          label={START.fields.projectTitle.label}
          hint={START.fields.projectTitle.hint}
          error={errors.title}
          required
          value={title}
          onChange={setTitle}
        />

        {/* انتخاب نوع پروژه */}
        <fieldset>
          <legend className="mb-2 block text-[14px] font-semibold">
            {START.fields.projectType.label}
            <span className="mr-1 text-alert" aria-label="اجباری">*</span>
          </legend>
          <p className="mb-3 text-[12.5px] text-ink3">{START.fields.projectType.hint}</p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {CATEGORIES.map((c) => {
              const on = brief.category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setBrief({ ...brief, category: c.id as ContentKind, type: null })}
                  className={`min-h-[52px] border px-3 py-3 text-[14px] font-semibold transition-colors ${
                    on ? "border-core bg-core text-white" : "border-hairline text-ink2 hover:border-ink3 hover:text-ink"
                  }`}
                >
                  {c.title.replace("محتوای ", "")}
                </button>
              );
            })}
          </div>
          {errors.category && (
            <p role="alert" className="mt-2 text-[12.5px] text-alert">{errors.category}</p>
          )}
        </fieldset>

        {/* انتخاب نوع محتوا */}
        <fieldset>
          <legend className="mb-2 block text-[14px] font-semibold">
            {START.fields.contentType.label}
            <span className="mr-1 text-alert" aria-label="اجباری">*</span>
          </legend>
          <p className="mb-3 text-[12.5px] text-ink3">{START.fields.contentType.hint}</p>
          {!category ? (
            <p className="border border-dashed border-hairline px-4 py-5 text-[13.5px] text-ink3">
              ابتدا نوع پروژه را انتخاب کنید تا انواع محتوای مرتبط نمایش داده شود.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {category.types.map((t) => {
                const on = brief.type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
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
          )}
          {errors.type && <p role="alert" className="mt-2 text-[12.5px] text-alert">{errors.type}</p>}
        </fieldset>

        {/* پرسشنامه پروژه */}
        <fieldset className="border-t border-hairline pt-8">
          <legend className="text-[15px] font-bold">{START.fields.questionnaire.label}</legend>
          <div className="mt-5 space-y-6">
            {QUESTIONS.map((qq) => (
              <div key={qq.key}>
                <p className="mb-3 text-[14px] font-semibold text-ink2">{qq.q}</p>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {qq.opts.map((o) => {
                    const on = brief[qq.key] === o.id;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setBrief({ ...brief, [qq.key]: o.id })}
                        className={`min-h-[60px] border px-4 py-3 text-right transition-colors ${
                          on ? "border-core bg-core/12" : "border-hairline hover:border-ink3"
                        }`}
                      >
                        <span className={`block text-[14px] font-semibold ${on ? "text-ink" : "text-ink2"}`}>
                          {o.label}
                        </span>
                        <span className="block text-[12px] text-ink3">{o.note}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        {/* فایل‌های مرتبط */}
        <div className="border-t border-hairline pt-8">
          <p className="mb-2 text-[14px] font-semibold">{START.fields.files.label}</p>
          <label
            htmlFor="files"
            className="flex cursor-pointer flex-col items-center gap-2 border border-dashed border-hairline px-5 py-8 text-center transition-colors hover:border-core hover:bg-panel/50"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-lift" aria-hidden>
              <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2"
                    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[14px] font-semibold">{file ?? "فایل را انتخاب یا اینجا رها کنید"}</span>
            <span className="text-[12.5px] text-ink3">{START.fields.files.hint}</span>
          </label>
          <input
            id="files"
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.length ? `${fa(e.target.files.length)} فایل انتخاب شد` : null)}
          />
        </div>

        {/* توضیحات */}
        <Field
          id="notes"
          label={START.fields.notes.label}
          hint={START.fields.notes.hint}
          as="textarea"
          required={false}
          value={notes}
          onChange={setNotes}
        />

        {/* تایید اطلاعات */}
        <div className="border-t border-hairline pt-8">
          <h3 className="mb-4 text-[15px] font-bold">{START.confirmTitle}</h3>
          <Check
            id="confirm"
            checked={confirmed}
            onChange={setConfirmed}
            error={errors.confirmed}
            label={START.confirmCheckbox}
          />
        </div>

        <div className="lg:hidden">
          <Button type="submit" className="w-full">{START.submit}</Button>
        </div>
      </form>

      {/* ── پنل زنده: هزینه و زمان ── */}
      <aside className="lg:sticky lg:top-24">
        <ArcPanel corner="tl" radius={26}>
          <div className="p-6">
            <h2 className="label text-lift">خلاصه پروژه</h2>

            <dl className="mt-6 space-y-6">
              <div>
                <dt className="text-[13px] text-ink3">{START.outputs.cost}</dt>
                <dd className="mono mt-1.5 text-[clamp(1.6rem,4vw,2.1rem)] font-bold leading-none">
                  {est.complete ? (
                    <>
                      <Counter to={est.total} grouped persian duration={0.5} />
                      <span className="mr-2 text-[14px] font-medium text-ink3">تومان</span>
                    </>
                  ) : (
                    <span className="text-[18px] font-medium text-ink3">—</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-ink3">{START.outputs.time}</dt>
                <dd className="mono mt-1.5 text-[22px] font-bold">
                  {est.complete ? `${fa(est.days)} روز کاری` : <span className="text-[16px] font-medium text-ink3">—</span>}
                </dd>
              </div>
            </dl>

            {/* Why this number: a figure that moves without explanation reads as
                arbitrary, which undercuts the "قیمت‌گذاری هوشمند و منصفانه" claim. */}
            <AnimatePresence initial={false}>
              {est.complete && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 border-t border-hairline pt-5">
                    <p className="label mb-3">این هزینه چگونه محاسبه شد؟</p>
                    <ul className="space-y-3">
                      {est.lines.map((l) => (
                        <li key={l.key}>
                          <div className="mono flex items-baseline justify-between text-[12.5px]">
                            <span className="text-ink3">{l.label}</span>
                            <span className="text-ink2">{groupFa(l.amount)} ت</span>
                          </div>
                          <div className="mt-1.5 h-1 bg-panel2" role="presentation">
                            <motion.div
                              className="h-full bg-core"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.round(l.share * 100)}%` }}
                              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-7 hidden lg:block">
              <Button onClick={submit} className="w-full">{START.submit}</Button>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-ink3">
              پس از تایید اطلاعات، به صفحه پرداخت امن هدایت می‌شوید.
            </p>
          </div>
        </ArcPanel>
      </aside>

      {/* مدال تایید ثبت پروژه */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={START.modal}
        actions={
          <>
            <Button
              onClick={() => {
                setModal(false);
                setSent(true);
              }}
            >
              بله، ثبت و پرداخت
            </Button>
            <Button variant="secondary" onClick={() => setModal(false)}>
              بازگشت و ویرایش
            </Button>
          </>
        }
      >
        <p>
          «{title}» — {category?.title} · {category?.types.find((t) => t.id === brief.type)?.label}
          <br />
          هزینه نهایی <b className="mono text-ink">{groupFa(est.total)}</b> تومان، زمان انجام{" "}
          <b className="mono text-ink">{fa(est.days)}</b> روز کاری.
        </p>
      </Modal>

      <Modal
        open={sent}
        onClose={() => setSent(false)}
        title="پروژه شما ثبت شد"
        actions={<Button href="/matin">پیگیری از طریق متین</Button>}
      >
        <p>در مرحله بعد به درگاه پرداخت امن هدایت می‌شوید و سپس کارپذیر پروژه شما تخصیص داده می‌شود.</p>
      </Modal>
    </div>
  );
}
