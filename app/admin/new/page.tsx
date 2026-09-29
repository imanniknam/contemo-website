import { requireAdmin } from "@/lib/admin-auth";
import { getAdminEntries } from "@/lib/posts-store";
import PostForm, { type FormValues } from "../PostForm";

export default async function NewPostPage() {
  await requireAdmin();
  const others = (await getAdminEntries()).map((e) => ({ slug: e.post.slug, title: e.post.title }));
  const today = new Date().toISOString().slice(0, 10);

  const initial: FormValues = {
    originalSlug: "",
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    excerpt: "",
    category: "ابزارها و روش‌های حرفه‌ای شدن",
    date: today,
    keywords: "",
    heroArt: "compare",
    heroAlt: "",
    answerQ: "",
    answerA: "",
    body: "",
    faq: "",
    related: [],
    draft: false,
  };

  return <PostForm heading="مقاله‌ی جدید" initial={initial} others={others} slugLocked={false} allowImport />;
}
