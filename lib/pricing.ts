/**
 * SINGLE SOURCE OF PRICING TRUTH.
 *
 * Audit finding IA-05: the spec had a standalone "برآورد هزینه" page *and*
 * a live estimate inside the project form. Two implementations drift, and a
 * price that differs between two screens is the fastest way to lose trust.
 * Both surfaces import from here. One engine, two views.
 *
 * Finding OR-04: the estimate must be decomposable. `breakdown()` returns
 * every contributing line so the UI can show *why* the number is what it is.
 */

export type ContentKind = "text" | "visual" | "audio" | "video";

export interface Category {
  id: ContentKind;
  title: string;
  blurb: string;
  /** Toman, before any multiplier. */
  base: number;
  /** Working days at standard urgency. */
  baseDays: number;
  types: { id: string; label: string; mult: number; days: number }[];
}

export const CATEGORIES: Category[] = [
  {
    id: "text",
    title: "محتوای متنی",
    blurb: "مقاله، رپورتاژ، سناریو، کپی‌رایتینگ، ترجمه و بازنویسی",
    base: 1_200_000,
    baseDays: 3,
    types: [
      { id: "blog", label: "بلاگ", mult: 1, days: 0 },
      { id: "report", label: "رپورتاژ", mult: 1.35, days: 1 },
      { id: "script", label: "سناریونویسی", mult: 1.6, days: 2 },
      { id: "copy", label: "کپی‌رایتینگ", mult: 1.9, days: 2 },
      { id: "translate", label: "ترجمه", mult: 1.25, days: 1 },
    ],
  },
  {
    id: "visual",
    title: "محتوای تصویری",
    blurb: "پوستر، هویت بصری، اینفوگرافیک، بسته‌بندی و تصویرسازی",
    base: 2_400_000,
    baseDays: 5,
    types: [
      { id: "poster", label: "پوستر", mult: 1, days: 0 },
      { id: "catalog", label: "کاتالوگ", mult: 1.8, days: 4 },
      { id: "logo", label: "لوگو", mult: 2.2, days: 5 },
      { id: "identity", label: "هویت بصری", mult: 3.2, days: 9 },
      { id: "infographic", label: "اینفوگرافیک", mult: 1.5, days: 2 },
      { id: "social", label: "تصاویر شبکه‌های اجتماعی", mult: 1.7, days: 3 },
    ],
  },
  {
    id: "audio",
    title: "محتوای صوتی",
    blurb: "پادکست، گویندگی، صداگذاری و کتاب صوتی",
    base: 1_800_000,
    baseDays: 4,
    types: [
      { id: "podcast", label: "قسمت پادکست", mult: 1, days: 0 },
      { id: "voice", label: "گویندگی تیزر", mult: .8, days: -1 },
      { id: "dub", label: "دوبله و صداگذاری", mult: 1.6, days: 3 },
      { id: "audiobook", label: "کتاب صوتی", mult: 3.4, days: 12 },
    ],
  },
  {
    id: "video",
    title: "محتوای ویدئویی",
    blurb: "تیزر، موشن‌گرافیک، ویدیو آموزشی و محتوای شبکه‌های اجتماعی",
    base: 4_600_000,
    baseDays: 7,
    types: [
      { id: "teaser", label: "تیزر تبلیغاتی", mult: 1, days: 0 },
      { id: "motion", label: "موشن‌گرافیک", mult: 1.4, days: 3 },
      { id: "tutorial", label: "ویدیو آموزشی", mult: 1.2, days: 2 },
      { id: "reels", label: "ست ریلز و شورت", mult: .9, days: -2 },
      { id: "doc", label: "ویدیو مستند برند", mult: 2.6, days: 10 },
    ],
  },
];

export const VOLUMES = [
  { id: "s", label: "کم", note: "یک قلم", mult: 1 },
  { id: "m", label: "متوسط", note: "۳ تا ۵ قلم", mult: 2.6 },
  { id: "l", label: "زیاد", note: "۱۰ قلم و بیشتر", mult: 6.2 },
] as const;

export const URGENCIES = [
  { id: "relaxed", label: "بدون عجله", note: "زمان‌بندی استاندارد", mult: 1, dayMult: 1 },
  { id: "normal", label: "معمول", note: "زمان‌بندی متعارف", mult: 1.15, dayMult: .8 },
  { id: "rush", label: "فوری", note: "نصف زمان معمول", mult: 1.55, dayMult: .5 },
] as const;

export const TIERS = [
  { id: "verified", label: "تأییدشده", note: "کارپذیر مهارت‌سنجی‌شده", mult: 1 },
  { id: "senior", label: "ارشد", note: "بالای ۵۰ پروژه موفق", mult: 1.45 },
  { id: "expert", label: "متخصص برند", note: "سابقه کار با برندهای بزرگ", mult: 2.1 },
] as const;

export interface Brief {
  category: ContentKind | null;
  type: string | null;
  volume: (typeof VOLUMES)[number]["id"];
  urgency: (typeof URGENCIES)[number]["id"];
  tier: (typeof TIERS)[number]["id"];
}

export const EMPTY_BRIEF: Brief = {
  category: null,
  type: null,
  volume: "s",
  urgency: "relaxed",
  tier: "verified",
};

export interface Line {
  key: string;
  label: string;
  amount: number;
  /** Share of the total, 0–1. */
  share: number;
}

export interface Estimate {
  total: number;
  days: number;
  lines: Line[];
  complete: boolean;
}

/**
 * Returns the estimate *and* its decomposition. The UI never recomputes a
 * total from the lines — `total` is authoritative and the lines are derived
 * from it, so the drawer can never disagree with the headline figure.
 */
export function estimate(brief: Brief): Estimate {
  const cat = CATEGORIES.find((c) => c.id === brief.category);
  const type = cat?.types.find((t) => t.id === brief.type);
  const vol = VOLUMES.find((v) => v.id === brief.volume)!;
  const urg = URGENCIES.find((u) => u.id === brief.urgency)!;
  const tier = TIERS.find((t) => t.id === brief.tier)!;

  if (!cat || !type) {
    return { total: 0, days: 0, lines: [], complete: false };
  }

  const base = cat.base * type.mult;
  const volumeAdd = base * (vol.mult - 1);
  const subtotal = base + volumeAdd;
  const urgencyAdd = subtotal * (urg.mult - 1);
  const tierAdd = subtotal * (tier.mult - 1);

  const total = Math.round((subtotal + urgencyAdd + tierAdd) / 50_000) * 50_000;
  const days = Math.max(1, Math.round((cat.baseDays + type.days) * vol.mult ** .45 * urg.dayMult));

  const raw = [
    { key: "base", label: "پایه خدمت", amount: base },
    { key: "volume", label: "حجم پروژه", amount: volumeAdd },
    { key: "urgency", label: "فوریت تحویل", amount: urgencyAdd },
    { key: "tier", label: "سطح کارپذیر", amount: tierAdd },
  ].filter((l) => l.amount > 0);

  const sum = raw.reduce((a, l) => a + l.amount, 0) || 1;

  return {
    total,
    days,
    complete: true,
    lines: raw.map((l) => ({ ...l, amount: Math.round(l.amount), share: l.amount / sum })),
  };
}

/**
 * Creator earnings — finding FR-02. The single most-asked question by any
 * freelancer went unanswered across every page of the spec. Commission is
 * stated explicitly rather than buried.
 */
export const COMMISSION = 0.18;

export function creatorEarnings(brief: Brief) {
  const { total, days } = estimate(brief);
  const platform = Math.round(total * COMMISSION);
  return { gross: total, platform, net: total - platform, days };
}
