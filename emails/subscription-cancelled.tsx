import * as React from "react";

interface SubscriptionCancelledEmailProps {
  name: string;
}

export function SubscriptionCancelledEmail({
  name,
}: SubscriptionCancelledEmailProps) {
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: "560px",
        margin: "0 auto",
        padding: "40px 24px",
        color: "#1a1a1a",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}>
        Subscription cancelled
      </h1>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        Hey {name || "there"},
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        Your Pro subscription has been cancelled. Your account has been moved
        back to the free plan with 5 script generations per month.
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        All your existing scripts and Brand Brain data are still here — nothing
        has been deleted. You can resubscribe anytime to unlock 50 monthly
        generations again.
      </p>
      <a
        href="https://contentosstudio.com/billing"
        style={{
          display: "inline-block",
          marginTop: "16px",
          padding: "12px 24px",
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "14px",
        }}
      >
        Resubscribe
      </a>
      <p
        style={{
          fontSize: "13px",
          color: "#888",
          marginTop: "32px",
          borderTop: "1px solid #eee",
          paddingTop: "16px",
        }}
      >
        ContentOS Studio — your content production system
      </p>
    </div>
  );
}
