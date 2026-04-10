import * as React from "react";

interface SubscriptionActivatedEmailProps {
  name: string;
}

export function SubscriptionActivatedEmail({
  name,
}: SubscriptionActivatedEmailProps) {
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
        You&apos;re on the Pro plan
      </h1>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        Hey {name || "there"},
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        Your subscription is active. Here&apos;s what&apos;s unlocked:
      </p>
      <ul style={{ fontSize: "16px", lineHeight: "1.8", color: "#333" }}>
        <li>
          <strong>50 script generations</strong> per month
        </li>
        <li>All creation modes — Own Idea, Trend, Series, Remix</li>
        <li>Priority AI generation</li>
      </ul>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        Your usage resets each billing cycle. Go create something great.
      </p>
      <a
        href="https://contentosstudio.com/create"
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
        Start Creating
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
        Manage your subscription anytime from the{" "}
        <a
          href="https://contentosstudio.com/billing"
          style={{ color: "#888" }}
        >
          Billing page
        </a>
        .
      </p>
    </div>
  );
}
