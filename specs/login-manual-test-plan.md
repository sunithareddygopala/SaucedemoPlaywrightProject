# Sauce Demo Login Manual Test Plan

## Application Overview

Manual test cases for the Sauce Demo login page at https://www.saucedemo.com/. The plan validates login-page presentation, successful authentication, credential validation, locked-user handling, supported test personas, keyboard behavior, password masking, and recoverability after errors. Each test starts from a fresh browser state on the login page and uses the documented Sauce Demo credentials where applicable.

## Test Scenarios

### 1. Login Authentication and Validation

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-LOGIN-001 - Verify login page loads with required controls

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. Open https://www.saucedemo.com/ in a new browser session.
    - expect: The page loads successfully without a browser error.
    - expect: The page title is "Swag Labs" and the login screen is displayed.
  2. Inspect the login form without entering data.
    - expect: Username input is visible and identified as Username.
    - expect: Password input is visible and identified as Password.
    - expect: Login button is visible and enabled.
    - expect: The Sauce Demo branding and login form are aligned without clipped or overlapping content.

#### 1.2. TC-LOGIN-002 - Login successfully with a valid standard user

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, enter "standard_user" in the Username field.
    - expect: The username value is accepted and displayed.
  2. Enter "secret_sauce" in the Password field and click Login.
    - expect: Authentication succeeds.
    - expect: The user is redirected to the inventory page at a URL ending in /inventory.html.
    - expect: The inventory page displays the Products heading and product inventory.

#### 1.3. TC-LOGIN-003 - Validate submission with both fields blank

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, leave Username and Password blank, then click Login.
    - expect: The login request is not successful.
    - expect: An error message states "Epic sadface: Username is required."
    - expect: The user remains on the login page.

#### 1.4. TC-LOGIN-004 - Validate submission with username blank and password populated

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, leave Username blank.
    - expect: The Username field remains empty.
  2. Enter "secret_sauce" in Password and click Login.
    - expect: The login request is rejected.
    - expect: An error message states "Epic sadface: Username is required."
    - expect: The user remains on the login page.

#### 1.5. TC-LOGIN-005 - Validate submission with password blank and username populated

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, enter "standard_user" in Username and leave Password blank.
    - expect: The username is accepted.
    - expect: The Password field remains empty.
  2. Click Login.
    - expect: The login request is rejected.
    - expect: An error message states "Epic sadface: Password is required."
    - expect: The user remains on the login page.

#### 1.6. TC-LOGIN-006 - Reject an unknown username with a valid password

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, enter "unknown_user" in Username and "secret_sauce" in Password.
    - expect: Both values are accepted by the fields.
  2. Click Login.
    - expect: Authentication fails.
    - expect: An error message states "Epic sadface: Username and password do not match any user in this service."
    - expect: The user remains on the login page and no inventory page is shown.

#### 1.7. TC-LOGIN-007 - Reject a valid username with an incorrect password

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, enter "standard_user" in Username and "wrong_password" in Password.
    - expect: Both values are accepted by the fields.
  2. Click Login.
    - expect: Authentication fails.
    - expect: An error message states "Epic sadface: Username and password do not match any user in this service."
    - expect: The user remains on the login page.

#### 1.8. TC-LOGIN-008 - Reject credentials with incorrect casing

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, enter "STANDARD_USER" in Username and "SECRET_SAUCE" in Password.
    - expect: The fields accept the values.
  2. Click Login.
    - expect: Authentication does not succeed because the credentials are case-sensitive.
    - expect: The standard invalid-credentials error is displayed.
    - expect: The user remains on the login page.

#### 1.9. TC-LOGIN-009 - Reject credentials containing unintended leading or trailing spaces

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, enter " standard_user " in Username and " secret_sauce " in Password.
    - expect: The fields accept the entered characters or visibly preserve them according to normal browser input behavior.
  2. Click Login.
    - expect: The application does not authenticate the spaced credentials as the valid credentials.
    - expect: An appropriate invalid-credentials error is displayed.
    - expect: The user remains on the login page.

#### 1.10. TC-LOGIN-010 - Prevent locked-out user from logging in

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, enter "locked_out_user" in Username and "secret_sauce" in Password.
    - expect: Both values are accepted.
  2. Click Login.
    - expect: Authentication is blocked.
    - expect: An error message states "Epic sadface: Sorry, this user has been locked out."
    - expect: The user remains on the login page and is not redirected to inventory.

#### 1.11. TC-LOGIN-011 - Verify supported Sauce Demo users can authenticate as documented

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. Run this case independently from a fresh login page for each username: "problem_user", "performance_glitch_user", "error_user", and "visual_user". Use "secret_sauce" as the password for each attempt.
    - expect: Each documented user is accepted by the login service.
    - expect: Each successful attempt redirects to /inventory.html.
    - expect: The Products heading is displayed after each successful login.

#### 1.12. TC-LOGIN-012 - Verify password characters are masked

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, click Password and type "secret_sauce".
    - expect: The entered value is not displayed as readable plain text; each character is masked by the password control.
  2. Move focus away from Password and inspect the field.
    - expect: The password remains masked and is not exposed in the page UI.

#### 1.13. TC-LOGIN-013 - Submit valid credentials using the Enter key

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, enter "standard_user" in Username and "secret_sauce" in Password.
    - expect: The valid credentials are present in the form.
  2. Press Enter while focus is in the Password field.
    - expect: The form submits without requiring a mouse click.
    - expect: The user is redirected to /inventory.html and the Products heading is displayed.

#### 1.14. TC-LOGIN-014 - Recover from an authentication error and log in successfully

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, enter "standard_user" and "wrong_password", then click Login.
    - expect: The invalid-credentials error is displayed and the user remains on the login page.
  2. Replace the Password value with "secret_sauce" and submit the form.
    - expect: The previous error is cleared or no longer shown as an active validation state.
    - expect: Authentication succeeds and the user is redirected to /inventory.html.

#### 1.15. TC-LOGIN-015 - Dismiss a login error message

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, submit the form with both fields blank.
    - expect: The required-username error is displayed.
  2. Use the error message's close control, if displayed, to dismiss the error.
    - expect: The error message is removed from the page.
    - expect: The login form remains available and usable.
    - expect: No unintended navigation occurs.

#### 1.16. TC-LOGIN-016 - Verify login controls support keyboard focus order

**File:** `specs/login-manual-test-plan.md`

**Steps:**
  1. From a fresh login page, use the Tab key repeatedly from the browser page start to move through the interactive controls.
    - expect: Focus moves visibly to the Username field, Password field, Login button, and any other interactive control in a logical order.
    - expect: The focused control is visually distinguishable.
  2. Press Enter when the Login button is focused with blank fields.
    - expect: The form submits through keyboard interaction and displays the expected required-field validation without a page crash.
