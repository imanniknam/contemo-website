// Zarinpal payment relay for Matin Call.
// Zarinpal only accepts callback URLs on the domain registered for the merchant id (contemo.ir). Matin Call lives on
// matincall.ir, so the customer is sent back to Zarinpal's callback HERE and bounced straight on to Matin.
// This route decides nothing: it never marks anything paid (Matin verifies with Zarinpal server-to-server) and the
// destination is fixed by configuration, never taken from the request, so it cannot be used as an open redirect.
const DEFAULT_TARGET = "https://matincall.ir/api/v1/payments/online/zarinpal/callback";

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams;
  const authority = src.get("Authority") ?? "";
  const status = src.get("Status") === "OK" ? "OK" : "NOK";

  const target = new URL(process.env.MATIN_PAY_RETURN_URL || DEFAULT_TARGET);
  if (/^[A-Za-z0-9]{8,100}$/.test(authority)) {
    target.searchParams.set("Authority", authority);
    target.searchParams.set("Status", status);
  }
  return new Response(null, { status: 303, headers: { Location: target.toString(), "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
}
