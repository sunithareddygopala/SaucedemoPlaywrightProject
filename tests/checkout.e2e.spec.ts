import { test, expect } from '../fixtures/login.fixture';
import { CartPage } from '../pages/cartPage';
import { CheckoutPage } from '../pages/checkoutPage';
import { ProductsPage } from '../pages/productsPage';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../test.env') });

const checkoutScenarios = [
    {
        products: ['Sauce Labs Backpack', 'Sauce Labs Bike Light'],
        customer: { firstName: 'Test', lastName: 'Customer', postalCode: '10001' },
        totals: { subtotal: '$39.98', tax: '$3.20', total: '$43.18' },
    },
];

test.describe('Sauce Demo checkout', () => {
    for (const scenario of checkoutScenarios) {
        test('complete checkout with two products', async ({ loginPage, page }) => {
            const productsPage = new ProductsPage(page);
            const cartPage = new CartPage(page);
            const checkoutPage = new CheckoutPage(page);

            await loginPage.performLogin(
                process.env.SAUCEDEMO_USERNAME as string,
                process.env.SAUCEDEMO_PASSWORD as string,
            );
            await expect(page).toHaveURL(/inventory\.html/);

            for (const product of scenario.products) {
                await productsPage.addItemTocart(product);
            }
            await productsPage.openCart();
            await cartPage.expectProducts(scenario.products);

            await cartPage.proceedToCheckout();
            await checkoutPage.enterCustomerDetails(scenario.customer);
            await checkoutPage.continueToOverview();
            await checkoutPage.expectTotals(scenario.totals);
            await checkoutPage.completeOrder();
            await checkoutPage.returnHome();
        });
    }
});