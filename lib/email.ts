import type { ReactElement } from "react";
import { resend, FROM_EMAIL } from "@/lib/resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  react: ReactElement;
}

/**
 * Send a transactional email via Resend.
 * Returns the email ID on success, or null on failure (logs the error).
 * Non-throwing so webhook/mutation callers aren't disrupted by email failures.
 */
export async function sendEmail({ to, subject, react }: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    react,
  });

  if (error) {
    console.error(`[email] Failed to send "${subject}" to ${to}:`, error);
    return null;
  }

  return data?.id ?? null;
}
