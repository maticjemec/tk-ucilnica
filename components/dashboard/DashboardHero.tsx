import type { DashboardHeroContent } from "@/types/dashboard";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { HeroPlaceholder } from "@/components/dashboard/visuals";

type DashboardHeroProps = {
  content: DashboardHeroContent;
  action?: {
    href: string;
    label: string;
  };
};

export function DashboardHero({ content, action }: DashboardHeroProps) {
  const ctaHref = action?.href ?? content.ctaHref;
  const ctaLabel = action?.label ?? content.ctaLabel;
  return (
    <section className="overflow-hidden rounded-md border border-border bg-surface shadow-[var(--shadow-card)]">
      <div className="relative min-h-[18.5rem] sm:min-h-[20rem]">
        <div className="absolute inset-0">
          <CoverMedia
            alt={content.imageAlt}
            imageSrc={content.imageSrc}
            preload={Boolean(content.imageSrc)}
            sizes="(min-width: 1440px) 72vw, 100vw"
            className="h-full w-full"
          >
            <HeroPlaceholder />
          </CoverMedia>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_82%_40%,rgba(232,176,112,0.28),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f7f2ea]/90 from-[4%] via-[#f7f2ea]/52 via-[30%] to-transparent to-[64%]" />

        <div className="relative flex min-h-[18.5rem] max-w-[28rem] flex-col justify-center px-6 py-9 sm:min-h-[20rem] sm:px-10 md:max-w-[31rem]">
          <h2 className="font-serif text-[1.9rem] leading-[1.14] tracking-tight text-foreground sm:text-[2.15rem]">
            {content.headingLines[0]}
            <br />
            {content.headingLines[1]}
          </h2>
          <p className="mt-3.5 max-w-[22.5rem] text-sm leading-relaxed text-muted">
            {content.body}
          </p>
          <div className="mt-7">
            <ButtonLink href={ctaHref} prefetch={false}>
              {ctaLabel}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
