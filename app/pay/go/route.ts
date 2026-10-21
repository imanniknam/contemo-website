// Zarinpal only opens StartPay for visitors whose Referer is the domain registered for the merchant id (contemo.ir).
// Matin Call (matincall.ir) therefore sends the customer HERE first; this page, served from contemo.ir, then moves the
// browser on to Zarinpal, so the Referer Zarinpal sees is https://contemo.ir/. (An HTTP redirect would not do: a redirect
// keeps the ORIGINAL referrer, i.e. matincall.ir.) The destination host is fixed; only a validated Authority is interpolated.
export async function GET(request: Request) {
  const authority = new URL(request.url).searchParams.get("Authority") ?? "";
  if (!/^[A-Za-z0-9]{8,100}$/.test(authority)) return new Response("Bad request", { status: 400 });
  const target = `https://payment.zarinpal.com/pg/StartPay/${authority}`;
  const html = `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="origin"><meta http-equiv="refresh" content="1;url=${target}"><title>انتقال به درگاه پرداخت</title></head><body style="font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#f6f7fb;color:#1b2540"><main style="text-align:center;padding:24px"><p style="font-size:18px;font-weight:700">در حال انتقال به درگاه امن پرداخت…</p><p style="font-size:14px;color:#5b6478">اگر منتقل نشدید <a href="${target}" rel="noopener" referrerpolicy="origin">اینجا کلیک کنید</a>.</p></main><script>location.replace(${JSON.stringify(target)})</script></body></html>`;
  return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "origin" } });
}
