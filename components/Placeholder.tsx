import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui";

/**
 * Pages that exist in the site map but whose copy has not been written yet.
 *
 * A designed, honest holding page beats a 404: it confirms the visitor is in
 * the right place, says plainly what will be here, and always offers a real
 * next step rather than a dead end.
 */
export default function Placeholder({
  title,
  subtitle,
  desc,
  next,
}: {
  title: string;
  subtitle: string;
  desc: string;
  next?: { href: string; label: string };
}) {
  return (
    <PageHero title={title} subtitle={subtitle} desc={desc}>
      <div className="flex flex-wrap gap-3">
        {next && <Button href={next.href}>{next.label}</Button>}
        <Button href="/" variant="secondary">
          بازگشت به صفحه اصلی
        </Button>
      </div>
    </PageHero>
  );
}
