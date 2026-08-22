import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/billing/client";
import { getStripeWebhookSecret } from "@/lib/billing/env";
import {
  fulfillPaidCheckoutSession,
  forgetStripeWebhookEvent,
  markCheckoutSessionStatus,
  recordStripeWebhookEvent,
} from "@/lib/billing/fulfill";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event;

  try {
    event = getStripeClient().webhooks.constructEvent(
      body,
      signature,
      getStripeWebhookSecret(),
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let recorded = false;

  try {
    const record = await recordStripeWebhookEvent(event.id, event.type);
    recorded = true;

    if (record.duplicate) {
      return NextResponse.json({ received: true });
    }

    if (event.type === "checkout.session.completed") {
      await fulfillPaidCheckoutSession(event.data.object);
    } else if (event.type === "checkout.session.expired") {
      await markCheckoutSessionStatus(event.data.object, "expired");
    } else if (event.type === "checkout.session.async_payment_failed") {
      await markCheckoutSessionStatus(event.data.object, "failed");
    }

    return NextResponse.json({ received: true });
  } catch {
    if (recorded) {
      await forgetStripeWebhookEvent(event.id);
    }

    return NextResponse.json({ error: "Webhook failed." }, { status: 500 });
  }
}
