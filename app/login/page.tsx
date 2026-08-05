import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "ورود به پنل کاربری", description: "از طریق پنل کاربری می‌توانید تمام مراحل سفارش، اجرا و بازبینی پروژه‌های خود را دنبال کنید. فرم ورود در فاز بعدی توسعه فعال می‌شود." };

export default function Page() {
  return <Placeholder title="ورود به پنل کاربری" subtitle="پیگیری پروژه‌ها، تیکت‌ها و تسویه‌ها در یک جا" desc="از طریق پنل کاربری می‌توانید تمام مراحل سفارش، اجرا و بازبینی پروژه‌های خود را دنبال کنید. فرم ورود در فاز بعدی توسعه فعال می‌شود." next={{ href: "/start", label: "ثبت پروژه" }} />;
}
