import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../init";
import { feedback, users } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { FeedbackThanksEmail } from "@/emails/feedback-thanks";

export const feedbackRouter = router({
  // ─── Submit feedback (earns 1 free script) ────────────
  submit: protectedProcedure
    .input(z.object({ content: z.string().min(10).max(5000) }))
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(feedback)
        .values({
          userId: ctx.user.id,
          content: input.content,
          creditAwarded: true,
        })
        .returning();

      // Award 1 free script generation
      await ctx.db
        .update(users)
        .set({
          extraCredits: ctx.user.extraCredits + 1,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id));

      // Send thank-you email (non-blocking — doesn't affect mutation result)
      await sendEmail({
        to: ctx.user.email,
        subject: "Thanks for your feedback — here's a free credit",
        react: FeedbackThanksEmail({ name: ctx.user.name || "" }),
      });

      return created;
    }),
});
