import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "اتاق فرمان", description: "اتاق فرمان جایی است که تیم مدیریت پروژه و کنترل کیفیت کانتمو، مسیر هر پروژه را رصد می‌کند. معرفی اعضا و نقش هرکدام به‌زودی در این صفحه منتشر می‌شود." };

export default function Page() {
  return <Placeholder title="اتاق فرمان" subtitle="آشنایی با کانتمو و اعضای اتاق فرمان" desc="اتاق فرمان جایی است که تیم مدیریت پروژه و کنترل کیفیت کانتمو، مسیر هر پروژه را رصد می‌کند. معرفی اعضا و نقش هرکدام به‌زودی در این صفحه منتشر می‌شود." next={{ href: "/contact", label: "تماس با ما" }} />;
}
