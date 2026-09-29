/**
 * قالب ساده‌ی نوشتن مقاله در پنل ادمین ↔ بلوک‌های `Block` در `posts.ts`.
 *
 * کارفرما هیچ HTMLی نمی‌نویسد؛ فقط این نشانه‌ها:
 *
 *   ## تیتر اصلی           → h2   (برای شناسه‌ی دلخواه:  ## تیتر {#my-id})
 *   ### زیرتیتر            → h3
 *   - مورد لیست            → ul   (خطوط پشت‌سرهم یک لیست‌اند)
 *   > نکته‌ی ویژه          → note
 *   **متن پررنگ**          → درون‌خطی
 *   [[figure: art | alt | caption]]  → تصویر
 *   بقیه‌ی خطوط             → پاراگراف (خط خالی پاراگراف‌ها را جدا می‌کند)
 */
import type { Art, Block } from "./posts";

export const ARTS: Art[] = ["compare", "cost", "capacity", "pricing", "steps", "brief", "mistakes"];

const isArt = (s: string): s is Art => (ARTS as string[]).includes(s);

export function markupToBlocks(text: string): Block[] {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let h2n = 0;

  const flushPara = () => {
    if (para.length) blocks.push({ t: "p", text: para.join(" ").replace(/\s+/g, " ").trim() });
    para = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ t: "ul", items: list });
    list = [];
  };
  const flush = () => {
    flushPara();
    flushList();
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^###\s+(.+)$/))) {
      flush();
      blocks.push({ t: "h3", text: m[1].trim() });
    } else if ((m = line.match(/^##\s+(.+?)(?:\s*\{#([\w-]+)\})?$/))) {
      flush();
      blocks.push({ t: "h2", id: m[2] ?? `s${++h2n}`, text: m[1].trim() });
    } else if ((m = line.match(/^>\s*(.+)$/))) {
      flush();
      blocks.push({ t: "note", text: m[1].trim() });
    } else if ((m = line.match(/^\[\[figure:\s*(.*?)\]\]$/i))) {
      flush();
      const [art, alt = "", caption = ""] = m[1].split("|").map((s) => s.trim());
      if (isArt(art)) blocks.push({ t: "figure", art, alt, caption });
    } else if ((m = line.match(/^[-*•]\s+(.+)$/))) {
      flushPara();
      list.push(m[1].trim());
    } else {
      flushList();
      para.push(line);
    }
  }
  flush();
  return blocks;
}

export function blocksToMarkup(blocks: Block[]): string {
  const out: string[] = [];
  let h2n = 0;
  for (const b of blocks) {
    switch (b.t) {
      case "p":
        out.push(b.text);
        break;
      case "h2": {
        h2n++;
        out.push(b.id === `s${h2n}` ? `## ${b.text}` : `## ${b.text} {#${b.id}}`);
        break;
      }
      case "h3":
        out.push(`### ${b.text}`);
        break;
      case "ul":
        out.push(b.items.map((i) => `- ${i}`).join("\n"));
        break;
      case "note":
        out.push(`> ${b.text}`);
        break;
      case "figure":
        out.push(`[[figure: ${b.art} | ${b.alt} | ${b.caption}]]`);
        break;
    }
  }
  return out.join("\n\n");
}

/** پرسش و پاسخ‌ها: هر جفت یک خط پرسش + خط(های) پاسخ، بین جفت‌ها خط خالی. */
export function parseFaq(text: string): { q: string; a: string }[] {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((chunk) => chunk.split("\n").map((l) => l.trim()).filter(Boolean))
    .filter((l) => l.length >= 2)
    .map(([q, ...a]) => ({ q, a: a.join(" ") }));
}

export const faqToText = (faq: { q: string; a: string }[]) =>
  faq.map((f) => `${f.q}\n${f.a}`).join("\n\n");

export function countWords(blocks: Block[]): number {
  return blocks
    .map((b) => ("text" in b ? b.text : b.t === "ul" ? b.items.join(" ") : ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}
