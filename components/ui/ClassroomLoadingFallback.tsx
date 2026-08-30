export function ClassroomLoadingFallback() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className="mb-3 h-9 w-48 max-w-full rounded-sm bg-border" />
      <div className="mb-8 h-4 w-72 max-w-full rounded-sm bg-border/80" />
      <div className="overflow-hidden rounded-md border border-border bg-surface">
        <div className="h-44 bg-border/70 sm:h-52" />
        <div className="space-y-3 px-5 py-5">
          <div className="h-4 w-2/3 rounded-sm bg-border/80" />
          <div className="h-4 w-1/2 rounded-sm bg-border/60" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-40 rounded-md bg-border/70" />
        <div className="h-40 rounded-md bg-border/70" />
      </div>
    </div>
  );
}
