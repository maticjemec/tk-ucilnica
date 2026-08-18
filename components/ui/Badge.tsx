import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "muted";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-canvas text-foreground border-border",
  accent: "bg-warning-soft text-warning-foreground border-transparent",
  success: "bg-success-soft text-success-foreground border-transparent",
  warning: "bg-warning-soft text-warning-foreground border-transparent",
  muted: "bg-canvas text-muted border-border",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-[0.65rem] font-medium tracking-[0.08em] uppercase",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
