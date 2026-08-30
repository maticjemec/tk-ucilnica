import { Progress } from "@/components/ui/Progress";
import { formatProgressPercent } from "@/lib/progress/helpers";

type LessonProgramHeaderProps = {
  title: string;
  positionLabel: string;
  progressPercent: number;
};

export function LessonProgramHeader({
  title,
  positionLabel,
  progressPercent,
}: LessonProgramHeaderProps) {
  const progressLabel = `Napredek programa: ${formatProgressPercent(progressPercent)}`;

  return (
    <header className="mb-3.5 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <h1 className="program-title text-[1.28rem] leading-[1.25] sm:text-[1.55rem] lg:text-[1.7rem]">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-muted">{positionLabel}</p>
      </div>

      <div className="w-full shrink-0 sm:max-w-[13.5rem]">
        <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
          <span className="text-muted">Napredek</span>
          <span className="tabular-nums text-foreground">
            {formatProgressPercent(progressPercent)}
          </span>
        </div>
        <Progress
          value={progressPercent}
          label={progressLabel}
          className="h-1.5"
        />
      </div>
    </header>
  );
}
