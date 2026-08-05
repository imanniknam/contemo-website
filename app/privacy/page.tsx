import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "سیاست حفظ حریم خصوصی", description: "این سند توضیح می‌دهد کانتمو چه داده‌هایی را جمع‌آوری می‌کند، چرا به هرکدام نیاز دارد و چگونه از آن‌ها محافظت می‌شود. انتشار آن پیش از دریافت اطلاعات هویتی و بانکی الزامی است." };

export default function Page() {
  return <Placeholder title="سیاست حفظ حریم خصوصی" subtitle="چه اطلاعاتی جمع‌آوری می‌شود و چرا" desc="این سند توضیح می‌دهد کانتمو چه داده‌هایی را جمع‌آوری می‌کند، چرا به هرکدام نیاز دارد و چگونه از آن‌ها محافظت می‌شود. انتشار آن پیش از دریافت اطلاعات هویتی و بانکی الزامی است." next={{ href: "/matin", label: "تماس با پشتیبانی" }} />;
}
