import { expect, test } from '../fixtures/login.fixture';
import { CartPage } from '../pages/cartPage';
import { CheckoutPage } from '../pages/checkoutPage';
import { ProductsPage } from '../pages/productsPage';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../test.env') });

test.describe('Sauce Demo checkout positive scenarios', () => {
  test('completes checkout with valid customer details', async ({ loginPage, page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Log in with valid credentials.
    await loginPage.performLogin(
      process.env.SAUCEDEMO_USERNAME as string,
      process.env.SAUCEDEMO_PASSWORD as string,
    );
    await expect(page).toHaveURL(/inventory\.html/);

    // 2. Add two products and open the cart.
    await productsPage.addItemTocart('Sauce Labs Backpack');
    await productsPage.addItemTocart('Sauce Labs Bike Light');
    await productsPage.openCart();
    await cartPage.expectProducts(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);

    // 3. Enter customer details and verify the checkout totals.
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerDetails({
      firstName: 'Test',
      lastName: 'Customer',
      postalCode: '10001',
    });
    await checkoutPage.continueToOverview();
    await checkoutPage.expectTotals({ subtotal: '$39.98', tax: '$3.20', total: '$43.18' });

    // 4. Finish the order and return to inventory.
    await checkoutPage.completeOrder();
    await checkoutPage.returnHome();
  });
});

test.describe('Sauce Demo checkout negative scenarios', () => {
  test('rejects checkout when required customer details are missing', async ({ loginPage, page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const checkoutError = page.getByTestId('error');

    // 1. Log in and add one product to the cart.
    await loginPage.performLogin(
      process.env.SAUCEDEMO_USERNAME as string,
      process.env.SAUCEDEMO_PASSWORD as string,
    );
    await productsPage.addItemTocart('Sauce Labs Backpack');
    await productsPage.openCart();
    await cartPage.expectProducts(['Sauce Labs Backpack']);
    await cartPage.proceedToCheckout();

    // 2. Continue without entering any customer details.
    await checkoutPage.continueToOverview();
    await expect(checkoutError).toContainText('First Name is required');

    // 3. Enter only the first name and verify last-name validation.
    await checkoutPage.firstNameInput.fill('Test');
    await checkoutPage.continueToOverview();
    await expect(checkoutError).toContainText('Last Name is required');

    // 4. Enter the last name but leave the postal code blank.
    await checkoutPage.lastNameInput.fill('Customer');
    await checkoutPage.continueToOverview();
    await expect(checkoutError).toContainText('Postal Code is required');
  });
});

test.describe('Sauce Demo checkout edge scenarios', () => {
  test('completes checkout with one product and boundary postal code', async ({ loginPage, page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Log in and add exactly one product.
    await loginPage.performLogin(
      process.env.SAUCEDEMO_USERNAME as string,
      process.env.SAUCEDEMO_PASSWORD as string,
    );
    await productsPage.addItemTocart('Sauce Labs Onesie');
    await productsPage.openCart();
    await cartPage.expectProducts(['Sauce Labs Onesie']);

    // 2. Use minimum-length names and a zero-padded postal code.
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerDetails({
      firstName: 'A',
      lastName: 'B',
      postalCode: '00000',
    });
    await checkoutPage.continueToOverview();

    // 3. Verify the order can proceed from the boundary input.
    await expect(checkoutPage.finishButton).toBeVisible();
    await checkoutPage.completeOrder();
    await checkoutPage.returnHome();
  });

  test('accepts maximum practical customer input lengths', async ({ loginPage, page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const firstName = 'A'.repeat(20);
    const lastName = 'B'.repeat(20);
    const postalCode = '9'.repeat(10);

    // 1. Log in, add one product, and open checkout.
    await loginPage.performLogin(
      process.env.SAUCEDEMO_USERNAME as string,
      process.env.SAUCEDEMO_PASSWORD as string,
    );
    await productsPage.addItemTocart('Sauce Labs Bolt T-Shirt');
    await productsPage.openCart();
    await cartPage.proceedToCheckout();

    // 2. Submit longer valid-looking customer values.
    await checkoutPage.enterCustomerDetails({ firstName, lastName, postalCode });
    await checkoutPage.continueToOverview();

    // 3. Verify the checkout overview is reached without validation errors.
    await expect(checkoutPage.finishButton).toBeVisible();
  });
});
