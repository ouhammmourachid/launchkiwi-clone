/**
 * End-to-end user journey against a running stack:
 *   npm run pb   (PocketBase on :8090, seeded with `npm run seed`)
 *   npm run dev  (Next.js on :3000)
 * Run with: npx playwright test tests/user-flows.spec.ts
 *
 * Creates a throwaway user + product on every run.
 */

import { expect, test, type Page } from "@playwright/test";

const BASE = "http://localhost:3000";
const PASSWORD = "password123";

async function open(page: Page, path: string) {
  // Wait for streamed content + hydration before interacting.
  await page.goto(BASE + path, { waitUntil: "networkidle" });
}

const onPath = (page: Page, path: string) => page.waitForFunction((p) => location.pathname === p, path);

test("visitor signs up, upvotes, saves, comments, launches and signs out", async ({ page }) => {
  const stamp = Date.now();
  const email = `e2e${stamp}@test.local`;
  const name = `E2E ${stamp.toString().slice(-5)}`;

  await test.step("guests can upvote without an account", async () => {
    await open(page, "/");
    const button = page.getByRole("button", { name: /^Upvote / }).first();
    const [, product, count] = (await button.getAttribute("aria-label"))!.match(/^Upvote (.+) \((\d+) upvotes\)$/)!;
    await button.click();
    const voted = page.getByRole("button", { name: `Remove upvote from ${product} (${Number(count) + 1} upvotes)` }).first();
    await expect(voted).toBeVisible();
    await voted.click();
    await expect(page.getByRole("button", { name: `Upvote ${product} (${count} upvotes)` }).first()).toBeVisible();
  });

  await test.step("guest comments wait for moderation", async () => {
    await open(page, "/browse");
    await page.locator('a[href^="/p/"]').first().click();
    await page.getByPlaceholder("Your name").fill("E2E Guest");
    const comment = `Guest comment ${stamp}`;
    await page.getByLabel("Write a comment").fill(comment);
    await page.getByRole("button", { name: "Post comment" }).click();
    await expect(page.getByRole("status")).toHaveText(/appear once a moderator approves it/);
    await expect(page.getByText(comment)).toHaveCount(0);
  });

  await test.step("register with validation", async () => {
    await open(page, "/register?next=/");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();

    await page.getByLabel("Name").fill(name);
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByLabel("Confirm password").fill(PASSWORD);
    await page.getByRole("button", { name: "Create account" }).click();
    await onPath(page, "/");
    await expect(page.getByRole("button", { name })).toBeVisible();
  });

  await test.step("upvote persists and can be undone", async () => {
    const button = page.getByRole("button", { name: /^Upvote / }).first();
    const label = (await button.getAttribute("aria-label"))!;
    const [, product, count] = label.match(/^Upvote (.+) \((\d+) upvotes\)$/)!;
    const before = Number(count);

    await button.click();
    const voted = page.getByRole("button", { name: `Remove upvote from ${product} (${before + 1} upvotes)` }).first();
    await expect(voted).toBeVisible();
    await page.waitForLoadState("networkidle");
    await page.reload({ waitUntil: "networkidle" });
    await expect(voted).toBeVisible();

    await voted.click();
    await expect(page.getByRole("button", { name: `Upvote ${product} (${before} upvotes)` }).first()).toBeVisible();
  });

  await test.step("save a product and comment on it", async () => {
    await open(page, "/p/pagecub");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByRole("button", { name: "Saved" })).toBeVisible();

    const comment = `Testing comments ${stamp}`;
    await page.getByLabel("Write a comment").fill(comment);
    await page.getByRole("button", { name: "Post comment" }).click();
    await expect(page.getByText(comment)).toBeVisible();
    await page.getByRole("button", { name: "Delete" }).first().click();
    await expect(page.getByText(comment)).toHaveCount(0);
  });

  await test.step("launch a product from the hero box", async () => {
    await open(page, "/");
    await page.getByLabel("Your product URL").fill(`https://e2e-${stamp}.example.com`);
    await page.getByRole("button", { name: /Submit/ }).first().click();
    await onPath(page, "/launch");
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Product name").fill(`E2E Product ${stamp}`);
    await page.getByLabel("Tagline").fill("An end-to-end tested product launch");
    await page.getByLabel("Description").fill("Submitted by an automated end-to-end test to verify the launch flow works.");
    await page.getByLabel("Category").selectOption({ label: "Developer Tools" });
    await page.getByRole("button", { name: /Publish my launch/ }).click();
    await page.waitForFunction(() => location.pathname.startsWith("/p/e2e-product"));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(`E2E Product ${stamp}`);
  });

  await test.step("account lists launches and favorites", async () => {
    await open(page, "/account");
    await expect(page.getByText(`E2E Product ${stamp}`)).toBeVisible();
    await expect(page.getByRole("link", { name: "PageCub" })).toBeVisible();
  });

  await test.step("sign out and back in", async () => {
    await page.getByRole("button", { name }).click();
    await page.getByRole("menuitem", { name: "Sign out" }).click();
    await page.getByRole("link", { name: "Sign In" }).click();
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Incorrect email or password.")).toBeVisible();

    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await onPath(page, "/account");
  });
});
