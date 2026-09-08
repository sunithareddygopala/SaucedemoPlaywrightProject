/// <reference types="node" />

import * as path from 'path'
import * as XLSX from 'xlsx'

   
export class ExcelReader {

    static read<T>(sheetName:string, fileName:string='SauceDemoTestData.xlsx'): T[] {

        const filePath = path.join(process.cwd(),'testdata', fileName)
        const workbook = XLSX.readFile(filePath)
        const worksheet = workbook.Sheets[sheetName]

        if(!worksheet){
            throw new Error(`Sheet "${sheetName}" is not found in the ${fileName}`)
        }

       return XLSX.utils.sheet_to_json(worksheet,{defval:'',raw:false})

    }

    //{TestCaseId:PROD-02, Functionlity:Products,Username:standard_user, Password:secret_sauce ,ProductName:}
    //returns each row data of respective coloumn

    static getRowByTestCaseId<T>(sheetName:string, testCaseId:string,fileName:string ='SauceDemoTestData.xlsx'):T|undefined
    {
        const rows = this.read<T>(sheetName,fileName)
        return rows.find((row: T) => {
            const record = row as Record<string, unknown>
            return String(record['TestCaseId'] ?? '').trim() === testCaseId
        })
    }

    static getCellValue<T>(sheetName:string,testCaseId:string, columnName:string,fileName:string ='SauceDemoTestData.xlsx'):T
    {
        let row:any = this.getRowByTestCaseId(sheetName, testCaseId,fileName)
        return String(row?.[columnName]??'').trim() as T
    }
}

