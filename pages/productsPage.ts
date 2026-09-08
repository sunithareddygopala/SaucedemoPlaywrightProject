import { Page,expect, Locator } from "@playwright/test";

export class ProductsPage{
    readonly page: Page;
    readonly productsPageTitle:Locator;
    readonly sortDropdown:Locator;
    readonly inventoryItem:Locator;
    readonly shoppingCartButton:Locator;
    readonly removeButton :Locator;

    constructor(page:Page){
        this.page =page;
        this.productsPageTitle =page.getByText('Products');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.inventoryItem = page.locator('.inventory_item');
        this.shoppingCartButton = page.locator('[data-test="shopping-cart-link"]');
        this.removeButton = page.getByRole('button',{name: 'Remove'})


    }
//methods
    async validateProductsPageTitle(){
        await expect(this.productsPageTitle).toBeVisible();
        
    }

    async  sortBy(optionValue:string){
        this.sortDropdown.selectOption(optionValue);

    }

    async addItemTocart(itemName:string){
        let itemCard = this.inventoryItem.filter({hasText:itemName});
       await  itemCard.getByRole('button',{ name:'Add to Cart'}).click()

    }

    async removeItemFromCart(itemName:string){
  
        let itemCard = this.inventoryItem.filter({hasText:itemName});
       await  itemCard.getByRole('button',{ name:'Remove'}).click();

    }
    
    async openItemDetails(itemName:string){
        let itemCard = this.inventoryItem.filter({hasText:itemName});
       await  itemCard.locator('[data-test="item-4-title-link"]').click();
    }

    async getAllProductName(){
     return await this.inventoryItem.locator('[data-test="inventory-item-name"]').allInnerTexts();
    }

    async getAllProductCards(){

    }
    async openCart(){
        await this.shoppingCartButton.click();
    }

}