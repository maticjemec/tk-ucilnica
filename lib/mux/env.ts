import "server-only";

const MISSING_MUX_API_MESSAGE = "Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET.";
const MISSING_MUX_SIGNING_MESSAGE =
  "Missing MUX_SIGNING_KEY_ID or MUX_SIGNING_PRIVATE_KEY.";
const MISSING_MUX_WEBHOOK_MESSAGE = "Missing MUX_WEBHOOK_SECRET.";

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}

export function getMuxApiCredentials() {
  const tokenId = readRequiredEnv("MUX_TOKEN_ID");
  const tokenSecret = readRequiredEnv("MUX_TOKEN_SECRET");

  if (!tokenId || !tokenSecret) {
    throw new Error(MISSING_MUX_API_MESSAGE);
  }

  return { tokenId, tokenSecret };
}

/**
 * Mux URL signing key pair. Not the same as the API access token.
 * Dashboard copies the private key as base64-encoded PEM.
 */
export function getMuxSigningCredentials() {
  const keyId = readRequiredEnv("MUX_SIGNING_KEY_ID");
  const privateKey = readRequiredEnv("MUX_SIGNING_PRIVATE_KEY");

  if (!keyId || !privateKey) {
    throw new Error(MISSING_MUX_SIGNING_MESSAGE);
  }

  return {
    keyId,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };
}

export function getMuxWebhookSecret() {
  const secret = readRequiredEnv("MUX_WEBHOOK_SECRET");

  if (!secret) {
    throw new Error(MISSING_MUX_WEBHOOK_MESSAGE);
  }

  return secret;
}
