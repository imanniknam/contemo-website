import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "نمونه‌کارها", description: "گالری نمونه‌کارها با ذکر نوع خدمت، زمان تحویل و بازه هزینه در این صفحه منتشر می‌شود." };

export default function Page() {
  return <Placeholder title="نمونه‌کارها" subtitle="خروجی واقعی پروژه‌های اجراشده در کانتمو" desc="گالری نمونه‌کارها با ذکر نوع خدمت، زمان تحویل و بازه هزینه در این صفحه منتشر می‌شود." next={{ href: "/services", label: "خدمات کانتمو" }} />;
}
