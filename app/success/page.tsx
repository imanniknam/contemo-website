import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "موفقیت با کانتمو", description: "این صفحه به نمونه‌های واقعی همکاری اختصاص دارد؛ هر داستان با نام برند، نوع پروژه و نتیجه‌ای که به دست آمده. تا زمان انتشار اولین داستان‌ها، می‌توانید پروژه خود را ثبت کنید." };

export default function Page() {
  return <Placeholder title="موفقیت با کانتمو" subtitle="داستان موفقیت کارفرماهایی که به ما اعتماد کرده‌اند" desc="این صفحه به نمونه‌های واقعی همکاری اختصاص دارد؛ هر داستان با نام برند، نوع پروژه و نتیجه‌ای که به دست آمده. تا زمان انتشار اولین داستان‌ها، می‌توانید پروژه خود را ثبت کنید." next={{ href: "/start", label: "ثبت پروژه" }} />;
}
