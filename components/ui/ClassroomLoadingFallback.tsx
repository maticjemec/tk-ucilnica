export function ClassroomLoadingFallback() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className="mb-8 h-8 w-56 rounded-sm bg-border" />
      <div className="mb-3 h-4 w-80 max-w-full rounded-sm bg-border/80" />
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="h-56 rounded-md bg-border/70" />
        <div className="h-56 rounded-md bg-border/70" />
        <div className="h-56 rounded-md bg-border/70" />
        <div className="h-56 rounded-md bg-border/70" />
      </div>
    </div>
  );
}
