import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type SettingsCardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  compact?: boolean;
};

export function SettingsCard({
  title,
  action,
  children,
  className,
  compact = false,
}: SettingsCardProps) {
  return (
    <Card
      padding="none"
      className={cn(
        compact ? "px-5 py-5" : "px-6 py-6 sm:px-7",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-start justify-between gap-3",
          children ? (compact ? "mb-3.5" : "mb-5") : "",
        )}
      >
        <h2 className="text-[1.0625rem] font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </Card>
  );
}
