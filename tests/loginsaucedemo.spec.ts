import { test, expect } from '../fixtures/login.fixture';

const validUsername = 'standard_user';
const validPassword = 'secret_sauce';
const invalidCredentialsMessage = 'Epic sadface: Username and password do not match any user in this service';

test.describe('Sauce Demo Login Authentication and Validation', () => {
  test('LOGIN-01 - login with valid credentials', async ({ loginPage, page }) => {
    // 1. Enter standard_user in the Username field.
    await loginPage.enterUserName(validUsername);

    // 2. Enter secret_sauce in the Password field.
    await loginPage.enterPassword(validPassword);

    // 3. Click Login.
    await loginPage.clickLoginButton();

    // 4. Verify the inventory page is displayed.
    await expect(page).toHaveURL(/.*\/inventory\.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('LOGIN-02 - reject blank username and password', async ({ loginPage, page }) => {
    // 1. Leave Username and Password blank.
    // 2. Click Login.
    await loginPage.clickLoginButton();

    // 3. Verify the required username error is displayed.
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Username is required');
    await expect(page).toHaveURL(/.*\/$/);
  });

  test('LOGIN-03 - reject blank password', async ({ loginPage }) => {
    // 1. Enter standard_user in the Username field.
    await loginPage.enterUserName(validUsername);

    // 2. Leave Password blank and click Login.
    await loginPage.clickLoginButton();

    // 3. Verify the required password error is displayed.
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Password is required');
  });

  test('LOGIN-04 - reject invalid credentials', async ({ loginPage }) => {
    // 1. Enter an unknown username and an incorrect password.
    await loginPage.performLogin('unknown_user', 'wrong_password');

    // 2. Verify the invalid credentials error is displayed.
    await expect(loginPage.errorMessage).toContainText(invalidCredentialsMessage);
  });

  test('LOGIN-05 - prevent locked out user from logging in', async ({ loginPage }) => {
    // 1. Enter locked_out_user and secret_sauce.
    await loginPage.performLogin('locked_out_user', validPassword);

    // 2. Verify the locked-out error is displayed.
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('LOGIN-06 - submit valid credentials with Enter', async ({ loginPage, page }) => {
    // 1. Enter valid credentials.
    await loginPage.enterUserName(validUsername);
    await loginPage.enterPassword(validPassword);

    // 2. Press Enter while focus is in the Password field.
    await loginPage.passwordInput.press('Enter');

    // 3. Verify the inventory page is displayed.
    await expect(page).toHaveURL(/.*\/inventory\.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('LOGIN-07 - verify password characters are masked', async ({ loginPage }) => {
    // 1. Enter a password in the Password field.
    await loginPage.enterPassword(validPassword);

    // 2. Verify the password input remains masked.
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('LOGIN-08 - recover from an authentication error', async ({ loginPage, page }) => {
    // 1. Submit valid username with an incorrect password.
    await loginPage.performLogin(validUsername, 'wrong_password');
    await expect(loginPage.errorMessage).toContainText(invalidCredentialsMessage);

    // 2. Replace the password with the valid password and submit again.
    await loginPage.enterPassword(validPassword);
    await loginPage.clickLoginButton();

    // 3. Verify authentication succeeds.
    await expect(page).toHaveURL(/.*\/inventory\.html/);
  });
});
