import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "راهنمای استفاده از کانتمو", description: "راهنمای تصویری کار با پنل کاربری، ثبت پروژه و پیگیری وضعیت، به‌زودی در این صفحه در دسترس قرار می‌گیرد." };

export default function Page() {
  return <Placeholder title="راهنمای استفاده از کانتمو" subtitle="از ثبت پروژه تا تحویل، مرحله به مرحله" desc="راهنمای تصویری کار با پنل کاربری، ثبت پروژه و پیگیری وضعیت، به‌زودی در این صفحه در دسترس قرار می‌گیرد." next={{ href: "/matin#faq", label: "سوالات متداول" }} />;
}
