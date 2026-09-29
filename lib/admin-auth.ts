/**
 * ورود به پنل ادمین: یک رمز واحد از متغیر محیطی `ADMIN_PASSWORD`.
 *
 * نشست یک کوکی httpOnly است که با HMAC امضا شده و تاریخ انقضا دارد؛ سمت سرور
 * چیزی ذخیره نمی‌شود. `ADMIN_SECRET` (اختیاری) کلید امضاست؛ اگر نباشد از رمز مشتق می‌شود
 * — پس عوض‌کردن رمز همه‌ی نشست‌های قبلی را باطل می‌کند.
 *
 * هر Server Action باید خودش `requireAdmin()` را صدا بزند؛ کوکی روی خود صفحه‌ها کافی نیست
 * چون اکشن‌ها مستقیم با POST هم قابل فراخوانی‌اند.
 */
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "contemo_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

export const adminEnabled = () => Boolean(process.env.ADMIN_PASSWORD);

function key(): string {
  const pw = process.env.ADMIN_PASSWORD ?? "";
  return process.env.ADMIN_SECRET ?? crypto.createHash("sha256").update(`contemo-admin:${pw}`).digest("hex");
}

const sign = (payload: string) => crypto.createHmac("sha256", key()).update(payload).digest("hex");

function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminEnabled()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function startSession(password: string): Promise<boolean> {
  if (!adminEnabled() || !safeEqual(password, process.env.ADMIN_PASSWORD!)) {
    await new Promise((r) => setTimeout(r, 900)); // کند کردن حدس‌زدن رمز
    return false;
  }
  const exp = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
