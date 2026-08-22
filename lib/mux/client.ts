import "server-only";

import Mux from "@mux/mux-node";
import {
  getMuxApiCredentials,
  getMuxSigningCredentials,
  getMuxWebhookSecret,
} from "@/lib/mux/env";

/**
 * Server-only Mux API client.
 * Credentials stay in this module. Never import from client components.
 */
export function createMuxClient() {
  const { tokenId, tokenSecret } = getMuxApiCredentials();

  return new Mux({
    tokenId,
    tokenSecret,
  });
}

export function createMuxSigningClient() {
  const { tokenId, tokenSecret } = getMuxApiCredentials();
  const { keyId, privateKey } = getMuxSigningCredentials();

  return new Mux({
    tokenId,
    tokenSecret,
    jwtSigningKey: keyId,
    jwtPrivateKey: privateKey,
  });
}

export function createMuxWebhookClient() {
  const { tokenId, tokenSecret } = getMuxApiCredentials();

  return new Mux({
    tokenId,
    tokenSecret,
    webhookSecret: getMuxWebhookSecret(),
  });
}
