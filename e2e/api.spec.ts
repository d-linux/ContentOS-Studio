import { test, expect } from "@playwright/test";

test.describe("tRPC API", () => {
  test("tRPC endpoint exists and rejects unauthenticated requests", async ({
    request,
  }) => {
    // tRPC batch endpoint should exist but require auth for protected procedures
    const res = await request.get("/api/trpc/brandBrain.get");
    // Should return 401 or UNAUTHORIZED error from tRPC
    expect([401, 200]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      // tRPC returns errors inside the response body
      expect(JSON.stringify(body)).toContain("UNAUTHORIZED");
    }
  });

  test("tRPC endpoint rejects invalid procedures", async ({ request }) => {
    const res = await request.get("/api/trpc/nonexistent.procedure");
    const body = await res.json();
    expect(JSON.stringify(body)).toContain("NOT_FOUND");
  });
});

test.describe("Webhook endpoints", () => {
  test("Stripe webhook rejects unsigned requests", async ({ request }) => {
    const res = await request.post("/api/webhooks/stripe", {
      data: '{"type":"test"}',
      headers: { "Content-Type": "application/json" },
    });
    // Should fail signature verification
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test("Clerk webhook rejects unsigned requests", async ({ request }) => {
    const res = await request.post("/api/webhooks/clerk", {
      data: '{"type":"user.created"}',
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
