/**
 * ورود مقاله از گوگل‌داک عمومی («هر کسی با لینک می‌تواند ببیند»).
 *
 * سند را به‌صورت HTML خروجی می‌گیرد و به فیلدهای فرم تبدیل می‌کند. سندهای
 * فانوس ساختار ثابتی دارند: جدول «بریف سئو» (عنوان، متا، اسلاگ، کلمات کلیدی،
 * Featured Snippet، Alt تصاویر) در ابتدا، سپس H1، بدنه و بخش «سوالات متداول».
 * سند بدون جدول بریف هم پذیرفته می‌شود؛ فقط فیلدهای سئو خالی می‌مانند.
 *
 * فقط آدرس docs.google.com پذیرفته می‌شود تا سرور نتواند به مقصد دلخواهی درخواست بزند.
 */
import { blocksToMarkup, faqToText } from "./post-markup";
import type { Block } from "./posts";

export type ImportedDoc = {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  keywords: string;
  heroAlt: string;
  body: string;
  faq: string;
  internalTitles: string[];
};

const NAMED: Record<string, string> = {
  laquo: "«", raquo: "»", mdash: "—", ndash: "–", rarr: "→", larr: "←", times: "×", hellip: "…",
  ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’", middot: "·", bull: "•", copy: "©",
};

const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&zwnj;/g, "‌")
    .replace(/&nbsp;/g, " ")
    .replace(/&([a-z]+);/gi, (m, n: string) => NAMED[n.toLowerCase()] ?? m)
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const clean = (s: string) =>
  s
    .replace(/پروژه پروژه/g, "پروژه") // آسیب رایج جایگزینی متن در سندها
    .replace(/[ \t ]+/g, " ")
    .replace(/\*\*\s*\*\*/g, " ")
    .replace(/\*\*(\s*)([^*]*?)(\s*)\*\*/g, "$1**$2**$3")
    .replace(/ +/g, " ")
    .trim();

export function docIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (u.protocol !== "https:" || u.hostname !== "docs.google.com") return null;
    return u.pathname.match(/^\/document\/d\/([\w-]+)/)?.[1] ?? null;
  } catch {
    return null;
  }
}

export async function importGoogleDoc(url: string): Promise<ImportedDoc> {
  const id = docIdFromUrl(url);
  if (!id) throw new Error("لینک باید یک گوگل‌داک باشد (docs.google.com/document/d/…).");

  const res = await fetch(`https://docs.google.com/document/d/${id}/export?format=html`, {
    signal: AbortSignal.timeout(20_000),
    cache: "no-store",
  });
  if (!res.ok || !(res.headers.get("content-type") ?? "").includes("html"))
    throw new Error("سند خوانده نشد. دسترسی آن را روی «هر کسی که لینک را دارد (Viewer)» بگذارید.");
  const html = await res.text();
  if (html.length > 6_000_000) throw new Error("سند بیش‌ازحد بزرگ است.");
  return parseDocHtml(html);
}

