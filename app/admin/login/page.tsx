import { redirect } from "next/navigation";
import { adminEnabled, isAdmin } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="mx-auto max-w-[420px]">
      <h1 className="display text-[clamp(1.6rem,3.5vw,2.2rem)]">ورود به پنل فانوس</h1>
      <p className="mt-3 text-[14.5px] leading-loose text-ink2">
        برای افزودن و ویرایش مقاله‌های فانوس، رمز مدیریت را وارد کنید.
      </p>
      {adminEnabled() ? (
        <LoginForm />
      ) : (
        <p role="alert" className="mt-8 border-e-2 border-alert bg-panel/50 px-5 py-4 text-[14.5px] leading-loose text-ink2">
          پنل هنوز فعال نشده است. متغیر محیطی <span className="mono" dir="ltr">ADMIN_PASSWORD</span> را روی سرور
          تنظیم کنید و دوباره اجرا کنید.
        </p>
      )}
    </div>
  );
}
