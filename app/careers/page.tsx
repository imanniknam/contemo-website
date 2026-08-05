import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "فرصت‌های شغلی", description: "موقعیت‌های شغلی باز کانتمو در این صفحه منتشر می‌شود. اگر کارپذیر هستید و می‌خواهید پروژه بگیرید، مسیر شما ثبت‌نام کارپذیر است." };

export default function Page() {
  return <Placeholder title="فرصت‌های شغلی" subtitle="به تیم کانتمو بپیوندید" desc="موقعیت‌های شغلی باز کانتمو در این صفحه منتشر می‌شود. اگر کارپذیر هستید و می‌خواهید پروژه بگیرید، مسیر شما ثبت‌نام کارپذیر است." next={{ href: "/creators/apply", label: "ثبت‌نام کارپذیر" }} />;
}
