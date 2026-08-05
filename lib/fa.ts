/**
 * Persian text/number helpers.
 *
 * Rule from the design system (finding SY-04):
 *  - Persian digits in running prose.
 *  - Latin digits with tabular-nums inside data surfaces: prices, IDs,
 *    counters, timers — anything that lines up in a column.
 * Never mix the two inside one column.
 */

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Latin → Persian digits, for prose. */
export const fa = (v: string | number): string =>
  String(v).replace(/\d/g, (d) => FA_DIGITS[+d]);

/** Persian/Arabic → Latin digits, for parsing user input. */
export const toLatin = (v: string): string =>
  v
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

/**
 * Normalises the Arabic ye/kaf that Iranian keyboards emit, so search and
 * form validation don't silently fail on visually identical strings.
 */
export const normalizeFa = (v: string): string =>
  v.replace(/ي/g, "ی").replace(/ك/g, "ک").trim();

/** 4200000 → "4,200,000" (Latin digits, for data surfaces). */
export const group = (n: number): string => n.toLocaleString("en-US");

/** 4200000 → "۴٬۲۰۰٬۰۰۰" (Persian digits, for prose). */
export const groupFa = (n: number): string => fa(n.toLocaleString("en-US")).replace(/,/g, "٬");
