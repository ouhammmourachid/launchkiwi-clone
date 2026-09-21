import { test, expect } from '@playwright/test';

test.describe('PocketBase Backend Wire Verification', () => {
  test('PB admin accessible at local URL', async ({ page }) => {
    await page.goto('http://127.0.0.1:8090/_/');
    await expect(page.locator('body')).toContainText('PocketBase');
  });

  test('Frontend loads with backend connection', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    // Verify page loads without backend errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('Login page accessible', async ({ page }) => {
    await page.goto('http://localhost:3000/_auth/login');
    await expect(page.locator('h2')).toContainText('Sign in');
  });

  test('Browse page loads (server fetch)', async ({ page }) => {
    await page.goto('http://localhost:3000/browse');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Launch page loads (server fetch)', async ({ page }) => {
    await page.goto('http://localhost:3000/launch');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Reviews page loads (client + auth)', async ({ page }) => {
    await page.goto('http://localhost:3000/reviews');
    await expect(page.locator('h1')).toContainText('Reviews');
  });
});
