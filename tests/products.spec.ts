import{test,expect} from '../fixtures/products.fixtures'
import { ExcelReader } from '../utils/excelReader'

//console.log(ExcelReader.read('Products'))

let productcases = ExcelReader.read('Products');
//console.log(JSON.stringify(productcases));
//console.log(productcases)

//console.log(JSON.stringify(ExcelReader.getRowByTestCaseId('Products','PROD-01')))

console.log("============================================")
console.log(ExcelReader.getRowByTestCaseId<any>('Products','PROD-01'))
test.describe('saucedemo products scenarios',()=>{

    test('PROD-02' , async({productsPage})=>{

        await productsPage.validateProductsPageTitle();
        
    })



})