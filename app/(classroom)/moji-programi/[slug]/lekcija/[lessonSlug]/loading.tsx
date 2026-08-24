export default function LessonLoading() {
  return (
    <div
      className="animate-pulse"
      role="status"
      aria-live="polite"
      aria-label="Nalagam lekcijo"
    >
      <div className="mb-4 h-4 w-40 rounded-sm bg-border" />
      <div className="h-[18rem] rounded-md bg-border/70 sm:h-[22rem]" />
      <div className="mt-5 h-6 w-2/3 max-w-md rounded-sm bg-border" />
      <div className="mt-3 h-4 w-full max-w-xl rounded-sm bg-border/80" />
      <span className="sr-only">Nalagam lekcijo…</span>
    </div>
  );
}
