import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../init";
import { users, referrals } from "@/db/schema";
import { stripe } from "@/lib/stripe";

export const billingRouter = router({
  // ─── Get current user's billing info ──────────────────
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    return {
      plan: ctx.user.plan,
      scriptsUsed: ctx.user.scriptsUsed,
      scriptsLimit: ctx.user.scriptsLimit,
      extraCredits: ctx.user.extraCredits,
      stripeCustomerId: ctx.user.stripeCustomerId,
      stripeSubscriptionId: ctx.user.stripeSubscriptionId,
      referralCode: ctx.user.referralCode,
    };
  }),

  // ─── Create Stripe checkout for subscription ──────────
  createCheckout: protectedProcedure
    .input(z.object({ priceId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      let customerId = ctx.user.stripeCustomerId;

      // Create Stripe customer if none exists
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: ctx.user.email,
          metadata: { userId: ctx.user.id },
        });
        customerId = customer.id;

        await ctx.db
          .update(users)
          .set({ stripeCustomerId: customerId, updatedAt: new Date() })
          .where(eq(users.id, ctx.user.id));
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: input.priceId, quantity: 1 }],
        success_url: `${appUrl}/billing?success=true`,
        cancel_url: `${appUrl}/billing?canceled=true`,
        metadata: { userId: ctx.user.id },
      });

      return { url: session.url };
    }),

  // ─── Create checkout for extra credits ────────────────
  buyCredits: protectedProcedure.mutation(async ({ ctx }) => {
    let customerId = ctx.user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: ctx.user.email,
        metadata: { userId: ctx.user.id },
      });
      customerId = customer.id;

      await ctx.db
        .update(users)
        .set({ stripeCustomerId: customerId, updatedAt: new Date() })
        .where(eq(users.id, ctx.user.id));
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "5 Extra Script Credits",
              description:
                "5 additional script generations for ContentOS Studio",
            },
            unit_amount: 299, // £2.99
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/billing?credits=true`,
      cancel_url: `${appUrl}/billing?canceled=true`,
      metadata: { userId: ctx.user.id, type: "credits" },
    });

    return { url: session.url };
  }),

  // ─── Open Stripe customer portal ──────────────────────
  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user.stripeCustomerId) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "No billing account found.",
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.billingPortal.sessions.create({
      customer: ctx.user.stripeCustomerId,
      return_url: `${appUrl}/billing`,
    });

    return { url: session.url };
  }),

  // ─── Apply referral code ──────────────────────────────
  applyReferral: protectedProcedure
    .input(z.object({ code: z.string().min(1).max(50) }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.referredBy) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have already used a referral code.",
        });
      }

      // Find the referrer by their referral code
      const [referrer] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.referralCode, input.code))
        .limit(1);

      if (!referrer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid referral code.",
        });
      }

      if (referrer.id === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot refer yourself.",
        });
      }

      // Record the referral
      await ctx.db.insert(referrals).values({
        referrerId: referrer.id,
        referredId: ctx.user.id,
        creditAwarded: true,
      });

      // Award 1 bonus script to the referrer
      await ctx.db
        .update(users)
        .set({
          extraCredits: referrer.extraCredits + 1,
          updatedAt: new Date(),
        })
        .where(eq(users.id, referrer.id));

      // Mark the referred user
      await ctx.db
        .update(users)
        .set({ referredBy: referrer.id, updatedAt: new Date() })
        .where(eq(users.id, ctx.user.id));

      return { success: true };
    }),
});
