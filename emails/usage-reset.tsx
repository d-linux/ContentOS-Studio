import * as React from "react";

interface UsageResetEmailProps {
  name: string;
  scriptsLimit: number;
}

export function UsageResetEmail({ name, scriptsLimit }: UsageResetEmailProps) {
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
        Your monthly scripts have reset
      </h1>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        Hey {name || "there"},
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        Good news — your billing cycle just renewed. You have{" "}
        <strong>{scriptsLimit} script generations</strong> ready to go this
        month.
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
        Create a Script
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
