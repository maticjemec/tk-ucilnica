import type { ReactNode } from "react";
import { OwnedProgressProvider } from "@/components/lesson-player/OwnedProgressProvider";

export default function OwnedLessonLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <OwnedProgressProvider>{children}</OwnedProgressProvider>;
}
