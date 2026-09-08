
import { test, expect } from '../fixtures/login.fixture'
import { ProductsPage } from '../pages/productsPage';
import dotenv from 'dotenv';
import path from 'path';
import {JsonReader} from '../utils/jsonReader'

//reading the environment file

dotenv.config({path:path.resolve(__dirname,'../test.env')})
console.log(__dirname)
console.log(path.resolve(__dirname,'../test.env'))

let url = process.env.SAUCEDEMO_URL as string
let username = process.env.SAUCEDEMO_USERNAME as string
let password = process.env.SAUCEDEMO_PASSWORD as string
let inventoryUrl = process.env.INVENTORYPAGE_URL as string

//reading data from json
let testData = JsonReader.read<any>('sauceDemoData.json')
let lockedoutuser = testData.credentials.lockeduser
let invalidUser = testData.credentials.invaliduser
let validpassword = testData.credentials.validPassword
let invalidUserErrorMessage= testData.expectedMessages.invalidUserError


test.describe('SauceDemo Login tests', () => {


    test('LOGIN-01 - login with valid credentials', async ({ loginPage, page }) => {
        //loginPage is a userdefined fixture
        let productsPage = new ProductsPage(page);

        //1. Open SauceDemo login page.
        //2. Enter username standard_user.
        //3. Enter password secret_sauce.
        //4. Click Login."

        loginPage.performLogin(username, password)

        //assertions
        //User should be redirected to the Products page.

        await expect(page).toHaveURL(inventoryUrl);

        await expect(productsPage.validateProductsPageTitle()).toBeTruthy();


    })

    test('LOGIN-02 - login with  invalid username', async ({ loginPage, page }) => {
        /*  1. Enter an invalid username.
            2. Enter valid password secret_sauce.
            3. Click Login."
        */

        loginPage.performLogin(invalidUser, validpassword)

        //assertions
        //Login should fail and an appropriate error message should be displayed.

        console.log(await loginPage.getErrorText());
        expect(await loginPage.getErrorText()).toContain(invalidUserErrorMessage);

    })

    test('LOGIN-03 - login with valid username and invalid password', async ({ page, loginPage }) => {

        /*   1. Enter username standard_user.
             2. Enter an invalid password.
             3. Click Login." */

        loginPage.performLogin('standard_user', 'hjkm')

        //assertions
        //Login should fail and an appropriate error message should be displayed.

        console.log(await loginPage.getErrorText());
        expect(await loginPage.getErrorText()).toContain("Epic sadface: Username and password do not match any user in this service");

    })

    test('LOGIN-04 - login with invalid username and invalid password', async ({ page, loginPage }) => {

        /* 1. Enter an invalid username.
        2. Enter an invalid password.
        3. Click Login.
        */
        loginPage.performLogin('standard_user', 'hjkm')

        //assertions
        //User should remain on the login page and see an error message.
        console.log(await loginPage.getErrorText());
        expect(await loginPage.getErrorText()).toContain("Epic sadface: Username and password do not match any user in this service");

    })

    test('LOGIN-05 - login with username blank and valid password', async ({ page, loginPage }) => {
        /*  1. Leave username blank.
            2. Enter password secret_sauce.
            3. Click Login. */

        loginPage.performLogin('', 'secret_sauce')

        //assertions
        //Username is required error should be displayed.

        console.log(await loginPage.getErrorText());
        expect(await loginPage.getErrorText()).toContain("Epic sadface: Username is required");

    })
    test('LOGIN-06 - login with valid username  and leave password blank ', async ({ page, loginPage }) => {
        /*  1. Enter username standard_user.
            2. Leave password blank.
            3. Click Login. */

        loginPage.performLogin('standard_user', '')

        //assertions
        //Password is required error should be displayed.

        console.log(await loginPage.getErrorText());
        expect(await loginPage.getErrorText()).toContain("Epic sadface: Password is required");

    })

    test('LOGIN-07 - login with leave username blank  and leave password blank ', async ({ page, loginPage }) => {

        /*  1. Leave username and password blank.
            2. Click Login.*/

        loginPage.performLogin('', '')

        //assertions
        //Required-field error should be displayed.

        console.log(await loginPage.getErrorText());
        expect(await loginPage.getErrorText()).toContain("Epic sadface: Username is required");

    })

    test.only('LOGIN-08 - login with lockedoutuser  and password', async ({ page, loginPage }) => {
        /*  1. Enter username locked_out_user.
            2. Enter password secret_sauce.
            3. Click Login.*/

        loginPage.performLogin(lockedoutuser, 'secret_sauce')

        //assertions
        //Login should be denied with a locked-out user message.

        console.log(await loginPage.getErrorText());
        expect(await loginPage.getErrorText()).toContain("Epic sadface: Sorry, this user has been locked out.");

    })

    test('LOGIN-09 - login with problem_user  and password', async ({ page, loginPage }) => {
        let productsPage = new ProductsPage(page);

        /*  1. Enter username problem_user.
            2. Enter password secret_sauce.
            3. Click Login.*/


        loginPage.performLogin('problem_user', 'secret_sauce')

        //assertions
        //User should log in successfully; any functional inconsistencies should be captured.

        await expect(await productsPage.validateProductsPageTitle()).toBeTruthy();


    })

    test('LOGIN-10 - login with performance_glitch_user  and password', async ({ page, loginPage }) => {
        let productsPage = new ProductsPage(page);

        /*  1. Enter username performance_glitch_user.
            2. Enter password secret_sauce.
            3. Click Login.*/

        loginPage.performLogin('performance_glitch_user', 'secret_sauce')

        //assertions
        //Login should eventually succeed and the response time should be measurable.

        await expect(await productsPage.validateProductsPageTitle()).toBeTruthy();


    })

    test('LOGIN-11 - login with error_user  and password', async ({ page, loginPage }) => {
        let productsPage = new ProductsPage(page);
        /*  1. Enter username error_user.
            2. Enter password secret_sauce.
            3. Click Login.*/

        loginPage.performLogin('error_user', 'secret_sauce')

        //assertions
        //User should log in; application errors should be captured without crashing.

        await expect(await productsPage.validateProductsPageTitle()).toBeTruthy();


    })

    test('LOGIN-12 - login with visual_user  and password', async ({ page, loginPage }) => {
        let productsPage = new ProductsPage(page);

        /*  1. Enter username visual_user.
            2. Enter password secret_sauce.
            3. Click Login.*/

        loginPage.performLogin('visual_user', 'secret_sauce')

        //assertions
        //User should log in and visual differences should be identifiable.

        await expect(await productsPage.validateProductsPageTitle()).toBeTruthy();


    })

    test('LOGIN-13- password mask validation', async ({ page, loginPage }) => {
        /*  1. Click the password field.
            2. Enter any password.*/

        await loginPage.passwordInput.click();
        await loginPage.passwordInput.fill('abc');

        //Password characters should be masked.

        expect(await loginPage.passwordInput).toHaveAttribute('type', 'password');



    })

    test('LOGIN -14 - ERROR Close icon validation', async ({ page, loginPage }) => {

        /*  1. Trigger a login validation error.
            2. Click the error close icon.*/

        loginPage.performLogin("abd", "bnm");

        await expect(loginPage.errorMessage).toBeTruthy();

        expect(await loginPage.closeIcon).toBeTruthy();
        await loginPage.closeIcon.click();
        //assertion
        //The displayed error message should disappear.
        await expect(loginPage.errorMessage).toBeFalsy();

    })

    test('LOGIN-15- Enter spaces before or after standard_user and valid password', async ({ page, loginPage }) => {

        /*
        1. Enter spaces before or after standard_user.
        2. Enter password secret_sauce.
        3. Click Login.*/

        loginPage.performLogin(' standard_user ', 'secret_sauce')

        //Application should either trim spaces or show a clear authentication error.

        await expect(loginPage.errorMessage).toBeTruthy();
        await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
    })

    test('LOGIN-16- Enter STANDARD_USER and valid password', async ({ page, loginPage }) => {

        /*
        1. Enter username STANDARD_USER.
        2. Enter password secret_sauce.
        3. Click Login. */

        loginPage.performLogin('STANDARD_USER', 'secret_sauce')

        //Login should fail if usernames are case-sensitive.

        await expect(loginPage.errorMessage).toBeTruthy();
        await expect(loginPage.errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
    })

    test('LOGIN-17- validate enter key for login with valid credentials', async ({ page, loginPage }) => {

        let productsPage = new ProductsPage(page);
        /*1. Enter valid credentials.
        2. Press Enter.*/

        await loginPage.userNameInput.fill('standard_user')
        await loginPage.passwordInput.fill('secret_sauce')
        await page.keyboard.press('Enter');

        //The login form should be submitted successfully when Enter is supported.

        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(productsPage.validateProductsPageTitle()).toBeTruthy();
    })

    test('LOGIN-18- authentication', async ({ page, loginPage }) => {
        /*
        1. Start a new unauthenticated browser session.
        2. Open /inventory.html directly.*/

        await page.goto('https://www.saucedemo.com/inventory.html')

        //User should be redirected to login or shown an authorization error.

        await expect(loginPage.getErrorText()).toBeTruthy();
        await expect(await loginPage.getErrorText()).toContain("Epic sadface: You can only access '/inventory.html' when you are logged in.")
    })

    test('LOGIN -19-SECURITY- SQL INJECTION', async ({ page, loginPage }) => {
        /*"1. Enter ' OR '1'='1 in username/password.
        2. Click Login.*/

        await loginPage.userNameInput.fill("' OR '1'='1");
        await loginPage.passwordInput.fill("' OR '1'='1");
        await loginPage.loginButton.click();

        //Authentication should not be bypassed and no internal information should be exposed.

    })

    test('LOGIN -20-SECURITY- app safety', async ({ page, loginPage }) => {
        /* 1. Enter <script>alert(1)</script> in an input field.
        2. Submit the form.*/
        await loginPage.userNameInput.fill("<script>alert(1)</script>");
        await loginPage.loginButton.click()
        //Script should not execute and the input should be handled safely.

    })
})