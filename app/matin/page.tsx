import type { Metadata } from "next";
import MatinPage from "./MatinPage";
import { MATIN } from "@/lib/content";

export const metadata: Metadata = {
  title: MATIN.title,
  description: MATIN.desc,
};

export default function Page() {
  return <MatinPage />;
}
