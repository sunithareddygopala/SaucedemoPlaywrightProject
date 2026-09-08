
// declaration of locators
// initialization of locators in constructor
// write reusable METHODS


import { Locator,Page,expect} from "@playwright/test";
export class LoginPage{

    readonly page:Page;
    readonly userNameInput:Locator;
    readonly passwordInput :Locator;
    readonly loginButton:Locator;
    readonly errorMessage:Locator;
    readonly closeIcon:Locator;

    constructor(page:Page){
        this.page=page;

        this.userNameInput = page.getByRole('textbox',{name:'username'});
        this.passwordInput = page.getByRole('textbox',{name:'password'});
        this.loginButton = page.getByRole('button',{name:'Login'});
        this.errorMessage = page.locator('[data-test="error"]');
        this.closeIcon = page.locator('[data-icon="xmark"]')


    }

    //methods

    async navigateToLogInPage(url:string):Promise<void>{
        await this.page.goto(url);
        await expect(this.page).toHaveURL(url);


    }

    async enterUserName(username:string):Promise<void>{
        await this.userNameInput.fill(username);

    }

    async enterPassword(password:string):Promise<void>{
       await this.passwordInput.fill(password);
    }

    async clickLoginButton():Promise<void>{
        await this.loginButton.click();
    }

    async performLogin(username:string, password:string):Promise<void>{

        await this.enterUserName(username);
        await this.enterPassword(password);
        await this.clickLoginButton();

    }    

    async getErrorText():Promise<string>{
        return this.errorMessage.innerText()
    }

}


