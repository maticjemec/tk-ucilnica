import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

type CoverMediaProps = {
  alt: string;
  imageSrc?: string;
  preload?: boolean;
  sizes?: string;
  className?: string;
  children: ReactNode;
};

export function CoverMedia({
  alt,
  imageSrc,
  preload = false,
  sizes,
  className,
  children,
}: CoverMediaProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
          preload={preload}
        />
      ) : (
        <div className="absolute inset-0" role="img" aria-label={alt}>
          {children}
        </div>
      )}
    </div>
  );
}
