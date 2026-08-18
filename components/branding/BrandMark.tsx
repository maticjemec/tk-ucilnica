import { cn } from "@/lib/cn";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("h-12 w-12", className)}
    >
      <circle cx="24" cy="24" r="17.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M24 10.8c4.1 4.7 6.4 8.8 6.4 13.2S28.1 32.5 24 37.2c-4.1-4.7-6.4-8.8-6.4-13.2S19.9 15.5 24 10.8Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="24" cy="24" r="3.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
