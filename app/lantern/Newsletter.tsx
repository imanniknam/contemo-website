"use client";

import { useState } from "react";
import { LANTERN } from "@/lib/content";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
    setState(ok ? "done" : "error");
  };

  if (state === "done") {
    return (
      <div role="status" className="border border-signal/50 bg-signal/10 px-5 py-6">
        <p className="text-[15px] font-bold text-signal">عضویت شما ثبت شد</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink2">
          از این پس تازه‌ترین نوشته‌های فانوس به نشانی <span className="ltr mono">{email}</span> ارسال می‌شود.
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={submit} noValidate>
      <label htmlFor="nl" className="text-[13.5px] font-semibold">
        ایمیل شما
      </label>
      <input
        id="nl"
        type="email"
        dir="ltr"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state === "error") setState("idle");
        }}
        aria-invalid={state === "error"}
        aria-describedby={state === "error" ? "nl-err" : undefined}
        placeholder="you@example.com"
        className={`mono w-full border bg-void px-4 py-3 text-left text-[14px] outline-none transition-colors placeholder:text-ink3 ${
          state === "error" ? "border-alert" : "border-hairline focus:border-beacon"
        }`}
      />
      {state === "error" && (
        <p id="nl-err" role="alert" className="text-[12.5px] text-alert">
          نشانی ایمیل معتبر نیست. نمونه صحیح: name@example.com
        </p>
      )}
      <button
        type="submit"
        className="arc arc-tr bg-beacon px-6 py-3.5 text-[14.5px] font-bold text-void transition-opacity hover:opacity-90"
        style={{ ["--arc-r" as string]: "16px" }}
      >
        {LANTERN.newsletterButton}
      </button>
    </form>
  );
}