export function parseDocHtml(html: string): ImportedDoc {
  const css = html.match(/<style[\s\S]*?<\/style>/)?.[0] ?? "";
  const boldClasses = new Set(
    [...css.matchAll(/\.(c\d+)\{([^}]*)\}/g)].filter((m) => /font-weight:700/.test(m[2])).map((m) => m[1]),
  );
  const body = html.slice(html.indexOf("<body"));

  const inline = (h: string, keepBold = true) => {
    let out = h.replace(/<br\s*\/?>/g, " ");
    out = out.replace(/<span class="([^"]*)">([\s\S]*?)<\/span>/g, (_, cls: string, inner: string) =>
      keepBold && cls.split(/\s+/).some((c) => boldClasses.has(c)) ? `**${inner}**` : inner,
    );
    return clean(decode(out.replace(/<a [^>]*>([\s\S]*?)<\/a>/g, "$1").replace(/<[^>]+>/g, "")));
  };
  const cellText = (c: string) =>
    [...c.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((p) => inline(p[1], false)).filter(Boolean);

  const els = [...body.matchAll(/<(table|h1|h2|h3|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => ({
    tag: m[1],
    inner: m[2],
  }));

  // جدول بریف: اولین جدولِ پیش از H1
  const h1i = els.findIndex((e) => e.tag === "h1");
  const briefEl = els.slice(0, h1i < 0 ? els.length : h1i).find((e) => e.tag === "table");
  const brief: Record<string, string> = {};
  if (briefEl) {
    for (const row of briefEl.inner.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)) {
      const cells = [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((c) => cellText(c[1]).join("\n"));
      if (cells.length >= 2) brief[cells[0]] = cells.slice(1).join("\n");
    }
  }
  const get = (k: string) => {
    const norm = (s: string) => s.toLowerCase().replace(/\s/g, "");
    const key = Object.keys(brief).find((x) => norm(x) === norm(k));
    return key ? brief[key] : "";
  };

  const blocks: Block[] = [];
  const faqTexts: string[] = [];
  let inFaq = false;
  let n = 0;
  let h1Title = "";
  for (const e of els.slice(h1i + 1)) {
    if (e === briefEl) continue;
    if (e.tag === "h2" || e.tag === "h3") {
      const text = inline(e.inner, false);
      if (!text) continue;
      if (e.tag === "h2" && /^(سوالات|سؤالات|پرسش‌?های)/.test(text)) {
        inFaq = true;
        continue;
      }
      if (inFaq) faqTexts.push(text);
      else if (e.tag === "h2") blocks.push({ t: "h2", id: `s${++n}`, text });
      else blocks.push({ t: "h3", text });
    } else if (e.tag === "p") {
      if (inFaq) {
        e.inner
          .split(/<br\s*\/?>/)
          .map((x) => inline(x, false).replace(/\*\*/g, ""))
          .filter(Boolean)
          .forEach((x) => faqTexts.push(x));
      } else {
        const text = inline(e.inner);
        if (text && text !== "**") blocks.push({ t: "p", text });
      }
    } else if ((e.tag === "ul" || e.tag === "ol") && !inFaq) {
      const items = [...e.inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((li) => inline(li[1])).filter(Boolean);
      if (items.length) blocks.push({ t: "ul", items });
    } else if (e.tag === "table" && !inFaq) {
      // بلوک جدول نداریم؛ هر ردیف یک آیتم لیست می‌شود.
      const rows = [...e.inner.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map((r) =>
        [...r[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((c) => cellText(c[1]).join(" ")),
      );
      const [head, ...data] = rows;
      if (head && data.length)
        blocks.push({
          t: "ul",
          items: data.map(
            (r) => `**${r[0]}:** ${r.slice(1).map((c, i) => `${head[i + 1]}: ${c}`).join("؛ ")}`,
          ),
        });
    }
  }
  if (h1i >= 0) h1Title = inline(els[h1i].inner, false);

  const faq: { q: string; a: string }[] = [];
  for (let i = 0; i + 1 < faqTexts.length; i += 2) faq.push({ q: faqTexts[i], a: faqTexts[i + 1] });

  const snippetLines = get("Featured Snippet").split("\n").map((x) => x.trim()).filter(Boolean);
  if (snippetLines.length > 1 && /؟$/.test(snippetLines[0])) snippetLines.shift();
  const snippet = snippetLines.join(" ");

  const keywords = [get("کلمه کلیدی اصلی"), ...get("کلمات کلیدی فرعی").split(/[،,\n]/)]
    .map((s) => s.trim())
    .filter(Boolean);
  const alt = [...get("تصاویر به همراه ALt").matchAll(/Alt(?: Text)?:\s*(.+)/gi)][0]?.[1]?.trim() ?? "";

  return {
    title: clean(get("عنوان مقاله") || h1Title),
    slug: get("URL Slug").trim().toLowerCase(),
    metaTitle: get("Meta Title").replace(/\s*\|\s*کانتمو\s*$/, "").replace(/؟\|/, "؟ |").trim(),
    metaDescription: get("Meta Description").trim(),
    excerpt: shortSentences(snippet),
    keywords: keywords.join("، "),
    heroAlt: alt,
    body: blocksToMarkup(blocks),
    faq: faqToText(faq),
    internalTitles: get("لینک‌سازی داخلی").split("\n").map((s) => s.replace(/^-\s*/, "").trim()).filter(Boolean),
  };
}

/** خلاصه‌ی فهرست: جمله‌های اول تا حدود ۲۳۰ نویسه. */
function shortSentences(t: string): string {
  let out = "";
  for (const s of t.split(/(?<=[.؟!])\s+/)) {
    if (out && `${out} ${s}`.length > 230) break;
    out = `${out} ${s}`.trim();
  }
  return out;
}
