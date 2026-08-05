import Hero from "@/components/home/Hero";
import { How, Services, Why, Success, Creators } from "@/components/home/Sections";

/**
 * Home — section order taken directly from HOME PAGE-Contemo.docx:
 * hero → how it works → services → why Contemo → client success → creators.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <How />
      <Services />
      <Why />
      <Success />
      <Creators />
    </>
  );
}
