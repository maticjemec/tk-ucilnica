import { ClassroomLoadingFallback } from "@/components/ui/ClassroomLoadingFallback";

export default function ClassroomLoading() {
  return (
    <div role="status" aria-live="polite" aria-label="Nalagam">
      <ClassroomLoadingFallback />
      <span className="sr-only">Nalagam…</span>
    </div>
  );
}
