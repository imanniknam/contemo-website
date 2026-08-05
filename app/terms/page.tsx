import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "شرایط استفاده از خدمات", description: "متن کامل شرایط استفاده از خدمات کانتمو در این صفحه منتشر می‌شود. این سند پیش از فعال‌سازی ثبت‌نام و پرداخت باید نهایی شود." };

export default function Page() {
  return <Placeholder title="شرایط استفاده از خدمات" subtitle="قوانین و مقررات همکاری با کانتمو" desc="متن کامل شرایط استفاده از خدمات کانتمو در این صفحه منتشر می‌شود. این سند پیش از فعال‌سازی ثبت‌نام و پرداخت باید نهایی شود." next={{ href: "/matin", label: "تماس با پشتیبانی" }} />;
}
