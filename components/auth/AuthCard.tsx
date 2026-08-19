import type { ReactNode } from "react";
import { BrandMark } from "@/components/branding/BrandMark";
import { Card } from "@/components/ui/Card";

type AuthCardProps = {
  title: string;
  supporting: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({
  title,
  supporting,
  children,
  footer,
}: AuthCardProps) {
  return (
    <Card padding="none" className="px-5 py-8 sm:px-8 sm:py-10">
      <div className="text-center">
        <BrandMark className="mx-auto h-11 w-11 text-accent" />
        <p className="mt-4 font-serif text-[1.2rem] leading-none tracking-[0.18em] text-accent">
          TK HIPNOZA
        </p>
        <p className="mt-2 text-[0.62rem] font-medium tracking-[0.28em] text-muted">
          SPLETNA UČILNICA
        </p>
      </div>

      <h1 className="mt-8 text-center font-serif text-[1.85rem] leading-tight font-medium tracking-[-0.02em] text-foreground">
        {title}
      </h1>
      <p className="mt-2 text-center text-sm leading-relaxed text-muted">
        {supporting}
      </p>

      {children}

      {footer ? <div className="mt-6 text-center text-sm text-muted">{footer}</div> : null}
    </Card>
  );
}
