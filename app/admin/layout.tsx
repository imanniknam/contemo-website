import type { Metadata } from "next";

/** پنل ادمین نباید در موتور جست‌وجو بیاید. */
export const metadata: Metadata = {
  title: "پنل مدیریت فانوس",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[1100px] px-5 pb-24 pt-28 lg:px-8 lg:pt-36">{children}</div>;
}
