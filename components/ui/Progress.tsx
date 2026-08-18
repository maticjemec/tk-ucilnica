import { cn } from "@/lib/cn";

type ProgressVariant = "accent" | "success";

type ProgressProps = {
  value: number;
  className?: string;
  label?: string;
  variant?: ProgressVariant;
};

const fillClasses: Record<ProgressVariant, string> = {
  accent: "bg-accent",
  success: "bg-success",
};

export function Progress({
  value,
  className,
  label,
  variant = "accent",
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-1 w-full overflow-hidden rounded-full bg-border", className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-300",
          fillClasses[variant],
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
