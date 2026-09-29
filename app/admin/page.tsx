import Link from "next/link";
import { logoutAction, deletePostAction } from "./actions";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminEntries, type Source } from "@/lib/posts-store";
import { Button } from "@/components/ui";

const SOURCE_LABEL: Record<Source, string> = {
  seed: "اولیه‌ی سایت",
  override: "ویرایش‌شده",
  custom: "افزوده‌شده از پنل",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  await requireAdmin();
  const { saved, deleted } = await searchParams;
  const entries = await getAdminEntries();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[clamp(1.6rem,3.5vw,2.2rem)]">مقاله‌های فانوس</h1>
          <p className="mt-2 text-[14px] text-ink2">{entries.length.toLocaleString("fa-IR")} مقاله</p>
        </div>
        <div className="flex items-center gap-3">
          <Button href="/admin/new">مقاله‌ی جدید</Button>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost">
              خروج
            </Button>
          </form>
        </div>
      </div>

      {saved && (
        <p role="status" className="mt-6 border-e-2 border-signal bg-panel/50 px-5 py-3 text-[14px] text-ink2">
          مقاله ذخیره شد و روی سایت اعمال شد.{" "}
          <Link href={`/lantern/${saved}`} className="font-semibold text-lift underline underline-offset-4">
            دیدن مقاله
          </Link>
        </p>
      )}
      {deleted && (
        <p role="status" className="mt-6 border-e-2 border-beacon bg-panel/50 px-5 py-3 text-[14px] text-ink2">
          تغییرات مقاله حذف شد.
        </p>
      )}

      <ul className="mt-8 divide-y divide-hairline border-y border-hairline">
        {entries.map(({ post, source }) => (
          <li key={post.slug} className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div className="min-w-0 flex-1 basis-[340px]">
              <p className="text-[15.5px] font-bold leading-snug">{post.title}</p>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-ink3">
                <span dir="ltr" className="mono">
                  /lantern/{post.slug}
                </span>
                <span>{post.dateFa}</span>
                <span>{SOURCE_LABEL[source]}</span>
                <span className={post.draft ? "font-semibold text-beacon" : "text-signal"}>
                  {post.draft ? "پیش‌نویس" : "منتشر شده"}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-[13.5px]">
              {!post.draft && (
                <Link href={`/lantern/${post.slug}`} className="px-3 py-2 text-ink2 hover:text-ink">
                  مشاهده
                </Link>
              )}
              <Link
                href={`/admin/${post.slug}`}
                className="border border-hairline px-4 py-2 font-semibold hover:border-core hover:bg-core hover:text-white"
              >
                ویرایش
              </Link>
              {source !== "seed" && (
                <form action={deletePostAction}>
                  <input type="hidden" name="slug" value={post.slug} />
                  <button
                    type="submit"
                    className="px-3 py-2 text-alert hover:underline"
                    title={source === "override" ? "بازگشت به نسخه‌ی اصلی" : "حذف مقاله"}
                  >
                    {source === "override" ? "بازگشت به اصلی" : "حذف"}
                  </button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
