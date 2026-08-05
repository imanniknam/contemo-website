import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "لیست کامل مهارت‌های کانتمو", description: "فهرست کامل مهارت‌های نوشتاری، صوتی، گرافیکی، ویدئویی و سایر مهارت‌ها، همراه با نمونه تسک مهارت‌سنجی هر کدام، در این صفحه قرار می‌گیرد." };

export default function Page() {
  return <Placeholder title="لیست کامل مهارت‌های کانتمو" subtitle="همه مهارت‌هایی که در کانتمو پروژه دارند" desc="فهرست کامل مهارت‌های نوشتاری، صوتی، گرافیکی، ویدئویی و سایر مهارت‌ها، همراه با نمونه تسک مهارت‌سنجی هر کدام، در این صفحه قرار می‌گیرد." next={{ href: "/creators/apply", label: "ثبت‌نام کارپذیر" }} />;
}
