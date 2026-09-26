// spec: specs/security-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('SauceDemo Security', () => {
  test('TC-SEC-AUTH-001 - Login with valid credentials', async ({ page }) => {
    // 1. Open the application in a fresh browser context.
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveURL(/^https:\/\/www\.saucedemo\.com\/$/);
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // 2. Enter valid credentials and submit Login.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.locator('body')).not.toContainText('secret_sauce');
  });

  test('TC-SEC-AUTH-002 - Reject invalid credential combinations', async ({ page }) => {
    // 1. Submit invalid credentials.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('unknown_user');
    await page.locator('[data-test="password"]').fill('wrong_password');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match any user');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(page.locator('body')).not.toContainText('secret_sauce');
  });

  test('TC-SEC-AUTH-003 - Block locked-out user', async ({ page }) => {
    // 1. Submit credentials for the documented locked-out user.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('TC-SEC-SESSION-001 - Deny direct access to authenticated routes', async ({ page }) => {
    // 1. Navigate directly to authenticated routes in a fresh browser context.
    for (const route of ['/inventory.html', '/cart.html', '/checkout-step-one.html', '/checkout-step-two.html']) {
      await page.goto(`https://www.saucedemo.com${route}`);
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
      await expect(page.locator('body')).not.toContainText('Products');
    }
  });

  test('TC-SEC-SESSION-002 - Logout invalidates the session', async ({ page }) => {
    // 1. Log in, open the navigation menu, and select Logout.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html$/);
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // 2. Use browser back and navigate directly to inventory.
    await page.goBack();
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  });

  test('TC-SEC-INPUT-001 - Enforce checkout required fields', async ({ page }) => {
    // 1. Log in, add a product, open checkout, and submit with required fields blank.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await expect(page).not.toHaveURL(/checkout-step-two\.html$/);
  });

  test('TC-SEC-AUTH-004 - Reject credential injection payloads', async ({ page }) => {
    // 1. Submit injection payloads in the authentication fields.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill("' OR '1'='1");
    await page.locator('[data-test="password"]').fill('<script>alert(1)</script>');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(page.locator('body')).not.toContainText('<script>alert(1)</script>');
  });
});
