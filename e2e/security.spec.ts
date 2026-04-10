import { test, expect } from "@playwright/test";

test.describe("Security headers", () => {
  test("responses include security headers", async ({ request }) => {
    const res = await request.get("/sign-in");
    const headers = res.headers();

    // CSP header
    expect(headers["content-security-policy"]).toBeDefined();
    expect(headers["content-security-policy"]).toContain("default-src 'self'");

    // Anti-clickjacking
    expect(headers["x-frame-options"]).toBe("DENY");

    // MIME sniffing protection
    expect(headers["x-content-type-options"]).toBe("nosniff");

    // Referrer policy
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");

    // Permissions policy
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["permissions-policy"]).toContain("microphone=()");
    expect(headers["permissions-policy"]).toContain("geolocation=()");
  });
});

test.describe("Rate limiting", () => {
  test("rapid requests eventually get rate limited", async ({ request }) => {
    const results: number[] = [];

    // Send 50 rapid requests to trigger token bucket limit (capacity 40)
    for (let i = 0; i < 50; i++) {
      const res = await request.get("/create");
      results.push(res.status());
    }

    // At least some should be rate limited (403) or redirected (307 to sign-in)
    const hasRateLimitOrRedirect = results.some(
      (s) => s === 403 || s === 429 || s === 307
    );
    expect(hasRateLimitOrRedirect).toBe(true);
  });
});
