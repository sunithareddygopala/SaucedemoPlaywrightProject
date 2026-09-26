# SauceDemo Security Test Plan

## Application Overview

Security-focused test coverage for SauceDemo at https://www.saucedemo.com/. The plan covers authentication, authorization, session handling, logout, injection-safe validation, sensitive-data exposure, and cart/checkout integrity. Each case is independent and starts from a fresh browser context unless the steps establish an authenticated session.

## Test Scenarios

### 1. Authentication and Authorization

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-SEC-AUTH-001 - Login with valid credentials

**File:** `tests/security/authentication-positive.spec.ts`

**Steps:**
  1. Open the application in a fresh browser context.
    - expect: The login page loads over HTTPS with Username, Password, and Login controls.
  2. Enter `standard_user` and `secret_sauce`, then submit Login.
    - expect: Authentication succeeds and redirects to `/inventory.html`.
    - expect: Products and inventory are visible.
    - expect: The password is not shown as readable page text.

#### 1.2. TC-SEC-AUTH-002 - Reject invalid credential combinations

**File:** `tests/security/authentication-negative.spec.ts`

**Steps:**
  1. Independently try an unknown username, a valid username with a wrong password, both values wrong, and blank required fields.
    - expect: Every attempt is rejected.
    - expect: The user remains on the login page.
    - expect: Errors do not reveal secrets or unnecessary account details.

#### 1.3. TC-SEC-AUTH-003 - Block locked-out user

**File:** `tests/security/authentication-negative.spec.ts`

**Steps:**
  1. Enter `locked_out_user` and `secret_sauce`, then submit Login.
    - expect: Authentication is blocked with the documented locked-out message.
    - expect: The inventory page is not accessible.

#### 1.4. TC-SEC-AUTH-004 - Reject credential edge cases and injection payloads

**File:** `tests/security/authentication-edge.spec.ts`

**Steps:**
  1. Try uppercase or mixed-case credentials, credentials with leading or trailing spaces, very long strings, SQL-like strings, and `<script>alert(1)</script>` in both fields.
    - expect: No altered or injected value authenticates.
    - expect: No script executes or unexpected dialog appears.
    - expect: The page remains usable and shows controlled validation.

#### 1.5. TC-SEC-AUTH-005 - Verify password masking and failed-login recovery

**File:** `tests/security/authentication-edge.spec.ts`

**Steps:**
  1. Type a password, submit an invalid login, then replace the password with `secret_sauce` and submit valid credentials.
    - expect: Password characters remain masked and do not appear in the URL or error text.
    - expect: The failed state can be corrected.
    - expect: The valid retry authenticates successfully.

### 2. Session and Access Control

**Seed:** `tests/seed.spec.ts`

#### 2.1. TC-SEC-SESSION-001 - Deny direct access to authenticated routes

**File:** `tests/security/session-negative.spec.ts`

**Steps:**
  1. In a fresh context, navigate directly to `/inventory.html`, `/cart.html`, `/checkout-step-one.html`, and `/checkout-step-two.html`.
    - expect: Each unauthenticated request is denied or redirected to login.
    - expect: No product, cart, customer, or order data is exposed.

#### 2.2. TC-SEC-SESSION-002 - Logout invalidates the session

**File:** `tests/security/session-positive.spec.ts`

**Steps:**
  1. Log in, open the navigation menu, and select Logout.
    - expect: The user returns to the login page and the authenticated session ends.
  2. Use browser back, refresh, and direct navigation to `/inventory.html`.
    - expect: Inventory and checkout are not accessible without logging in again.

#### 2.3. TC-SEC-SESSION-003 - Isolate sessions between browser contexts

**File:** `tests/security/session-negative.spec.ts`

**Steps:**
  1. Authenticate in Browser Context A, then open authenticated URLs in a fresh Context B with no shared storage.
    - expect: Context B is unauthenticated.
    - expect: Context B cannot view Context A's cart, checkout, or account state.

#### 2.4. TC-SEC-SESSION-004 - Prevent stale-page exposure after logout

**File:** `tests/security/session-edge.spec.ts`

**Steps:**
  1. Log in, add a product, open the cart, log out, then revisit the cart and checkout URLs using back and direct navigation.
    - expect: The previous authenticated pages do not expose cart or checkout data after logout.
    - expect: No prior customer or order information is shown.

#### 2.5. TC-SEC-SESSION-005 - Keep secrets out of URLs and errors

**File:** `tests/security/session-edge.spec.ts`

**Steps:**
  1. Complete login and checkout navigation while inspecting URLs, visible page text, and application error output.
    - expect: Passwords and customer details do not appear in URLs.
    - expect: Errors contain no tokens, stack traces, source paths, or credentials.

### 3. Input and Transaction Integrity

**Seed:** `tests/seed.spec.ts`

#### 3.1. TC-SEC-INPUT-001 - Enforce checkout required fields

**File:** `tests/security/input-negative.spec.ts`

**Steps:**
  1. Log in, add a product, open checkout, and submit with each required field blank one at a time and then all fields blank.
    - expect: Checkout cannot continue until required fields are supplied.
    - expect: Field validation is shown and no order is created.

#### 3.2. TC-SEC-INPUT-002 - Handle checkout injection safely

**File:** `tests/security/input-negative.spec.ts`

**Steps:**
  1. Enter SQL-like text, HTML, JavaScript payloads, quotes, delimiters, and newline characters in First Name, Last Name, and Zip/Postal Code.
    - expect: Invalid values are rejected or treated as inert text.
    - expect: No script executes, markup changes, or unexpected dialog appears.
    - expect: Invalid customer data cannot complete an order.

#### 3.3. TC-SEC-INPUT-003 - Test input boundaries and character sets

**File:** `tests/security/input-edge.spec.ts`

**Steps:**
  1. Test empty, one-character, maximum-length, overlong, whitespace-only, Unicode, punctuation, negative-looking, and alphabetic postal-code values.
    - expect: Validation follows the application's rules.
    - expect: Overlong or unusual input does not break layout, crash the page, or bypass validation.

#### 3.4. TC-SEC-INPUT-004 - Preserve cart and total integrity

**File:** `tests/security/input-positive.spec.ts`

**Steps:**
  1. Add and remove products repeatedly, add the same product more than once, refresh the cart, change sort order, and continue to checkout.
    - expect: Cart contents match the performed actions.
    - expect: Subtotal, tax, and total remain consistent with visible products.
    - expect: No hidden, negative, duplicate unauthorized, or phantom item is accepted.

#### 3.5. TC-SEC-INPUT-005 - Reject client-side price or product tampering

**File:** `tests/security/input-negative.spec.ts`

**Steps:**
  1. Before checkout, alter product or price-related client-side values using controlled browser tooling, then attempt to submit the order.
    - expect: Manipulated price or product data is rejected or has no effect.
    - expect: The completed transaction uses authorized product data and consistent totals.
