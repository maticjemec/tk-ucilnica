import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md";
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
};

export function Card({
  className,
  padding = "md",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface shadow-[var(--shadow-card)]",
        paddingClasses[padding],
        className,
      )}
      {...props}
    />
  );
}
