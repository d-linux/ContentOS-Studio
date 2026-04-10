import { test, expect } from "@playwright/test";

test.describe("Public routes", () => {
  test("sign-in page loads", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("sign-up page loads", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(page).toHaveURL(/sign-up/);
  });

  test("webhook endpoints return method not allowed for GET", async ({
    request,
  }) => {
    const stripeRes = await request.get("/api/webhooks/stripe");
    expect(stripeRes.status()).toBe(405);
  });
});

test.describe("Protected routes redirect to sign-in", () => {
  const protectedRoutes = [
    "/create",
    "/library",
    "/brand-brain",
    "/billing",
    "/help",
    "/settings",
    "/privacy",
    "/terms",
  ];

  for (const route of protectedRoutes) {
    test(`${route} redirects unauthenticated users`, async ({ page }) => {
      await page.goto(route);
      // Clerk redirects unauthenticated users to sign-in
      await expect(page).toHaveURL(/sign-in/);
    });
  }
});
