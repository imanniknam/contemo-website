/**
 * تصویرهای مقاله‌های فانوس.
 *
 * SVG درون‌خطی است، نه فایل تصویری: این‌طور متن فارسی با همان Vazirmatn سایت
 * شکل می‌گیرد (فونت داخل <img src="*.svg"> بارگذاری نمی‌شود)، رنگ‌ها مستقیم از
 * توکن‌های `@theme` می‌آیند، تصویر با تغییر رنگ برند همراه می‌شود و هیچ درخواست
 * شبکه‌ای اضافه نمی‌کند. هیچ عکس استوکی هم لازم نیست تا کپی‌رایت کسی زیر پا برود.
 *
 * نمودارها شماتیک‌اند: هیچ عدد ساختگی‌ای روی آن‌ها نیست، چون داده واقعی نداریم.
 */

import type { Art } from "@/lib/posts";

const T = {
  core: "var(--color-core)",
  lift: "var(--color-lift)",
  pale: "var(--color-pale)",
  beacon: "var(--color-beacon)",
  panel: "var(--color-panel)",
  panel2: "var(--color-panel2)",
  hair: "var(--color-hairline)",
  ink: "var(--color-ink)",
  ink2: "var(--color-ink2)",
  ink3: "var(--color-ink3)",
  alert: "var(--color-alert)",
};

/* ─────────────────────────────────────────────
   ۱. فریلنسر در برابر نیروی ثابت
   راست: ساختار بسته و ثابت. چپ: هسته‌ای با مدارهای تخصص.
   ───────────────────────────────────────────── */
