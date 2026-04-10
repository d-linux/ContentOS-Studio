import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { WelcomeEmail } from "@/emails/welcome";
export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses[0]?.email_address;

      if (!email) {
        return new Response("No email found on user", { status: 400 });
      }

      const name = [first_name, last_name].filter(Boolean).join(" ") || null;
      const referralCode = crypto.randomUUID().slice(0, 8);

      // Create the user record in our database
      await db.insert(users).values({
        clerkId: id,
        email,
        name,
        referralCode,
      });

      // Send welcome email
      await sendEmail({
        to: email,
        subject: "Welcome to ContentOS Studio",
        react: WelcomeEmail({ name: name || "" }),
      });
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying Clerk webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
