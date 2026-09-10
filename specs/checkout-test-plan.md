# Checkout Test Plan

## Application Overview

Checkout positive, negative, and edge coverage for Sauce Demo.

## Test Scenarios

### 1. Checkout scenarios

**Seed:** `tests/seed.spec.ts`

#### 1.1. Positive checkout

**File:** `tests/checkout/checkout-positive.spec.ts`

**Steps:**
  1. Complete checkout with valid details.
    - expect: Order confirmation is shown.

#### 1.2. Negative checkout

**File:** `tests/checkout/checkout-negative.spec.ts`

**Steps:**
  1. Submit checkout with missing required details.
    - expect: Required field validation is shown.

#### 1.3. Edge checkout

**File:** `tests/checkout/checkout-edge.spec.ts`

**Steps:**
  1. Complete checkout with one item and boundary postal code.
    - expect: Checkout succeeds.