function Compare() {
  const skills = [
    { label: "سئو", a: -60 },
    { label: "طراحی", a: 5 },
    { label: "ویدئو", a: 70 },
    { label: "محتوا", a: 140 },
    { label: "توسعه", a: 205 },
  ];
  const cx = 210;
  const cy = 205;

  return (
    <svg viewBox="0 0 800 400" className="h-auto w-full" role="img" aria-hidden="true">
      <defs>
        <radialGradient id="a-core" cx="50%" cy="50%">
          <stop offset="0%" stopColor={T.lift} stopOpacity=".55" />
          <stop offset="100%" stopColor={T.core} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ستون راست — نیروی ثابت */}
      <text x="590" y="52" textAnchor="middle" fill={T.ink} fontSize="19" fontWeight="700">
        نیروی ثابت
      </text>
      <text x="590" y="78" textAnchor="middle" fill={T.ink3} fontSize="13">
        ساختار ثابت، ظرفیت ثابت
      </text>

      <rect x="452" y="106" width="276" height="198" rx="10" fill={T.panel} stroke={T.hair} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => {
          const filled = r === 1 && c === 1;
          return (
            <rect
              key={`${r}-${c}`}
              x={478 + c * 58}
              y={132 + r * 58}
              width="44"
              height="44"
              rx="6"
              fill={filled ? T.core : T.panel2}
              stroke={filled ? T.lift : T.hair}
            />
          );
        }),
      )}
      <text x="590" y="334" textAnchor="middle" fill={T.ink2} fontSize="13">
        هزینه‌ی مستمر، مستقل از حجم پروژه
      </text>

      {/* خط جداکننده */}
      <line x1="400" y1="70" x2="400" y2="340" stroke={T.hair} strokeDasharray="3 7" />

      {/* ستون چپ — فریلنسر */}
      <text x="210" y="52" textAnchor="middle" fill={T.ink} fontSize="19" fontWeight="700">
        فریلنسر
      </text>
      <text x="210" y="78" textAnchor="middle" fill={T.ink3} fontSize="13">
        ظرفیت به‌اندازه‌ی نیاز
      </text>

      <circle cx={cx} cy={cy} r="110" fill="url(#a-core)" />
      <circle cx={cx} cy={cy} r="96" fill="none" stroke={T.hair} strokeDasharray="2 8" />
      <circle cx={cx} cy={cy} r="62" fill="none" stroke={T.hair} strokeDasharray="2 8" />
      <circle cx={cx} cy={cy} r="30" fill={T.panel} stroke={T.core} />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={T.ink} fontSize="12.5" fontWeight="700">
        پروژه
      </text>

      {skills.map((s, i) => {
        const r = i % 2 === 0 ? 96 : 62;
        const rad = (s.a * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        return (
          <g key={s.label}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={T.hair} />
            <circle cx={x} cy={y} r="6" fill={T.beacon} />
            <text
              x={x}
              y={y - 14}
              textAnchor="middle"
              fill={T.ink2}
              fontSize="12.5"
              fontWeight="600"
            >
              {s.label}
            </text>
          </g>
        );
      })}
      <text x="210" y="334" textAnchor="middle" fill={T.ink2} fontSize="13">
        تخصص، فقط برای همان نیاز مشخص
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   ۲. لایه‌های هزینه
   عمداً بدون محور عددی — لایه‌ها را نشان می‌دهد، نه مقدار را.
   ───────────────────────────────────────────── */
function Cost() {
  const fixed = [
    { label: "حقوق", h: 74 },
    { label: "فرآیند جذب و آموزش", h: 44 },
    { label: "فضا و تجهیزات", h: 40 },
    { label: "هزینه‌های جانبی", h: 34 },
  ];
  let y = 300;

  return (
    <svg viewBox="0 0 800 380" className="h-auto w-full" role="img" aria-hidden="true">
      <line x1="60" y1="300" x2="740" y2="300" stroke={T.hair} />

      {/* نیروی ثابت — لایه روی لایه */}
      <text x="560" y="40" textAnchor="middle" fill={T.ink} fontSize="17" fontWeight="700">
        نیروی ثابت
      </text>
      {fixed.map((f, i) => {
        y -= f.h + 4;
        return (
          <g key={f.label}>
            <rect
              x="470"
              y={y}
              width="180"
              height={f.h}
              rx="5"
              fill={i === 0 ? T.core : T.panel2}
              stroke={i === 0 ? T.lift : T.hair}
            />
            <text
              x="660"
              y={y + f.h / 2 + 4}
              textAnchor="start"
              fill={T.ink2}
              fontSize="12.5"
            >
              {f.label}
            </text>
          </g>
        );
      })}
      <text x="560" y="326" textAnchor="middle" fill={T.ink3} fontSize="12.5">
        هزینه‌ی جاری، حتی در ماه‌های کم‌کار
      </text>

      {/* فریلنسر — یک بلوک به‌ازای خروجی */}
      <text x="220" y="40" textAnchor="middle" fill={T.ink} fontSize="17" fontWeight="700">
        فریلنسر
      </text>
      <rect x="130" y="212" width="180" height="88" rx="5" fill={T.panel} stroke={T.beacon} />
      <text x="220" y="248" textAnchor="middle" fill={T.ink} fontSize="13.5" fontWeight="700">
        هزینه‌ی پروژه
      </text>
      <text x="220" y="272" textAnchor="middle" fill={T.ink3} fontSize="12">
        در برابر خروجی مشخص
      </text>
      <text x="220" y="326" textAnchor="middle" fill={T.ink3} fontSize="12.5">
        شروع و پایان مشخص
      </text>

      <text x="400" y="364" textAnchor="middle" fill={T.ink3} fontSize="11.5">
        نمودار شماتیک است؛ نسبت واقعی هزینه‌ها به پروژه و تخصص بستگی دارد.
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   ۳. ظرفیت تیم در طول زمان
   نوار پیوسته = تیم داخلی، بلوک‌های کهربایی = ظرفیت پروژه‌ای.
   ───────────────────────────────────────────── */
function Capacity() {
  const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"];
  const surge = [0, 0, 54, 92, 0, 40]; // ارتفاع ظرفیت افزوده در هر ماه
  const x0 = 90;
  const w = 92;
  const base = 280;

  return (
    <svg viewBox="0 0 800 360" className="h-auto w-full" role="img" aria-hidden="true">
      <line x1="60" y1={base} x2="740" y2={base} stroke={T.hair} />

      {months.map((m, i) => {
        const x = x0 + i * w;
        const s = surge[i];
        return (
          <g key={m}>
            {/* تیم داخلی — همیشه همان اندازه */}
            <rect x={x} y={base - 66} width="62" height="66" rx="4" fill={T.core} opacity=".85" />
            {/* ظرفیت پروژه‌ای */}
            {s > 0 && (
              <rect
                x={x}
                y={base - 66 - s - 4}
                width="62"
                height={s}
                rx="4"
                fill="none"
                stroke={T.beacon}
                strokeDasharray="5 4"
              />
            )}
            <text x={x + 31} y={base + 24} textAnchor="middle" fill={T.ink3} fontSize="12">
              {m}
            </text>
          </g>
        );
      })}

      <text x="400" y="46" textAnchor="middle" fill={T.ink} fontSize="17" fontWeight="700">
        ظرفیت تیم در طول سال
      </text>

      {/* راهنما */}
      <g>
        <rect x="470" y="72" width="16" height="16" rx="3" fill={T.core} />
        <text x="496" y="85" fill={T.ink2} fontSize="12.5">
          تیم داخلی — ثابت
        </text>
        <rect
          x="470"
          y="100"
          width="16"
          height="16"
          rx="3"
          fill="none"
          stroke={T.beacon}
          strokeDasharray="4 3"
        />
        <text x="496" y="113" fill={T.ink2} fontSize="12.5">
          ظرفیت پروژه‌ای — در زمان اوج کار
        </text>
      </g>

      <text x="400" y="332" textAnchor="middle" fill={T.ink3} fontSize="12">
        اوج تقاضا پوشش داده می‌شود، بدون آنکه ساختار سازمان بزرگ‌تر شود.
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   ۴. عوامل مؤثر بر تعرفه
   یک ترازو: سمت راست عوامل افزایش‌دهنده قیمت، سمت چپ عوامل کاهنده.
   ───────────────────────────────────────────── */
function Pricing() {
  const up = ["تخصص بالا", "تحویل فوری", "پیچیدگی زیاد", "اصلاحات زیاد"];
  const down = ["حجم بالا", "زمان کافی", "شرح دقیق پروژه"];

  return (
    <svg viewBox="0 0 800 380" className="h-auto w-full" role="img" aria-hidden="true">
      <text x="400" y="42" textAnchor="middle" fill={T.ink} fontSize="17" fontWeight="700">
        عوامل مؤثر بر تعرفه یک پروژه
      </text>

      {/* محور مرکزی */}
      <line x1="400" y1="70" x2="400" y2="300" stroke={T.hair} />
      <circle cx="400" cy="70" r="7" fill={T.beacon} />

      {/* راست: افزایش قیمت */}
      <text x="590" y="96" textAnchor="middle" fill={T.ink} fontSize="14" fontWeight="700">
        قیمت را بالا می‌برد
      </text>
      {up.map((u, i) => (
        <g key={u}>
          <line x1="400" y1="70" x2="500" y2={128 + i * 46} stroke={T.hair} strokeDasharray="3 5" />
          <rect x="500" y={112 + i * 46} width="220" height="34" rx="7" fill={T.panel2} stroke={T.hair} />
          <text x="610" y={112 + i * 46 + 22} textAnchor="middle" fill={T.ink2} fontSize="13">
            {u}
          </text>
        </g>
      ))}

      {/* چپ: کاهش قیمت */}
      <text x="210" y="96" textAnchor="middle" fill={T.ink} fontSize="14" fontWeight="700">
        قیمت را منطقی‌تر می‌کند
      </text>
      {down.map((d, i) => (
        <g key={d}>
          <line x1="400" y1="70" x2="300" y2={128 + i * 46} stroke={T.hair} strokeDasharray="3 5" />
          <rect x="80" y={112 + i * 46} width="220" height="34" rx="7" fill={T.panel} stroke={T.beacon} />
          <text x="190" y={112 + i * 46 + 22} textAnchor="middle" fill={T.ink2} fontSize="13">
            {d}
          </text>
        </g>
      ))}

      <text x="400" y="344" textAnchor="middle" fill={T.ink3} fontSize="12">
        قیمت نهایی، محل تلاقی این عوامل برای یک پروژه مشخص است — نه یک عدد ثابت بازار.
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   ۵. مراحل — نردبان گام‌به‌گام (برای استخدام/انتخاب فریلنسر)
   ───────────────────────────────────────────── */
function Steps() {
  const steps = [
    "نیاز پروژه را مشخص کنید",
    "شرح پروژه بنویسید",
    "پیشنهادها را بررسی کنید",
    "نمونه‌کار را ارزیابی کنید",
    "فریلنسر مناسب را انتخاب کنید",
  ];

  return (
    <svg viewBox="0 0 800 380" className="h-auto w-full" role="img" aria-hidden="true">
      <text x="400" y="38" textAnchor="middle" fill={T.ink} fontSize="17" fontWeight="700">
        مسیر انتخاب فریلنسر
      </text>
      {steps.map((s, i) => {
        const x = 90 + i * 148;
        const y = 300 - i * 34;
        return (
          <g key={s}>
            {i > 0 && (
              <line
                x1={x - 148 + 56}
                y1={y + 34 + 24}
                x2={x + 4}
                y2={y + 24}
                stroke={T.hair}
                strokeDasharray="3 5"
              />
            )}
            <rect x={x} y={y} width="120" height="48" rx="8" fill={i === steps.length - 1 ? T.core : T.panel2} stroke={i === steps.length - 1 ? T.lift : T.hair} />
            <text x={x + 60} y={y + 20} textAnchor="middle" fill={T.ink3} fontSize="11" className="mono">
              {String(i + 1).padStart(2, "0")}
            </text>
            <foreignObject x={x - 6} y={y + 22} width="132" height="46">
              <div
                style={{
                  fontSize: "11.5px",
                  lineHeight: 1.4,
                  color: T.ink2,
                  textAlign: "center",
                  padding: "0 4px",
                }}
              >
                {s}
              </div>
            </foreignObject>
          </g>
        );
      })}
      <text x="400" y="356" textAnchor="middle" fill={T.ink3} fontSize="12">
        هر پله، ابهام کمتری برای مرحله بعد باقی می‌گذارد.
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   ۶. شرح پروژه — مبهم در برابر دقیق
   ───────────────────────────────────────────── */
function Brief() {
  const vague = ["به یک طراح سایت نیاز داریم.", "لطفاً قیمت بدهید."];
  const clear = [
    "نوع پروژه و حوزه فعالیت",
    "تعداد صفحات و امکانات",
    "خروجی نهایی مورد انتظار",
    "زمان تحویل مشخص",
    "بازه بودجه",
  ];

  return (
    <svg viewBox="0 0 800 380" className="h-auto w-full" role="img" aria-hidden="true">
      {/* راست: دقیق */}
      <text x="590" y="42" textAnchor="middle" fill={T.ink} fontSize="17" fontWeight="700">
        شرح دقیق
      </text>
      <rect x="452" y="66" width="276" height="270" rx="10" fill={T.panel} stroke={T.beacon} />
      {clear.map((c, i) => (
        <g key={c}>
          <circle cx="480" cy={104 + i * 42} r="4" fill={T.beacon} />
          <foreignObject x="494" y={104 + i * 42 - 16} width="216" height="40">
            <div style={{ fontSize: "12.5px", lineHeight: 1.5, color: T.ink2 }}>{c}</div>
          </foreignObject>
        </g>
      ))}
      <text x="590" y="322" textAnchor="middle" fill={T.ink3} fontSize="11.5">
        پیشنهاد دقیق، در زمان کوتاه‌تر
      </text>

      <line x1="400" y1="70" x2="400" y2="340" stroke={T.hair} strokeDasharray="3 7" />

      {/* چپ: مبهم */}
      <text x="210" y="42" textAnchor="middle" fill={T.ink} fontSize="17" fontWeight="700">
        شرح مبهم
      </text>
      <rect x="82" y="66" width="256" height="130" rx="10" fill={T.panel2} stroke={T.hair} />
      {vague.map((v, i) => (
        <text key={v} x="210" y={112 + i * 30} textAnchor="middle" fill={T.ink3} fontSize="13">
          «{v}»
        </text>
      ))}
      <g>
        <circle cx="210" cy="240" r="34" fill="none" stroke={T.hair} strokeDasharray="3 4" />
        <text x="210" y="236" textAnchor="middle" fill={T.ink3} fontSize="11">
          سؤال‌های
        </text>
        <text x="210" y="252" textAnchor="middle" fill={T.ink3} fontSize="11">
          بی‌پایان
        </text>
      </g>
      <text x="210" y="322" textAnchor="middle" fill={T.ink3} fontSize="11.5">
        پیشنهاد نامرتبط، یا سکوت فریلنسر
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   ۷. اشتباهات رایج — چک‌لیست با خطوط قرمز
   ───────────────────────────────────────────── */
function Mistakes() {
  const items = [
    "انتخاب فقط بر اساس قیمت",
    "شرح پروژه مبهم",
    "بودجه نامتناسب با حجم کار",
    "زمان‌بندی مشخص نشده",
    "بازخورد غیرشفاف",
    "تغییر مداوم خواسته‌ها",
  ];

  return (
    <svg viewBox="0 0 800 380" className="h-auto w-full" role="img" aria-hidden="true">
      <text x="400" y="40" textAnchor="middle" fill={T.ink} fontSize="17" fontWeight="700">
        اشتباهات رایج پیش از شروع همکاری
      </text>
      {items.map((it, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 90 + col * 340;
        const y = 84 + row * 76;
        return (
          <g key={it}>
            <rect x={x} y={y} width="300" height="56" rx="8" fill={T.panel} stroke={T.hair} />
            <circle cx={x + 28} cy={y + 28} r="13" fill="none" stroke={T.alert} strokeWidth="2" />
            <line x1={x + 22} y1={y + 22} x2={x + 34} y2={y + 34} stroke={T.alert} strokeWidth="2" />
            <line x1={x + 34} y1={y + 22} x2={x + 22} y2={y + 34} stroke={T.alert} strokeWidth="2" />
            <foreignObject x={x + 50} y={y + 8} width="238" height="40">
              <div style={{ fontSize: "13px", lineHeight: 1.4, color: T.ink2 }}>{it}</div>
            </foreignObject>
          </g>
        );
      })}
      <text x="400" y="356" textAnchor="middle" fill={T.ink3} fontSize="12">
        بیشتر این اشتباهات، پیش از شروع پروژه قابل پیشگیری‌اند.
      </text>
    </svg>
  );
}

const ARTS: Record<Art, () => React.JSX.Element> = {
  compare: Compare,
  cost: Cost,
  capacity: Capacity,
  pricing: Pricing,
  steps: Steps,
  brief: Brief,
  mistakes: Mistakes,
};

/**
 * تصویر مقاله با متن جایگزین.
 *
 * خودِ SVG با `aria-hidden` پنهان می‌شود و متن جایگزین روی `<figure>` می‌نشیند،
 * چون در SVGهایی که ده‌ها `<text>` دارند، صفحه‌خوان در غیر این صورت تک‌تک
 * برچسب‌ها را می‌خواند و شنیدنشان بی‌معنی است.
 */
export default function ArticleArt({
  art,
  alt,
  caption,
}: {
  art: Art;
  alt: string;
  caption?: string;
}) {
  const Svg = ARTS[art];
  return (
    <figure className="my-10" role="img" aria-label={alt}>
      <div className="rounded-lg border border-hairline bg-panel/60 p-4 sm:p-6">
        <Svg />
      </div>
      {caption && (
        <figcaption className="mt-3 text-[13px] leading-loose text-ink3">{caption}</figcaption>
      )}
    </figure>
  );
}
