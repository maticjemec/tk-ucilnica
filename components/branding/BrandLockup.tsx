import Link from "next/link";
import { BrandMark } from "@/components/branding/BrandMark";

export function BrandLockup() {
  return (
    <Link
      href="/"
      className="flex flex-col items-center px-6 pt-8 pb-7 text-center outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
    >
      <BrandMark className="text-accent-soft" />
      <p className="mt-4 font-serif text-[1.35rem] leading-none tracking-[0.18em] text-accent-soft">
        TK HIPNOZA
      </p>
      <p className="mt-2 text-[0.62rem] font-medium tracking-[0.28em] text-accent-soft/80">
        SPLETNA UČILNICA
      </p>
    </Link>
  );
}
