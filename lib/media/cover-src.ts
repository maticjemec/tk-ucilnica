/**
 * Client-safe check for program-cover public Storage URLs.
 * Uses only NEXT_PUBLIC_SUPABASE_URL. Never reads the service-role key.
 */
export function isSupabaseProgramCoverSrc(src: string) {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!raw) {
    return false;
  }

  try {
    const allowed = new URL(raw);
    const image = new URL(src);

    return (
      image.protocol === allowed.protocol &&
      image.hostname === allowed.hostname &&
      (!allowed.port || image.port === allowed.port) &&
      image.pathname.startsWith("/storage/v1/object/public/program-covers/")
    );
  } catch {
    return false;
  }
}
