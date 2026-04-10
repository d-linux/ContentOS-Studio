import { NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (!userId) break;

      if (session.metadata?.type === "credits") {
        // Extra credits purchase — add 5 credits
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (user) {
          await db
            .update(users)
            .set({
              extraCredits: user.extraCredits + 5,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
        }
      } else if (session.mode === "subscription") {
        // Subscription checkout — upgrade to paid
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        await db
          .update(users)
          .set({
            plan: "paid",
            scriptsLimit: 50,
            scriptsUsed: 0,
            stripeSubscriptionId: subscriptionId ?? null,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.stripeCustomerId, customerId))
        .limit(1);

      if (user) {
        const isActive =
          subscription.status === "active" ||
          subscription.status === "trialing";

        await db
          .update(users)
          .set({
            plan: isActive ? "paid" : "free",
            scriptsLimit: isActive ? 50 : 5,
            stripeSubscriptionId: subscription.id,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.stripeCustomerId, customerId))
        .limit(1);

      if (user) {
        await db
          .update(users)
          .set({
            plan: "free",
            scriptsLimit: 5,
            stripeSubscriptionId: null,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));
      }
      break;
    }

    case "invoice.paid": {
      // Reset monthly usage on successful invoice payment
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;

      if (customerId) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (user) {
          await db
            .update(users)
            .set({ scriptsUsed: 0, updatedAt: new Date() })
            .where(eq(users.id, user.id));
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
