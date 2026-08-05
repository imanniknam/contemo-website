import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "رویدادها", description: "کانتمو با برگزاری رویدادها و کارگاه‌های تخصصی، مسیر پیشرفت کارپذیران را هموار می‌کند. تقویم رویدادها به‌زودی در این صفحه قرار می‌گیرد." };

export default function Page() {
  return <Placeholder title="رویدادها" subtitle="کارگاه‌ها و رویدادهای تخصصی کانتمو" desc="کانتمو با برگزاری رویدادها و کارگاه‌های تخصصی، مسیر پیشرفت کارپذیران را هموار می‌کند. تقویم رویدادها به‌زودی در این صفحه قرار می‌گیرد." next={{ href: "/lantern", label: "فانوس" }} />;
}
