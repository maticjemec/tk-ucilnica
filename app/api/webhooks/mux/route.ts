import { NextResponse } from "next/server";
import { applyVerifiedMuxAssetEvent } from "@/lib/media/server/mux-webhook";
import { createMuxWebhookClient } from "@/lib/mux/client";
import { getMuxWebhookSecret } from "@/lib/mux/env";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  const body = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  try {
    const mux = createMuxWebhookClient();
    const event = await mux.webhooks.unwrap(
      body,
      headers,
      getMuxWebhookSecret(),
    );

    if (isRecord(event) && typeof event.type === "string") {
      await applyVerifiedMuxAssetEvent(event.type, event.data);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }
}
