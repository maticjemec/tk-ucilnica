const MISSING_ENV_MESSAGE =
  "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.";

export type SupabasePublicEnv = {
  url: string;
  publishableKey: string;
};

function readSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  return { url, publishableKey };
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const env = readSupabasePublicEnv();

  if (!env) {
    throw new Error(MISSING_ENV_MESSAGE);
  }

  return env;
}

export function getSupabasePublicEnvOrNull(): SupabasePublicEnv | null {
  return readSupabasePublicEnv();
}
