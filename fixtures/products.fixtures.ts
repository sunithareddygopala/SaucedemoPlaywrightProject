import {test as base, expect} from '@playwright/test' //making this test as base
import { LoginPage } from '../pages/loginPage' // LoginPage - page class
import { ProductsPage } from '../pages/productsPage';

import dotenv from 'dotenv';
import path from 'path';
import { URL } from 'url';

//reading the environment file

dotenv.config({path:path.resolve(__dirname,'../test.env')})
console.log(__dirname)
console.log(path.resolve(__dirname,'../test.env'))

let url = process.env.SAUCEDEMO_URL as string

//declaration of fixture

export type ProductsPageFixture = {
    productsPage:ProductsPage //productsPage - fixture name
};

export let test = base.extend<ProductsPageFixture>({

    productsPage: async({page}, use)=>{
         let loginPage = new LoginPage(page);
        await loginPage.navigateToLogInPage(process.env.SAUCEDEMO_URL as string);
        await loginPage.performLogin(process.env.standard_user as string, process.env.password as string)

        let productsPage = new ProductsPage(page)
        productsPage.validateProductsPageTitle()

        await use(productsPage)

    }
    
});

export{expect}