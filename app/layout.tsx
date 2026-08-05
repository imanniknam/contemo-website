import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://contemo.ir"),
  title: {
    default: "کانتمو | دستیار یکپارچه محتوایی شما",
    template: "%s | کانتمو",
  },
  description:
    "کانتمو بستری برای برون‌سپاری نیازها و خدمات محتوای دیجیتال است که شما را در تمامی مراحل اجرای پروژه همراهی می‌کند.",
  keywords: ["تولید محتوا", "برون‌سپاری محتوا", "کپی‌رایتینگ", "تدوین ویدیو", "پادکست", "کانتمو"],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "کانتمو",
    title: "کانتمو | دستیار یکپارچه محتوایی شما",
    description: "با کانتمو داستان کسب‌وکار خودت رو بنویس!",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05060F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Committed single-theme design.
 *
 * The thesis is a mission-control room, and a control room is dark. Rather
 * than shipping a half-considered light mode, the dark ground is the brand —
 * a deliberate choice, not an omission. The one place saturated #2A38FF
 * appears at full strength is as a *frame* around dark canvases, which is
 * where it has the contrast headroom to be vivid.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="grain relative antialiased">
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
