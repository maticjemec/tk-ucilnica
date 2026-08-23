import type { NextConfig } from "next";

function supabaseCoverImagePattern() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!raw) {
    return [];
  }

  try {
    const url = new URL(raw);
    const protocol = url.protocol === "http:" ? "http" : "https";

    return [
      {
        protocol,
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: "/storage/v1/object/public/program-covers/**",
      },
    ] as const;
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [...supabaseCoverImagePattern()],
  },
};

export default nextConfig;
