import { APIRequestContext } from "@playwright/test";


class petAPI{

    constructor(private request:APIRequestContext){

    }

    async createPet(petData: object){

        return await this.request.post('', { data: petData });
    }

    async updatePet(){

    }

    async deletePet(){

    }
}
