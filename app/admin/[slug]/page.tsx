import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { blocksToMarkup, faqToText } from "@/lib/post-markup";
import { getAdminEntries } from "@/lib/posts-store";
import PostForm, { type FormValues } from "../PostForm";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const entries = await getAdminEntries();
  const entry = entries.find((e) => e.post.slug === slug);
  if (!entry) notFound();
  const p = entry.post;

  const initial: FormValues = {
    originalSlug: p.slug,
    title: p.title,
    slug: p.slug,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    excerpt: p.excerpt,
    category: p.category,
    date: p.date,
    keywords: p.keywords.join("، "),
    heroArt: p.hero.art,
    heroAlt: p.hero.alt,
    answerQ: p.answer.q,
    answerA: p.answer.a,
    body: blocksToMarkup(p.blocks),
    faq: faqToText(p.faq),
    related: p.related.map((r) => r.href.replace("/lantern/", "")),
    draft: Boolean(p.draft),
  };

  return (
    <PostForm
      heading="ویرایش مقاله"
      initial={initial}
      others={entries.filter((e) => e.post.slug !== slug).map((e) => ({ slug: e.post.slug, title: e.post.title }))}
      slugLocked={entry.source !== "custom"}
      note={
        entry.source === "seed"
          ? "این مقاله جزو مقاله‌های اولیه‌ی سایت است. با ذخیره، نسخه‌ی ویرایش‌شده جایگزین می‌شود و با «بازگشت به اصلی» می‌توانید برگردید."
          : undefined
      }
    />
  );
}
