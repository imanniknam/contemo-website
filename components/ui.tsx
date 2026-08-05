"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { fa } from "@/lib/fa";

/* ─────────────────────────────────────────────
   Buttons
   ───────────────────────────────────────────── */
export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "arc arc-tr inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14.5px] font-bold transition-colors disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-core text-white hover:bg-lift disabled:bg-panel2 disabled:text-ink3",
    secondary: "border border-hairline text-ink hover:border-core hover:bg-core hover:text-white",
    ghost: "text-ink2 hover:text-ink",
  }[variant];

  const cls = `${base} ${styles} ${className}`;
  const style = { ["--arc-r" as string]: "16px" };

  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} style={style}>
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Field — label, hint, error.

   A real <label> rather than a placeholder-as-label: a placeholder vanishes
   the moment typing starts, which strands anyone who looks away mid-form.
   `dir` is forced to ltr on numeric identifiers (national ID, IBAN, phone,
   email) so Persian bidi never reorders the digits on screen.
   ───────────────────────────────────────────── */
export function Field({
  id,
  label,
  hint,
  error,
  required,
  type = "text",
  as = "input",
  options,
  value,
  onChange,
  prefix,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  type?: string;
  as?: "input" | "textarea" | "select";
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (v: string) => void;
  prefix?: string;
}) {
  const isLatin = ["num", "iban", "email", "password", "tel"].includes(type);
  const inputType = type === "num" || type === "iban" ? "text" : type;

  const shared = {
    id,
    name: id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-err` : hint ? `${id}-hint` : undefined,
    required,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange?.(e.target.value),
    className: `w-full border bg-panel/60 px-4 py-3 text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink3 focus:border-core focus:bg-panel ${
      error ? "border-alert" : "border-hairline hover:border-ink3"
    }`,
    dir: isLatin ? ("ltr" as const) : undefined,
    style: isLatin ? { textAlign: "left" as const, fontFamily: "var(--font-mono)" } : undefined,
    inputMode: type === "num" || type === "tel" ? ("numeric" as const) : undefined,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[14px] font-semibold">
        {label}
        {required && (
          <span className="mr-1 text-alert" aria-label="اجباری">
            *
          </span>
        )}
        {required === false && <span className="mr-2 text-[12px] font-normal text-ink3">(اختیاری)</span>}
      </label>

      {as === "textarea" ? (
        <textarea rows={5} {...shared} />
      ) : as === "select" ? (
        <select {...shared}>
          <option value="">{hint ?? "انتخاب کنید"}</option>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          {prefix && (
            <span className="mono pointer-events-none absolute inset-y-0 left-3 flex items-center text-[12px] text-ink3">
              {prefix}
            </span>
          )}
          <input type={inputType} {...shared} />
        </div>
      )}

      {hint && as !== "select" && !error && (
        <p id={`${id}-hint`} className="mt-2 text-[12.5px] text-ink3">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-2 flex items-center gap-1.5 text-[12.5px] text-alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 7v6M12 16.5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Checkbox
   ───────────────────────────────────────────── */
export function Check({
  id,
  label,
  checked,
  onChange,
  error,
}: {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 py-1.5 text-[14px] leading-relaxed">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-lift ${
            checked ? "border-core bg-core" : error ? "border-alert" : "border-hairline"
          }`}
        >
          {checked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M4 12.5l5 5L20 6.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="text-ink2">{label}</span>
      </label>
      {error && (
        <p role="alert" className="mr-8 text-[12.5px] text-alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Modal — the confirmation dialogs the documents ask for
   ("آیا از ثبت پروژه اطمینان دارید؟" and friends).
   Focus is trapped by the browser via the dialog role + Escape closes.
   ───────────────────────────────────────────── */
export function Modal({
  open,
  onClose,
  title,
  children,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ scale: 0.94, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-md border border-hairline bg-panel p-7"
          >
            <h2 className="text-[18px] font-bold leading-relaxed">{title}</h2>
            {children && <div className="mt-3 text-[14px] leading-loose text-ink2">{children}</div>}
            <div className="mt-7 flex flex-wrap gap-3">{actions}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   Numbered process rail — used by every page that shows a فرایند.
   One component so the step visual can never drift between pages.
   ───────────────────────────────────────────── */
export function ProcessRail({
  steps,
  current,
  cols = 3,
}: {
  steps: (string | { title: string; desc?: string })[];
  current?: number;
  cols?: 2 | 3 | 4;
}) {
  const grid = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" }[cols];
  return (
    <ol className={`relative grid gap-6 sm:grid-cols-2 ${grid}`}>
      {steps.map((s, i) => {
        const item = typeof s === "string" ? { title: s, desc: undefined } : s;
        const done = current !== undefined && i < current;
        const now = current === i;
        return (
          <li key={item.title} className="flex gap-4">
            <span
              className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors ${
                now ? "border-core bg-core text-white" : done ? "border-core/60 text-lift" : "border-hairline text-ink3"
              }`}
            >
              {now && <span aria-hidden className="pulse-ring absolute inset-0 rounded-full bg-core" />}
              <span className="mono relative text-[13px] font-bold">{fa(i + 1)}</span>
            </span>
            <div className="pt-1.5">
              <h3 className={`text-[15px] font-bold ${now ? "text-ink" : ""}`}>{item.title}</h3>
              {item.desc && <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink2">{item.desc}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
