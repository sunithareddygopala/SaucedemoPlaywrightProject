import { test, expect } from '@playwright/test'

let petPayload = {
    "id": 74,
    "category": {
        "id": 0,
        "name": 123
    },
    "name": "tony",
    "photoUrls": [
        "string"
    ],
    "tags": [
        {
            "id": 1,
            "name": "TonyDo"
        }
    ],
    "status": "available"
}
test.describe('api petstore tests', () => {

    test('create a pet', async ({ request }) => {

        //1.create a request
        let response = await request.post('/v2/pet', {
            data: petPayload
        })

        console.log(response)
        expect(response.status()).toBe(200)
        expect(response.ok()).toBeTruthy();
        let responseBody = await response.json();
        console.log(responseBody)
        console.log("from reqesut id is " + petPayload.id)
        console.log("from response id is" + responseBody.id)
        expect(petPayload.id).toBe(responseBody.id)
        expect(petPayload.name).toBe(responseBody.name)
        expect(petPayload.status).toBe(responseBody.status)



    }
    )

    let petId = petPayload.id
    test('GET - fetch the pet details', async ({ request }) => {
        let getResponse = await request.get(`/v2/pet/${petId}`)

         expect(getResponse.status()).toBe(200)
        expect(getResponse.ok()).toBeTruthy()
        let responseBody = await getResponse.json()
        expect(responseBody.id).toBe(petId)
    })


    //crud

    //schema validation
})