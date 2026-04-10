import { NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { SubscriptionActivatedEmail } from "@/emails/subscription-activated";
import { SubscriptionCancelledEmail } from "@/emails/subscription-cancelled";
import { CreditsPurchasedEmail } from "@/emails/credits-purchased";
import { UsageResetEmail } from "@/emails/usage-reset";

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
          const newBalance = user.extraCredits + 5;

          await db
            .update(users)
            .set({
              extraCredits: newBalance,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));

          await sendEmail({
            to: user.email,
            subject: "Your extra credits are ready",
            react: CreditsPurchasedEmail({
              name: user.name || "",
              newBalance,
            }),
          });
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
            scriptsLimit: 25,
            scriptsUsed: 0,
            stripeSubscriptionId: subscriptionId ?? null,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (user) {
          await sendEmail({
            to: user.email,
            subject: "Welcome to ContentOS Studio Pro",
            react: SubscriptionActivatedEmail({ name: user.name || "" }),
          });
        }
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
            scriptsLimit: isActive ? 25 : 5,
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

        await sendEmail({
          to: user.email,
          subject: "Your subscription has been cancelled",
          react: SubscriptionCancelledEmail({ name: user.name || "" }),
        });
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

          await sendEmail({
            to: user.email,
            subject: "Your monthly scripts have reset",
            react: UsageResetEmail({
              name: user.name || "",
              scriptsLimit: user.scriptsLimit,
            }),
          });
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
