"use client";

import { useState } from "react";
import PageHero from "@/components/PageHero";
import ArcPanel from "@/components/ArcPanel";
import { Reveal } from "@/components/motion-primitives";
import { Button, Field, Check, Modal } from "@/components/ui";
import { CONTACT } from "@/lib/content";

export default function ContactPage() {
  const [v, setV] = useState<Record<string, string>>({});
  const [agree, setAgree] = useState(false);
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const err = (f: string) => (touched && !(v[f] ?? "").trim() ? `${f} را وارد کنید` : undefined);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (CONTACT.fields.every((f) => (v[f] ?? "").trim()) && agree) setSent(true);
  };

  return (
    <>
      <PageHero title={CONTACT.title} subtitle={CONTACT.subtitle} desc={CONTACT.desc} />

      <section className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          {/* فرم تماس */}
          <Reveal>
            <h2 className="display border-t border-hairline pt-7 text-[clamp(1.4rem,3vw,2rem)]">
              {CONTACT.formTitle}
            </h2>
            <p className="mt-4 max-w-[56ch] text-[14.5px] leading-loose text-ink2">{CONTACT.formDesc}</p>

            <form onSubmit={submit} noValidate className="mt-8 grid gap-6 sm:grid-cols-2">
              {CONTACT.fields.map((f, i) => (
                <div key={f} className={i >= 2 ? "sm:col-span-2" : ""}>
                  <Field
                    id={`c-${i}`}
                    label={f}
                    required
                    as={i === 3 ? "textarea" : "input"}
                    error={err(f)}
                    value={v[f] ?? ""}
                    onChange={(val) => setV({ ...v, [f]: val })}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <Check
                  id="privacy"
                  checked={agree}
                  onChange={setAgree}
                  error={touched && !agree ? "برای ارسال پیام، این گزینه را تأیید کنید" : undefined}
                  label={CONTACT.consent}
                />
              </div>
              <div className="sm:col-span-2 flex flex-wrap items-center gap-5">
                <Button type="submit">{CONTACT.submit}</Button>
                <p className="text-[13px] text-ink3">{CONTACT.note}</p>
              </div>
            </form>
          </Reveal>

          {/* راه‌های ارتباطی */}
          <Reveal delay={0.1}>
            <h2 className="display border-t border-hairline pt-7 text-[clamp(1.4rem,3vw,2rem)]">
              {CONTACT.channelsTitle}
            </h2>
            <p className="mt-4 text-[14.5px] leading-loose text-ink2">{CONTACT.channelsDesc}</p>

            <ArcPanel corner="tl" radius={24} className="mt-7">
              <dl className="space-y-5 p-6">
                <div>
                  <dt className="label">ایمیل پشتیبانی</dt>
                  <dd className="mono mt-1 text-[14.5px]">
                    <a href={`mailto:${CONTACT.email}`} className="ltr transition-colors hover:text-lift">
                      {CONTACT.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="label">شماره تماس</dt>
                  <dd className="mono mt-1 text-[14.5px]">
                    <span className="ltr">{CONTACT.phone}</span>
                  </dd>
                </div>
                <div>
                  <dt className="label">ساعات پاسخگویی</dt>
                  <dd className="mt-1 text-[14.5px]">{CONTACT.hours}</dd>
                </div>
              </dl>
            </ArcPanel>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/matin" variant="secondary">{CONTACT.buttons[0]}</Button>
              <Button href="/matin" variant="secondary">{CONTACT.buttons[1]}</Button>
            </div>

            <div className="mt-10">
              <h3 className="text-[16px] font-bold">{CONTACT.socialTitle}</h3>
              <p className="mt-3 text-[14px] leading-loose text-ink2">{CONTACT.socialDesc}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {CONTACT.socials.map((s) => (
                  <li key={s}>
                    <a
                      href="#"
                      className="label block border border-hairline px-3 py-2 transition-colors hover:border-core hover:text-ink"
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* همراه شما در مسیر ساخت محتوا */}
      <section className="mx-auto max-w-[1280px] px-5 pb-24 lg:px-8">
        <Reveal>
          <div className="border-t border-hairline pt-10">
            <h2 className="display text-[clamp(1.4rem,3vw,2rem)]">{CONTACT.closingTitle}</h2>
            <div className="mt-7 grid gap-8 lg:grid-cols-2">
              <ArcPanel corner="tr" radius={24}>
                <div className="p-7">
                  <p className="text-[17px] font-bold">{CONTACT.closingQ}</p>
                  <p className="mt-2 text-[14.5px] text-ink2">{CONTACT.closingDesc}</p>
                  <div className="mt-6">
                    <Button href="/matin#ticket">{CONTACT.closingButton}</Button>
                  </div>
                </div>
              </ArcPanel>

              <div className="flex flex-col justify-center">
                <p className="text-[15px] font-semibold">{CONTACT.finalCta}</p>
                <div className="mt-5 space-y-4">
                  {CONTACT.finalButtons.map((b) => (
                    <div key={b.label} className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
                      <span className="text-[14.5px] text-ink2">{b.q}</span>
                      <Button href={b.href} variant="secondary">{b.label}</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Modal
        open={sent}
        onClose={() => setSent(false)}
        title="پیام شما ارسال شد"
        actions={<Button onClick={() => setSent(false)}>باشه</Button>}
      >
        <p>{CONTACT.note}</p>
      </Modal>
    </>
  );
}
