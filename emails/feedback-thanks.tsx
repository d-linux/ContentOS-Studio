import * as React from "react";

interface FeedbackThanksEmailProps {
  name: string;
}

export function FeedbackThanksEmail({ name }: FeedbackThanksEmailProps) {
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
        Thanks for the feedback
      </h1>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        Hey {name || "there"},
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        We received your feedback and really appreciate you taking the time.
        As a thank you, <strong>1 free script credit</strong> has been added to
        your account.
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        Your input directly shapes how ContentOS Studio evolves. Keep the ideas
        coming.
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
        Use Your Credit
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
