import * as React from "react";

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
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
        Welcome to ContentOS Studio
      </h1>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        Hey {name || "there"},
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        You&apos;re in. ContentOS Studio is your content production system —
        plan, generate, and manage short-form video scripts powered by AI that
        learns your voice.
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        Here&apos;s how to get started:
      </p>
      <ol style={{ fontSize: "16px", lineHeight: "1.8", color: "#333" }}>
        <li>
          <strong>Set up your Brand Brain</strong> — teach the AI your tone,
          niche, and boundaries
        </li>
        <li>
          <strong>Create your first script</strong> — try Own Idea, Trend,
          Series, or Remix mode
        </li>
        <li>
          <strong>Explore the Library</strong> — organize scripts and analyze
          YouTube performance
        </li>
      </ol>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        You have <strong>5 free script generations</strong> to start. Make them
        count.
      </p>
      <a
        href="https://contentosstudio.com/brand-brain"
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
        Set Up Your Brand Brain
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
