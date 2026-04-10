import { Resend } from "resend";
import { env } from "@/lib/env";

export const resend = new Resend(env.RESEND_API_KEY);

// Shared sender — use your verified domain in production
export const FROM_EMAIL = "ContentOS Studio <hello@contentosstudio.com>";
