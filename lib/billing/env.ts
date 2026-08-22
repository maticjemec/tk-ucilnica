import "server-only";

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}

export function getStripeSecretKey() {
  const key = readRequiredEnv("STRIPE_SECRET_KEY");

  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  return key;
}

export function getStripeWebhookSecret() {
  const secret = readRequiredEnv("STRIPE_WEBHOOK_SECRET");

  if (!secret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET.");
  }

  return secret;
}
