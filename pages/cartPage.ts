import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('[data-test="inventory-item"]');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }

    async expectProducts(products: string[]): Promise<void> {
        await expect(this.cartItems).toHaveCount(products.length);
        for (const product of products) {
            await expect(this.cartItems.filter({ hasText: product })).toHaveCount(1);
        }
    }

    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }
}