"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { endSession, requireAdmin, startSession } from "@/lib/admin-auth";
import { importGoogleDoc, type ImportedDoc } from "@/lib/gdoc-import";
import { countWords, markupToBlocks, parseFaq, ARTS } from "@/lib/post-markup";
import { deleteStoredPost, getAdminEntries, getAnyPost, savePost } from "@/lib/posts-store";
import type { Art, Post } from "@/lib/posts";

export type FormResult = { error?: string };

/* ───────────── ورود / خروج ───────────── */

export async function loginAction(_prev: FormResult, fd: FormData): Promise<FormResult> {
  const ok = await startSession(String(fd.get("password") ?? ""));
  if (!ok) return { error: "رمز عبور درست نیست." };
  redirect("/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

/* ───────────── ورود از گوگل‌داک ───────────── */

export type ImportResult =
  | { ok: true; doc: ImportedDoc; relatedSlugs: string[] }
  | { ok: false; error: string };

const norm = (s: string) => s.replace(/[؟?،؛:\s‌]/g, "").slice(0, 22);

export async function importDocAction(url: string): Promise<ImportResult> {
  await requireAdmin();
  try {
    const doc = await importGoogleDoc(url);
    const entries = await getAdminEntries();
    const relatedSlugs = doc.internalTitles
      .map((t) => entries.find((e) => e.post.slug !== doc.slug && norm(e.post.title) === norm(t))?.post.slug)
      .filter((s): s is string => Boolean(s));
    return { ok: true, doc, relatedSlugs };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "ورود سند ناموفق بود." };
  }
}

/* ───────────── ذخیره / حذف ───────────── */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED = new Set(["new", "login"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const dateFa = (iso: string) =>
  new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric" }).format(
    new Date(`${iso}T12:00:00Z`),
  );

function refresh() {
  revalidatePath("/lantern");
  revalidatePath("/lantern/[slug]", "page");
  revalidatePath("/admin");
}

export async function savePostAction(_prev: FormResult, fd: FormData): Promise<FormResult> {
  await requireAdmin();
  const s = (k: string) => String(fd.get(k) ?? "").trim();

  const originalSlug = s("originalSlug");
  const title = s("title");
  const slug = s("slug").toLowerCase();
  const excerpt = s("excerpt");
  const body = String(fd.get("body") ?? "");
  const date = s("date");

  if (!title) return { error: "عنوان مقاله را بنویسید." };
  if (RESERVED.has(slug)) return { error: "این اسلاگ رزرو شده است؛ اسلاگ دیگری انتخاب کنید." };
  if (!SLUG_RE.test(slug)) return { error: "اسلاگ فقط حروف کوچک انگلیسی، عدد و خط‌تیره می‌پذیرد؛ مثل my-new-post." };
  if (!excerpt) return { error: "خلاصه‌ی مقاله (نمایش در فهرست) را بنویسید." };
  if (!DATE_RE.test(date) || Number.isNaN(Date.parse(date))) return { error: "تاریخ انتشار معتبر نیست." };

  const blocks = markupToBlocks(body);
  if (blocks.length === 0) return { error: "متن مقاله خالی است." };

  const entries = await getAdminEntries();
  const original = originalSlug ? entries.find((e) => e.post.slug === originalSlug) : undefined;
  if (originalSlug && !original) return { error: "مقاله‌ای که ویرایش می‌کردید دیگر وجود ندارد." };
  if (original?.source !== "custom" && originalSlug && slug !== originalSlug)
    return { error: "اسلاگ مقاله‌های اولیه‌ی سایت قابل تغییر نیست." };
  if (slug !== originalSlug && entries.some((e) => e.post.slug === slug))
    return { error: "این اسلاگ قبلاً برای مقاله‌ی دیگری استفاده شده است." };

  const all = new Map(entries.map((e) => [e.post.slug, e.post]));
  const related = fd
    .getAll("related")
    .map(String)
    .filter((r) => r !== slug && all.has(r))
    .map((r) => ({ title: all.get(r)!.title, href: `/lantern/${r}` }));

  const art = (ARTS as string[]).includes(s("heroArt")) ? (s("heroArt") as Art) : "compare";
  const metaDescription = s("metaDescription") || excerpt;

  const post: Post = {
    slug,
    title,
    metaTitle: s("metaTitle") || title,
    metaDescription,
    excerpt,
    category: s("category") || "ابزارها و روش‌های حرفه‌ای شدن",
    date,
    dateFa: dateFa(date),
    readingMinutes: Math.max(1, Math.round(countWords(blocks) / 200)),
    keywords: s("keywords").split(/[،,\n]/).map((k) => k.trim()).filter(Boolean),
    hero: { art, alt: s("heroAlt") || title },
    answer: { q: s("answerQ") || title, a: s("answerA") || excerpt },
    blocks,
    faq: parseFaq(String(fd.get("faq") ?? "")),
    related,
    ...(fd.get("draft") === "on" ? { draft: true } : {}),
  };

  await savePost(post);
  if (original?.source === "custom" && originalSlug !== slug) await deleteStoredPost(originalSlug);
  refresh();
  redirect(`/admin?saved=${encodeURIComponent(slug)}`);
}

export async function deletePostAction(fd: FormData) {
  await requireAdmin();
  const slug = String(fd.get("slug") ?? "");
  const entry = await getAnyPost(slug);
  // مقاله‌ی اولیه‌ی ویرایش‌نشده چیزی در فایل ندارد که حذف شود.
  if (entry && entry.source !== "seed") await deleteStoredPost(slug);
  refresh();
  redirect(`/admin?deleted=${encodeURIComponent(slug)}`);
}
