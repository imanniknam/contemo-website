import type { Metadata } from "next";
import ContactPage from "./ContactPage";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = {
  title: CONTACT.title,
  description: CONTACT.desc[0],
};

export default function Page() {
  return <ContactPage />;
}
