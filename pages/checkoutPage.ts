import { expect, Locator, Page } from '@playwright/test';

export type CustomerDetails = {
    firstName: string;
    lastName: string;
    postalCode: string;
};

export class CheckoutPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly subtotal: Locator;
    readonly tax: Locator;
    readonly total: Locator;
    readonly finishButton: Locator;
    readonly confirmationMessage: Locator;
    readonly backHomeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.postalCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.subtotal = page.getByTestId('subtotal-label');
        this.tax = page.getByTestId('tax-label');
        this.total = page.getByTestId('total-label');
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.confirmationMessage = page.getByText('Thank you for your order!');
        this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
    }

    async enterCustomerDetails(customer: CustomerDetails): Promise<void> {
        await this.firstNameInput.fill(customer.firstName);
        await this.lastNameInput.fill(customer.lastName);
        await this.postalCodeInput.fill(customer.postalCode);
    }

    async continueToOverview(): Promise<void> {
        await this.continueButton.click();
    }

    async expectTotals(expected: { subtotal: string; tax: string; total: string }): Promise<void> {
        await expect(this.subtotal).toHaveText(`Item total: ${expected.subtotal}`);
        await expect(this.tax).toHaveText(`Tax: ${expected.tax}`);
        await expect(this.total).toHaveText(`Total: ${expected.total}`);
    }

    async completeOrder(): Promise<void> {
        await this.finishButton.click();
        await expect(this.confirmationMessage).toBeVisible();
    }

    async returnHome(): Promise<void> {
        await this.backHomeButton.click();
        await expect(this.page).toHaveURL(/inventory\.html/);
    }
}