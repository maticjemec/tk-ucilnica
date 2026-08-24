import { ClassroomLoadingFallback } from "@/components/ui/ClassroomLoadingFallback";

export default function OwnedProgramLoading() {
  return (
    <div role="status" aria-live="polite" aria-label="Nalagam program">
      <ClassroomLoadingFallback />
      <span className="sr-only">Nalagam program…</span>
    </div>
  );
}
