"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { Button, Field } from "@/components/ui";
import { importDocAction, savePostAction, type FormResult } from "./actions";

export type FormValues = {
  originalSlug: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  date: string;
  keywords: string;
  heroArt: string;
  heroAlt: string;
  answerQ: string;
  answerA: string;
  body: string;
  faq: string;
  related: string[];
  draft: boolean;
};

const ART_OPTIONS = [
  { value: "compare", label: "مقایسه" },
  { value: "cost", label: "هزینه" },
  { value: "capacity", label: "ظرفیت" },
  { value: "pricing", label: "قیمت‌گذاری" },
  { value: "steps", label: "مراحل" },
  { value: "brief", label: "شرح پروژه / قرارداد" },
  { value: "mistakes", label: "اشتباهات" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6 border-t border-hairline pt-7">
      <h2 className="display text-[1.15rem]">{title}</h2>
      {children}
    </section>
  );
}

export default function PostForm({
  heading,
  initial,
  others,
  slugLocked,
  allowImport,
  note,
}: {
  heading: string;
  initial: FormValues;
  others: { slug: string; title: string }[];
  slugLocked: boolean;
  allowImport?: boolean;
  note?: string;
}) {
  const [state, action, saving] = useActionState<FormResult, FormData>(savePostAction, {});
  const [v, setV] = useState<FormValues>(initial);
  const set = <K extends keyof FormValues>(k: K) => (val: FormValues[K]) => setV((p) => ({ ...p, [k]: val }));

  const [docUrl, setDocUrl] = useState("");
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [importing, startImport] = useTransition();

  function runImport() {
    setImportMsg(null);
    startImport(async () => {
      const res = await importDocAction(docUrl);
      if (!res.ok) return setImportMsg({ ok: false, text: res.error });
      const d = res.doc;
      setV((p) => ({
        ...p,
        title: d.title || p.title,
        slug: slugLocked ? p.slug : d.slug || p.slug,
        metaTitle: d.metaTitle || p.metaTitle,
        metaDescription: d.metaDescription || p.metaDescription,
        excerpt: d.excerpt || p.excerpt,
        keywords: d.keywords || p.keywords,
        heroAlt: d.heroAlt || p.heroAlt,
        answerQ: d.title || p.answerQ,
        answerA: d.excerpt || p.answerA,
        body: d.body,
        faq: d.faq,
        related: res.relatedSlugs.length ? res.relatedSlugs : p.related,
      }));
      setImportMsg({
        ok: true,
        text: "سند وارد شد. فیلدها را مرور کنید، تصویر بالای مقاله را انتخاب کنید و ذخیره کنید.",
      });
    });
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-[clamp(1.6rem,3.5vw,2.2rem)]">{heading}</h1>
        <Link href="/admin" className="text-[14px] text-ink2 hover:text-ink">
          ← بازگشت به فهرست
        </Link>
      </div>

      {note && <p className="border-e-2 border-beacon bg-panel/50 px-5 py-4 text-[14px] leading-loose text-ink2">{note}</p>}

      {allowImport && (
        <section className="space-y-4 border border-hairline bg-panel/50 p-6">
          <h2 className="text-[16px] font-bold">ورود از گوگل‌داک</h2>
          <p className="text-[13.5px] leading-loose text-ink2">
            لینک سند را بگذارید تا عنوان، متا، اسلاگ، کلمات کلیدی، متن و پرسش‌های متداول خودکار پر شوند. دسترسی سند
            باید «هر کسی که لینک را دارد» باشد.
          </p>
          <Field
            id="docUrl"
            type="iban"
            label="لینک گوگل‌داک"
            value={docUrl}
            onChange={setDocUrl}
            hint="https://docs.google.com/document/d/…"
          />
          <Button onClick={runImport} disabled={importing || !docUrl.trim()} variant="secondary">
            {importing ? "در حال خواندن سند…" : "ورود سند"}
          </Button>
          {importMsg && (
            <p role={importMsg.ok ? "status" : "alert"} className={`text-[13.5px] ${importMsg.ok ? "text-signal" : "text-alert"}`}>
              {importMsg.text}
            </p>
          )}
        </section>
      )}

    <form action={action} className="space-y-12">
      <input type="hidden" name="originalSlug" value={v.originalSlug} />

      <Section title="اطلاعات اصلی">
        <Field id="title" label="عنوان مقاله" required value={v.title} onChange={set("title")} />
        <Field
          id="slug"
          type="iban"
          label="اسلاگ (آدرس مقاله)"
          required
          value={v.slug}
          onChange={(x) => set("slug")(x.toLowerCase())}
          hint={slugLocked ? "اسلاگ مقاله‌های اولیه قابل تغییر نیست." : "فقط حروف کوچک انگلیسی، عدد و خط‌تیره؛ مثل how-to-choose-freelancer"}
        />
        <Field
          id="excerpt"
          as="textarea"
          label="خلاصه برای فهرست فانوس"
          required
          value={v.excerpt}
          onChange={set("excerpt")}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="date" type="date" label="تاریخ انتشار" required value={v.date} onChange={set("date")} />
          <Field id="category" label="دسته‌بندی" value={v.category} onChange={set("category")} />
        </div>
        <label className="flex items-center gap-3 text-[14px]">
          <input
            type="checkbox"
            name="draft"
            checked={v.draft}
            onChange={(e) => set("draft")(e.target.checked)}
            className="h-4 w-4 accent-[#2A38FF]"
          />
          پیش‌نویس (روی سایت دیده نشود)
        </label>
      </Section>

      <Section title="متن مقاله">
        <Field
          id="body"
          as="textarea"
          label="متن"
          required
          value={v.body}
          onChange={set("body")}
          hint="راهنما: «## تیتر»، «### زیرتیتر»، «- مورد لیست»، «> نکته»، «**پررنگ**». پاراگراف‌ها را با یک خط خالی جدا کنید."
        />
        <style>{`#body{min-height:32rem;line-height:1.9;font-family:inherit}`}</style>
      </Section>

      <Section title="پرسش‌های متداول">
        <Field
          id="faq"
          as="textarea"
          label="پرسش و پاسخ"
          required={false}
          value={v.faq}
          onChange={set("faq")}
          hint="هر پرسش در یک خط و پاسخش خط بعد؛ بین دو پرسش یک خط خالی بگذارید."
        />
      </Section>

      <Section title="سئو و تصویر">
        <Field id="metaTitle" label="عنوان سئو (Meta Title)" required={false} value={v.metaTitle} onChange={set("metaTitle")} hint="خالی = همان عنوان مقاله" />
        <Field id="metaDescription" as="textarea" label="توضیحات متا (Meta Description)" required={false} value={v.metaDescription} onChange={set("metaDescription")} hint="خالی = همان خلاصه" />
        <Field id="keywords" as="textarea" label="کلمات کلیدی" required={false} value={v.keywords} onChange={set("keywords")} hint="با ویرگول فارسی جدا کنید." />
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="heroArt" as="select" label="تصویر بالای مقاله" value={v.heroArt} onChange={set("heroArt")} options={ART_OPTIONS} />
          <Field id="heroAlt" label="متن جایگزین تصویر (Alt)" required={false} value={v.heroAlt} onChange={set("heroAlt")} />
        </div>
        <Field id="answerQ" label="پرسش پاسخ کوتاه (Featured Snippet)" required={false} value={v.answerQ} onChange={set("answerQ")} />
        <Field id="answerA" as="textarea" label="پاسخ کوتاه بالای مقاله" required={false} value={v.answerA} onChange={set("answerA")} />
      </Section>

      {others.length > 0 && (
        <Section title="مقاله‌های مرتبط">
          <ul className="grid gap-2 sm:grid-cols-2">
            {others.map((o) => (
              <li key={o.slug}>
                <label className="flex items-start gap-3 text-[14px] leading-relaxed text-ink2">
                  <input
                    type="checkbox"
                    name="related"
                    value={o.slug}
                    checked={v.related.includes(o.slug)}
                    onChange={(e) =>
                      set("related")(e.target.checked ? [...v.related, o.slug] : v.related.filter((s) => s !== o.slug))
                    }
                    className="mt-1.5 h-4 w-4 shrink-0 accent-[#2A38FF]"
                  />
                  {o.title}
                </label>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-4 border-t border-hairline bg-void/95 px-5 py-4 backdrop-blur lg:-mx-8 lg:px-8">
        <Button type="submit" disabled={saving}>
          {saving ? "در حال ذخیره…" : v.draft ? "ذخیره به‌عنوان پیش‌نویس" : "ذخیره و انتشار"}
        </Button>
        {state.error && (
          <p role="alert" className="text-[14px] text-alert">
            {state.error}
          </p>
        )}
      </div>
    </form>
    </div>
  );
}
