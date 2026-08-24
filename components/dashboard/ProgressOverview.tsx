import type { DashboardProgress } from "@/types/dashboard";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { Card } from "@/components/ui/Card";

type ProgressOverviewProps = {
  progress: DashboardProgress;
  detailsHref?: string;
  detailsLabel?: string;
};

export function ProgressOverview({
  progress,
  detailsHref = "/moji-programi",
  detailsLabel = "Ogled podrobnosti",
}: ProgressOverviewProps) {
  return (
    <Card padding="none" className="px-5 py-4">
      <h2 className="font-serif text-lg tracking-tight text-foreground">
        Tvoj napredek
      </h2>

      <div className="mt-3.5 flex items-center gap-3.5">
        <CircularProgress value={progress.percent} />
        <div className="min-w-0">
          <p className="font-serif text-[1.05rem] leading-snug text-accent">
            {progress.headline}
          </p>
          <p className="mt-1 text-sm leading-snug text-muted">
            {progress.supporting}
          </p>
        </div>
      </div>

      <ButtonLink variant="outline" href={detailsHref} className="mt-4 w-full">
        {detailsLabel}
      </ButtonLink>
    </Card>
  );
}

function CircularProgress({ value }: { value: number }) {
  const size = 80;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(clamped)} odstotkov`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-serif text-[1.2rem] tracking-tight text-foreground"
        aria-hidden
      >
        {Math.round(clamped)}%
      </span>
    </div>
  );
}
