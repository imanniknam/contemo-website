import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import ArcPanel from "@/components/ArcPanel";
import ArticleArt from "@/components/lantern/Art";
import { Button } from "@/components/ui";
import { POSTS, getPost, type Block } from "@/lib/posts";
import { fa } from "@/lib/fa";

const SITE = "https://contemo.ir";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `${SITE}/lantern/${post.slug}`;
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.metaTitle,
      description: post.metaDescription,
      publishedTime: post.date,
      section: post.category,
      tags: post.keywords,
    },
  };
}

/* ─────────────────────────────────────────────
   متن درون‌خطی: تنها نشانه‌گذاری مجاز `**bold**` است.
   محتوا هرگز به‌صورت HTML خام رندر نمی‌شود.
   ───────────────────────────────────────────── */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((chunk, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-bold text-ink">
            {chunk}
          </strong>
        ) : (
          <Fragment key={i}>{chunk}</Fragment>
        ),
      )}
    </>
  );
}

function Body({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h2":
            return (
              <h2
                key={i}
                id={b.id}
                className="display mt-14 scroll-mt-24 border-t border-hairline pt-7 text-[clamp(1.35rem,2.8vw,1.8rem)]"
              >
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-10 text-[17px] font-bold leading-snug text-ink">
                {b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="mt-4 text-[15.5px] leading-loose text-ink2">
                <Rich text={b.text} />
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="mt-5 space-y-2.5">
                {b.items.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-[15px] leading-loose text-ink2">
                    <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-beacon" />
                    <span>
                      <Rich text={it} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "note":
            return (
              <p
                key={i}
                className="mt-7 border-e-2 border-beacon bg-panel/50 px-5 py-4 text-[15px] leading-loose text-ink2"
              >
                <Rich text={b.text} />
              </p>
            );
          case "figure":
            return <ArticleArt key={i} art={b.art} alt={b.alt} caption={b.caption} />;
        }
      })}
    </>
  );
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SITE}/lantern/${post.slug}`;
  const toc = post.blocks.filter(
    (b): b is Extract<Block, { t: "h2" }> => b.t === "h2",
  );

  /* اسکیما: مقاله + پرسش‌های متداول + مسیر راهنما.
     در یک @graph تا موتور جست‌وجو هر سه را به یک صفحه نسبت دهد. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.metaDescription,
        inLanguage: "fa-IR",
        datePublished: post.date,
        dateModified: post.date,
        articleSection: post.category,
        keywords: post.keywords.join("، "),
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@type": "Organization", name: "کانتمو", url: SITE },
        publisher: { "@type": "Organization", name: "کانتمو", url: SITE },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: [
          { q: post.answer.q, a: post.answer.a },
          ...post.faq,
        ].map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "کانتمو", item: SITE },
          { "@type": "ListItem", position: 2, name: "فانوس", item: `${SITE}/lantern` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // داده‌ی ساختاریافته از `posts.ts` می‌آید و ورودی کاربر در آن راه ندارد.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-[1280px] px-5 pt-24 pb-20 lg:px-8 lg:pt-[104px]">
        {/* مسیر راهنما */}
        <nav aria-label="مسیر صفحه" className="label flex flex-wrap items-center gap-2">
          <Link href="/lantern" className="transition-colors hover:text-beacon">
            فانوس
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink3">{post.category}</span>
        </nav>

        <header className="mt-6 max-w-[46ch]">
          <h1 className="display text-[clamp(1.8rem,4vw,2.9rem)]">{post.title}</h1>
          <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink3">
            <time dateTime={post.date}>{post.dateFa}</time>
            <span aria-hidden>•</span>
            <span>حدود {fa(post.readingMinutes)} دقیقه مطالعه</span>
          </p>
        </header>

        <div className="mt-10 grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            {/* تصویر شاخص */}
            <ArticleArt art={post.hero.art} alt={post.hero.alt} />

            {/* پاسخ کوتاه — همان چیزی که برای Featured Snippet نوشته شده */}
            <ArcPanel corner="tl" radius={24}>
              <div className="p-6 lg:p-7">
                <h2 className="text-[16px] font-bold text-beacon">{post.answer.q}</h2>
                <p className="mt-3 text-[15px] leading-loose text-ink2">{post.answer.a}</p>
              </div>
            </ArcPanel>

            <div className="mt-10">
              <Body blocks={post.blocks} />
            </div>

            {/* فراخوان */}
            <ArcPanel corner="tr" radius={28} className="mt-14">
              <div className="grid gap-6 p-7 lg:grid-cols-[1.4fr_auto] lg:items-center lg:p-9">
                <div>
                  <h2 className="display text-[clamp(1.25rem,2.6vw,1.7rem)]">
                    برای پروژه‌تان متخصص مناسب پیدا کنید
                  </h2>
                  <p className="mt-3 max-w-[52ch] text-[14.5px] leading-loose text-ink2">
                    پروژه خود را در کانتمو ثبت کنید، نیازها و جزئیات کار را مشخص کنید و از میان
                    متخصص‌ها، گزینه مناسب پروژه خود را انتخاب کنید.
                  </p>
                </div>
                <Button href="/start">ثبت پروژه در کانتمو</Button>
              </div>
            </ArcPanel>

            {/* سوالات متداول */}
            <section className="mt-16">
              <h2 className="display border-t border-hairline pt-7 text-[clamp(1.35rem,2.8vw,1.8rem)]">
                سوالات متداول
              </h2>
              <dl className="mt-7 divide-y divide-hairline border-y border-hairline">
                {post.faq.map((f) => (
                  <div key={f.q} className="py-6">
                    <dt className="text-[15.5px] font-bold leading-snug text-ink">{f.q}</dt>
                    <dd className="mt-3 text-[15px] leading-loose text-ink2">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          {/* ستون کناری — فهرست مطالب */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav aria-labelledby="toc-title" className="border-t border-hairline pt-6">
              <h2 id="toc-title" className="label">
                در این مقاله می‌خوانید
              </h2>
              <ol className="mt-4 space-y-3">
                {toc.map((h, i) => (
                  <li key={h.id} className="flex gap-3 text-[13.5px] leading-relaxed">
                    <span className="mono shrink-0 pt-px text-[12px] text-ink3">
                      {fa(String(i + 1).padStart(2, "0"))}
                    </span>
                    <a href={`#${h.id}`} className="text-ink2 transition-colors hover:text-beacon">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-10 border-t border-hairline pt-6">
              <h2 className="label">ادامه‌ی مسیر</h2>
              <ul className="mt-4 space-y-3">
                {post.related.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="text-[13.5px] text-ink2 transition-colors hover:text-beacon"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
