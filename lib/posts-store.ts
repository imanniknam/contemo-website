/**
 * ذخیره‌ی نوشته‌های فانوس که از پنل ادمین ثبت می‌شوند.
 *
 * نوشته‌های اولیه در `posts.ts` می‌مانند و فقط‌خواندنی‌اند. هرچه از پنل ثبت شود
 * در یک فایل JSON (پیش‌فرض `data/posts.json`) نوشته می‌شود و با هم ادغام می‌شوند:
 *   - اسلاگ جدید            → نوشته‌ی تازه
 *   - اسلاگ نوشته‌ی اولیه    → نسخه‌ی ویرایش‌شده جایگزین می‌شود؛ حذفش نسخه‌ی اصلی را برمی‌گرداند
 *
 * مسیر فایل با `POSTS_DATA_DIR` عوض می‌شود (برای Docker/VPS یک volume کنارش بگذارید).
 * این ذخیره‌سازی به دیسک ماندگار نیاز دارد؛ روی هاست‌های serverless کار نمی‌کند.
 */
import { promises as fs } from "fs";
import path from "path";
import { POSTS as SEED, type Post } from "./posts";

const DIR = process.env.POSTS_DATA_DIR ?? path.join(process.cwd(), "data");
const FILE = path.join(DIR, "posts.json");

export type Source = "seed" | "override" | "custom";
export type AdminEntry = { post: Post; source: Source };

async function readStored(): Promise<Post[]> {
  try {
    const data = JSON.parse(await fs.readFile(FILE, "utf8"));
    return Array.isArray(data) ? (data as Post[]) : [];
  } catch {
    return [];
  }
}

/** نوشتن‌ها پشت‌سرهم انجام می‌شوند تا دو ذخیره‌ی هم‌زمان همدیگر را خراب نکنند. */
let queue: Promise<unknown> = Promise.resolve();
function mutate(fn: (list: Post[]) => Post[]): Promise<void> {
  const run = queue.then(async () => {
    const next = fn(await readStored());
    await fs.mkdir(DIR, { recursive: true });
    const tmp = `${FILE}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
    await fs.rename(tmp, FILE);
  });
  queue = run.catch(() => {});
  return run;
}

const byDateDesc = (a: Post, b: Post) => b.date.localeCompare(a.date);

export async function getAdminEntries(): Promise<AdminEntry[]> {
  const stored = await readStored();
  const storedBySlug = new Map(stored.map((p) => [p.slug, p]));
  const seedSlugs = new Set(SEED.map((p) => p.slug));
  const entries: AdminEntry[] = SEED.map((p) =>
    storedBySlug.has(p.slug)
      ? { post: storedBySlug.get(p.slug)!, source: "override" as const }
      : { post: p, source: "seed" as const },
  );
  for (const p of stored) if (!seedSlugs.has(p.slug)) entries.push({ post: p, source: "custom" });
  return entries.sort((a, b) => byDateDesc(a.post, b.post));
}

export async function getAllPosts(): Promise<Post[]> {
  return (await getAdminEntries()).map((e) => e.post);
}

/** فقط نوشته‌های منتشرشده — چیزی که بازدیدکننده می‌بیند. */
export async function getPublicPosts(): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => !p.draft);
}

export async function getPublicPost(slug: string): Promise<Post | undefined> {
  return (await getPublicPosts()).find((p) => p.slug === slug);
}

export async function getAnyPost(slug: string): Promise<AdminEntry | undefined> {
  return (await getAdminEntries()).find((e) => e.post.slug === slug);
}

export const savePost = (post: Post) =>
  mutate((list) => [...list.filter((p) => p.slug !== post.slug), post]);

export const deleteStoredPost = (slug: string) => mutate((list) => list.filter((p) => p.slug !== slug));
