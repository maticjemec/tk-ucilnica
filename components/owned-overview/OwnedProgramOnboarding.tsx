import { BookOpen, CirclePlay, Layers, Percent } from "lucide-react";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { Card } from "@/components/ui/Card";
import { formatLessonHeading } from "@/lib/owned-program/access";
import type { OwnedOverviewModel } from "@/lib/owned-program/overview";
import { formatProgressPercent } from "@/lib/progress/helpers";

type OwnedProgramOnboardingProps = {
  model: OwnedOverviewModel;
};

export function OwnedProgramOnboarding({ model }: OwnedProgramOnboardingProps) {
  const {
    firstLesson,
    firstLessonSectionTitle,
    firstLessonUnlockMessage,
    continueHref,
    continueAvailable,
    startHereCtaLabel,
    howItWorksSteps,
    guidanceLines,
    lessonCountLabelExact,
    sectionCountLabel,
    durationLabel,
    accessNote,
    progressPercent,
    visibleLessonCount,
  } = model;
  const headingId = "program-onboarding-heading";
  const waiting = Boolean(firstLesson) && !continueAvailable;
  const duration = durationLabel.trim();
  const stats = [
    {
      id: "lessons",
      icon: BookOpen,
      label: lessonCountLabelExact,
    },
    ...(model.program.sections.length > 0
      ? [
          {
            id: "sections",
            icon: Layers,
            label: sectionCountLabel,
          },
        ]
      : []),
    {
      id: "progress",
      icon: Percent,
      label: formatProgressPercent(progressPercent),
    },
  ];

  return (
    <section aria-labelledby={headingId}>
      <Card padding="none" className="px-5 py-5 sm:px-6 sm:py-6">
        <h2
          id={headingId}
          className="font-serif text-[1.45rem] leading-tight tracking-tight text-foreground sm:text-[1.6rem]"
        >
          Dobrodošel/a v programu
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Tukaj vidiš, kako program poteka in s katero lekcijo začneš.
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <li
                key={item.id}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-border bg-canvas px-3 text-sm text-foreground"
              >
                <Icon
                  className="h-3.5 w-3.5 shrink-0 text-accent"
                  strokeWidth={1.6}
                  aria-hidden
                />
                {item.label}
              </li>
            );
          })}
        </ul>

        {duration || accessNote ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {duration ? duration : null}
            {duration && accessNote ? " · " : null}
            {accessNote}
          </p>
        ) : null}

        <h3 className="mt-6 text-[1.05rem] font-semibold tracking-tight text-foreground">
          Kako program poteka
        </h3>
        <ol className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {howItWorksSteps.map((step, index) => (
            <li key={step.id} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-[0.78rem] font-medium text-foreground"
                aria-hidden
              >
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug text-foreground">
                  {step.title}
                </p>
                <p className="mt-0.5 text-sm leading-snug text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <ul className="mt-4 space-y-1 text-sm leading-relaxed text-muted">
          {guidanceLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <div className="mt-6 border-t border-border pt-5">
          <h3 className="text-[1.05rem] font-semibold tracking-tight text-foreground">
            Začni tukaj
          </h3>

          {firstLesson ? (
            <>
              <p className="mt-2 font-medium leading-snug text-foreground">
                {formatLessonHeading(firstLesson)}
              </p>
              {firstLessonSectionTitle ? (
                <p className="mt-1 text-sm text-muted">{firstLessonSectionTitle}</p>
              ) : null}
              {waiting ? (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {firstLessonUnlockMessage}
                </p>
              ) : (
                <ButtonLink href={continueHref} className="mt-4 w-full sm:w-auto">
                  <CirclePlay className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                  {startHereCtaLabel}
                </ButtonLink>
              )}
            </>
          ) : visibleLessonCount > 0 ? (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Prva lekcija trenutno ni na voljo.
            </p>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Vsebina programa še ni na voljo.
            </p>
          )}
        </div>
      </Card>
    </section>
  );
}
