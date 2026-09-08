import {test as base, expect} from '@playwright/test' //making this test as base
import { LoginPage } from '../pages/loginPage' // LoginPage - page class
import dotenv from 'dotenv';
import path from 'path';
import { ProductsPage } from '../pages/productsPage';

//reading the environment file

dotenv.config({path:path.resolve(__dirname,'../test.env')})
console.log(__dirname)
console.log(path.resolve(__dirname,'../test.env'))

//let url = process.env.SAUCEDEMO_URL as string

//declaration of fixture

export type LoginPageFixture = {
    loginPage:LoginPage //loginPage - fixture name
};

export let test = base.extend<LoginPageFixture>({

    loginPage: async({page}, use)=>{
           let loginPage = new LoginPage(page);
        await loginPage.navigateToLogInPage(process.env.SAUCEDEMO_URL as string);
        await use(loginPage);
  
    }
    
});

export{expect}