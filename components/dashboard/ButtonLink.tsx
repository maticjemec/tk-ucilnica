import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonLinkVariant = "primary" | "outline" | "success-outline";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonLinkVariant;
  className?: string;
};

const variantClasses: Record<ButtonLinkVariant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover border-transparent",
  outline:
    "bg-transparent text-accent border-accent/50 hover:border-accent hover:bg-accent/5",
  "success-outline":
    "bg-transparent text-success border-success/55 hover:border-success hover:bg-success/5",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm border font-medium whitespace-nowrap transition-colors",
        "h-10 px-4 text-sm",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
